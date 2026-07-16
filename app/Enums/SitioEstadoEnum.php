<?php

namespace App\Enums;

enum SitioEstadoEnum: string
{
    case Pendiente = 'pendiente';
    case Activo = 'activo';
    case Suspendido = 'suspendido';
    case Rechazado = 'rechazado';

    public function label(): string
    {
        return match ($this) {
            self::Pendiente => 'Pendiente',
            self::Activo => 'Activo',
            self::Suspendido => 'Suspendido',
            self::Rechazado => 'Rechazado',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
