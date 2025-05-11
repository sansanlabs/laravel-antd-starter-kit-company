<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Response;

class DashboardController extends Controller {
  public function index(): Response {
    $userTotal = User::count();
    $roleTotal = Role::count();
    $permissionTotal = Permission::count();

    $activityLogs = ActivityLog::with(["subject", "causer"])
      ->latest()
      ->take(5)
      ->orderBy("id", "asc")
      ->get();

    return inertia("dashboard/index", [
      "userTotal" => $userTotal,
      "roleTotal" => $roleTotal,
      "permissionTotal" => $permissionTotal,
      "activityLogs" => $activityLogs,
    ]);
  }
}
