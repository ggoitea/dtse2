export interface PaqueteTuristico {
    id: number;
    modelable_type: string;
    modelable_id: number;
    nombre: string;
    descripcion: string | null;
    categoria: 'aventura' | 'cultura' | 'relax' | 'familiar' | 'romantico' | 'negocios';
    destino: string | null;
    duracion: string | null;
    estado: 'activo' | 'agotado' | 'suspendido' | 'cancelado';
    created_at: string;
    updated_at: string;
    modelable?: Evento | Sitio;
}

export interface Evento {
    id: number;
    nombre: string;
    localidad_id: number;
    fecha: string;
}

export interface Sitio {
    id: number;
    nombre: string;
    localidad_id: number;
}
