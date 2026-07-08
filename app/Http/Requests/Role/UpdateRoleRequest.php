<?php

namespace App\Http\Requests\Role;

use App\Enums\Permission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class UpdateRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var Role $role */
        $role = $this->route('role');

        // Cannot edit the owner role
        if ($role->name === 'owner') {
            return false;
        }

        return $this->user()?->can(Permission::RolesEdit->value) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Role $role */
        $role = $this->route('role');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles', 'name')
                    ->ignore($role->id),
                Rule::notIn(['owner', 'super-admin']),
            ],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => ['required', 'string', Rule::in(Permission::values())],
            'default_empleado' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del rol es obligatorio.',
            'name.max' => 'El nombre del rol no puede superar los 255 caracteres.',
            'name.unique' => 'Ya existe un rol con este nombre.',
            'name.not_in' => 'No se puede usar este nombre de rol reservado.',
            'permissions.required' => 'Debe seleccionar al menos un permiso.',
            'permissions.min' => 'Debe seleccionar al menos un permiso.',
            'permissions.*.in' => 'El permiso seleccionado no es válido.',
        ];
    }
}
