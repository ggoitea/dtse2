<?php

namespace App\Enums;

enum SitioAperturaDiaEnum: string
{
    case Lunes = 'lunes';
    case Martes = 'martes';
    case Miercoles = 'miercoles';
    case Jueves = 'jueves';
    case Viernes = 'viernes';
    case Sabado = 'sabado';
    case Domingo = 'domingo';

    public function label(): string
    {
        return match ($this) {
            self::Lunes => 'Lunes',
            self::Martes => 'Martes',
            self::Miercoles => 'Miércoles',
            self::Jueves => 'Jueves',
            self::Viernes => 'Viernes',
            self::Sabado => 'Sábado',
            self::Domingo => 'Domingo',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
