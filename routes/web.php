<?php

use App\Http\Controllers\ContactoController;
use App\Http\Controllers\EjemploController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\MapaController;
use App\Http\Controllers\NovedadesController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [LandingController::class, 'index'])->name('home');
Route::post('/contacto', [ContactoController::class, 'store'])->name('contacto.store');
Route::get('/novedades', [NovedadesController::class, 'index'])->name('novedades');
Route::get('/sitios', [MapaController::class, 'index'])->name('sitios.mapa');

// API for map data (JSON responses for react-leaflet)
Route::get('/sitios/data', [MapaController::class, 'data'])->name('sitios.data');
Route::get('/api/departamentos', [MapaController::class, 'departamentos'])->name('api.departamentos');
Route::get('/api/localidades', [MapaController::class, 'localidades'])->name('api.localidades');

// Auth routes
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
