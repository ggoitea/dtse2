<?php

use App\Models\Persona;
use App\Models\Propiedad;
use App\Models\Propietario;
use App\Models\Reclamo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('requiere autenticación para ver el listado de reclamos', function () {
    $this->get('/vigilancia/reclamos')->assertRedirect('/login');
});

it('muestra el listado de reclamos', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/vigilancia/reclamos')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('vigilancia/reclamos/index'));
});

it('filtra reclamos por buscar', function () {
    $user = User::factory()->create();

    Reclamo::factory()->create(['detalle' => 'Ruido excesivo en la noche']);
    Reclamo::factory()->create(['detalle' => 'Problema con el agua']);

    $this->actingAs($user)
        ->get('/vigilancia/reclamos?buscar=Ruido')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('vigilancia/reclamos/index'));
});

it('requiere autenticación para generar el pdf de reclamos', function () {
    $this->get('/vigilancia/reclamos/pdf')->assertRedirect('/login');
});

it('genera el pdf de reclamos', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/vigilancia/reclamos/pdf');

    expect($response->status())->not->toBe(302);
});

it('propietario puede registrar un reclamo', function () {
    $user = User::factory()->create();

    $persona = Persona::factory()->create(['user_id' => $user->id]);
    $propiedad = Propiedad::factory()->create();

    Propietario::create([
        'propietario_id' => $persona->id,
        'propiedad_id' => $propiedad->id,
        'es_titular' => true,
    ]);

    $this->actingAs($user)
        ->post('/vigilancia/reclamos', [
            'fecha_suceso' => now()->format('Y-m-d'),
            'detalle' => 'Reclamo de prueba por propietario',
        ])
        ->assertSuccessful();

    $this->assertDatabaseHas('reclamos', ['detalle' => 'Reclamo de prueba por propietario']);
});

it('usuario no propietario no puede registrar un reclamo', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/vigilancia/reclamos', [
            'fecha_suceso' => now()->format('Y-m-d'),
            'detalle' => 'Intento no autorizado',
        ])
        ->assertStatus(403);
});
