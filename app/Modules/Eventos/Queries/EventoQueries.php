<?php

namespace App\Modules\Eventos\Queries;

use App\Models\Evento;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class EventoQueries
{
    public static function query(): Builder
    {
        return Evento::query()
            ->with(['localidad', 'sitio', 'archivoDefault']);
    }

    public static function paginated(array $filtros = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = self::query()->orderBy('fecha');

        $buscar = $filtros['buscar'] ?? null;

        if (is_string($buscar) && $buscar !== '') {
            $query->where(function (Builder $q) use ($buscar) {
                $q->where('nombre', 'like', "%{$buscar}%")
                    ->orWhere('descripcion', 'like', "%{$buscar}%");
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public static function activos(): Builder
    {
        return self::query()->where('estado', 'activo');
    }
}
