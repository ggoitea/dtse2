export interface Evento {
    id: number;
    localidad_id: number;
    sitio_id: number | null;
    nombre: string;
    descripcion: string | null;
    fecha: string;
    inicio: string | null;
    fin: string | null;
    domicilio_calle: string;
    domicilio_numero: string | null;
    estado: 'pendiente' | 'activo' | 'suspendido' | 'rechazado';
    created_at: string;
    updated_at: string;
    localidad?: Localidad;
    sitio?: Sitio;
    archivo_default?: Archivo | null;
}

export interface Localidad {
    id: number;
    nombre: string;
}

export interface Sitio {
    id: number;
    nombre: string;
    localidad_id: number;
    domicilio_calle: string;
    domicilio_numero: string | null;
}

export interface Archivo {
    id: number;
    nombre: string;
    path: string;
    mime_type: string | null;
    default: boolean;
}
