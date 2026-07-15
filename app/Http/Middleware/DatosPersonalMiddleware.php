<?php

namespace App\Http\Middleware;

use App\Models\UserDatoPersonal;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DatosPersonalMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $this->hasCompleteDatos($user->id)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Datos personales incompletos.'], 403);
            }

            return redirect()->route('datos-personales.completar');
        }

        return $next($request);
    }

    private function hasCompleteDatos(int $userId): bool
    {
        $datoPersonal = UserDatoPersonal::where('user_id', $userId)->first();

        if (! $datoPersonal) {
            return false;
        }

        return $datoPersonal->isComplete();
    }
}
