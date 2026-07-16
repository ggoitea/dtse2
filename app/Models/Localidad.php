<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Localidad extends Model
{
    protected $table = 'localidades';

    protected $fillable = [
        'asentamiento_id',
        'departamento_id',
        'es_paraje',
        'nombre',
        'latitud',
        'longitud',
    ];

    protected function casts(): array
    {
        return [
            'es_paraje' => 'boolean',
        ];
    }

    public function departamento(): BelongsTo
    {
        return $this->belongsTo(Departamento::class);
    }

    public function sitios(): HasMany
    {
        return $this->hasMany(Sitio::class);
    }

    public function eventos(): HasMany
    {
        return $this->hasMany(Evento::class);
    }
}
