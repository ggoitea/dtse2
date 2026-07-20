import type { Row } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { PaqueteTuristico } from '../types/paquete';

const categoriaLabels: Record<string, string> = {
    aventura: 'Aventura',
    cultura: 'Cultura',
    relax: 'Relajación',
    familiar: 'Familiar',
    romantico: 'Romántico',
    negocios: 'Negocios',
};

const estadoLabels: Record<string, string> = {
    activo: 'Activo',
    agotado: 'Agotado',
    suspendido: 'Suspendido',
    cancelado: 'Cancelado',
};

const estadoStyles: Record<string, string> = {
    activo: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
    agotado:
        'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
    suspendido:
        'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400',
    cancelado:
        'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400',
};

export default function PaqueteMobileCard({
    row,
}: {
    row: Row<PaqueteTuristico>;
}) {
    const paquete = row.original;

    return (
        <div className="group cursor-pointer rounded-2xl border border-border bg-muted p-5 transition-transform active:scale-[0.98]">
            <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                        {paquete.nombre}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {categoriaLabels[paquete.categoria] ??
                            paquete.categoria}
                    </p>
                </div>
                <Badge
                    className={`shrink-0 ${estadoStyles[paquete.estado] ?? ''}`}
                    variant="outline"
                >
                    {estadoLabels[paquete.estado] ?? paquete.estado}
                </Badge>
            </div>
            <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm">
                {paquete.destino && (
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Destino</span>
                        <span>{paquete.destino}</span>
                    </div>
                )}
                {paquete.duracion && (
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Duración</span>
                        <span>{paquete.duracion}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
