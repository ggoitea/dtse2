<?php

namespace App\Modules\Eventos\UseCases;

use App\Enums\EventoEstadoEnum;
use App\Models\Evento;
use App\Models\User;

class CrearEvento
{
    public static function make(array $datos, ?int $userId = null): Evento
    {
        $user = $userId ? User::find($userId) : null;

        if ($user && $user->hasRole('colaborador')) {
            $datos['estado'] = EventoEstadoEnum::Pendiente;
        } elseif (! isset($datos['estado'])) {
            $datos['estado'] = EventoEstadoEnum::Pendiente;
        }

        if ($userId) {
            $datos['creado_por_user_id'] = $userId;
        }

        return Evento::create($datos);
    }
}
