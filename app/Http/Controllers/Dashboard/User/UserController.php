<?php

namespace App\Http\Controllers\Dashboard\User;

use App\Facades\MicrosoftGraph;
use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Response;

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

  public function photo(User $user, Request $request): mixed {
    $allowed = ["48x48", "64x64", "96x96", "120x120", "240x240", "360x360", "432x432", "504x504", "648x648"];
    $dimension = in_array($request->query("dimension"), $allowed) ? $request->query("dimension") : null;

    try {
      $photo = $dimension
        ? MicrosoftGraph::users()->byUserId($user->microsoft_id)->photos()->byProfilePhotoId($dimension)->content()->get()->wait()
        : MicrosoftGraph::users()->byUserId($user->microsoft_id)->photo()->content()->get()->wait();

      $mime = (new \finfo(FILEINFO_MIME_TYPE))->buffer($photo) ?: "image/jpeg";
      return response($photo)->header("Content-Type", $mime);
    } catch (\Throwable) {
      return redirect("https://ui-avatars.com/api/?name={$user->name}&background=random");
    }
  }
}
