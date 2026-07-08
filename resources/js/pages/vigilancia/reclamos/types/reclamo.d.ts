export interface Reclamo {
    id: number;
    creado: string | null; // "dd/mm/yyyy"
    hora_registro: string | null; // "HH:mm"
    propiedad: {
        id: number;
        lote: string;
        manzana: string;
    };
    persona: {
        nombre: string;
        dni: string;
    };
    fecha: string | null; // "dd/mm/yyyy" - fecha incidencia
    hora_incidencia: string | null; // "HH:mm"
    detalle: string | null;
    estado: {
        value: string;
        label: string;
    };
    can_be_eliminar: boolean;
}
