<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $asentamiento_id
 * @property int $departamento_id
 * @property bool $es_paraje
 * @property string $nombre
 * @property float|null $latitud
 * @property float|null $longitud
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Departamento|null $departamento
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Evento> $eventos
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Sitio> $sitios
 */
class Localidad extends Model
{
    use HasFactory;

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
