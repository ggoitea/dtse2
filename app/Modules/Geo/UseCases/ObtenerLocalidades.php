<?php

namespace App\Modules\Geo\UseCases;

use App\Models\Localidad;
use Illuminate\Database\Eloquent\Collection;

class ObtenerLocalidades
{
    public static function make(?int $departamentoId = null): Collection
    {
        $query = Localidad::query()->with('departamento')->orderBy('nombre');

        if ($departamentoId) {
            $query->where('departamento_id', $departamentoId);
        }

        return $query->get();
    }
}
