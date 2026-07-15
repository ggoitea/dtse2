<?php

namespace App\Models;

use App\Enums\SitioSocialTipo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SitioSocial extends Model
{
    protected $fillable = [
        'sitio_id',
        'tipo',
        'url',
    ];

    protected function casts(): array
    {
        return [
            'tipo' => SitioSocialTipo::class,
        ];
    }

    public function sitio(): BelongsTo
    {
        return $this->belongsTo(Sitio::class);
    }
}
