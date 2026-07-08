export interface Aviso {
    id: number;
    tipo: {
        value: string; // 'taxi' | 'cadete' | 'encomienda' | 'otro'
        label: string; // 'Taxi' | 'Cadete' | 'Encomienda' | 'Otro'
    };
    domicilio: {
        lote: string;
        manzana: string;
    };
    propietario: string | null; // nombre del titular
    estado: 'pendiente' | 'ingreso';
    fecha: string; // "dd/mm/yyyy" si pendiente, "dd/mm/yyyy HH:mm" si ingresado
    observacion: string | null;
    recepcion_observacion: string | null;
    can_be_eliminar: boolean;
    has_marcado_ingreso: boolean;
}
