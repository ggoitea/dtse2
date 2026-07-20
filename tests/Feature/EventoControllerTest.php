<?php

use App\Models\Evento;
use App\Models\Localidad;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

describe('EventoController', function () {
    describe('GET /eventos', function () {
        it('returns a successful response for guests', function () {
            Evento::factory()->count(3)->create();

            $response = $this->get(route('eventos.index'));

            $response->assertOk();
        });

        it('paginates eventos', function () {
            Evento::factory()->count(20)->create();

            $response = $this->get(route('eventos.index'));

            $response->assertOk();
        });

        it('filters eventos by search term', function () {
            Evento::factory()->create(['nombre' => 'Festival de Chacarera']);
            Evento::factory()->create(['nombre' => 'Rally del Norte']);

            $response = $this->get(route('eventos.index', ['buscar' => 'Festival']));

            $response->assertOk();
        });
    });

    describe('GET /eventos/create', function () {
        it('redirects guests to login', function () {
            $response = $this->get(route('eventos.create'));

            $response->assertRedirect(route('login'));
        });

        it('returns 403 for users without permission', function () {
            $user = User::factory()->create();
            $this->actingAs($user);

            $response = $this->get(route('eventos.create'));

            $response->assertForbidden();
        });

        it('returns a successful response for authorized users', function () {
            $user = User::factory()->create();
            $user->assignRole('admin');

            $response = $this->actingAs($user)->get(route('eventos.create'));

            $response->assertOk();
        });
    });

    describe('POST /eventos', function () {
        it('redirects guests to login', function () {
            $localidad = Localidad::factory()->create();

            $response = $this->post(route('eventos.store'), [
                'localidad_id' => $localidad->id,
                'nombre' => 'Test Evento',
                'fecha' => now()->addMonth()->format('Y-m-d'),
                'domicilio_calle' => 'Calle Test',
            ]);

            $response->assertRedirect(route('login'));
        });

        it('creates an evento for authorized users', function () {
            $user = User::factory()->create();
            $user->assignRole('admin');
            $localidad = Localidad::factory()->create();

            $response = $this->actingAs($user)->post(route('eventos.store'), [
                'localidad_id' => $localidad->id,
                'nombre' => 'Test Evento',
                'fecha' => now()->addMonth()->format('Y-m-d'),
                'domicilio_calle' => 'Calle Test',
            ]);

            $response->assertRedirect(route('eventos.index'));
            $this->assertDatabaseHas('eventos', ['nombre' => 'Test Evento']);
        });

        it('validates required fields', function () {
            $user = User::factory()->create();
            $user->assignRole('admin');

            $response = $this->actingAs($user)->post(route('eventos.store'), []);

            $response->assertSessionHasErrors(['localidad_id', 'nombre', 'fecha', 'domicilio_calle']);
        });
    });

    describe('GET /eventos/{evento}/edit', function () {
        it('redirects guests to login', function () {
            $evento = Evento::factory()->create();

            $response = $this->get(route('eventos.edit', $evento));

            $response->assertRedirect(route('login'));
        });

        it('returns a successful response for authorized users', function () {
            $user = User::factory()->create();
            $user->assignRole('admin');
            $evento = Evento::factory()->create();

            $response = $this->actingAs($user)->get(route('eventos.edit', $evento));

            $response->assertOk();
        });
    });

    describe('PUT /eventos/{evento}', function () {
        it('updates an evento', function () {
            $user = User::factory()->create();
            $user->assignRole('admin');
            $evento = Evento::factory()->create();

            $response = $this->actingAs($user)->put(route('eventos.update', $evento), [
                'localidad_id' => $evento->localidad_id,
                'nombre' => 'Evento Actualizado',
                'fecha' => $evento->fecha->format('Y-m-d'),
                'domicilio_calle' => 'Nueva Calle',
            ]);

            $response->assertRedirect(route('eventos.index'));
            $this->assertDatabaseHas('eventos', [
                'id' => $evento->id,
                'nombre' => 'Evento Actualizado',
            ]);
        });
    });

    describe('DELETE /eventos/{evento}', function () {
        it('redirects guests to login', function () {
            $evento = Evento::factory()->create();

            $response = $this->delete(route('eventos.destroy', $evento));

            $response->assertRedirect(route('login'));
        });

        it('returns 403 for non-admin users', function () {
            $user = User::factory()->create();
            $user->assignRole('colaborador');
            $evento = Evento::factory()->create();

            $response = $this->actingAs($user)->delete(route('eventos.destroy', $evento));

            $response->assertForbidden();
        });

        it('deletes an evento for admin users', function () {
            $user = User::factory()->create();
            $user->assignRole('admin');
            $evento = Evento::factory()->create();

            $response = $this->actingAs($user)->delete(route('eventos.destroy', $evento));

            $response->assertRedirect(route('eventos.index'));
            $this->assertDatabaseMissing('eventos', ['id' => $evento->id]);
        });
    });
});
