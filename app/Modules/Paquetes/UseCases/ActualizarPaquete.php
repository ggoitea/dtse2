<?php

namespace App\Modules\Paquetes\UseCases;

use App\Models\PaqueteTuristico;

class ActualizarPaquete
{
    public static function make(PaqueteTuristico $paquete, array $datos): PaqueteTuristico
    {
        unset($datos['evento_data']);

        $paquete->update($datos);

        return $paquete->fresh();
    }
}
