import type { Credencial } from '@/pages/acceso-fisico/credenciales/types/credencial';

export type CredencialAcceso = Credencial;

export interface RegistrarAccesoForm {
    propiedad_id: string;
    nombre: string;
    dni: string;
    vehiculo_tipo: string;
    vehiculo_patente: string;
    observacion: string;
    nombre_dni_vehiculo_observacion_observacion: null;
}

export interface ValidarQrResponse {
    valido: boolean;
    mensaje?: string;
    credencial?: CredencialAcceso;
}

export interface PropiedadOpcion {
    value: number;
    label: string;
}
