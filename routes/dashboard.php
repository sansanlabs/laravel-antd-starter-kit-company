<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\PermissionController;
use App\Http\Controllers\Dashboard\RoleController;
use App\Http\Controllers\Dashboard\User\ActivityLogController;
use App\Http\Controllers\Dashboard\User\DeviceSessionController;
use App\Http\Controllers\Dashboard\User\UserController;
use App\Http\Controllers\Dashboard\UserActivityLogController;

Route::prefix("dashboard")->middleware(["ms_auth", "auth"])->group(function (): void {
  // Dashboard
  Route::get("/", [DashboardController::class, "index"])->name("dashboard.index")->middleware("can:Dashboard.Index");

  // Users
  Route::prefix("users")->group(function (): void {
    Route::get( "/",                   [UserController::class, "index"     ])->name("users.index"      )->middleware("can:Users.Index"        );
    Route::get( "/auth-avatar",        [UserController::class, "authAvatar"])->name("users.auth-avatar");
    Route::get( "/{user}/show",        [UserController::class, "show"      ])->name("users.show"       );
    Route::get( "/{user}/edit",        [UserController::class, "edit"      ])->name("users.edit"       )->middleware("can:Users.Edit"         );
    Route::put( "/{user}/update",      [UserController::class, "update"    ])->name("users.update"     )->middleware("can:Users.Edit"         );
    Route::get( "/{user}/user-avatar", [UserController::class, "userAvatar"])->name("users.user-avatar");

    // Activity Logs
    Route::prefix("{user}/activity-logs")->group(function (): void {
      Route::get("/", [ActivityLogController::class, "index" ])->name("users.activity-logs.index" )->middleware("can:Users.ActivityLogs.Index");
    });

    // Device Sessions
    Route::prefix("{user}/device-sessions")->group(function (): void {
      Route::get(   "/",                        [DeviceSessionController::class, "index"     ])->name("users.device-sessions.index"      )->middleware("can:Users.DeviceSessions.Index"    );
      Route::delete("/destroy-all",             [DeviceSessionController::class, "destroyAll"])->name("users.device-sessions.destroy-all")->middleware("can:Users.DeviceSessions.Logout"   );
      Route::delete("/{deviceSession}/destroy", [DeviceSessionController::class, "destroy"   ])->name("users.device-sessions.destroy"    )->middleware("can:Users.DeviceSessions.LogoutAll");
    });
  });

  // User Activity Logs
  Route::prefix("user-activity-logs")->group(function (): void {
    Route::get("/", [UserActivityLogController::class, "index"])->name("user-activity-logs.index")->middleware("can:UserActivityLogs.Index");
  });

  // Roles and Permissions
  Route::prefix("roles-and-permissions")->group(function (): void {
    // Roles
    Route::prefix("roles")->group(function (): void {
      Route::get(   "/",               [RoleController::class, "index"  ])->name("roles.index"  )->middleware("can:Roles.Index" );
      Route::get(   "/create",         [RoleController::class, "create" ])->name("roles.create" )->middleware("can:Roles.Create");
      Route::post(  "/store",          [RoleController::class, "store"  ])->name("roles.store"  )->middleware("can:Roles.Create");
      Route::get(   "/{role}/show",    [RoleController::class, "show"   ])->name("roles.show"   )->middleware("can:Roles.Detail");
      Route::get(   "/{role}/edit",    [RoleController::class, "edit"   ])->name("roles.edit"   )->middleware("can:Roles.Edit"  );
      Route::put(   "/{role}/update",  [RoleController::class, "update" ])->name("roles.update" )->middleware("can:Roles.Edit"  );
      Route::delete("/{role}/destroy", [RoleController::class, "destroy"])->name("roles.destroy")->middleware("can:Roles.Delete");
    });
    
    // Permissions
    Route::prefix("permissions")->group(function (): void {
      Route::get("/", [PermissionController::class, "index"])->name("permissions.index")->middleware("can:Permissions.Index");
    });
  });
});
