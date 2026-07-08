<?php

namespace App\Console\Commands;

use App\Concerns\PasswordValidationRules;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Console\PromptValidationException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

use function Laravel\Prompts\error;
use function Laravel\Prompts\info;
use function Laravel\Prompts\password;
use function Laravel\Prompts\select;
use function Laravel\Prompts\table;
use function Laravel\Prompts\text;

class UserCreateCommand extends Command
{
    use PasswordValidationRules;

    protected $signature = 'user:create';

    protected $description = 'Crear un usuario de forma interactiva';

    public function handle(): int
    {
        $role = $this->promptForRole();

        if ($role === null) {
            error('No hay roles disponibles para asignar.');

            return self::FAILURE;
        }

        $username = Str::of($this->promptTextUntilValid(
            label: 'Nombre de usuario',
            required: 'El nombre de usuario es obligatorio.',
            validate: fn (string $value): ?string => $this->validateUsername($value),
        ))->lower()->trim()->toString();
        $name = $this->promptTextUntilValid(
            label: 'Nombre completo',
            required: 'El nombre completo es obligatorio.',
            validate: fn (string $value): ?string => $this->validateName($value),
        );
        $email = Str::lower($this->promptTextUntilValid(
            label: 'Correo electrónico',
            required: 'El correo electrónico es obligatorio.',
            validate: fn (string $value): ?string => $this->validateEmail($value),
        ));
        $password = $this->promptPasswordUntilValid(
            label: 'Contraseña',
            required: 'La contraseña es obligatoria.',
            validate: fn (string $value): ?string => $this->validatePassword($value),
        );

        $user = new User([
            'name' => $name,
            'username' => $username,
            'email' => $email,
            'password' => $password,
        ]);
        $user->forceFill([
            'email_verified_at' => now(),
        ])->save();
        $user->assignRole($role);

        info('Usuario creado correctamente.');
        table(
            headers: ['ID', 'Nombre', 'Usuario', 'Correo', 'Rol'],
            rows: [[
                $user->id,
                $user->name,
                $user->username,
                $user->email,
                $role->name,
            ]],
        );

        return self::SUCCESS;
    }

    private function promptForRole(): ?Role
    {
        $roles = Role::query()
            ->orderBy('name')
            ->get();

        if ($roles->isEmpty()) {
            return null;
        }

        $options = $roles
            ->mapWithKeys(fn (Role $role): array => [
                $role->name => $role->id,
            ])
            ->all();

        $selected = select(
            label: 'Seleccione un rol',
            options: array_keys($options),
        );
        $roleId = $options[$selected];

        return $roles->firstWhere('id', $roleId);
    }

    private function validateUsername(string $value): ?string
    {
        $username = Str::of($value)->lower()->trim()->toString();
        $validator = Validator::make(
            [
                'username' => $username,
            ],
            [
                'username' => ['required', 'string', 'max:255', 'unique:users,username'],
            ],
            [
                'username.required' => 'El nombre de usuario es obligatorio.',
                'username.unique' => 'Ya existe un usuario con este nombre de usuario.',
            ],
        );

        return $validator->errors()->first('username');
    }

    private function validateName(string $value): ?string
    {
        $name = Str::of($value)->trim()->toString();
        $validator = Validator::make(
            ['name' => $name],
            ['name' => ['required', 'string', 'max:255']],
            ['name.required' => 'El nombre completo es obligatorio.'],
        );

        return $validator->errors()->first('name');
    }

    private function validateEmail(string $value): ?string
    {
        $email = Str::of($value)->lower()->trim()->toString();
        $validator = Validator::make(
            ['email' => $email],
            ['email' => ['required', 'string', 'email', 'max:255', 'unique:users,email']],
            [
                'email.required' => 'El correo electrónico es obligatorio.',
                'email.email' => 'El correo electrónico no tiene un formato válido.',
                'email.unique' => 'Ya existe un usuario con este correo electrónico.',
            ],
        );

        return $validator->errors()->first('email');
    }

    private function validatePassword(string $value): ?string
    {
        return Validator::make(
            ['password' => $value],
            ['password' => $this->passwordRulesWithoutConfirmation()],
            ['password.required' => 'La contraseña es obligatoria.'],
        )->errors()->first('password');
    }

    private function passwordRulesWithoutConfirmation(): array
    {
        return array_values(array_filter(
            ['required', 'string', 'confirmed'],
            fn (mixed $rule): bool => $rule !== 'confirmed',
        ));
    }

    private function promptTextUntilValid(string $label, bool|string $required, callable $validate): string
    {
        while (true) {
            try {
                return text(
                    label: $label,
                    required: $required,
                    validate: $validate,
                );
            } catch (PromptValidationException) {
                continue;
            }
        }
    }

    private function promptPasswordUntilValid(string $label, bool|string $required, callable $validate): string
    {
        while (true) {
            try {
                return password(
                    label: $label,
                    required: $required,
                    validate: $validate,
                );
            } catch (PromptValidationException) {
                continue;
            }
        }
    }
}
