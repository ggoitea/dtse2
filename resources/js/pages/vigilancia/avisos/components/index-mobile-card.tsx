import type { Row } from '@tanstack/react-table';

import { renderCell } from '@/components/blocks/mobile-grid';
import { Badge } from '@/components/ui/badge';

import type { Aviso } from '../types/aviso';

export default function AvisoMobileCard({ row }: { row: Row<Aviso> }) {
    const aviso = row.original;
    const isPendiente = aviso.estado === 'pendiente';

    return (
        <div className="group cursor-pointer rounded-2xl border border-border bg-muted p-5 transition-transform active:scale-[0.98]">
            {/* Encabezado: tipo + estado */}
            <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <Badge variant="secondary" className="text-sm">
                        {aviso.tipo.label}
                    </Badge>
                </div>
                <Badge
                    className={
                        isPendiente
                            ? 'shrink-0 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                            : 'shrink-0 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                    }
                    variant="outline"
                >
                    {isPendiente ? 'Pendiente' : 'Ingreso'}
                </Badge>
            </div>

            {/* Detalle */}
            <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Domicilio</span>
                    <span>
                        L{aviso.domicilio.lote} M{aviso.domicilio.manzana}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Propietario</span>
                    <span>{aviso.propietario ?? '-'}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fecha</span>
                    <span>{aviso.fecha}</span>
                </div>
            </div>
            <div className="mt-1 flex items-center justify-end gap-1 border-t border-border pt-1 text-sm">
                {renderCell(row, 'actions')}
            </div>
        </div>
    );
}
