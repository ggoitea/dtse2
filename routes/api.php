<?php

use App\Modules\Chatbot\UseCases\RealizarConsulta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/api/v1.0/asistente', function (Request $request) {
    $request->validate([
        'consulta' => 'required|string|max:255',
    ]);

    return response()->json([
        'respuesta' => RealizarConsulta::make($request->input('consulta')),
    ]);
})->middleware('auth:sanctum')->withoutMiddleware('auth:sanctum')
    ->name('api.asistente');
