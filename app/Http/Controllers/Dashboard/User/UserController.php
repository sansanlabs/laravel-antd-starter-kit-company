<?php

namespace App\Http\Controllers\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use SanSanLabs\MicrosoftGraph\Facades\MicrosoftGraph;

class UserController extends Controller {
  public function index(Request $request): Response {
    $parameters = initializeQueryParams($request);
    $usersResult = User::query()
      ->with(["roles", "creator", "editor"])
      ->search($parameters["search"])
      ->sort($parameters["column"], $parameters["sort"])
      ->paginate($parameters["size"])
      ->toArray();
    $users = initializeResultArray($usersResult, $parameters);

    return inertia("dashboard/users/index", [
      "queryResult" => $users,
    ]);
  }

  public function show(User $user): Response {
    if (auth()->id() !== $user->id && !auth()->user()->hasPermissionTo("Users.Detail")) {
      abort(403);
    }

    $user->load("roles");

    return inertia("dashboard/users/show", [
      "user" => $user,
    ]);
  }

  public function edit(User $user): Response {
    $user->load("roles");

    $roles = Role::all();

    return inertia("dashboard/users/edit", [
      "user" => $user,
      "roles" => $roles,
    ]);
  }

  public function update(User $user, Request $request): RedirectResponse {
    $dataValidated = $request->validate([
      "roles" => ["nullable", "array"],
      "roles.*" => ["nullable", "string", "exists:roles,name"],
    ]);

    DB::beginTransaction();
    try {
      $oldRoles = $user
        ->roles()
        ->select(["id", "name", "guard_name"])
        ->get()
        ->makeHidden("pivot")
        ->toArray();
      $user->syncRoles($dataValidated["roles"]);
      $user->touch();
      $newRoles = $user
        ->roles()
        ->select(["id", "name", "guard_name"])
        ->get()
        ->makeHidden("pivot")
        ->toArray();

      activity(config("permission.table_names.model_has_roles"))
        ->on($user)
        ->by(auth()->user())
        ->withProperties(["old" => $oldRoles, "attributes" => $newRoles])
        ->event("updated")
        ->log("updated " . config("permission.table_names.model_has_roles") . " pivot (:subject.name)");
      DB::commit();
      return to_route("users.show", ["user" => $user->id]);
    } catch (\Throwable $th) {
      DB::rollBack();
      handleTrowable($th);
    }
  }

  public function authAvatar(User $user): mixed {
    $user = auth()->user();
    try {
      return MicrosoftGraph::getMyPhoto();
    } catch (\Throwable $th) {
      report($th);
      $fallbackUrl = "https://ui-avatars.com/api/?name={$user->name}&background=random";
      return response()->redirectTo($fallbackUrl);
    }
  }

  public function userAvatar(User $user): mixed {
    try {
      return MicrosoftGraph::getUserPhoto($user->microsoft_id);
    } catch (\Throwable $th) {
      $fallbackUrl = "https://ui-avatars.com/api/?name={$user->name}&background=random";
      return response()->redirectTo($fallbackUrl);
    }
  }
}
