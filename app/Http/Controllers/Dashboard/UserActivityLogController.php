<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Response;

class UserActivityLogController extends Controller {
  public function index(Request $request): Response {
    $parameters = initializeQueryParams($request);
    $activityLogsResult = ActivityLog::query()
      ->with(["subject", "causer"])
      ->search($parameters["search"])
      ->sort($parameters["column"], $parameters["sort"])
      ->paginate($parameters["size"])
      ->toArray();
    $activityLogs = initializeResultArray($activityLogsResult, $parameters);

    return inertia("dashboard/user-activity-logs/index", [
      "queryResult" => $activityLogs,
    ]);
  }
}
