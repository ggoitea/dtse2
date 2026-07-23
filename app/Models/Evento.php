<?php

namespace App\Models;

use App\Enums\EventoEstadoEnum;
use App\Traits\HasArchivos;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $localidad_id
 * @property int|null $sitio_id
 * @property string $nombre
 * @property string|null $descripcion
 * @property \Illuminate\Support\Carbon $fecha
 * @property \Illuminate\Support\Carbon|null $inicio
 * @property \Illuminate\Support\Carbon|null $fin
 * @property string|null $domicilio_calle
 * @property string|null $domicilio_numero
 * @property EventoEstadoEnum $estado
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class Evento extends Model
{
    use HasArchivos, HasFactory;

    protected $fillable = [
        'localidad_id',
        'sitio_id',
        'nombre',
        'descripcion',
        'fecha',
        'inicio',
        'fin',
        'domicilio_calle',
        'domicilio_numero',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'inicio' => 'datetime:H:i',
            'fin' => 'datetime:H:i',
            'estado' => EventoEstadoEnum::class,
        ];
    }

    public function localidad(): BelongsTo
    {
        return $this->belongsTo(Localidad::class);
    }

    public function sitio(): BelongsTo
    {
        return $this->belongsTo(Sitio::class);
    }

    public function paquetes(): HasMany
    {
        return $this->hasMany(PaqueteTuristico::class, 'modelable_id')
            ->where('modelable_type', self::class);
    }

    public function scopeProximos(Builder $query): void
    {
        $query->where('fecha', '>=', now()->toDateString())
            ->where('estado', EventoEstadoEnum::Activo)
            ->orderBy('fecha');
    }

    public function scopeActivos(Builder $query): void
    {
        $query->where('estado', EventoEstadoEnum::Activo);
    }
}
