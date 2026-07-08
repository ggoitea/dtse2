<?php

use App\Models\Guardia;
use App\Models\User;
use App\Modules\Vigilancia\Guardia\Services\GestionGuardiaService;
use App\Modules\Vigilancia\Guardia\UseCases\ActualizarPerfil;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ─── GestionGuardiaService::registrar ───────────────────────────────────────

it('registrar crea un guardia correctamente', function () {
    $guardia = GestionGuardiaService::registrar(
        nombre: 'Juan Pérez',
        dni: '12345678901',
        telefono: '1234567890',
        secundarioTelefono: null,
    );

    expect(Guardia::count())->toBe(1)
        ->and($guardia->nombre)->toBe('Juan Pérez')
        ->and($guardia->dni)->toBe('12345678901')
        ->and($guardia->telefono)->toBe('1234567890')
        ->and($guardia->secundario_telefono)->toBeNull()
        ->and($guardia->user_id)->toBeNull();
});

it('registrar lanza excepción si DNI ya existe', function () {
    Guardia::factory()->create(['dni' => '12345678901']);

    expect(fn () => GestionGuardiaService::registrar(
        nombre: 'Otro Guardia',
        dni: '12345678901',
        telefono: '9876543210',
        secundarioTelefono: null,
    ))->toThrow(RuntimeException::class);
});

// ─── GestionGuardiaService::actualizar ──────────────────────────────────────

it('actualizar modifica los datos del guardia', function () {
    $guardia = Guardia::factory()->create(['dni' => '11111111111']);

    $actualizado = GestionGuardiaService::actualizar(
        guardia: $guardia,
        nombre: 'Nuevo Nombre',
        dni: '22222222222',
        telefono: '0987654321',
        secundarioTelefono: '1112223334',
    );

    expect($actualizado->nombre)->toBe('Nuevo Nombre')
        ->and($actualizado->dni)->toBe('22222222222')
        ->and($actualizado->telefono)->toBe('0987654321')
        ->and($actualizado->secundario_telefono)->toBe('1112223334');
});

it('actualizar lanza excepción si DNI pertenece a otro guardia', function () {
    Guardia::factory()->create(['dni' => '99999999999']);
    $guardia = Guardia::factory()->create(['dni' => '11111111111']);

    expect(fn () => GestionGuardiaService::actualizar(
        guardia: $guardia,
        nombre: 'Guardia',
        dni: '99999999999',
        telefono: '1234567890',
        secundarioTelefono: null,
    ))->toThrow(RuntimeException::class);
});

// ─── GestionGuardiaService::eliminar ────────────────────────────────────────

it('eliminar borra el guardia y su usuario asociado', function () {
    $user = User::factory()->create();
    $guardia = Guardia::factory()->create(['user_id' => $user->id]);

    GestionGuardiaService::eliminar($guardia);

    expect(Guardia::count())->toBe(0)
        ->and(User::find($user->id))->toBeNull();
});

it('eliminar borra el guardia sin usuario', function () {
    $guardia = Guardia::factory()->create(['user_id' => null]);

    GestionGuardiaService::eliminar($guardia);

    expect(Guardia::count())->toBe(0);
});

// ─── ActualizarPerfil ────────────────────────────────────────────────────────

it('ActualizarPerfil actualiza solo telefono y secundario_telefono', function () {
    $guardia = Guardia::factory()->create([
        'telefono' => '1111111111',
        'secundario_telefono' => null,
    ]);

    $resultado = ActualizarPerfil::make(
        guardia: $guardia,
        telefono: '9999999999',
        secundarioTelefono: '8888888888',
    );

    expect($resultado->telefono)->toBe('9999999999')
        ->and($resultado->secundario_telefono)->toBe('8888888888');
});
