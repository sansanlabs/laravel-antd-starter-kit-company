<?php

use App\Http\Controllers\LocalizationController;
use Illuminate\Support\Facades\Route;

// Home
Route::redirect("/", "/dashboard");

// Localization
Route::put("/localization", [LocalizationController::class, "update"])->name("localization.update");

require __DIR__ . "/dashboard.php";
require __DIR__ . "/auth.php";
