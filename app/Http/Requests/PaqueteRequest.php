<?php

namespace App\Http\Requests;

use App\Models\Evento;
use App\Models\Sitio;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaqueteRequest extends FormRequest
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
        $rules = [
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion' => ['nullable', 'string'],
            'categoria' => ['required', 'in:aventura,cultura,relax,familiar,romantico,negocios'],
            'destino' => ['nullable', 'string', 'max:255'],
            'duracion' => ['nullable', 'string', 'max:255'],
            'estado' => ['sometimes', 'in:activo,agotado,suspendido,cancelado'],
        ];

        if ($this->isMethod('POST')) {
            $rules['modelable_type'] = ['required', Rule::in([Evento::class, Sitio::class])];
            $rules['modelable_id'] = ['required', 'integer'];

            $rules['evento_data.localidad_id'] = ['required_with:evento_data', 'integer', 'exists:localidades,id'];
            $rules['evento_data.sitio_id'] = ['nullable', 'integer', 'exists:sitios,id'];
            $rules['evento_data.nombre'] = ['required_with:evento_data', 'string', 'max:255'];
            $rules['evento_data.descripcion'] = ['nullable', 'string'];
            $rules['evento_data.fecha'] = ['required_with:evento_data', 'date', 'after_or_equal:today'];
            $rules['evento_data.inicio'] = ['nullable', 'date_format:H:i'];
            $rules['evento_data.fin'] = ['nullable', 'date_format:H:i', 'after:evento_data.inicio'];
            $rules['evento_data.domicilio_calle'] = ['required_with:evento_data', 'string', 'max:255'];
            $rules['evento_data.domicilio_numero'] = ['nullable', 'string', 'max:255'];
        }

        return $rules;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del paquete es obligatorio.',
            'nombre.max' => 'El nombre no puede superar los 255 caracteres.',
            'categoria.required' => 'La categoría es obligatoria.',
            'categoria.in' => 'La categoría seleccionada no es válida.',
            'modelable_type.required' => 'Debe seleccionar un sitio o evento asociado.',
            'modelable_type.in' => 'El tipo de asociación no es válido.',
            'modelable_id.required' => 'Debe seleccionar un elemento asociado.',
            'modelable_id.integer' => 'El elemento asociado no es válido.',
            'evento_data.localidad_id.required_with' => 'La localidad (nodo) es obligatoria para el evento.',
            'evento_data.localidad_id.exists' => 'La localidad seleccionada no es válida.',
            'evento_data.nombre.required_with' => 'El nombre del evento es obligatorio.',
            'evento_data.fecha.required_with' => 'La fecha del evento es obligatoria.',
            'evento_data.fecha.date' => 'La fecha debe ser una fecha válida.',
            'evento_data.fecha.after_or_equal' => 'La fecha debe ser hoy o en el futuro.',
            'evento_data.inicio.date_format' => 'La hora de inicio debe tener el formato HH:MM.',
            'evento_data.fin.date_format' => 'La hora de fin debe tener el formato HH:MM.',
            'evento_data.fin.after' => 'La hora de fin debe ser posterior a la hora de inicio.',
            'evento_data.domicilio_calle.required_with' => 'La calle del domicilio es obligatoria para el evento.',
        ];
    }
}
