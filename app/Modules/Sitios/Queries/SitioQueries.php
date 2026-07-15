<?php

namespace App\Modules\Sitios\Queries;

use App\Models\Sitio;
use Illuminate\Database\Eloquent\Builder;

class SitioQueries
{
    public static function query(): Builder
    {
        return Sitio::query()
            ->with(['localidad.departamento', 'archivoDefault'])
            ->orderBy('nombre');
    }

    public static function activos(): Builder
    {
        return self::query()->activos();
    }

    public static function porCategoria(string $categoria): Builder
    {
        return self::query()->where('categoria', $categoria);
    }

    public static function porLocalidad(int $localidadId): Builder
    {
        return self::query()->where('localidad_id', $localidadId);
    }

    public static function buscar(string $termino): Builder
    {
        return self::query()->where(function (Builder $q) use ($termino) {
            $q->where('nombre', 'like', "%{$termino}%")
                ->orWhere('descripcion', 'like', "%{$termino}%");
        });
    }

    public static function porRadio(float $lat, float $lng, float $radioKm): Builder
    {
        return self::activos()->porRadio($lat, $lng, $radioKm)->limit(20);
    }
}
