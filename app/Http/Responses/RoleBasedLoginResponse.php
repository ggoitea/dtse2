<?php

namespace App\Http\Responses;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class RoleBasedLoginResponse implements LoginResponseContract
{
    /**
     * {@inheritdoc}
     */
    public function toResponse($request): RedirectResponse
    {
        /** @var Request $request */
        /** @var User|null $user */
        $user = $request->user();

        return redirect()->to($this->redirectTo($user));
    }

    /**
     * Determine the default landing page for the authenticated user.
     */
    private function redirectTo(?User $user): string
    {
        if ($user?->hasAnyRole(['owner', 'admin'])) {
            return route('dashboard', absolute: false);
        }

        if ($user?->hasAnyRole(['propietario', 'security'])) {
            return route('launcher', absolute: false);
        }

        return route('launcher', absolute: false);
    }
}
