import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { Reclamo } from '../types/reclamo';
import IndexRowActions from './index-row-actions';

export const columns: ColumnDef<Reclamo>[] = [
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => <IndexRowActions reclamo={row.original} />,
    },
    {
        accessorKey: 'creado',
        header: 'Creado',
        cell: ({ row }) => row.original.creado ?? '-',
    },
    {
        accessorKey: 'hora_registro',
        header: 'Hora',
        cell: ({ row }) => row.original.hora_registro ?? '-',
    },
    {
        id: 'propiedad',
        header: 'Lote',
        cell: ({ row }) => {
            const { lote, manzana } = row.original.propiedad;

            return `L${lote} M${manzana}`;
        },
    },
    {
        id: 'persona_nombre',
        header: 'Nombre y Apellido',
        cell: ({ row }) => row.original.persona.nombre ?? '-',
    },
    {
        id: 'persona_dni',
        header: 'DNI',
        cell: ({ row }) => row.original.persona.dni ?? '-',
    },
    {
        accessorKey: 'fecha',
        header: 'Fecha (incidencia)',
        cell: ({ row }) => row.original.fecha ?? '-',
    },
    {
        accessorKey: 'hora_incidencia',
        header: 'Hora (incidencia)',
        cell: ({ row }) => row.original.hora_incidencia ?? '-',
    },
    {
        accessorKey: 'detalle',
        header: 'Descripción',
        cell: ({ row }) => (
            <span className="block max-w-xs truncate">
                {row.original.detalle ?? '-'}
            </span>
        ),
    },
    {
        id: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
            const { value, label } = row.original.estado;
            const isEnviado = value === 'enviado';

            return (
                <Badge
                    className={
                        isEnviado
                            ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                            : 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                    }
                    variant="outline"
                >
                    {label}
                </Badge>
            );
        },
    },
];
