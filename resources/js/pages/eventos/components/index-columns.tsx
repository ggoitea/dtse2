import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { Evento } from '../types/evento';
import { EventoRowActions } from './index-row-actions';

const estadoLabels: Record<string, string> = {
    pendiente: 'Pendiente',
    activo: 'Activo',
    suspendido: 'Suspendido',
    rechazado: 'Rechazado',
};

const estadoVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pendiente: 'outline',
    activo: 'default',
    suspendido: 'secondary',
    rechazado: 'destructive',
};

export const columns: ColumnDef<Evento>[] = [
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => <EventoRowActions evento={row.original} />,
    },
    {
        accessorKey: 'nombre',
        header: 'Nombre',
        cell: ({ row }) => (
            <span className="font-medium">{row.original.nombre}</span>
        ),
    },
    {
        accessorKey: 'fecha',
        header: 'Fecha',
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.fecha}</span>
        ),
    },
    {
        accessorKey: 'localidad',
        header: 'Nodo',
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.original.localidad?.nombre ?? '-'}
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
