<?php

namespace App\Enums;

enum PaqueteEstado: string
{
    case Activo = 'activo';
    case Agotado = 'agotado';
    case Suspendido = 'suspendido';
    case Cancelado = 'cancelado';

    public function label(): string
    {
        return match ($this) {
            self::Activo => 'Activo',
            self::Agotado => 'Agotado',
            self::Suspendido => 'Suspendido',
            self::Cancelado => 'Cancelado',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
