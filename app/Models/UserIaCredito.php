<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserIaCredito extends Model
{
    protected $fillable = [
        'user_id',
        'creditos_disponibles',
        'creditos_usados',
    ];

    protected function casts(): array
    {
        return [
            'creditos_disponibles' => 'integer',
            'creditos_usados' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function hasCredits(): bool
    {
        return $this->creditos_disponibles > 0;
    }
}
