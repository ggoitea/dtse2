<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class OwnerRoleSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(PermissionSeeder::class);

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $ownerRole = Role::query()->firstOrCreate([
            'name' => 'owner',
            'guard_name' => 'web',
        ]);
    }
}
