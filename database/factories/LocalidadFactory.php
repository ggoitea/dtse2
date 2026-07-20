<?php

namespace Database\Factories;

use App\Models\Departamento;
use App\Models\Localidad;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Localidad>
 */
class LocalidadFactory extends Factory
{
    protected $model = Localidad::class;

    public function definition(): array
    {
        return [
            'asentamiento_id' => fake()->uuid(),
            'departamento_id' => Departamento::factory(),
            'es_paraje' => fake()->boolean(),
            'nombre' => fake()->city(),
            'latitud' => (string) fake()->latitude(-30, -25),
            'longitud' => (string) fake()->longitude(-65, -60),
        ];
    }
}
