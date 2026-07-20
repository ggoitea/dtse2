<?php

use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\ContactoController;
use App\Http\Controllers\EjemploController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\MapaController;
use App\Http\Controllers\NovedadesController;
use App\Http\Controllers\PaqueteController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [LandingController::class, 'index'])->name('landing');
Route::get('/novedades', [NovedadesController::class, 'index'])->name('novedades');
Route::get('/sitios', [MapaController::class, 'index'])->name('sitios.mapa');
Route::post('/contacto', [ContactoController::class, 'store'])->name('contacto.store');
Route::get('/paquetes', [PaqueteController::class, 'index'])->name('paquetes.index');
Route::get('/eventos', [EventoController::class, 'index'])->name('eventos.index');

// Google OAuth routes (must be outside guest middleware since callback may need authenticated user)
Route::get('/auth/google', [SocialiteController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [SocialiteController::class, 'callback'])->name('google.callback');

// API for map data (JSON responses for react-leaflet)
Route::get('/sitios/data', [MapaController::class, 'data'])->name('sitios.data');
Route::get('/api/departamentos', [MapaController::class, 'departamentos'])->name('api.departamentos');
Route::get('/api/localidades', [MapaController::class, 'localidades'])->name('api.localidades');

// Auth routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Rutas para cargar créditos
    Route::prefix('credito')->group(function () {
        Route::get('/recarga', function () {
            echo 'Cargar créditos page';
        })->name('credito.recarga');
    });

    Route::prefix('ejemplos')->group(function () {
        Route::get('/esqueleto', [EjemploController::class, 'esqueleto'])->name('ejemplo.esqueleto');
        Route::get('/tabla-con-filtros', [EjemploController::class, 'tablaConFiltros'])->name('ejemplo.tablaConFiltros');
        Route::get('/tabla-con-filtros/{id}', [EjemploController::class, 'tablaConFiltrosShow'])->name('ejemplo.tablaConFiltrosShow');
    });

    // Eventos CRUD
    Route::get('/eventos/create', [EventoController::class, 'create'])->name('eventos.create');
    Route::post('/eventos', [EventoController::class, 'store'])->name('eventos.store');
    Route::get('/eventos/{evento}/edit', [EventoController::class, 'edit'])->name('eventos.edit');
    Route::put('/eventos/{evento}', [EventoController::class, 'update'])->name('eventos.update');
    Route::delete('/eventos/{evento}', [EventoController::class, 'destroy'])->name('eventos.destroy');

    // Paquetes CRUD
    Route::get('/paquetes/create', [PaqueteController::class, 'create'])->name('paquetes.create');
    Route::post('/paquetes', [PaqueteController::class, 'store'])->name('paquetes.store');
    Route::get('/paquetes/{paquete}/edit', [PaqueteController::class, 'edit'])->name('paquetes.edit');
    Route::put('/paquetes/{paquete}', [PaqueteController::class, 'update'])->name('paquetes.update');
    Route::delete('/paquetes/{paquete}', [PaqueteController::class, 'destroy'])->name('paquetes.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/platform.php';
