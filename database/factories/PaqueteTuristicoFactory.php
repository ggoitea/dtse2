<?php

namespace Database\Factories;

use App\Enums\PaqueteCategoriaEnum;
use App\Enums\PaqueteEstadoEnum;
use App\Models\Evento;
use App\Models\PaqueteTuristico;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaqueteTuristico>
 */
class PaqueteTuristicoFactory extends Factory
{
    protected $model = PaqueteTuristico::class;

    public function definition(): array
    {
        return [
            'modelable_type' => Evento::class,
            'modelable_id' => Evento::factory(),
            'nombre' => fake()->sentence(3),
            'descripcion' => fake()->paragraph(),
            'categoria' => PaqueteCategoriaEnum::Aventura,
            'destino' => fake()->city(),
            'duracion' => fake()->randomElement(['1 día', '2 días', '3 días', '1 semana']),
            'estado' => PaqueteEstadoEnum::Activo,
        ];
    }
}
