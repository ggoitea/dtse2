import type { Row } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { Evento } from '../types/evento';

const estadoLabels: Record<string, string> = {
    pendiente: 'Pendiente',
    activo: 'Activo',
    suspendido: 'Suspendido',
    rechazado: 'Rechazado',
};

const estadoStyles: Record<string, string> = {
    pendiente:
        'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
    activo: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    suspendido:
        'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
    rechazado:
        'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
};

export default function EventoMobileCard({ row }: { row: Row<Evento> }) {
    const evento = row.original;

    return (
        <div className="group cursor-pointer rounded-2xl border border-border bg-muted p-5 transition-transform active:scale-[0.98]">
            <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                        {evento.nombre}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {evento.localidad?.nombre ?? '-'}
                    </p>
                </div>
                <Badge
                    className={`shrink-0 ${estadoStyles[evento.estado] ?? ''}`}
                    variant="outline"
                >
                    {estadoLabels[evento.estado] ?? evento.estado}
                </Badge>
            </div>
            <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fecha</span>
                    <span>{evento.fecha}</span>
                </div>
                {evento.sitio && (
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Sitio</span>
                        <span>{evento.sitio.nombre}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
