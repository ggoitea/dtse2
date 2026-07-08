import type { Row } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { Reclamo } from '../types/reclamo';

export default function ReclamoMobileCard({ row }: { row: Row<Reclamo> }) {
    const reclamo = row.original;
    const isEnviado = reclamo.estado.value === 'enviado';

    return (
        <div className="group cursor-pointer rounded-2xl border border-border bg-muted p-5 transition-transform active:scale-[0.98]">
            {/* Encabezado: nombre + estado */}
            <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                        {reclamo.persona.nombre ?? '-'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        DNI: {reclamo.persona.dni ?? '-'}
                    </p>
                </div>
                <Badge
                    className={
                        isEnviado
                            ? 'shrink-0 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                            : 'shrink-0 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                    }
                    variant="outline"
                >
                    {reclamo.estado.label}
                </Badge>
            </div>

            {/* Detalle */}
            <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Registrado</span>
                    <span>
                        {reclamo.creado ?? '-'}
                        {reclamo.hora_registro
                            ? ` · ${reclamo.hora_registro}`
                            : ''}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Propiedad</span>
                    <span>
                        L{reclamo.propiedad.lote} M{reclamo.propiedad.manzana}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                        Fecha (incidencia)
                    </span>
                    <span>
                        {reclamo.fecha ?? '-'}
                        {reclamo.hora_incidencia
                            ? ` · ${reclamo.hora_incidencia}`
                            : ''}
                    </span>
                </div>

                {reclamo.detalle && (
                    <div className="mt-1 border-t border-border pt-2">
                        <p className="text-muted-foreground">Descripción</p>
                        <p className="mt-0.5 text-sm">{reclamo.detalle}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
