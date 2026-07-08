<?php

use App\Enums\AccessoFisico\AccesoTipoEnum;
use App\Enums\AccessoFisico\CredencialEstadoEnum;
use App\Enums\AccessoFisico\VehiculoTipoEnum;
use App\Models\Credencial;
use App\Models\CredencialPersona;
use App\Models\CredencialVehiculo;
use App\Models\Persona;
use App\Models\Propiedad;
use App\Modules\AccesoFisico\Credencial\UseCases\Deshabilitar;
use App\Modules\AccesoFisico\Credencial\UseCases\Habilitar;
use App\Modules\AccesoFisico\Credencial\UseCases\ObtenerCredenciales;
use App\Modules\AccesoFisico\Credencial\UseCases\ObtenerCredencialPorQr;
use App\Modules\AccesoFisico\Credencial\UseCases\RegistrarCredencial;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ─── RegistrarCredencial ────────────────────────────────────────────────────

test('RegistrarCredencial crea credencial con persona', function () {
    $propiedad = Propiedad::factory()->create();
    $persona = Persona::factory()->create();

    $credencial = RegistrarCredencial::make(
        propiedad: $propiedad,
        tipo: AccesoTipoEnum::Propietario->value,
        persona_dni: $persona->dni,
    );

    expect(Credencial::count())->toBe(1)
        ->and($credencial->tipo)->toBe(AccesoTipoEnum::Propietario)
        ->and($credencial->estado)->toBe(CredencialEstadoEnum::Activa)
        ->and($credencial->codigo_qr)->not->toBeNull()
        ->and(CredencialPersona::count())->toBe(1)
        ->and(CredencialPersona::first()->persona_id)->toBe($persona->id);
});

test('RegistrarCredencial de tipo evento crea múltiples personas eventuales', function () {
    $propiedad = Propiedad::factory()->create();
    $nombres = ['Juan Pérez', 'María García', 'Carlos López'];

    $credencial = RegistrarCredencial::make(
        propiedad: $propiedad,
        tipo: AccesoTipoEnum::Evento->value,
        nombresEventuales: $nombres,
    );

    expect($credencial->tipo)->toBe(AccesoTipoEnum::Evento)
        ->and(CredencialPersona::count())->toBe(3)
        ->and(CredencialPersona::whereNull('persona_id')->count())->toBe(3)
        ->and(CredencialPersona::pluck('nombre')->toArray())->toBe($nombres);
});

test('RegistrarCredencial crea credencial con vehículo', function () {
    $propiedad = Propiedad::factory()->create();

    RegistrarCredencial::make(
        propiedad: $propiedad,
        tipo: AccesoTipoEnum::Propietario->value,
        vehiculoTipo: VehiculoTipoEnum::Auto->value,
        vehiculoPatente: 'ABC123',
    );

    expect(CredencialVehiculo::count())->toBe(1)
        ->and(CredencialVehiculo::first()->tipo)->toBe(VehiculoTipoEnum::Auto)
        ->and(CredencialVehiculo::first()->patente)->toBe('ABC123');
});

test('RegistrarCredencial genera código QR único automáticamente', function () {
    $propiedad = Propiedad::factory()->create();

    $c1 = RegistrarCredencial::make(propiedad: $propiedad, tipo: AccesoTipoEnum::Familiar->value);
    $c2 = RegistrarCredencial::make(propiedad: $propiedad, tipo: AccesoTipoEnum::Familiar->value);

    expect($c1->codigo_qr)->not->toBe($c2->codigo_qr);
});

// ─── ObtenerCredenciales ────────────────────────────────────────────────────

test('ObtenerCredenciales retorna todas las credenciales paginadas', function () {
    Credencial::factory()->count(3)->create();

    $resultado = ObtenerCredenciales::make();

    expect($resultado->total())->toBe(3);
});

test('ObtenerCredenciales filtra por propiedad', function () {
    $propiedad = Propiedad::factory()->create();
    Credencial::factory()->for($propiedad)->count(2)->create();
    Credencial::factory()->count(1)->create();

    $resultado = ObtenerCredenciales::make(filtros: ['propiedadId' => $propiedad->id]);

    expect($resultado->total())->toBe(2);
});

