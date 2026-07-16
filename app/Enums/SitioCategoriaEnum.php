<?php

namespace App\Enums;

enum SitioCategoriaEnum: string
{
    case InteresTuristico = 'interes_turistico';
    case Alojamiento = 'alojamiento';
    case Gastronomia = 'gastronomia';
    case EstacionServicio = 'estacion_servicio';
    case ServicioAutomotriz = 'servicio_automotriz';
    case Salud = 'salud';
    case SeguridadEmergencia = 'seguridad_emergencia';
    case TerminalesTransporte = 'terminales_transporte';
    case InformacionTuristica = 'informacion_turistica';
    case Compras = 'compras';
    case RecreacionEntretenimiento = 'recreacion_entretenimiento';
    case Deporte = 'deporte';
    case Naturaleza = 'naturaleza';
    case Eventos = 'eventos';
    case ServiciosPublicos = 'servicios_publicos';
    case Otro = 'otro';

    public function label(): string
    {
        return match ($this) {
            self::InteresTuristico => 'Interés Turístico',
            self::Alojamiento => 'Alojamiento',
            self::Gastronomia => 'Gastronomía',
            self::EstacionServicio => 'Estación de Servicio',
            self::ServicioAutomotriz => 'Servicio Automotriz',
            self::Salud => 'Salud',
            self::SeguridadEmergencia => 'Seguridad y Emergencia',
            self::TerminalesTransporte => 'Terminales y Transporte',
            self::InformacionTuristica => 'Información Turística',
            self::Compras => 'Compras',
            self::RecreacionEntretenimiento => 'Recreación y Entretenimiento',
            self::Deporte => 'Deporte',
            self::Naturaleza => 'Naturaleza',
            self::Eventos => 'Eventos',
            self::ServiciosPublicos => 'Servicios Públicos',
            self::Otro => 'Otro',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return array<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases()
        );
    }
}
