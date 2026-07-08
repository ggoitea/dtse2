<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('authenticated users can visit the launcher', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('launcher'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('launcher'),
        );
});
