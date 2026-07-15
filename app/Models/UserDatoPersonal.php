<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDatoPersonal extends Model
{
    protected $fillable = [
        'user_id',
        'celular',
        'domicilio',
        'solicitud_embajador',
        'dni',
    ];

    protected function casts(): array
    {
        return [
            'solicitud_embajador' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isComplete(): bool
    {
        return filled($this->celular)
            && filled($this->domicilio)
            && filled($this->dni);
    }
}
