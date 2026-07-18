<?php

namespace App\Ai\Tools;

use App\Services\Clima\ClimaService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;

class ConsultarClimaElTool implements Tool
{
    /**
     * Get the name of the tool.
     */
    public function name(): string
    {
        return 'consultar_clima';
    }

    /**
     * Get the description of the tool's purpose.
     */
    public function description(): string
    {
        return 'Consulta el clima actual en Santiago del Estero, Argentina. Incluye temperatura, humedad, viento y descripción de las condiciones meteorológicas.';
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): string
    {
        $tipoConsulta = $request['tipo_consulta'] ?? 'actual';
        $service = new ClimaService;

        try {
            if ($tipoConsulta === 'pronostico') {
                $resultado = $service->obtenerPronostico();
            } else {
                $resultado = $service->obtenerClima();
            }

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
            'tipo_consulta' => $schema
                ->string()
                ->description('Tipo de consulta: "actual" para clima en tiempo real o "pronostico" para los próximos 5 días')
                ->required(),
        ];
    }
}
