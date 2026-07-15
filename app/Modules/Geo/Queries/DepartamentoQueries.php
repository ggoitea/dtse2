<?php

namespace App\Modules\Geo\Queries;

use App\Models\Departamento;
use Illuminate\Database\Eloquent\Builder;

class DepartamentoQueries
{
    public static function query(): Builder
    {
        return Departamento::query()->orderBy('nombre');
    }
}
