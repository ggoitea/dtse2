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

    // Sitios
    case SitiosView = 'sitios.view';
    case SitiosCreate = 'sitios.create';
    case SitiosEdit = 'sitios.edit';
    case SitiosDelete = 'sitios.delete';

    // Eventos
    case EventosView = 'eventos.view';
    case EventosCreate = 'eventos.create';
    case EventosEdit = 'eventos.edit';
    case EventosDelete = 'eventos.delete';

    // Paquetes
    case PaquetesView = 'paquetes.view';
    case PaquetesCreate = 'paquetes.create';
    case PaquetesEdit = 'paquetes.edit';
    case PaquetesDelete = 'paquetes.delete';

    public function label(): string
    {
        return match ($this) {
            self::UsersView => 'Ver usuarios',
            self::UsersCreate => 'Crear usuarios',
            self::UsersEdit => 'Editar usuarios',
            self::UsersDelete => 'Eliminar usuarios',
            self::RolesView => 'Ver roles',
            self::RolesCreate => 'Crear roles',
            self::RolesEdit => 'Editar roles',
            self::RolesDelete => 'Eliminar roles',
            self::SitiosView => 'Ver sitios',
            self::SitiosCreate => 'Crear sitios',
            self::SitiosEdit => 'Editar sitios',
            self::SitiosDelete => 'Eliminar sitios',
            self::EventosView => 'Ver eventos',
            self::EventosCreate => 'Crear eventos',
            self::EventosEdit => 'Editar eventos',
            self::EventosDelete => 'Eliminar eventos',
            self::PaquetesView => 'Ver paquetes',
            self::PaquetesCreate => 'Crear paquetes',
            self::PaquetesEdit => 'Editar paquetes',
            self::PaquetesDelete => 'Eliminar paquetes',
        };
    }

    public function group(): string
    {
        return match ($this) {
            self::UsersView, self::UsersCreate, self::UsersEdit, self::UsersDelete => 'Usuarios',
            self::RolesView, self::RolesCreate, self::RolesEdit, self::RolesDelete => 'Roles',
            self::SitiosView, self::SitiosCreate, self::SitiosEdit, self::SitiosDelete => 'Sitios',
            self::EventosView, self::EventosCreate, self::EventosEdit, self::EventosDelete => 'Eventos',
            self::PaquetesView, self::PaquetesCreate, self::PaquetesEdit, self::PaquetesDelete => 'Paquetes',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
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
