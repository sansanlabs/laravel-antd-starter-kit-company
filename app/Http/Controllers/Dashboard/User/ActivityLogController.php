<?php

namespace App\Http\Controllers\Dashboard\User;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Response;

class ActivityLogController extends Controller {
  public function index(User $user, Request $request): Response {
    $parameters = initializeQueryParams($request);
    $activityLogsResult = ActivityLog::query()
      ->with(["subject", "causer"])
      ->where("causer_id", $user->id)
      ->search($parameters["search"])
      ->sort($parameters["column"], $parameters["sort"])
      ->paginate($parameters["size"])
      ->toArray();
    $activityLogs = initializeResultArray($activityLogsResult, $parameters);

    return inertia("dashboard/users/activity-logs/index", [
      "user" => $user,
      "queryResult" => $activityLogs,
    ]);
  }
}
