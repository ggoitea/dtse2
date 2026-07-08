export interface Propietario {
    id: number | null;
    nombre: string | null;
    dni: string | null;
    telefono: string | null;
    secundario_telefono: string | null;
    secundario_nombre: string | null;
}

export interface Propiedad {
    id: number;
    lote: string | null;
    manzana: string | null;
    descripcion: string | null;
    propietario: Propietario | null;
}
