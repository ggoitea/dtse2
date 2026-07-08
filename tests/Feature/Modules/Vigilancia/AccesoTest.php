<?php

use App\Enums\AccessoFisico\AccesoTipoEnum;
use App\Enums\Vigilancia\AccesoDocumentoTipoEnum;
use App\Enums\Vigilancia\AccesoMovimientoEnum;
use App\Models\Acceso;
use App\Models\Guardia;
use App\Models\Propiedad;
use App\Modules\Vigilancia\Acceso\UseCases\ObtenerAcceso;
use App\Modules\Vigilancia\Acceso\UseCases\RegistrarAcceso;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ─── RegistrarAcceso ─────────────────────────────────────────────────────────

it('RegistrarAcceso crea un acceso correctamente', function () {
    $propiedad = Propiedad::factory()->create();
    $guardia = Guardia::factory()->create();

    $acceso = RegistrarAcceso::make(
        movimiento: AccesoMovimientoEnum::Ingreso->value,
        tipo: AccesoTipoEnum::VisitaEventual->value,
        documentoTipo: AccesoDocumentoTipoEnum::Dni->value,
        propiedadId: $propiedad->id,
        guardiaId: $guardia->id,
        nombre: 'Visitante Test',
        dni: '12345678901',
    );

    expect(Acceso::count())->toBe(1)
        ->and($acceso->movimiento)->toBe(AccesoMovimientoEnum::Ingreso)
        ->and($acceso->tipo)->toBe(AccesoTipoEnum::VisitaEventual)
        ->and($acceso->documento_tipo)->toBe(AccesoDocumentoTipoEnum::Dni)
        ->and($acceso->nombre)->toBe('Visitante Test')
        ->and($acceso->dni)->toBe('12345678901')
        ->and($acceso->propiedad_id)->toBe($propiedad->id)
        ->and($acceso->guardia_id)->toBe($guardia->id);
});

it('RegistrarAcceso usa acceso_at actual si no se provee', function () {
    $propiedad = Propiedad::factory()->create();
    $guardia = Guardia::factory()->create();

    $acceso = RegistrarAcceso::make(
        movimiento: AccesoMovimientoEnum::Salida->value,
        tipo: AccesoTipoEnum::Propietario->value,
        documentoTipo: AccesoDocumentoTipoEnum::NoAplica->value,
        propiedadId: $propiedad->id,
        guardiaId: $guardia->id,
        nombre: 'Propietario Test',
    );

    expect($acceso->acceso_at)->not->toBeNull();
});

// ─── ObtenerAcceso ───────────────────────────────────────────────────────────

it('ObtenerAcceso retorna accesos paginados', function () {
    Acceso::factory()->count(3)->create();

    $resultado = ObtenerAcceso::make();

    expect($resultado->total())->toBe(3);
});

it('ObtenerAcceso filtra por guardia', function () {
    $guardia = Guardia::factory()->create();
    Acceso::factory()->count(2)->create(['guardia_id' => $guardia->id]);
    Acceso::factory()->count(1)->create();

    $resultado = ObtenerAcceso::make(filtros: ['guardiaId' => $guardia->id]);

    expect($resultado->total())->toBe(2);
});

it('ObtenerAcceso filtra por movimiento', function () {
    Acceso::factory()->create(['movimiento' => AccesoMovimientoEnum::Ingreso]);
    Acceso::factory()->create(['movimiento' => AccesoMovimientoEnum::Salida]);

    $resultado = ObtenerAcceso::make(filtros: ['movimiento' => AccesoMovimientoEnum::Salida->value]);

    expect($resultado->total())->toBe(1);
});

it('ObtenerAcceso filtra por tipo', function () {
    Acceso::factory()->create(['tipo' => AccesoTipoEnum::Propietario]);
    Acceso::factory()->create(['tipo' => AccesoTipoEnum::Familiar]);

    $resultado = ObtenerAcceso::make(filtros: ['tipo' => AccesoTipoEnum::Familiar->value]);

    expect($resultado->total())->toBe(1);
});

it('ObtenerAcceso filtra por buscar nombre', function () {
    Acceso::factory()->create(['nombre' => 'Carlos López']);
    Acceso::factory()->create(['nombre' => 'Ana García']);

    $resultado = ObtenerAcceso::make(filtros: ['buscar' => 'Carlos']);

    expect($resultado->total())->toBe(1);
});

it('ObtenerAcceso filtra por buscar dni', function () {
    Acceso::factory()->create(['dni' => '11122233344']);
    Acceso::factory()->create(['dni' => '55566677788']);

    $resultado = ObtenerAcceso::make(filtros: ['buscar' => '11122233344']);

    expect($resultado->total())->toBe(1);
});
