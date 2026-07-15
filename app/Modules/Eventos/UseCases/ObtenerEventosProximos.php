<?php

namespace App\Modules\Eventos\UseCases;

use App\Models\Evento;
use Illuminate\Database\Eloquent\Collection;

class ObtenerEventosProximos
{
    public static function make(int $limite = 10): Collection
    {
        return Evento::query()
            ->with(['localidad', 'sitio', 'archivoDefault'])
            ->proximos()
            ->limit($limite)
            ->get();
    }
}
