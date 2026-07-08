<?php

namespace App\Http\Requests\User;

use App\Enums\Permission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can(Permission::UsersCreate->value) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {

        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'dni' => ['nullable', 'string', 'max:20'],
            'telefono' => ['nullable', 'string', 'max:40'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'string', Password::defaults()],
            'role_id' => [
                'required',
                'integer',
                Rule::exists('roles', 'id'),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio.',
            'name.max' => 'El nombre no puede superar los 255 caracteres.',
            'username.required' => 'El usuario es obligatorio.',
            'username.unique' => 'Este usuario ya está registrado.',
            'email.required' => 'El email es obligatorio.',
            'email.email' => 'El email debe ser una dirección válida.',
            'email.unique' => 'Este email ya está registrado.',
            'dni.max' => 'El DNI no puede superar los 20 caracteres.',
            'telefono.max' => 'El teléfono no puede superar los 40 caracteres.',
            'direccion.max' => 'La dirección no puede superar los 255 caracteres.',
            'password.required' => 'La contraseña es obligatoria.',
            'role_id.required' => 'Debe seleccionar un rol.',
            'role_id.exists' => 'El rol seleccionado no es válido.',
        ];
    }
}
