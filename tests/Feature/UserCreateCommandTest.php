<?php

use App\Models\User;

test('user create command fails when there are no roles available', function () {
    $this->artisan('user:create')
        ->expectsPromptsError('No hay roles disponibles para asignar.')
        ->assertExitCode(1);

    expect(User::count())->toBe(0);
});
test('example', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
