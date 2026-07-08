<?php

use App\Models\Aviso;
use App\Models\Guardia;
use App\Models\Persona;
use App\Models\Propiedad;
use App\Models\Propietario;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('requiere autenticación para ver el listado de avisos', function () {
    $this->get('/vigilancia/avisos')->assertRedirect('/login');
});

it('muestra el listado de avisos', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/vigilancia/avisos')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('vigilancia/avisos/index'));
});

it('propietario puede registrar un aviso', function () {
    $user = User::factory()->create();
    $persona = Persona::factory()->create(['user_id' => $user->id]);
    $propiedad = Propiedad::factory()->create();

    Propietario::create([
        'propietario_id' => $persona->id,
        'propiedad_id' => $propiedad->id,
        'es_titular' => true,
    ]);

    $this->actingAs($user)
        ->post('/vigilancia/avisos', [
            'tipo' => 'cadete',
            'observacion' => 'Aviso de prueba',
        ])
        ->assertSuccessful();

    $this->assertDatabaseHas('avisos', ['tipo' => 'cadete', 'propiedad_id' => $propiedad->id]);
});

it('usuario no propietario no puede registrar un aviso', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/vigilancia/avisos', [
            'tipo' => 'cadete',
        ])
        ->assertStatus(403);
});

it('guardia puede marcar ingreso en un aviso', function () {
    $propiedad = Propiedad::factory()->create();
    $aviso = Aviso::factory()->create(['propiedad_id' => $propiedad->id, 'recepcion_at' => null]);

    $guardiaUser = User::factory()->create();
    Guardia::factory()->create(['user_id' => $guardiaUser->id]);

    $this->actingAs($guardiaUser)
        ->post("/vigilancia/avisos/{$aviso->id}/ingreso", ['recepcion_observacion' => null])
        ->assertSuccessful();

    $this->assertDatabaseHas('avisos', ['id' => $aviso->id, 'recepcion_at' => now()->toDateTimeString()]);
});

it('puede eliminar un aviso sin ingreso', function () {
    $aviso = Aviso::factory()->create(['recepcion_at' => null]);
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete("/vigilancia/avisos/{$aviso->id}")
        ->assertSuccessful();

    $this->assertDatabaseMissing('avisos', ['id' => $aviso->id]);
});

it('no puede eliminar un aviso con ingreso', function () {
    $aviso = Aviso::factory()->create(['recepcion_at' => now()]);
    $user = User::factory()->create();

    $this->actingAs($user)
        ->delete("/vigilancia/avisos/{$aviso->id}")
        ->assertStatus(500);
});

it('el listado de avisos expone observacion y recepcion_observacion', function () {
    $user = User::factory()->create();
    $aviso = Aviso::factory()->create([
        'observacion' => 'Texto observacion residente',
        'recepcion_observacion' => null,
        'recepcion_at' => null,
    ]);

    $this->actingAs($user)
        ->get('/vigilancia/avisos')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('vigilancia/avisos/index')
            ->has('avisos.data.0', fn ($avisoData) => $avisoData
                ->where('observacion', 'Texto observacion residente')
                ->where('recepcion_observacion', null)
                ->etc()
            )
        );
});

it('filtra avisos por busqueda de texto', function () {
    $user = User::factory()->create();

    Aviso::factory()->create(['observacion' => null]);
    $propiedad = Propiedad::factory()->create(['manzana' => 'Z99']);
    Aviso::factory()->create(['propiedad_id' => $propiedad->id]);

    $this->actingAs($user)
        ->get('/vigilancia/avisos?buscar=Z99')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('vigilancia/avisos/index')
            ->has('avisos.data', 1)
        );
});

it('filtra avisos por rango de fechas', function () {
    $user = User::factory()->create();

    Aviso::factory()->create(['created_at' => '2024-01-10']);
    Aviso::factory()->create(['created_at' => '2024-03-15']);
    Aviso::factory()->create(['created_at' => '2024-06-20']);

    $this->actingAs($user)
        ->get('/vigilancia/avisos?fecha_desde=2024-02-01&fecha_hasta=2024-05-01')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('vigilancia/avisos/index')
            ->has('avisos.data', 1)
        );
});
