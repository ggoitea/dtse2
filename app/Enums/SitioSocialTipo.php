<?php

namespace App\Enums;

enum SitioSocialTipo: string
{
    case Web = 'web';
    case Youtube = 'youtube';
    case Facebook = 'facebook';
    case Instagram = 'instagram';
    case X = 'x';
    case Tiktok = 'tiktok';

    public function label(): string
    {
        return match ($this) {
            self::Web => 'Web',
            self::Youtube => 'YouTube',
            self::Facebook => 'Facebook',
            self::Instagram => 'Instagram',
            self::X => 'X',
            self::Tiktok => 'TikTok',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
