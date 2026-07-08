<?php

use App\Http\Controllers\EjemploController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('ejemplos')->group(function () {
        Route::get('/esqueleto', [EjemploController::class, 'esqueleto'])->name('ejemplo.esqueleto');
        Route::get('/tabla-con-filtros', [EjemploController::class, 'tablaConFiltros'])->name('ejemplo.tablaConFiltros');
        Route::get('/tabla-con-filtros/{id}', [EjemploController::class, 'tablaConFiltrosShow'])->name('ejemplo.tablaConFiltrosShow');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/platform.php';
