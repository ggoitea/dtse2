<?php

namespace App\Modules\Paquetes\UseCases;

use App\Enums\PaqueteEstadoEnum;
use App\Models\PaqueteTuristico;
use App\Modules\Eventos\UseCases\CrearEvento;

class CrearPaquete
{
    public static function make(array $datos, ?int $userId = null): PaqueteTuristico
    {
        $eventoData = $datos['evento_data'] ?? null;
        unset($datos['evento_data']);

        if ($eventoData) {
            $evento = CrearEvento::make($eventoData, $userId);
            $datos['modelable_type'] = $evento->getMorphClass();
            $datos['modelable_id'] = $evento->id;
        }

        if (! isset($datos['estado'])) {
            $datos['estado'] = PaqueteEstadoEnum::Activo;
        }

        return PaqueteTuristico::create($datos);
    }
}
