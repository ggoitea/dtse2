<?php

namespace App\Modules\Sitios\UseCases;

use App\Enums\SitioEstado;
use App\Models\Sitio;

class CrearSitio
{
    public static function make(array $datos, int $userId): Sitio
    {
        $datos['estado'] = SitioEstado::Pendiente;
        $datos['creado_por_user_id'] = $userId;

        return Sitio::create($datos);
    }
}
