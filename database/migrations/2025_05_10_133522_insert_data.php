<?php

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Str;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    $permissions = [
      // Dashboard permissions
      [
        "name" => "Dashboard.Index",
        "description" => "Access and view the main dashboard page",
      ],

      // User Permissions
      [
        "name" => "Users.Index",
        "description" => "View the list of users in the system",
      ],
      [
        "name" => "Users.Detail",
        "description" => "View detailed information about a specific user",
      ],
      [
        "name" => "Users.Edit",
        "description" => "Edit user information or assign roles and permissions",
      ],

      // User Activity Log Permissions
      [
        "name" => "Users.ActivityLogs.Index",
        "description" => "View activity logs for a specific user",
      ],
      [
        "name" => "Users.ActivityLogs.Detail",
        "description" => "View detailed activity log entries for a specific user",
      ],

      // User Device Session Permissions
      [
        "name" => "Users.DeviceSessions.Index",
        "description" => "View all active device sessions for a specific user",
      ],
      [
        "name" => "Users.DeviceSessions.Logout",
        "description" => "Force logout a specific device session for a user",
      ],
      [
        "name" => "Users.DeviceSessions.LogoutAll",
        "description" => "Force logout all device sessions for a user",
      ],

      // User Activity Log Permissions
      [
        "name" => "UserActivityLogs.Index",
        "description" => "View activity logs of all users in the system",
      ],
      [
        "name" => "UserActivityLogs.Detail",
        "description" => "View detailed activity log entries of all users in the system",
      ],

      // Role Permissions
      [
        "name" => "Roles.Index",
        "description" => "View the list of all roles",
      ],
      [
        "name" => "Roles.Create",
        "description" => "Create a new role with specific permissions",
      ],
      [
        "name" => "Roles.Detail",
        "description" => "View detailed information about a specific role",
      ],
      [
        "name" => "Roles.Edit",
        "description" => "Modify the details or permissions of an existing role",
      ],
      [
        "name" => "Roles.Delete",
        "description" => "Remove a role from the system",
      ],

      // Permission Permissions
      [
        "name" => "Permissions.Index",
        "description" => "View the list of all permissions in the system",
      ],

      // Laravel Telescope
      [
        "name" => "LaravelTelescope.Index",
        "description" => "Grants access to the Laravel Telescope main dashboard",
      ],
    ];

    foreach ($permissions as $permission) {
      Permission::create($permission);
    }

    // Create role super-admin
    $allPermission = Permission::all();
    $superAdminRole = Role::create([
      "name" => "SuperAdmin",
      "description" => "Has full access to all features and permissions across the system, including administrative functions",
    ])->givePermissionTo($allPermission);

    // Create user admin
    User::create([
      "microsoft_id" => Str::uuid7(),
      "name" => "Administration",
      "email" => "administration@os-selnajaya.com",
    ])->assignRole($superAdminRole);
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void {
    //
  }
};
