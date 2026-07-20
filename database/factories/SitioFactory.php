<?php

namespace Database\Factories;

use App\Enums\SitioCategoriaEnum;
use App\Enums\SitioEstadoEnum;
use App\Models\Localidad;
use App\Models\Sitio;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sitio>
 */
class SitioFactory extends Factory
{
    protected $model = Sitio::class;

    public function definition(): array
    {
        return [
            'localidad_id' => Localidad::factory(),
            'nombre' => fake()->company(),
            'domicilio_calle' => fake()->streetName(),
            'domicilio_numero' => fake()->buildingNumber(),
            'latitud' => (string) fake()->latitude(-30, -25),
            'longitud' => (string) fake()->longitude(-65, -60),
            'estado' => SitioEstadoEnum::Activo,
            'categoria' => SitioCategoriaEnum::InteresTuristico,
        ];
    }
}
