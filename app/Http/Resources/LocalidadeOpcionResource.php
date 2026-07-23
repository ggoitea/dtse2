<?php

namespace App\Http\Resources;

use App\Models\Localidad;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocalidadeOpcionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Localidad $localidad */
        $localidad = $this->resource;

        return [
            'value' => $localidad->id,
            'label' => $localidad->departamento->nombre.', '.$localidad->nombre,
        ];
    }
}
