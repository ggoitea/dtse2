<?php

namespace App\Http\Controllers;

use App\Models\Departamento;
use App\Models\Localidad;
use App\Models\Sitio;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        return Inertia::render('landing', [
            'stats' => [
                'departamentos' => Departamento::count(),
                'nodos' => Localidad::count(),
                'sitios' => Sitio::count(),
            ],
        ]);
    }
}
