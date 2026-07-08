<?php

use App\Enums\Vigilancia\ReclamoEstadoEnum;
use App\Models\Persona;
use App\Models\Propiedad;
use App\Models\Reclamo;
use App\Models\ReclamoRespuesta;
use App\Modules\Vigilancia\Reclamo\UseCases\EliminarReclamo;
use App\Modules\Vigilancia\Reclamo\UseCases\ObtenerReclamos;
use App\Modules\Vigilancia\Reclamo\UseCases\RegistrarReclamo;
use App\Modules\Vigilancia\Reclamo\UseCases\ResponderReclamo;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ─── RegistrarReclamo ────────────────────────────────────────────────────────

it('RegistrarReclamo crea reclamo con estado Enviado', function () {
    $propiedad = Propiedad::factory()->create();
    $persona = Persona::factory()->create();

    $reclamo = RegistrarReclamo::make(
        propiedadId: $propiedad->id,
        personaId: $persona->id,
        detalle: 'Detalle del reclamo de prueba.',
        fecha: now()->toDateString(),
    );

    expect(Reclamo::count())->toBe(1)
        ->and($reclamo->estado)->toBe(ReclamoEstadoEnum::Enviado)
        ->and($reclamo->propiedad_id)->toBe($propiedad->id)
        ->and($reclamo->persona_id)->toBe($persona->id)
        ->and($reclamo->detalle)->toBe('Detalle del reclamo de prueba.')
        ->and($reclamo->fecha)->not->toBeNull();
});

// ─── ResponderReclamo ────────────────────────────────────────────────────────

it('ResponderReclamo crea respuesta y cambia estado a Contestado', function () {
    $reclamo = Reclamo::factory()->create(['estado' => ReclamoEstadoEnum::Enviado]);
    $persona = Persona::factory()->create();

    $respuesta = ResponderReclamo::make(
        reclamo: $reclamo,
        respuesta: 'Esta es la respuesta al reclamo.',
        personaId: $persona->id,
    );

    expect(ReclamoRespuesta::count())->toBe(1)
        ->and($respuesta->reclamo_id)->toBe($reclamo->id)
        ->and($respuesta->respuesta)->toBe('Esta es la respuesta al reclamo.')
        ->and($respuesta->persona_id)->toBe($persona->id);

    $reclamo->refresh();
    expect($reclamo->estado)->toBe(ReclamoEstadoEnum::Contestado);
});

// ─── ObtenerReclamos ─────────────────────────────────────────────────────────

it('ObtenerReclamos retorna reclamos paginados', function () {
    Reclamo::factory()->count(3)->create();

    $resultado = ObtenerReclamos::make();

    expect($resultado->total())->toBe(3);
});

it('ObtenerReclamos filtra por propiedad', function () {
    $propiedad = Propiedad::factory()->create();
    Reclamo::factory()->count(2)->create(['propiedad_id' => $propiedad->id]);
    Reclamo::factory()->count(1)->create();

    $resultado = ObtenerReclamos::make(filtros: ['propiedadId' => $propiedad->id]);

    expect($resultado->total())->toBe(2);
});

it('ObtenerReclamos filtra por estado', function () {
    Reclamo::factory()->create(['estado' => ReclamoEstadoEnum::Enviado]);
    Reclamo::factory()->create(['estado' => ReclamoEstadoEnum::Contestado]);

    $resultado = ObtenerReclamos::make(filtros: ['estado' => ReclamoEstadoEnum::Contestado->value]);

    expect($resultado->total())->toBe(1);
});

it('ObtenerReclamos filtra por intervalo de fechas', function () {
    Reclamo::factory()->create(['fecha' => now()->subDays(10)]);
    Reclamo::factory()->create(['fecha' => now()->subDays(5)]);
    Reclamo::factory()->create(['fecha' => now()]);

    $resultado = ObtenerReclamos::make(filtros: [
        'fechaDesde' => now()->subDays(6)->toDateString(),
        'fechaHasta' => now()->subDays(1)->toDateString(),
    ]);

    expect($resultado->total())->toBe(1);
});

// ─── EliminarReclamo ─────────────────────────────────────────────────────────

it('EliminarReclamo elimina si estado es Enviado', function () {
    $reclamo = Reclamo::factory()->create(['estado' => ReclamoEstadoEnum::Enviado]);

    EliminarReclamo::make($reclamo);

    expect(Reclamo::count())->toBe(0);
});

it('EliminarReclamo lanza excepción si estado no es Enviado', function () {
    $reclamo = Reclamo::factory()->create(['estado' => ReclamoEstadoEnum::Contestado]);

    expect(fn () => EliminarReclamo::make($reclamo))->toThrow(RuntimeException::class);
});
