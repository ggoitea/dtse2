<?php

namespace App\Models;

use App\Enums\SitioAperturaDiaEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SitioApertura extends Model
{
    protected $fillable = [
        'sitio_id',
        'dia',
        'apertura',
        'cierre',
    ];

    protected function casts(): array
    {
        return [
            'dia' => SitioAperturaDiaEnum::class,
            'apertura' => 'datetime:H:i',
            'cierre' => 'datetime:H:i',
        ];
    }

    public function sitio(): BelongsTo
    {
        return $this->belongsTo(Sitio::class);
    }
}
