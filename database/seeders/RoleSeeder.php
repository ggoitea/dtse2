<?php

namespace Database\Seeders;

use App\Enums\Permission;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission as PermissionModel;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Crear permisos
        foreach (Permission::values() as $permission) {
            PermissionModel::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // Rol: Administrador - todos los permisos
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $admin->syncPermissions(Permission::values());

        // Rol: Colaborador - crear/editar sitios y eventos (siempre estado pendiente)
        $colaborador = Role::firstOrCreate(['name' => 'colaborador', 'guard_name' => 'web']);
        $colaborador->syncPermissions([
            Permission::SitiosView->value,
            Permission::SitiosCreate->value,
            Permission::SitiosEdit->value,
            Permission::EventosView->value,
            Permission::EventosCreate->value,
            Permission::EventosEdit->value,
            Permission::PaquetesView->value,
        ]);

        // Rol: Usuario - solo lectura
        $usuario = Role::firstOrCreate(['name' => 'usuario', 'guard_name' => 'web']);
        $usuario->syncPermissions([
            Permission::SitiosView->value,
            Permission::EventosView->value,
            Permission::PaquetesView->value,
        ]);
    }
}
