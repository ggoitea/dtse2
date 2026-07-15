<?php

namespace App\Modules\Sitios\UseCases;

use App\Models\Sitio;
use Illuminate\Database\Eloquent\Collection;

class ObtenerSitios
{
    public static function make(array $filtros = []): Collection
    {
        $query = Sitio::query()
            ->with(['localidad.departamento', 'archivoDefault', 'eventos', 'paquetes'])
            ->activos();

        $buscar = $filtros['buscar'] ?? null;
        $categoria = $filtros['categoria'] ?? null;

        if (is_string($buscar) && $buscar !== '') {
            $query->where(function ($q) use ($buscar) {
                $q->where('nombre', 'like', "%{$buscar}%")
                    ->orWhere('descripcion', 'like', "%{$buscar}%");
            });
        }

        if (is_string($categoria) && $categoria !== '') {
            $query->where('categoria', $categoria);
        }

        return $query->orderBy('nombre')->get();
    }
}
