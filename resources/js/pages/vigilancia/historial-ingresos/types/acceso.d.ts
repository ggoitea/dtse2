export interface Acceso {
    id: number;
    fecha: string | null; // "dd/mm/yyyy"
    hora: string | null; // "HH:mm"
    movimiento: {
        value: string;
        label: string;
    };
    tipo: {
        value: string;
        label: string;
    };
    nombre: string | null;
    dni: string | null;
    propiedad: {
        id: number;
        lote: string;
        manzana: string;
    };
    guardia: {
        id: number;
        nombre: string;
    };
    documento_tipo: {
        value: string;
        label: string;
    };
    observacion: string | null;
}
