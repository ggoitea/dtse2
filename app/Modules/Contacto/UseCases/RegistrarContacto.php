<?php

namespace App\Modules\Contacto\UseCases;

use App\Models\Contacto;

class RegistrarContacto
{
    public static function make(array $datos): Contacto
    {
        return Contacto::create($datos);
    }
}
