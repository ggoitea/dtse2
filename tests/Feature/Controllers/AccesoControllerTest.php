<?php

use App\Enums\Vigilancia\AccesoMovimientoEnum;
use App\Models\Acceso;
use App\Models\Guardia;
use App\Models\Propiedad;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('GET /vigilancia/accesos requires authentication', function () {
    $this->get('/vigilancia/accesos')->assertRedirect('/login');
});

test('GET /vigilancia/accesos returns 200 for authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/vigilancia/accesos')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('vigilancia/historial-ingresos/index'));
});

test('GET /vigilancia/accesos filtra por buscar (nombre)', function () {
    $user = User::factory()->create();
    $propiedad = Propiedad::factory()->create();
    $guardia = Guardia::factory()->create();

    Acceso::factory()->create(['nombre' => 'Juan Pérez', 'propiedad_id' => $propiedad->id, 'guardia_id' => $guardia->id]);
    Acceso::factory()->create(['nombre' => 'María García', 'propiedad_id' => $propiedad->id, 'guardia_id' => $guardia->id]);

    $this->actingAs($user)
        ->get('/vigilancia/accesos?buscar=Juan')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('vigilancia/historial-ingresos/index')
            ->where('accesos.data', fn ($data) => count($data) === 1 && $data[0]['nombre'] === 'Juan Pérez')
        );
});

test('GET /vigilancia/accesos filtra por movimiento', function () {
    $user = User::factory()->create();
    $propiedad = Propiedad::factory()->create();
    $guardia = Guardia::factory()->create();

    Acceso::factory()->create(['movimiento' => AccesoMovimientoEnum::Ingreso, 'propiedad_id' => $propiedad->id, 'guardia_id' => $guardia->id]);
    Acceso::factory()->create(['movimiento' => AccesoMovimientoEnum::Salida, 'propiedad_id' => $propiedad->id, 'guardia_id' => $guardia->id]);

    $this->actingAs($user)
        ->get('/vigilancia/accesos?movimiento=ingreso')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('vigilancia/historial-ingresos/index')
            ->where('accesos.data', fn ($data) => count($data) === 1 && $data[0]['movimiento']['value'] === 'ingreso')
        );
});

test('GET /vigilancia/accesos filtra por rango de fechas (desde/hasta)', function () {
    $user = User::factory()->create();
    $propiedad = Propiedad::factory()->create();
    $guardia = Guardia::factory()->create();

    Acceso::factory()->create(['acceso_at' => '2024-01-15 10:00:00', 'propiedad_id' => $propiedad->id, 'guardia_id' => $guardia->id]);
    Acceso::factory()->create(['acceso_at' => '2024-03-20 10:00:00', 'propiedad_id' => $propiedad->id, 'guardia_id' => $guardia->id]);

    $this->actingAs($user)
        ->get('/vigilancia/accesos?desde=2024-01-01&hasta=2024-02-01')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('vigilancia/historial-ingresos/index')
            ->where('accesos.data', fn ($data) => count($data) === 1 && $data[0]['fecha'] === '15/01/2024')
        );
});

test('GET /vigilancia/accesos filtra por propiedad_id', function () {
    $user = User::factory()->create();
    $propiedad1 = Propiedad::factory()->create();
    $propiedad2 = Propiedad::factory()->create();
    $guardia = Guardia::factory()->create();

    Acceso::factory()->create(['propiedad_id' => $propiedad1->id, 'guardia_id' => $guardia->id, 'nombre' => 'Visitante A']);
    Acceso::factory()->create(['propiedad_id' => $propiedad2->id, 'guardia_id' => $guardia->id, 'nombre' => 'Visitante B']);

    $this->actingAs($user)
        ->get("/vigilancia/accesos?propiedad_id={$propiedad1->id}")
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('vigilancia/historial-ingresos/index')
            ->where('accesos.data', fn ($data) => count($data) === 1 && $data[0]['propiedad']['id'] === $propiedad1->id)
        );
});

test('GET /vigilancia/accesos/pdf requires authentication', function () {
    $this->get('/vigilancia/accesos/pdf')->assertRedirect('/login');
});

test('GET /vigilancia/accesos/pdf pasa la autenticación para usuario autenticado', function () {
    $user = User::factory()->create();

    // El PDF puede fallar si no existe la vista Blade; solo verificamos que pasa auth (no 302)
    $response = $this->actingAs($user)->get('/vigilancia/accesos/pdf');

    expect($response->status())->not->toBe(302);
});
