<?php

namespace App\Modules\Eventos\UseCases;

use App\Models\Evento;

class EliminarEvento
{
    public static function make(Evento $evento): bool
    {
        return $evento->delete();
    }
}
