<?php

use App\Models\Persona;
use App\Models\Propiedad;
use App\Models\Propietario;
use App\Models\User;
use App\Modules\Propiedades\Propiedad\UseCases\RegistrarPropiedad;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// Helper to create a complete propiedad
function crearPropiedadCompleta(User $user, array $overrides = []): Propiedad
{
    return RegistrarPropiedad::make(
        lote: $overrides['lote'] ?? '01',
        manzana: $overrides['manzana'] ?? 'A1',
        descripcion: $overrides['descripcion'] ?? null,
        nombre: $overrides['nombre'] ?? 'Juan Pérez',
        dni: $overrides['dni'] ?? '12345678',
        telefono: $overrides['telefono'] ?? '1234567890',
        altTelefono: $overrides['altTelefono'] ?? null,
        altNombre: $overrides['altNombre'] ?? null,
    );
}

test('GET /propiedades requires authentication', function () {
    $this->get('/propiedades')->assertRedirect('/login');
});

test('GET /propiedades returns 200 for authenticated user', function () {
    $user = User::factory()->create();
    $this->actingAs($user)
        ->get('/propiedades')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page->component('propiedades/index'));
});

test('POST /propiedades creates propiedad, persona, and propietario', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/propiedades', [
            'lote' => '01',
            'manzana' => 'A1',
            'descripcion' => 'Casa esquina',
            'titular' => 'Juan Pérez',
            'dni' => '12345678',
            'telefono' => '1234567890',
            'telefono_nombre' => 'Juan',
            'alt_telefono' => null,
            'alt_nombre' => null,
        ])
        ->assertSuccessful();

    expect(Propiedad::count())->toBe(1);
    expect(Persona::count())->toBe(1);
    expect(Propietario::count())->toBe(1);
});

test('POST /propiedades fails with DNI of 6 digits', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/propiedades', [
            'lote' => '01',
            'manzana' => 'A1',
            'titular' => 'Juan Pérez',
            'dni' => '123456', // 6 digits - invalid
            'telefono' => '1234567890',
            'telefono_nombre' => 'Juan',
        ])
        ->assertSessionHasErrors('dni');
});

test('POST /propiedades fails with missing required fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/propiedades', [])
        ->assertSessionHasErrors(['lote', 'manzana', 'titular', 'dni', 'telefono', 'telefono_nombre']);
});

test('PUT /propiedades/{id} updates propiedad and persona', function () {
    $user = User::factory()->create();
    $propiedad = crearPropiedadCompleta($user);

    $this->actingAs($user)
        ->put("/propiedades/{$propiedad->id}", [
            'lote' => '99',
            'manzana' => 'Z9',
            'descripcion' => 'Updated',
            'titular' => 'María García',
            'dni' => '87654321',
            'telefono' => '0987654321',
            'telefono_nombre' => 'María',
        ])
        ->assertSuccessful();

    expect($propiedad->fresh()->lote)->toBe('99');
    expect($propiedad->fresh()->manzana)->toBe('Z9');
    expect(Persona::first()->nombre)->toBe('María García');
});

test('DELETE /propiedades/{id} deletes propiedad', function () {
    $user = User::factory()->create();
    $propiedad = crearPropiedadCompleta($user);

    $this->actingAs($user)
        ->delete("/propiedades/{$propiedad->id}")
        ->assertRedirect('/propiedades');

    expect(Propiedad::count())->toBe(0);
    expect(Propietario::count())->toBe(0); // cascade
});

test('GET /propiedades filters by lote', function () {
    $user = User::factory()->create();
    crearPropiedadCompleta($user, ['lote' => '01']);
    crearPropiedadCompleta($user, ['lote' => '99']);

    $this->actingAs($user)
        ->get('/propiedades?buscar=01')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('propiedades/index')
            ->where('propiedades.data', fn ($data) => count($data) === 1 && $data[0]['lote'] === '01')
        );
});

test('GET /propiedades filters by manzana', function () {
    $user = User::factory()->create();
    crearPropiedadCompleta($user, ['manzana' => 'A1']);
    crearPropiedadCompleta($user, ['manzana' => 'Z9']);

    $this->actingAs($user)
        ->get('/propiedades?buscar=A1')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('propiedades/index')
            ->where('propiedades.data', fn ($data) => count($data) === 1 && $data[0]['manzana'] === 'A1')
        );
});

test('GET /propiedades filters by nombre del propietario', function () {
    $user = User::factory()->create();
    crearPropiedadCompleta($user, ['nombre' => 'Juan Pérez', 'dni' => '12345678']);
    crearPropiedadCompleta($user, ['nombre' => 'María García', 'dni' => '87654321']);

    $this->actingAs($user)
        ->get('/propiedades?buscar=Juan')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('propiedades/index')
            ->where('propiedades.data', fn ($data) => count($data) === 1 && $data[0]['propietario']['nombre'] === 'Juan Pérez')
        );
});

test('GET /propiedades filters by DNI del propietario', function () {
    $user = User::factory()->create();
    crearPropiedadCompleta($user, ['dni' => '12345678']);
    crearPropiedadCompleta($user, ['dni' => '87654321']);

    $this->actingAs($user)
        ->get('/propiedades?buscar=1234')
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('propiedades/index')
            ->where('propiedades.data', fn ($data) => count($data) === 1 && $data[0]['propietario']['dni'] === '12345678')
        );
});

test('GET /propiedades/pdf returns 200 HTML response', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/propiedades/pdf')
        ->assertSuccessful()
        ->assertHeader('Content-Type', 'application/pdf');
});
