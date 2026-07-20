<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class EventoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $eventoId = $this->route('evento')?->id;

        return [
            'localidad_id' => ['required', 'integer', 'exists:localidades,id'],
            'sitio_id' => ['nullable', 'integer', 'exists:sitios,id'],
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'fecha' => [
                $this->isMethod('POST') ? 'required' : 'sometimes',
                'date',
                'after_or_equal:today',
            ],
            'inicio' => ['nullable', 'date_format:H:i'],
            'fin' => ['nullable', 'date_format:H:i', 'after:inicio'],
            'domicilio_calle' => ['required', 'string', 'max:255'],
            'domicilio_numero' => ['nullable', 'string', 'max:255'],
            'estado' => ['sometimes', 'in:pendiente,activo,suspendido,rechazado'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'localidad_id.required' => 'La localidad (nodo) es obligatoria.',
            'localidad_id.exists' => 'La localidad seleccionada no es válida.',
            'sitio_id.exists' => 'El sitio seleccionado no es válido.',
            'nombre.required' => 'El nombre del evento es obligatorio.',
            'nombre.max' => 'El nombre no puede superar los 255 caracteres.',
            'fecha.required' => 'La fecha del evento es obligatoria.',
            'fecha.date' => 'La fecha debe ser una fecha válida.',
            'fecha.after_or_equal' => 'La fecha debe ser hoy o en el futuro.',
            'inicio.date_format' => 'La hora de inicio debe tener el formato HH:MM.',
            'fin.date_format' => 'La hora de fin debe tener el formato HH:MM.',
            'fin.after' => 'La hora de fin debe ser posterior a la hora de inicio.',
            'domicilio_calle.required' => 'La calle del domicilio es obligatoria.',
            'domicilio_calle.max' => 'La calle no puede superar los 255 caracteres.',
            'domicilio_numero.max' => 'El número no puede superar los 255 caracteres.',
            'estado.in' => 'El estado seleccionado no es válido.',
        ];
    }
}
