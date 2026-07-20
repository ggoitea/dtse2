<?php

namespace App\Http\Controllers;

use App\Enums\PaqueteCategoriaEnum;
use App\Enums\Permission;
use App\Http\Requests\PaqueteRequest;
use App\Http\Resources\PaqueteResource;
use App\Models\Evento;
use App\Models\Localidad;
use App\Models\PaqueteTuristico;
use App\Models\Sitio;
use App\Modules\Paquetes\Queries\PaqueteQueries;
use App\Modules\Paquetes\UseCases\ActualizarPaquete;
use App\Modules\Paquetes\UseCases\CrearPaquete;
use App\Modules\Paquetes\UseCases\EliminarPaquete;
use App\Modules\Paquetes\UseCases\ObtenerPaquetes;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaqueteController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('paquetes/index', [
            'paquetes' => fn() => PaqueteResource::collection(ObtenerPaquetes::make(
                page: $request->input('page', 1),
                perPage: $request->input('perPage', 25),
                filtros: $request->only(['buscar']),
            )),
            'filtros' => $request->only(['buscar']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize(Permission::PaquetesCreate->value);

        return Inertia::render('paquetes/create', [
            'localidades' => fn() => Localidad::orderBy('nombre')->get(['id', 'nombre']),
            'sitios' => fn() => Sitio::orderBy('nombre')->get(['id', 'nombre', 'localidad_id']),
            'eventos' => fn() => Evento::orderBy('nombre')->get(['id', 'nombre', 'localidad_id']),
            'categorias' => PaqueteCategoriaEnum::options(),
        ]);
    }

    public function store(PaqueteRequest $request): RedirectResponse
    {
        $paquete = CrearPaquete::make($request->validated(), $request->user()->id);

        return redirect()
            ->route('paquetes.index')
            ->with('success', 'Paquete turístico creado exitosamente.');
    }

    public function edit(PaqueteTuristico $paquete): Response
    {
        $this->authorize(Permission::PaquetesEdit->value);

        return Inertia::render('paquetes/edit', [
            'paquete' => $paquete->load('modelable'),
            'localidades' => fn() => Localidad::orderBy('nombre')->get(['id', 'nombre']),
            'sitios' => fn() => Sitio::orderBy('nombre')->get(['id', 'nombre', 'localidad_id']),
            'eventos' => fn() => Evento::orderBy('nombre')->get(['id', 'nombre', 'localidad_id']),
            'categorias' => PaqueteCategoriaEnum::options(),
        ]);
    }

    public function update(PaqueteRequest $request, PaqueteTuristico $paquete): RedirectResponse
    {
        $paquete = ActualizarPaquete::make($paquete, $request->validated());

        return redirect()
            ->route('paquetes.index')
            ->with('success', 'Paquete turístico actualizado exitosamente.');
    }

    public function destroy(Request $request, PaqueteTuristico $paquete): RedirectResponse
    {
        if (! $request->user()->hasRole('admin')) {
            abort(403);
        }

        EliminarPaquete::make($paquete);

        return redirect()
            ->route('paquetes.index')
            ->with('success', 'Paquete turístico eliminado exitosamente.');
    }
}
