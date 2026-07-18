<?php

namespace App\Modules\Chatbot\Services;

use Exception;
use Illuminate\Support\Facades\Http;

class LugaresService
{
    protected string $apiKey;

    protected string $baseUrl = 'https://maps.googleapis.com/maps/api/place';

    protected array $coordenadasSantiago = [
        'lat' => -27.7951,
        'lng' => -64.2637,
    ];

    public function __construct()
    {
        $this->apiKey = config('chatbot.google.places_key');

        if (empty($this->apiKey)) {
            throw new Exception('Google Places API key no configurada. Configura GOOGLE_PLACES_KEY en .env');
        }
    }

    /**
     * Busca museos en Santiago del Estero
     */
    public function buscarMuseos(): array
    {
        return $this->buscarLugar('museum', 'Museos');
    }

    /**
     * Busca restaurantes en Santiago del Estero
     */
    public function buscarRestaurantes(): array
    {
        return $this->buscarLugar('restaurant', 'Restaurantes');
    }

    /**
     * Busca hoteles en Santiago del Estero
     */
    public function buscarHoteles(): array
    {
        return $this->buscarLugar('lodging', 'Hoteles');
    }

    /**
     * Busca lugares de interés turístico
     */
    public function buscarPuntosInteres(): array
    {
        return $this->buscarLugar('tourist_attraction', 'Puntos de Interés Turístico');
    }

    /**
     * Busca un tipo específico de lugar en Santiago del Estero
     */
    private function buscarLugar(string $tipo, string $etiqueta): array
    {
        try {
            $response = Http::get($this->baseUrl.'/nearbysearch/json', [
                'location' => $this->coordenadasSantiago['lat'].','.$this->coordenadasSantiago['lng'],
                'radius' => 50000, // 50 km alrededor de Santiago del Estero
                'type' => $tipo,
                'key' => $this->apiKey,
                'language' => 'es',
            ]);

            if (! $response->successful()) {
                throw new Exception('Error al consultar lugares: '.$response->status());
            }

            $data = $response->json();
            $lugares = [];

            foreach ($data['results'] ?? [] as $lugar) {
                $detalles = $this->obtenerDetalles($lugar['place_id']);

                $lugares[] = [
                    'nombre' => $lugar['name'],
                    'direccion' => $detalles['formatted_address'] ?? $lugar['vicinity'] ?? 'No disponible',
                    'telefono' => $detalles['formatted_phone_number'] ?? 'No disponible',
                    'sitio_web' => $detalles['website'] ?? 'No disponible',
                    'horario' => $detalles['opening_hours'] ?? 'No disponible',
                    'calificacion' => $lugar['rating'] ?? 'No disponible',
                    'latitud' => $lugar['geometry']['location']['lat'],
                    'longitud' => $lugar['geometry']['location']['lng'],
                ];
            }

            return [
                'tipo' => $etiqueta,
                'cantidad' => count($lugares),
                'lugares' => $lugares,
            ];
        } catch (Exception $e) {
            return [
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Obtiene detalles completos de un lugar
     */
    private function obtenerDetalles(string $placeId): array
    {
        try {
            $response = Http::get($this->baseUrl.'/details/json', [
                'place_id' => $placeId,
                'key' => $this->apiKey,
                'language' => 'es',
                'fields' => 'formatted_address,formatted_phone_number,website,opening_hours',
            ]);

            if (! $response->successful()) {
                return [];
            }

            return $response->json()['result'] ?? [];
        } catch (Exception $e) {
            return [];
        }
    }

    /**
     * Busca un lugar específico por nombre en Santiago del Estero
     */
    public function buscarPorNombre(string $nombre): array
    {
        try {
            // Buscar con el nombre completo que incluya Santiago del Estero
            $query = $nombre.' Santiago del Estero Argentina';

            $response = Http::get($this->baseUrl.'/textsearch/json', [
                'query' => $query,
                'key' => $this->apiKey,
                'language' => 'es',
            ]);

            if (! $response->successful()) {
                throw new Exception('Error al buscar: '.$response->status());
            }

            $data = $response->json();
            $lugares = [];

            foreach ($data['results'] ?? [] as $lugar) {
                $detalles = $this->obtenerDetalles($lugar['place_id']);

                $lugares[] = [
                    'nombre' => $lugar['name'],
                    'direccion' => $detalles['formatted_address'] ?? 'No disponible',
                    'telefono' => $detalles['formatted_phone_number'] ?? 'No disponible',
                    'sitio_web' => $detalles['website'] ?? 'No disponible',
                    'horario' => $detalles['opening_hours'] ?? 'No disponible',
                    'calificacion' => $lugar['rating'] ?? 'No disponible',
                ];
            }

            return [
                'busqueda' => $nombre,
                'cantidad' => count($lugares),
                'lugares' => $lugares,
            ];
        } catch (Exception $e) {
            return [
                'error' => $e->getMessage(),
            ];
        }
    }
}
