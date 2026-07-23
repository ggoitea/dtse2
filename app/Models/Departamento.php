<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $asentamiento_id
 * @property string $nombre
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Localidad> $localidades
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
