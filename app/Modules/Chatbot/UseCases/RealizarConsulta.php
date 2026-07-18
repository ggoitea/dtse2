<?php

namespace App\Modules\Chatbot\UseCases;

use App\Ai\Agents\UrituAgent;
use App\Models\GuestIaCreditos;
use App\Models\UserIaCredito;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class RealizarConsulta
{
    public static function make(string $consulta): string
    {
        return (new self())->__invoke(consulta: $consulta);
    }

    /**
     * @return string false si no tienes la capacidad para realizar consultas
     */
    public function __invoke(string $consulta): string
    {
        if (Auth::check()) {
            $credito = UserIaCredito::firstOrCreate(
                ['user_id' => Auth::id()],
                ['creditos_disponibles' => 3]
            );
            if ($credito->creditos_disponibles <= 0) {
                throw ValidationException::withMessages([
                    'creditos' => 'No tienes créditos disponibles para realizar consultas.',
                ]);
            }
        } else {
            $ipAddress = request()->ip();
            $credito = GuestIaCreditos::query()->firstOrCreate(
                ['ip_address' => $ipAddress],
                ['creditos_disponibles' => 2]
            );
            if ($credito->creditos_disponibles <= 0) {
                throw ValidationException::withMessages([
                    'creditos' => 'No tienes créditos disponibles para realizar consultas.',
                ]);
            }
        }
        $agent = new  UrituAgent();
        $response = $agent->prompt($consulta);
        return $response;
    }
}
