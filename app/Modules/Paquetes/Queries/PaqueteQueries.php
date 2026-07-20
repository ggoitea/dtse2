<?php

namespace App\Modules\Paquetes\Queries;

use App\Models\PaqueteTuristico;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class PaqueteQueries
{
    public static function obtenerPaquetes(array $filtros = []): Builder
    {
        $filtros = array_merge([
            'buscar' => null,
        ], $filtros);

        return PaqueteTuristico::query()
            ->when($filtros['buscar'], fn(Builder $q) => $q->where('nombre', 'like', "%{$filtros['buscar']}%")
                ->orWhere('descripcion', 'like', "%{$filtros['buscar']}%"))
            ->orderBy('id', 'asc');
    }
}
