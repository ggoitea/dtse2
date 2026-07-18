<?php

namespace App\Ai\Tools;

use App\Services\Lugares\LugaresService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;

class BuscarLugaresTool implements Tool
{
    /**
     * Get the name of the tool.
     */
    public function name(): string
    {
        return 'buscar_lugares';
    }

    /**
     * Get the description of the tool's purpose.
     */
    public function description(): string
    {
        return 'Busca lugares específicos en Santiago del Estero, Argentina. Puede buscar museos, restaurantes, hoteles, puntos de interés turístico o un lugar específico por su nombre. Retorna dirección, teléfono, horario, sitio web y calificación.';
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): string
    {
        $tipo = $request['tipo'] ?? '';
        $nombre = $request['nombre'] ?? '';
        $service = new LugaresService;

        try {
            $resultado = match ($tipo) {
                'museos' => $service->buscarMuseos(),
                'restaurantes' => $service->buscarRestaurantes(),
                'hoteles' => $service->buscarHoteles(),
                'puntos_interes' => $service->buscarPuntosInteres(),
                'buscar_nombre' => ! empty($nombre) ? $service->buscarPorNombre($nombre) : ['error' => 'Nombre requerido'],
                default => ['error' => 'Tipo de búsqueda no válido'],
            };

            return json_encode($resultado, JSON_UNESCAPED_UNICODE);
        } catch (\Exception $e) {
            return json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    /**
     * Get the tool's schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'tipo' => $schema
                ->string()
                ->description('Tipo de lugar a buscar: museos, restaurantes, hoteles, puntos_interes, o buscar_nombre')
                ->required(),
        ];
    }
}
