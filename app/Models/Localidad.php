<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $asentamiento_id
 * @property int $departamento_id
 * @property bool $es_paraje
 * @property string $nombre
 * @property float|null $latitud
 * @property float|null $longitud
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Departamento|null $departamento
 * @property-read Collection<int, Evento> $eventos
 * @property-read Collection<int, Sitio> $sitios
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
