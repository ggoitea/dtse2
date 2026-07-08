<?php

namespace App\Enums;

enum Permission: string
{
    // Users
    case UsersView = 'users.view';
    case UsersCreate = 'users.create';
    case UsersEdit = 'users.edit';
    case UsersDelete = 'users.delete';

    // Roles
    case RolesView = 'roles.view';
    case RolesCreate = 'roles.create';
    case RolesEdit = 'roles.edit';
    case RolesDelete = 'roles.delete';

    /**
     * Get human-readable label for the permission.
     */
    public function label(): string
    {
        return match ($this) {
            // Users
            self::UsersView => 'Ver usuarios',
            self::UsersCreate => 'Crear usuarios',
            self::UsersEdit => 'Editar usuarios',
            self::UsersDelete => 'Eliminar usuarios',

            // Roles
            self::RolesView => 'Ver roles',
            self::RolesCreate => 'Crear roles',
            self::RolesEdit => 'Editar roles',
            self::RolesDelete => 'Eliminar roles',
        };
    }

    /**
     * Get the group name for the permission.
     */
    public function group(): string
    {
        return match ($this) {
            self::UsersView, self::UsersCreate, self::UsersEdit, self::UsersDelete => 'Usuarios',
            self::RolesView, self::RolesCreate, self::RolesEdit, self::RolesDelete => 'Roles',
        };
    }

    /**
     * Get all permission values as an array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get all permissions as options for forms.
     *
     * @return array<array{value: string, label: string, group: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $permission) => [
                'value' => $permission->value,
                'label' => $permission->label(),
                'group' => $permission->group(),
            ],
            self::cases()
        );
    }

    /**
     * Get permissions grouped by their group name.
     *
     * @return array<string, array<array{value: string, label: string}>>
     */
    public static function groupedOptions(): array
    {
        $grouped = [];

        foreach (self::cases() as $permission) {
            $group = $permission->group();
            $grouped[$group][] = [
                'value' => $permission->value,
                'label' => $permission->label(),
            ];
        }

        return $grouped;
    }
}
