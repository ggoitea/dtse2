<?php

namespace App\Models;

use App\Enums\ContactoEstado;
use Illuminate\Database\Eloquent\Model;

class Contacto extends Model
{
    protected $fillable = [
        'nombre',
        'telefono',
        'consulta',
        'estado',
    ];

    protected function casts(): array
    {
        return [
            'estado' => ContactoEstado::class,
        ];
    }
}