test('ObtenerCredenciales filtra por tipo', function () {
    Credencial::factory()->create(['tipo' => AccesoTipoEnum::Propietario]);
    Credencial::factory()->create(['tipo' => AccesoTipoEnum::Familiar]);

    $resultado = ObtenerCredenciales::make(filtros: ['tipo' => AccesoTipoEnum::Propietario->value]);

    expect($resultado->total())->toBe(1);
});

test('ObtenerCredenciales filtra por estado', function () {
    Credencial::factory()->create(['estado' => CredencialEstadoEnum::Activa]);
    Credencial::factory()->inactiva()->create();

    $resultado = ObtenerCredenciales::make(filtros: ['estado' => CredencialEstadoEnum::Inactiva->value]);

    expect($resultado->total())->toBe(1);
});

// ─── Habilitar / Deshabilitar ────────────────────────────────────────────────

test('Habilitar cambia estado de inactiva a activa', function () {
    $credencial = Credencial::factory()->inactiva()->create();

    $resultado = Habilitar::make($credencial);

    expect($resultado->estado)->toBe(CredencialEstadoEnum::Activa);
});

test('Habilitar lanza excepción si credencial ya está activa', function () {
    $credencial = Credencial::factory()->create(['estado' => CredencialEstadoEnum::Activa]);

    expect(fn () => Habilitar::make($credencial))->toThrow(RuntimeException::class);
});

test('Deshabilitar cambia estado de activa a inactiva', function () {
    $credencial = Credencial::factory()->create(['estado' => CredencialEstadoEnum::Activa]);

    $resultado = Deshabilitar::make($credencial);

    expect($resultado->estado)->toBe(CredencialEstadoEnum::Inactiva);
});

test('Deshabilitar lanza excepción si credencial ya está inactiva', function () {
    $credencial = Credencial::factory()->inactiva()->create();

    expect(fn () => Deshabilitar::make($credencial))->toThrow(RuntimeException::class);
});

// ─── ObtenerCredencialPorQr ──────────────────────────────────────────────────

test('ObtenerCredencialPorQr retorna credencial por código QR', function () {
    $credencial = Credencial::factory()->create();

    $resultado = ObtenerCredencialPorQr::make($credencial->codigo_qr);

    expect($resultado)->not->toBeNull()
        ->and($resultado->id)->toBe($credencial->id);
});

test('ObtenerCredencialPorQr retorna null si el QR no existe', function () {
    $resultado = ObtenerCredencialPorQr::make('codigo-qr-inexistente');

    expect($resultado)->toBeNull();
});

// ─── canBeAccesoFisico ───────────────────────────────────────────────────────

test('canBeAccesoFisico es true para credencial activa sin fechas', function () {
    $credencial = Credencial::factory()->create(['estado' => CredencialEstadoEnum::Activa]);

    expect($credencial->canBeAccesoFisico())->toBeTrue();
});

test('canBeAccesoFisico es false para credencial inactiva', function () {
    $credencial = Credencial::factory()->inactiva()->create();

    expect($credencial->canBeAccesoFisico())->toBeFalse();
});

test('canBeAccesoFisico es false para credencial vencida', function () {
    $credencial = Credencial::factory()->vencida()->create();

    expect($credencial->canBeAccesoFisico())->toBeFalse();
});

test('canBeAccesoFisico es true dentro de vigencia', function () {
    $credencial = Credencial::factory()->conVigencia(now()->subDay(), now()->addDay())->create();

    expect($credencial->canBeAccesoFisico())->toBeTrue();
});

test('canBeAccesoFisico es false cuando vigente_desde es en el futuro', function () {
    $credencial = Credencial::factory()->create([
        'vigente_desde' => now()->addDays(5),
        'vigente_hasta' => null,
    ]);

    expect($credencial->canBeAccesoFisico())->toBeFalse();
});
