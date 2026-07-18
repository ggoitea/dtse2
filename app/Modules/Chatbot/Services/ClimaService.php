<?php

namespace App\Modules\Chatbot\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class ClimaService
{
    protected string $apiKey;
    protected string $baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

    public function __construct()
    {
        $this->apiKey = config('chatbot.openweather.key');

        if (empty($this->apiKey)) {
            throw new Exception('OpenWeatherMap API key no configurada. Configura OPENWEATHER_API_KEY en .env');
        }
    }

    /**
     * Obtiene el clima actual de Santiago del Estero
     * 
     * @return array
     */
    public function obtenerClima(): array
    {
        try {
            $response = Http::get($this->baseUrl, [
                'q' => 'Santiago del Estero,AR',
                'appid' => $this->apiKey,
                'units' => 'metric',
                'lang' => 'es',
            ]);

            if (!$response->successful()) {
                throw new Exception('Error al consultar el clima: ' . $response->status());
            }

            $data = $response->json();

            return [
                'ubicacion' => $data['name'] . ', ' . $data['sys']['country'],
                'temperatura' => $data['main']['temp'],
                'sensacion_termica' => $data['main']['feels_like'],
                'temperatura_minima' => $data['main']['temp_min'],
                'temperatura_maxima' => $data['main']['temp_max'],
                'humedad' => $data['main']['humidity'],
                'presion' => $data['main']['pressure'],
                'descripcion' => $data['weather'][0]['description'],
                'viento_velocidad' => $data['wind']['speed'],
                'nubosidad' => $data['clouds']['all'],
                'visibilidad' => $data['visibility'],
            ];
        } catch (Exception $e) {
            return [
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Obtiene el pronóstico de 5 días para Santiago del Estero
     * 
     * @return array
     */
    public function obtenerPronostico(): array
    {
        try {
            $response = Http::get('https://api.openweathermap.org/data/2.5/forecast', [
                'q' => 'Santiago del Estero,AR',
                'appid' => $this->apiKey,
                'units' => 'metric',
                'lang' => 'es',
            ]);

            if (!$response->successful()) {
                throw new Exception('Error al consultar el pronóstico: ' . $response->status());
            }

            $data = $response->json();
            $pronostico = [];

            foreach ($data['list'] as $forecast) {
                $pronostico[] = [
                    'fecha' => date('d/m/Y H:i', $forecast['dt']),
                    'temperatura' => $forecast['main']['temp'],
                    'descripcion' => $forecast['weather'][0]['description'],
                    'humedad' => $forecast['main']['humidity'],
                    'viento' => $forecast['wind']['speed'],
                ];
            }

            return [
                'ubicacion' => $data['city']['name'],
                'pronostico' => $pronostico,
            ];
        } catch (Exception $e) {
            return [
                'error' => $e->getMessage(),
            ];
        }
    }
}
