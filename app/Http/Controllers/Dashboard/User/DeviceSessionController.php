<?php

namespace App\Http\Controllers\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\Session;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class DeviceSessionController extends Controller {
  public function index(User $user, Request $request): Response {
    $parameters = initializeQueryParams($request);
    $deviceSessionsResult = Session::query()
      ->where("user_id", $user->id)
      ->search($parameters["search"])
      ->sort($parameters["column"], $parameters["sort"])
      ->paginate($parameters["size"])
      ->toArray();
    $deviceSessions = initializeResultArray($deviceSessionsResult, $parameters);

    $sessionId = session()?->getId() ?? "";

    return inertia("dashboard/users/device-sessions/index", [
      "user" => $user,
      "queryResult" => $deviceSessions,
      "sessionId" => $sessionId,
    ]);
  }

  public function destroy(User $user, Session $deviceSession): RedirectResponse {
    try {
      $deviceSession->delete();
      return back();
    } catch (\Throwable $th) {
      handleTrowable($th);
    }
  }

  public function destroyAll(User $user): RedirectResponse {
    try {
      $sessionId = session()?->getId();
      Session::where("user_id", $user->id)->whereNot("id", $sessionId)->delete();
      return back();
    } catch (\Throwable $th) {
      handleTrowable($th);
    }
  }
}
