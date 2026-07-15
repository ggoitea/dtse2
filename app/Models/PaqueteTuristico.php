<?php

namespace App\Models;

use App\Enums\PaqueteCategoria;
use App\Enums\PaqueteEstado;
use App\Traits\HasArchivos;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class PaqueteTuristico extends Model
{
    use HasArchivos;

    protected $table = 'paquete_turisticos';

    protected $fillable = [
        'modelable_type',
        'modelable_id',
        'nombre',
        'descripcion',
        'categoria',
        'destino',
        'duracion',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'categoria' => PaqueteCategoria::class,
            'estado' => PaqueteEstado::class,
        ];
    }

    public function modelable(): MorphTo
    {
        return $this->morphTo();
    }
}
