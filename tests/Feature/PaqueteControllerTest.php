<?php

use App\Models\Evento;
use App\Models\PaqueteTuristico;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

describe('PaqueteController', function () {
    describe('GET /paquetes', function () {
        it('returns a successful response for guests', function () {
            PaqueteTuristico::factory()->count(3)->create();

            $response = $this->get(route('paquetes.index'));

            $response->assertOk();
        });

        it('paginates paquetes', function () {
            PaqueteTuristico::factory()->count(20)->create();

            $response = $this->get(route('paquetes.index'));

            $response->assertOk();
        });

        it('filters paquetes by search term', function () {
            PaqueteTuristico::factory()->create(['nombre' => 'Aventura en Termas']);
            PaqueteTuristico::factory()->create(['nombre' => 'Ruta del Sol']);

            $response = $this->get(route('paquetes.index', ['buscar' => 'Termas']));

            $response->assertOk();
        });
    });

    describe('GET /paquetes/create', function () {
        it('redirects guests to login', function () {
            $response = $this->get(route('paquetes.create'));

            $response->assertRedirect(route('login'));
        });

        it('returns 403 for users without permission', function () {
            $user = User::factory()->create();
            $this->actingAs($user);

            $response = $this->get(route('paquetes.create'));

            $response->assertForbidden();
        });

        it('returns a successful response for authorized users', function () {
            $user = User::factory()->create();
            $user->assignRole('admin');

            $response = $this->actingAs($user)->get(route('paquetes.create'));

            $response->assertOk();
        });
    });

    describe('POST /paquetes', function () {
        it('redirects guests to login', function () {
            $evento = Evento::factory()->create();

            $response = $this->post(route('paquetes.store'), [
                'modelable_type' => Evento::class,
                'modelable_id' => $evento->id,
                'nombre' => 'Test Paquete',
                'categoria' => 'aventura',
            ]);

            $response->assertRedirect(route('login'));
        });

        it('creates a paquete for authorized users', function () {
            $user = User::factory()->create();
            $user->assignRole('admin');
            $evento = Evento::factory()->create();

            $response = $this->actingAs($user)->post(route('paquetes.store'), [
                'modelable_type' => Evento::class,
                'modelable_id' => $evento->id,
                'nombre' => 'Test Paquete',
                'categoria' => 'aventura',
            ]);

            $response->assertRedirect(route('paquetes.index'));
            $this->assertDatabaseHas('paquete_turisticos', ['nombre' => 'Test Paquete']);
        });

        it('validates required fields', function () {
            $user = User::factory()->create();
            $user->assignRole('admin');

            $response = $this->actingAs($user)->post(route('paquetes.store'), []);

            $response->assertSessionHasErrors(['modelable_type', 'modelable_id', 'nombre', 'categoria']);
        });
    });

    describe('GET /paquetes/{paquete}/edit', function () {
        it('redirects guests to login', function () {
            $paquete = PaqueteTuristico::factory()->create();

            $response = $this->get(route('paquetes.edit', $paquete));

            $response->assertRedirect(route('login'));
        });

        it('returns a successful response for authorized users', function () {
            $user = User::factory()->create();
            $user->assignRole('admin');
            $paquete = PaqueteTuristico::factory()->create();

            $response = $this->actingAs($user)->get(route('paquetes.edit', $paquete));

            $response->assertOk();
        });
    });

    describe('PUT /paquetes/{paquete}', function () {
        it('updates a paquete', function () {
            $user = User::factory()->create();
            $user->assignRole('admin');
            $paquete = PaqueteTuristico::factory()->create();

            $response = $this->actingAs($user)->put(route('paquetes.update', $paquete), [
                'modelable_type' => $paquete->modelable_type,
                'modelable_id' => $paquete->modelable_id,
                'nombre' => 'Paquete Actualizado',
                'categoria' => 'cultura',
            ]);

            $response->assertRedirect(route('paquetes.index'));
            $this->assertDatabaseHas('paquete_turisticos', [
                'id' => $paquete->id,
                'nombre' => 'Paquete Actualizado',
            ]);
        });
    });

    describe('DELETE /paquetes/{paquete}', function () {
        it('redirects guests to login', function () {
            $paquete = PaqueteTuristico::factory()->create();

            $response = $this->delete(route('paquetes.destroy', $paquete));

            $response->assertRedirect(route('login'));
        });

        it('returns 403 for non-admin users', function () {
            $user = User::factory()->create();
            $user->assignRole('colaborador');
            $paquete = PaqueteTuristico::factory()->create();

            $response = $this->actingAs($user)->delete(route('paquetes.destroy', $paquete));

            $response->assertForbidden();
        });

        it('deletes a paquete for admin users', function () {
            $user = User::factory()->create();
            $user->assignRole('admin');
            $paquete = PaqueteTuristico::factory()->create();

            $response = $this->actingAs($user)->delete(route('paquetes.destroy', $paquete));

            $response->assertRedirect(route('paquetes.index'));
            $this->assertDatabaseMissing('paquete_turisticos', ['id' => $paquete->id]);
        });
    });
});
