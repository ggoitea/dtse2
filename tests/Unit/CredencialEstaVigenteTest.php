<?php

use App\Models\Credencial;
use Carbon\Carbon;
use Tests\TestCase;

uses(TestCase::class);

beforeEach(function () {
    Carbon::setTestNow(Carbon::create(2026, 5, 13));
});

it('es vigente cuando ambas fechas son null', function () {
    $c = new Credencial(['vigente_desde' => null, 'vigente_hasta' => null]);
    expect($c->tiene_periodo_vigente)->toBeTrue();
});

it('no es vigente cuando vigente_desde está en el futuro', function () {
    $c = new Credencial(['vigente_desde' => Carbon::today()->addDay(), 'vigente_hasta' => null]);
    expect($c->tiene_periodo_vigente)->toBeFalse();
});

it('no es vigente cuando vigente_hasta es anterior a hoy', function () {
    $c = new Credencial(['vigente_desde' => null, 'vigente_hasta' => Carbon::today()->subDay()]);
    expect($c->tiene_periodo_vigente)->toBeFalse();
});

it('es vigente cuando hoy está dentro del rango (inclusive)', function () {
    $c = new Credencial(['vigente_desde' => Carbon::today(), 'vigente_hasta' => Carbon::today()]);
    expect($c->tiene_periodo_vigente)->toBeTrue();
});

it('es vigente cuando desde es pasado y hasta es futuro', function () {
    $c = new Credencial([
        'vigente_desde' => Carbon::today()->subDays(5),
        'vigente_hasta' => Carbon::today()->addDays(5),
    ]);
    expect($c->tiene_periodo_vigente)->toBeTrue();
});
