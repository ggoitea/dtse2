<?php

use App\Enums\Permission;
use App\Models\User;
use Spatie\Permission\Models\Permission as SpatiePermission;
use Spatie\Permission\PermissionRegistrar;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('authenticated users with permission can visit the users settings page', function () {
    app(PermissionRegistrar::class)->forgetCachedPermissions();

    SpatiePermission::query()->firstOrCreate([
        'name' => Permission::UsersView->value,
        'guard_name' => 'web',
    ]);

    $user = User::factory()->create();
    $user->givePermissionTo(Permission::UsersView->value);

    $response = $this->actingAs($user)->get(route('settings.users.index'));

    $response->assertOk();
});
