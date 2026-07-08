<?php

use App\Models\Persona;
use App\Models\Propiedad;
use App\Models\Propietario;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/**
 * Creates a user with a linked Persona and Propiedad for testing the perfil endpoint.
 */
function crearPropietarioConPerfil(array $personaOverrides = [], array $propiedadOverrides = []): User
{
    $user = User::factory()->create();

    $persona = Persona::factory()->create(array_merge([
        'user_id' => $user->id,
        'nombre' => 'Juan Pérez',
        'dni' => '12345678',
        'telefono' => '3512345678',
        'secundario_telefono' => null,
        'secundario_nombre' => null,
    ], $personaOverrides));

    $propiedad = Propiedad::factory()->create(array_merge([
        'lote' => '01',
        'manzana' => 'A1',
    ], $propiedadOverrides));

    Propietario::create([
        'propietario_id' => $persona->id,
        'propiedad_id' => $propiedad->id,
        'es_titular' => true,
    ]);

    return $user;
}

test('GET /propietario/perfil requires authentication', function () {
    $this->get('/propietario/perfil')->assertRedirect('/login');
});

test('GET /propietario/perfil returns 200 with propiedad data', function () {
    $user = crearPropietarioConPerfil();

    $this->actingAs($user)
        ->get('/propietario/perfil')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('propietario/perfil/index')
            ->has('perfil')
            ->where('perfil.lote', '01')
            ->where('perfil.manzana', 'A1')
            ->where('perfil.propietario.nombre', 'Juan Pérez')
            ->where('perfil.propietario.dni', '12345678')
        );
});

test('PUT /propietario/perfil updates telefono principal', function () {
    $user = crearPropietarioConPerfil(['telefono' => '3510000000']);

    $this->actingAs($user)
        ->put('/propietario/perfil', [
            'telefono' => '3519999999',
        ])
        ->assertRedirect();

    expect(Persona::where('user_id', $user->id)->first()->telefono)->toBe('3519999999');
});

test('PUT /propietario/perfil updates telefono alternativo', function () {
    $user = crearPropietarioConPerfil();

    $this->actingAs($user)
        ->put('/propietario/perfil', [
            'telefono' => '3512345678',
            'alt_telefono' => '3517654321',
            'alt_nombre' => 'María García',
        ])
        ->assertRedirect();

    $persona = Persona::where('user_id', $user->id)->first();
    expect($persona->secundario_telefono)->toBe('3517654321');
    expect($persona->secundario_nombre)->toBe('María García');
});

test('PUT /propietario/perfil requires telefono', function () {
    $user = crearPropietarioConPerfil();

    $this->actingAs($user)
        ->put('/propietario/perfil', [])
        ->assertSessionHasErrors('telefono');
});

test('PUT /propietario/perfil rejects telefono longer than 15 characters', function () {
    $user = crearPropietarioConPerfil();

    $this->actingAs($user)
        ->put('/propietario/perfil', [
            'telefono' => '1234567890123456', // 16 chars
        ])
        ->assertSessionHasErrors('telefono');
});

test('PUT /propietario/perfil requires authentication', function () {
    $this->put('/propietario/perfil', ['telefono' => '3512345678'])
        ->assertRedirect('/login');
});
