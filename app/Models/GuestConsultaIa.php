<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuestConsultaIa extends Model
{
    protected $fillable = [
        'fingerprint',
        'consultas_realizadas',
    ];

    protected function casts(): array
    {
        return [
            'consultas_realizadas' => 'integer',
        ];
    }

    public function incrementConsultas(): void
    {
        $this->increment('consultas_realizadas');
    }
}
