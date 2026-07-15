<?php

namespace App\Enums;

enum PaqueteCategoria: string
{
    case Aventura = 'aventura';
    case Cultura = 'cultura';
    case Relax = 'relax';
    case Familiar = 'familiar';
    case Romantico = 'romantico';
    case Negocios = 'negocios';

    public function label(): string
    {
        return match ($this) {
            self::Aventura => 'Aventura',
            self::Cultura => 'Cultura',
            self::Relax => 'Relax',
            self::Familiar => 'Familiar',
            self::Romantico => 'Romántico',
            self::Negocios => 'Negocios',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return array<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
