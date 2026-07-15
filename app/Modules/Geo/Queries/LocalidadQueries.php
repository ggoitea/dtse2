<?php

namespace App\Modules\Geo\Queries;

use App\Models\Localidad;
use Illuminate\Database\Eloquent\Builder;

class LocalidadQueries
{
    public static function query(): Builder
    {
        return Localidad::query()->orderBy('nombre');
    }

    public static function porDepartamento(int $departamentoId): Builder
    {
        return self::query()->where('departamento_id', $departamentoId);
    }
}
