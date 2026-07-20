<?php

namespace App\Modules\Eventos\UseCases;

use App\Models\Evento;

class ActualizarEvento
{
    public static function make(Evento $evento, array $datos): Evento
    {
        $evento->update($datos);

        return $evento->fresh();
    }
}
