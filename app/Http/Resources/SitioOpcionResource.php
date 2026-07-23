<?php

namespace App\Http\Resources;

use App\Models\Sitio;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SitioOpcionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Sitio $sitio */
        $sitio = $this->resource;
        return [
            'value' => $sitio->id,
            'label' => $sitio->nombre,
            'localidad_id' => $sitio->localidad_id,
        ];
    }
}
