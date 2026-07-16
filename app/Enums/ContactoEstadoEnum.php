<?php

namespace App\Enums;

enum ContactoEstadoEnum: string
{
    case Nuevo = 'nuevo';
    case Leido = 'leido';
    case Respondido = 'respondido';

    public function label(): string
    {
        return match ($this) {
            self::Nuevo => 'Nuevo',
            self::Leido => 'Leído',
            self::Respondido => 'Respondido',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
