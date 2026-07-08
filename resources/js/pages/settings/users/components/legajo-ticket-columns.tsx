import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { UserLegajoTicket } from '../types';

function prioridadVariant(
    prioridad: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (prioridad === 'urgente') {
        return 'destructive';
    }

    if (prioridad === 'alta') {
        return 'default';
    }

    return 'secondary';
}

function estadoVariant(
    estado: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (estado === 'finalizado') {
        return 'default';
    }

    if (estado === 'asignado') {
        return 'secondary';
    }

    if (estado === 'anulado') {
        return 'destructive';
    }

    return 'outline';
}

function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(value));
}

export const legajoTicketColumns: ColumnDef<UserLegajoTicket>[] = [
    {
        accessorKey: 'created_at',
        header: 'Fecha',
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {formatDate(row.original.created_at)}
            </span>
        ),
    },
    {
        accessorKey: 'ticket_nro_formateado',
        header: 'Ticket Nro',
        cell: ({ row }) => (
            <span className="font-mono font-medium">
                {row.original.ticket_nro_formateado}
            </span>
        ),
    },
    {
        id: 'cliente',
        header: 'Cliente',
        cell: ({ row }) => (
            <span className="font-medium">
                {row.original.cliente.razon_social}
            </span>
        ),
    },
    {
        accessorKey: 'descripcion',
        header: 'Descripción',
        cell: ({ row }) => (
            <span className="block max-w-80 truncate text-sm text-muted-foreground">
                {row.original.descripcion}
            </span>
        ),
    },
    {
        accessorKey: 'prioridad_label',
        header: 'Prioridad',
        cell: ({ row }) => (
            <Badge variant={prioridadVariant(row.original.prioridad)}>
                {row.original.prioridad_label}
            </Badge>
        ),
    },
    {
        accessorKey: 'estado_label',
        header: 'Estado',
        cell: ({ row }) => (
            <Badge variant={estadoVariant(row.original.estado)}>
                {row.original.estado_label}
            </Badge>
        ),
    },
];
