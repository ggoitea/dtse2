<?php

namespace App\Modules\Geo\UseCases;

use App\Models\Departamento;
use Illuminate\Database\Eloquent\Collection;

class ObtenerDepartamentos
{
    public static function make(): Collection
    {
        return Departamento::query()->orderBy('nombre')->get();
    }
}
