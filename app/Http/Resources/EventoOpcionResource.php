<?php

namespace App\Http\Resources;

use App\Models\Evento;
use App\Models\Sitio;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventoOpcionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var Evento $evento */
        $evento = $this->resource;
        return [
            'value' => $evento->id,
            'label' => $evento->nombre,
            'localidad_id' => $evento->localidad_id,
        ];
    }
}
