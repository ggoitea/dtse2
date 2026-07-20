<?php

namespace App\Models;

use App\Enums\PaqueteCategoriaEnum;
use App\Enums\PaqueteEstadoEnum;
use App\Traits\HasArchivos;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class PaqueteTuristico extends Model
{
    use HasArchivos, HasFactory;

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
            'categoria' => PaqueteCategoriaEnum::class,
            'estado' => PaqueteEstadoEnum::class,
        ];
    }

    public function modelable(): MorphTo
    {
        return $this->morphTo();
    }
}
