<?php

namespace App\Http\Controllers;

use App\Models\Departamento;
use App\Models\Localidad;
use App\Models\Sitio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapaController extends Controller
{
    public function index()
    {
        return Inertia::render('mapa/index');
    }

    public function data(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'radio' => 'required|numeric|min:1|max:100',
        ]);

        $sitios = Sitio::query()
            ->with(['localidad', 'archivoDefault'])
            ->activos()
            ->porRadio(
                (float) $request->lat,
                (float) $request->lng,
                (float) $request->radio
            )
            ->limit(20)
            ->get();

        return response()->json($sitios);
    }

    public function departamentos(): JsonResponse
    {
        return response()->json(Departamento::orderBy('nombre')->get());
    }

    public function localidades(Request $request): JsonResponse
    {
        $query = Localidad::query()->with('departamento')->orderBy('nombre');

        if ($request->has('departamento_id')) {
            $query->where('departamento_id', $request->departamento_id);
        }

        return response()->json($query->get());
    }
}
