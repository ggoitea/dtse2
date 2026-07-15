<?php

namespace App\Models;

use App\Enums\SitioCategoria;
use App\Enums\SitioEstado;
use App\Traits\HasArchivos;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sitio extends Model
{
    use HasArchivos;

    protected $fillable = [
        'localidad_id',
        'nombre',
        'domicilio_calle',
        'domicilio_numero',
        'contacto_telefono',
        'contacto_email',
        'latitud',
        'longitud',
        'descripcion',
        'estado',
        'creado_por_user_id',
        'categoria',
    ];

    protected function casts(): array
    {
        return [
            'estado' => SitioEstado::class,
            'categoria' => SitioCategoria::class,
        ];
    }

    public function localidad(): BelongsTo
    {
        return $this->belongsTo(Localidad::class);
    }

    public function creador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'creado_por_user_id');
    }

    public function sociales(): HasMany
    {
        return $this->hasMany(SitioSocial::class);
    }

    public function aperturas(): HasMany
    {
        return $this->hasMany(SitioApertura::class);
    }

    public function eventos(): HasMany
    {
        return $this->hasMany(Evento::class);
    }

    public function paquetes(): HasMany
    {
        return $this->hasMany(PaqueteTuristico::class, 'modelable_id')
            ->where('modelable_type', self::class);
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $buscar = $filters['buscar'] ?? null;
        $categoria = $filters['categoria'] ?? null;

        if (is_string($buscar) && $buscar !== '') {
            $query->where(function (Builder $q) use ($buscar) {
                $q->where('nombre', 'like', "%{$buscar}%")
                    ->orWhere('descripcion', 'like', "%{$buscar}%");
            });
        }

        if (is_string($categoria) && $categoria !== '') {
            $query->where('categoria', $categoria);
        }
    }

    public function scopeActivos(Builder $query): void
    {
        $query->where('estado', SitioEstado::Activo);
    }

    public function scopePorRadio(Builder $query, float $lat, float $lng, float $radioKm): void
    {
        $query->selectRaw('*, (
            6371 * acos(
                cos(radians(?)) * cos(radians(latitud)) *
                cos(radians(longitud) - radians(?)) +
                sin(radians(?)) * sin(radians(latitud))
            )
        ) AS distancia', [$lat, $lng, $lat])
            ->having('distancia', '<', $radioKm)
            ->orderBy('distancia');
    }
}
