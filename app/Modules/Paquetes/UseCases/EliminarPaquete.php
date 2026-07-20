<?php

namespace App\Modules\Paquetes\UseCases;

use App\Models\PaqueteTuristico;

class EliminarPaquete
{
    public static function make(PaqueteTuristico $paquete): bool
    {
        return $paquete->delete();
    }
}
