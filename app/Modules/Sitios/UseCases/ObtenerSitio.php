<?php

namespace App\Modules\Sitios\UseCases;

use App\Models\Sitio;

class ObtenerSitio
{
    public static function make(int $id): Sitio
    {
        return Sitio::query()
            ->with([
                'localidad.departamento',
                'archivos',
                'archivoDefault',
                'sociales',
                'aperturas',
                'eventos' => fn ($q) => $q->orderBy('fecha'),
                'paquetes',
            ])
            ->findOrFail($id);
    }
}
