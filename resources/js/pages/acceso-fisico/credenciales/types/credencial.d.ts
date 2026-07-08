export interface Credencial {
    id: number;
    tipo: {
        value: string;
        label: string;
    };
    nombre: string | null;
    dni: string | null;
    vehiculo: {
        tipo: string | null;
        patente: string | null;
    } | null;
    estado: {
        value: string;
        label: string;
    };
    codigo_qr: string;
    codigo_qr_base64: string;
    vigente_hasta: string | null; // "dd/mm/yyyy" o null
    tiene_periodo_vigente: boolean;
    can: {
        activar: boolean;
        suspender: boolean;
        ingreso_fisico: boolean;
    };
}
