<?php

use App\Http\Controllers\LauncherController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('launcher', [LauncherController::class, 'index'])->name('launcher');
});
