<?php

namespace App\Http\Controllers;

use App\Enums\Permission;
use App\Http\Requests\EventoRequest;
use App\Models\Evento;
use App\Models\Localidad;
use App\Models\Sitio;
use App\Modules\Eventos\Queries\EventoQueries;
use App\Modules\Eventos\UseCases\ActualizarEvento;
use App\Modules\Eventos\UseCases\CrearEvento;
use App\Modules\Eventos\UseCases\EliminarEvento;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventoController extends Controller
{
    public function index(Request $request): Response
    {
        $eventos = EventoQueries::paginated($request->only(['buscar', 'page']));

        return Inertia::render('eventos/index', [
            'eventos' => fn () => $eventos,
            'filtros' => $request->only(['buscar']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize(Permission::EventosCreate->value);

        return Inertia::render('eventos/create', [
            'localidades' => fn () => Localidad::orderBy('nombre')->get(['id', 'nombre']),
            'sitios' => fn () => Sitio::orderBy('nombre')->get(['id', 'nombre', 'localidad_id', 'domicilio_calle', 'domicilio_numero']),
        ]);
    }

    public function store(EventoRequest $request): RedirectResponse
    {
        $evento = CrearEvento::make($request->validated(), $request->user()->id);

        return redirect()
            ->route('eventos.index')
            ->with('success', 'Evento creado exitosamente.');
    }

    public function edit(Evento $evento): Response
    {
        $this->authorize(Permission::EventosEdit->value);

        return Inertia::render('eventos/edit', [
            'evento' => $evento->load(['localidad', 'sitio']),
            'localidades' => fn () => Localidad::orderBy('nombre')->get(['id', 'nombre']),
            'sitios' => fn () => Sitio::orderBy('nombre')->get(['id', 'nombre', 'localidad_id', 'domicilio_calle', 'domicilio_numero']),
        ]);
    }

    public function update(EventoRequest $request, Evento $evento): RedirectResponse
    {
        $evento = ActualizarEvento::make($evento, $request->validated());

        return redirect()
            ->route('eventos.index')
            ->with('success', 'Evento actualizado exitosamente.');
    }

    public function destroy(Request $request, Evento $evento): RedirectResponse
    {
        if (! $request->user()->hasRole('admin')) {
            abort(403);
        }

        EliminarEvento::make($evento);

        return redirect()
            ->route('eventos.index')
            ->with('success', 'Evento eliminado exitosamente.');
    }
}
