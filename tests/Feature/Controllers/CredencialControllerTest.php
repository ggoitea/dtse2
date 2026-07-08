<?php

use App\Enums\AccessoFisico\AccesoTipoEnum;
use App\Enums\AccessoFisico\CredencialEstadoEnum;
use App\Models\Credencial;
use App\Models\Persona;
use App\Models\Propiedad;
use App\Models\Propietario;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('requiere autenticación para ver credenciales', function () {
    $this->get('/acceso-fisico/credenciales')->assertRedirect('/login');
});

it('muestra el listado de credenciales', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/acceso-fisico/credenciales')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('acceso-fisico/credenciales/index'));
});

it('filtra credenciales por tipo', function () {
    $user = User::factory()->create();

    Credencial::factory()->create(['tipo' => AccesoTipoEnum::Propietario]);
    Credencial::factory()->create(['tipo' => AccesoTipoEnum::Familiar]);

    $this->actingAs($user)
        ->get('/acceso-fisico/credenciales?tipo=propietario')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('acceso-fisico/credenciales/index'));
});

it('crea una nueva credencial', function () {
    $user = User::factory()->create();
    $propiedad = Propiedad::factory()->create();

    $persona = Persona::factory()->create(['user_id' => $user->id]);

    Propietario::create([
        'propietario_id' => $persona->id,
        'propiedad_id' => $propiedad->id,
        'es_titular' => true,
    ]);

    $this->actingAs($user)
        ->post('/acceso-fisico/credenciales', [
            'propiedad_id' => $propiedad->id,
            'tipo' => AccesoTipoEnum::Familiar->value,
        ])
        ->assertSuccessful();

    expect(Credencial::count())->toBe(1);
});

it('suspende una credencial activa', function () {
    $user = User::factory()->create();
    $credencial = Credencial::factory()->create(['estado' => CredencialEstadoEnum::Activa]);

    $this->actingAs($user)
        ->post("/acceso-fisico/credenciales/{$credencial->id}/suspender")
        ->assertSuccessful();

    expect($credencial->fresh()->estado)->toBe(CredencialEstadoEnum::Inactiva);
});

it('activa una credencial inactiva', function () {
    $user = User::factory()->create();
    $credencial = Credencial::factory()->inactiva()->create();

    $this->actingAs($user)
        ->post("/acceso-fisico/credenciales/{$credencial->id}/activar")
        ->assertSuccessful();

    expect($credencial->fresh()->estado)->toBe(CredencialEstadoEnum::Activa);
});

it('elimina una credencial', function () {
    $user = User::factory()->create();
    $credencial = Credencial::factory()->create();

    $this->actingAs($user)
        ->delete("/acceso-fisico/credenciales/{$credencial->id}")
        ->assertSuccessful();

    expect(Credencial::count())->toBe(0);
});
