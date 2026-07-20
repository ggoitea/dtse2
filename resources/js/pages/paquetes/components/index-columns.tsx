import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { PaqueteTuristico } from '../types/paquete';
import { PaqueteRowActions } from './index-row-actions';

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

const estadoVariants: Record<
    string,
    'default' | 'secondary' | 'destructive' | 'outline'
> = {
    activo: 'default',
    agotado: 'secondary',
    suspendido: 'outline',
    cancelado: 'destructive',
};

export const columns: ColumnDef<PaqueteTuristico>[] = [
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => <PaqueteRowActions paquete={row.original} />,
    },
    {
        accessorKey: 'nombre',
        header: 'Nombre',
        cell: ({ row }) => (
            <span className="font-medium">{row.original.nombre}</span>
        ),
    },
    {
        accessorKey: 'categoria',
        header: 'Categoría',
        cell: ({ row }) => (
            <Badge variant="outline">
                {categoriaLabels[row.original.categoria] ??
                    row.original.categoria}
            </Badge>
        ),
    },
    {
        accessorKey: 'destino',
        header: 'Destino',
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.original.destino ?? '-'}
            </span>
        ),
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => (
            <Badge variant={estadoVariants[row.original.estado] ?? 'outline'}>
                {estadoLabels[row.original.estado] ?? row.original.estado}
            </Badge>
        ),
    },
];
