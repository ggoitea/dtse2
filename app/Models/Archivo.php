<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Archivo extends Model
{
    protected $fillable = [
        'modelable_type',
        'modelable_id',
        'nombre',
        'path',
        'mime_type',
        'default',
    ];

    protected function casts(): array
    {
        return [
            'default' => 'boolean',
        ];
    }

    public function modelable(): MorphTo
    {
        return $this->morphTo();
    }
}
