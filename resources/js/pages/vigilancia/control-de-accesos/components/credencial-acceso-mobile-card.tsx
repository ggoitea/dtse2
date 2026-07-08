import type { Row } from '@tanstack/react-table';

import { renderCell } from '@/components/blocks/mobile-grid';
import { Badge } from '@/components/ui/badge';

import type { CredencialAcceso } from '../types/control-acceso';

export default function CredencialAccesoMobileCard({
    row,
}: {
    row: Row<CredencialAcceso>;
}) {
    const credencial = row.original;
    const activa = credencial.estado.value === 'activa';

    return (
        <div className="group cursor-pointer rounded-2xl border border-border bg-muted p-5 transition-transform active:scale-[0.98]">
            {/* Encabezado: tipo + estado */}
            <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <div className="mb-1">
                        <Badge variant="default">{credencial.tipo.label}</Badge>
                    </div>
                    <p className="truncate text-base font-semibold uppercase">
                        {credencial.nombre ?? '—'}
                    </p>
                    {credencial.dni && (
                        <p className="text-sm text-muted-foreground">
                            DNI: {credencial.dni}
                        </p>
                    )}
                </div>
                <Badge
                    variant="outline"
                    className={
                        activa
                            ? 'shrink-0 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                            : 'shrink-0 bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                    }
                >
                    {credencial.estado.label}
                </Badge>
            </div>

            {/* Detalle */}
            <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
                {credencial.vehiculo &&
                    (credencial.vehiculo.tipo ||
                        credencial.vehiculo.patente) && (
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">
                                Vehículo
                            </span>
                            <span>
                                {[
                                    credencial.vehiculo.tipo,
                                    credencial.vehiculo.patente,
                                ]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </span>
                        </div>
                    )}

                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vencimiento</span>
                    <span
                        className={
                            credencial.tiene_periodo_vigente
                                ? ''
                                : 'text-red-600'
                        }
                    >
                        {credencial.vigente_hasta ?? 'Nunca'}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-end border-t border-neutral-800 pt-2">
                {renderCell(row, 'actions')}
            </div>
        </div>
    );
}
