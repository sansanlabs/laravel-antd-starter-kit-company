<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

Route::prefix("auth")->group(function (): void {
    // Login
    Route::get( "/login",              [AuthenticatedSessionController::class, "index"            ])->name("login"             )->middleware("guest");
    Route::get( "/microsoft/redirect", [AuthenticatedSessionController::class, "microsoftRedirect"])->name("microsoft.redirect");
    Route::get( "/microsoft/callback", [AuthenticatedSessionController::class, "microsoftCallback"])->name("microsoft.callback");
    
    Route::middleware("auth")->group(function (): void {
        // Logout
        Route::post("/logout", [AuthenticatedSessionController::class, "logout"])->name("logout");
    });
});
