<?php

namespace App\Modules\Eventos\UseCases;

use App\Models\Evento;
use Illuminate\Database\Eloquent\Collection;

class ObtenerEventos
{
    public static function make(array $filtros = []): Collection
    {
        $query = Evento::query()
            ->with(['localidad', 'sitio', 'archivoDefault'])
            ->orderBy('fecha');

        $buscar = $filtros['buscar'] ?? null;

        if (is_string($buscar) && $buscar !== '') {
            $query->where(function ($q) use ($buscar) {
                $q->where('nombre', 'like', "%{$buscar}%")
                    ->orWhere('descripcion', 'like', "%{$buscar}%");
            });
        }

        return $query->get();
    }
}
