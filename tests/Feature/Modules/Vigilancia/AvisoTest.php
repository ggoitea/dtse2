<?php

use App\Enums\Vigilancia\AvisoTipoEnum;
use App\Models\Acceso;
use App\Models\Aviso;
use App\Models\Guardia;
use App\Models\Propiedad;
use App\Models\User;
use App\Modules\Vigilancia\Aviso\UseCases\EliminarAviso;
use App\Modules\Vigilancia\Aviso\UseCases\MarcarIngreso;
use App\Modules\Vigilancia\Aviso\UseCases\ObtenerAvisos;
use App\Modules\Vigilancia\Aviso\UseCases\RegistrarAviso;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;

uses(RefreshDatabase::class);

// ─── RegistrarAviso ──────────────────────────────────────────────────────────

it('RegistrarAviso crea el aviso correctamente', function () {
    $propiedad = Propiedad::factory()->create();

    $aviso = RegistrarAviso::make(
        propiedadId: $propiedad->id,
        tipo: AvisoTipoEnum::Taxi->value,
        nombre: 'Juan Pérez',
        observacion: 'Taxi color amarillo.',
    );

    expect(Aviso::count())->toBe(1)
        ->and($aviso->propiedad_id)->toBe($propiedad->id)
        ->and($aviso->tipo)->toBe(AvisoTipoEnum::Taxi)
        ->and($aviso->nombre)->toBe('Juan Pérez')
        ->and($aviso->observacion)->toBe('Taxi color amarillo.')
        ->and($aviso->recepcion_at)->toBeNull()
        ->and($aviso->recepcion_observacion)->toBeNull();
});

// ─── EliminarAviso ───────────────────────────────────────────────────────────

it('EliminarAviso elimina el aviso si no tiene ingreso registrado', function () {
    $aviso = Aviso::factory()->create(['recepcion_at' => null]);

    EliminarAviso::make($aviso);

    expect(Aviso::count())->toBe(0);
});

it('EliminarAviso lanza excepción si el aviso ya tiene ingreso registrado', function () {
    $aviso = Aviso::factory()->create(['recepcion_at' => now()]);

    expect(fn () => EliminarAviso::make($aviso))->toThrow(RuntimeException::class, 'El aviso no puede ser eliminado porque ya tiene un ingreso registrado.');
});

// ─── MarcarIngreso ───────────────────────────────────────────────────────────

it('MarcarIngreso actualiza recepcion_at y crea un Acceso con la observación correcta', function () {
    $propiedad = Propiedad::factory()->create();
    $usuario = User::factory()->create();
    Auth::login($usuario);
    $guardia = Guardia::factory()->create([
        'user_id' => $usuario->id,
    ]);
    $aviso = Aviso::factory()->create([
        'propiedad_id' => $propiedad->id,
        'recepcion_at' => null,
        'nombre' => 'Cadete Express',
    ]);

    $acceso = MarcarIngreso::make(
        aviso: $aviso,
    );

    $aviso->refresh();
    expect($aviso->recepcion_at)->not->toBeNull()
        ->and(Acceso::count())->toBe(1)
        ->and($acceso->observacion)->toBe("Solicitado por Aviso #{$aviso->id}")
        ->and($acceso->propiedad_id)->toBe($propiedad->id)
        ->and($acceso->guardia_id)->toBe($guardia->id)
        ->and($acceso->nombre)->toBe('Cadete Express');
});

it('MarcarIngreso lanza excepción si el aviso ya tiene ingreso registrado', function () {
    $guardia = Guardia::factory()->create();
    $aviso = Aviso::factory()->create(['recepcion_at' => now()]);

    expect(fn () => MarcarIngreso::make(
        aviso: $aviso,
    ))->toThrow(RuntimeException::class, 'El aviso ya tiene un ingreso registrado.');
});

// ─── ObtenerAvisos ───────────────────────────────────────────────────────────

it('ObtenerAvisos retorna avisos paginados', function () {
    Aviso::factory()->count(3)->create();

    $resultado = ObtenerAvisos::make();

    expect($resultado->total())->toBe(3);
});

it('ObtenerAvisos filtra por propiedad', function () {
    $propiedad = Propiedad::factory()->create();
    Aviso::factory()->count(2)->create(['propiedad_id' => $propiedad->id]);
    Aviso::factory()->count(1)->create();

    $resultado = ObtenerAvisos::make(filtros: ['propiedadId' => $propiedad->id]);

    expect($resultado->total())->toBe(2);
});

it('ObtenerAvisos filtra por tipo', function () {
    Aviso::factory()->create(['tipo' => AvisoTipoEnum::Taxi->value]);
    Aviso::factory()->create(['tipo' => AvisoTipoEnum::Cadete->value]);

    $resultado = ObtenerAvisos::make(filtros: ['tipo' => AvisoTipoEnum::Taxi->value]);

    expect($resultado->total())->toBe(1);
});

it('ObtenerAvisos filtra solo sin ingreso', function () {
    Aviso::factory()->create(['recepcion_at' => null]);
    Aviso::factory()->create(['recepcion_at' => now()]);

    $resultado = ObtenerAvisos::make(filtros: ['soloSinIngreso' => true]);

    expect($resultado->total())->toBe(1);
});
