<?php

namespace App\Http\Controllers;

use App\Enums\SitioCategoria;
use App\Modules\Eventos\UseCases\ObtenerEventosProximos;
use App\Modules\Sitios\UseCases\ObtenerSitios;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NovedadesController extends Controller
{
    public function index(Request $request)
    {
        $filtros = $request->only(['buscar', 'categoria']);

        return Inertia::render('novedades/index', [
            'sitios' => fn() => ObtenerSitios::make($filtros),
            'eventos' => fn() => ObtenerEventosProximos::make(),
            'categorias' => SitioCategoria::options(),
        ]);
    }
}
