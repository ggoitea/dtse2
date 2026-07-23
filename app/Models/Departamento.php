<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $asentamiento_id
 * @property string $nombre
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Localidad> $localidades
 */
class Departamento extends Model
{
    use HasFactory;

    protected $fillable = [
        'asentamiento_id',
        'nombre',
    ];

    public function localidades(): HasMany
    {
        return $this->hasMany(Localidad::class);
    }
}
