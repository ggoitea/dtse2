import type { Row } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { Acceso } from '../types/acceso';

export default function AccesoMobileCard({ row }: { row: Row<Acceso> }) {
    const acceso = row.original;
    const isIngreso = acceso.movimiento.value === 'ingreso';

    return (
        <div className="group cursor-pointer rounded-2xl border border-border bg-muted p-5 transition-transform active:scale-[0.98]">
            {/* Encabezado: nombre + movimiento */}
            <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                        {acceso.nombre ?? '-'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        DNI: {acceso.dni ?? '-'}
                    </p>
                </div>
                <Badge
                    className={
                        isIngreso
                            ? 'shrink-0 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                            : 'shrink-0 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                    }
                    variant="outline"
                >
                    {acceso.movimiento.label}
                </Badge>
            </div>

            {/* Detalle */}
            <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fecha y hora</span>
                    <span>
                        {acceso.fecha ?? '-'}{' '}
                        {acceso.hora ? `· ${acceso.hora}` : ''}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tipo</span>
                    <Badge variant="secondary">{acceso.tipo.label}</Badge>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Propiedad</span>
                    <span>
                        L{acceso.propiedad.lote} M{acceso.propiedad.manzana}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Guardia</span>
                    <span>{acceso.guardia.nombre}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Acreditación</span>
                    <span>{acceso.documento_tipo.label}</span>
                </div>

                {acceso.observacion && (
                    <div className="mt-1 border-t border-border pt-2">
                        <p className="text-muted-foreground">Observación</p>
                        <p className="mt-0.5 text-sm">{acceso.observacion}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
