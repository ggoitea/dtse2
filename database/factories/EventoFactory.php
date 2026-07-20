<?php

namespace Database\Factories;

use App\Enums\EventoEstadoEnum;
use App\Models\Evento;
use App\Models\Localidad;
use App\Models\Sitio;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Evento>
 */
class EventoFactory extends Factory
{
    protected $model = Evento::class;

    public function definition(): array
    {
        return [
            'localidad_id' => Localidad::factory(),
            'sitio_id' => null,
            'nombre' => fake()->sentence(3),
            'descripcion' => fake()->paragraph(),
            'fecha' => fake()->dateTimeBetween('+1 month', '+3 month'),
            'inicio' => fake()->time('H:i'),
            'fin' => fake()->time('H:i'),
            'domicilio_calle' => fake()->streetName(),
            'domicilio_numero' => fake()->buildingNumber(),
            'estado' => EventoEstadoEnum::Activo,
        ];
    }

    public function pendiente(): static
    {
        return $this->state(fn () => ['estado' => EventoEstadoEnum::Pendiente]);
    }

    public function conSitio(): static
    {
        return $this->state(fn () => [
            'sitio_id' => Sitio::factory(),
        ]);
    }
}
