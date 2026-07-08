<?php

use App\Models\Guardia;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/**
 * Creates a user with a linked Guardia for testing the perfil endpoint.
 */
function crearGuardiaConPerfil(array $guardiaOverrides = []): User
{
    $user = User::factory()->create();

    Guardia::factory()->create(array_merge([
        'user_id' => $user->id,
        'nombre' => 'Carlos López',
        'dni' => '87654321',
        'telefono' => '3512345678',
        'secundario_telefono' => null,
    ], $guardiaOverrides));

    return $user;
}

test('GET /vigilancia/perfil requires authentication', function () {
    $this->get('/vigilancia/perfil')->assertRedirect('/login');
});

test('GET /vigilancia/perfil returns 200 with guardia data', function () {
    $user = crearGuardiaConPerfil();

    $this->actingAs($user)
        ->get('/vigilancia/perfil')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('vigilancia/perfil/index')
            ->has('perfil')
            ->where('perfil.nombre', 'Carlos López')
            ->where('perfil.dni', '87654321')
            ->where('perfil.telefono', '3512345678')
            ->where('perfil.secundario_telefono', null)
        );
});

test('PUT /vigilancia/perfil updates telefono principal', function () {
    $user = crearGuardiaConPerfil(['telefono' => '3510000000']);

    $this->actingAs($user)
        ->put('/vigilancia/perfil', [
            'telefono' => '3519999999',
        ])
        ->assertRedirect();

    expect(Guardia::where('user_id', $user->id)->first()->telefono)->toBe('3519999999');
});

test('PUT /vigilancia/perfil updates telefono secundario', function () {
    $user = crearGuardiaConPerfil();

    $this->actingAs($user)
        ->put('/vigilancia/perfil', [
            'telefono' => '3512345678',
            'secundario_telefono' => '3517654321',
        ])
        ->assertRedirect();

    expect(Guardia::where('user_id', $user->id)->first()->secundario_telefono)->toBe('3517654321');
});

test('PUT /vigilancia/perfil requires telefono', function () {
    $user = crearGuardiaConPerfil();

    $this->actingAs($user)
        ->put('/vigilancia/perfil', [])
        ->assertSessionHasErrors('telefono');
});

test('PUT /vigilancia/perfil rejects telefono longer than 15 characters', function () {
    $user = crearGuardiaConPerfil();

    $this->actingAs($user)
        ->put('/vigilancia/perfil', [
            'telefono' => '1234567890123456', // 16 chars
        ])
        ->assertSessionHasErrors('telefono');
});

test('PUT /vigilancia/perfil requires authentication', function () {
    $this->put('/vigilancia/perfil', ['telefono' => '3512345678'])
        ->assertRedirect('/login');
});
