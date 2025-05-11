<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\RoleRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

class RoleController extends Controller {
  private function SuperAdminRoleCheck($role) {
    if ($role->name === "SuperAdmin") {
      abort(404);
    }
  }

  public function index(Request $request): Response {
    $parameters = initializeQueryParams($request);
    $rolesResult = Role::query()
      ->with(["permissions", "creator", "editor"])
      ->search($parameters["search"])
      ->sort($parameters["column"], $parameters["sort"])
      ->paginate($parameters["size"])
      ->toArray();
    $roles = initializeResultArray($rolesResult, $parameters);

    $pemissionsTotal = Permission::count();

    return inertia("dashboard/roles-and-permissions/roles/index", [
      "queryResult" => $roles,
      "pemissionsTotal" => $pemissionsTotal,
    ]);
  }

  public function create(): Response {
    $permissions = Permission::all()
      ->select(["id", "name", "description"])
      ->toArray();

    $permissions = permissionFormatted($permissions);

    return inertia("dashboard/roles-and-permissions/roles/create", [
      "allPermissions" => $permissions,
    ]);
  }

  public function store(RoleRequest $request): RedirectResponse {
    $dataValidated = $request->validated();

    DB::beginTransaction();
    try {
      $newRole = Role::create([
        "name" => $dataValidated["name"],
        "description" => $dataValidated["description"],
      ]);
      $newRole->syncPermissions($dataValidated["permissions"]);
      $newPermissions = $newRole
        ->permissions()
        ->select(["id", "name", "guard_name"])
        ->get()
        ->toArray();

      activity(config("permission.table_names.role_has_permissions"))
        ->on($newRole)
        ->by(auth()->user())
        ->event("updated")
        ->withProperties([
          "attributes" => $newPermissions,
        ])
        ->log("updated " . config("permission.table_names.role_has_permissions") . " pivot (:subject.name)");
      DB::commit();
      return redirect()->route("roles.show", ["role" => $newRole->id]);
    } catch (\Throwable $th) {
      DB::rollBack();
      handleTrowable($th);
    }
  }

  public function show(Role $role): Response {
    $role->permissions = $role->permissions()->pluck("name");

    $permissions = Permission::all()
      ->select(["id", "name", "description"])
      ->toArray();
    $permissionsFormatted = permissionFormatted($permissions);

    $rolePermission = $role
      ->permissions()
      ->select(["id", "name", "description"])
      ->get()
      ->toArray();
    $rolePermission = permissionFormatted($rolePermission);
    $selectedCollapseIds = collect($rolePermission)->pluck("options")->flatten(1)->pluck("name");

    return inertia("dashboard/roles-and-permissions/roles/show", [
      "role" => $role,
      "allPermissions" => $permissionsFormatted,
      "permissionTotal" => count($permissions),
      "selectedCollapseIds" => $selectedCollapseIds,
    ]);
  }

  public function edit(Role $role): Response {
    $this->SuperAdminRoleCheck($role);

    $role->permissions = $role->permissions()->pluck("name");

    $permissions = Permission::all()
      ->select(["id", "name", "description"])
      ->toArray();
    $permissions = permissionFormatted($permissions);

    $rolePermission = $role
      ->permissions()
      ->select(["id", "name", "description"])
      ->get()
      ->toArray();
    $rolePermission = permissionFormatted($rolePermission);
    $selectedCollapseIds = collect($rolePermission)->pluck("options")->flatten(1)->pluck("name");

    return inertia("dashboard/roles-and-permissions/roles/edit", [
      "role" => $role,
      "allPermissions" => $permissions,
      "selectedCollapseIds" => $selectedCollapseIds,
    ]);
  }

  public function update(Role $role, RoleRequest $request): RedirectResponse {
    $this->SuperAdminRoleCheck($role);

    $dataValidated = $request->validated();

    DB::beginTransaction();
    try {
      $oldPermissions = $role
        ->permissions()
        ->select(["id", "name", "guard_name"])
        ->get()
        ->makeHidden("pivot")
        ->toArray();

      $role->update(["name" => $dataValidated["name"]]);

      $role->syncPermissions($dataValidated["permissions"]);
      $role->touch();

      $newPermissions = $role
        ->permissions()
        ->select(["id", "name", "guard_name"])
        ->get()
        ->makeHidden("pivot")
        ->toArray();

      activity(config("permission.table_names.role_has_permissions"))
        ->on($role)
        ->by(auth()->user())
        ->event("updated")
        ->withProperties([
          "old" => $oldPermissions,
          "attributes" => $newPermissions,
        ])
        ->log("updated " . config("permission.table_names.role_has_permissions") . " pivot (:subject.name)");
      DB::commit();

      DB::commit();
      return redirect()->route("roles.show", ["role" => $role->id]);
    } catch (\Throwable $th) {
      DB::rollBack();
      handleTrowable($th);
    }
  }

  public function destroy(Role $role): RedirectResponse {
    $this->SuperAdminRoleCheck($role);

    try {
      $role->delete();
      return redirect()->route("roles.index");
    } catch (\Throwable $th) {
      handleTrowable($th);
    }
  }
}
