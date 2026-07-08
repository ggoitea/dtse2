<?php

namespace App\Http\Controllers;

use App\Http\Resources\UsuarioResource;
use App\Models\User;
use App\Modules\Ejemplos\TablaConFiltros\UseCases\ObtenerUsuarios;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EjemploController extends Controller
{
    public function esqueleto()
    {
        return Inertia::render('ejemplo/un-dominio/index');
    }

    public function tablaConFiltros(Request $request)
    {
        $page = $request->input('usuariosPage', 1);
        $filtros = [
            'search' => $request->input('search'),
        ];

        return Inertia::render('ejemplo/tabla-con-filtros/index', [
            'filtros' => $filtros,
            'usuarios' => fn () => UsuarioResource::collection(ObtenerUsuarios::make(page: $page, filtros: $filtros)),
        ]);
    }

    public function tablaConFiltrosShow(string $id)
    {
        return Inertia::render('ejemplo/tabla-con-filtros/show', [
            'usuario' => fn () => new UsuarioResource(User::findOrFail($id)),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
