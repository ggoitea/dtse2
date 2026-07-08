import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { Acceso } from '../types/acceso';

export const columns: ColumnDef<Acceso>[] = [
    {
        accessorKey: 'fecha',
        header: 'Fecha',
        cell: ({ row }) => row.original.fecha ?? '-',
    },
    {
        accessorKey: 'hora',
        header: 'Hora',
        cell: ({ row }) => row.original.hora ?? '-',
    },
    {
        id: 'movimiento',
        header: 'Movimiento',
        cell: ({ row }) => {
            const { value, label } = row.original.movimiento;
            const isIngreso = value === 'ingreso';

            return (
                <Badge
                    className={
                        isIngreso
                            ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                            : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                    }
                    variant="outline"
                >
                    {label}
                </Badge>
            );
        },
    },
    {
        id: 'tipo',
        header: 'Tipo',
        cell: ({ row }) => (
            <Badge variant="secondary">{row.original.tipo.label}</Badge>
        ),
    },
    {
        accessorKey: 'nombre',
        header: 'Nombre y Apellido',
        cell: ({ row }) => row.original.nombre ?? '-',
    },
    {
        accessorKey: 'dni',
        header: 'DNI',
        cell: ({ row }) => row.original.dni ?? '-',
    },
    {
        id: 'propiedad',
        header: 'Lote/Manzana',
        cell: ({ row }) => {
            const { lote, manzana } = row.original.propiedad;

            return `L${lote} M${manzana}`;
        },
    },
    {
        id: 'guardia',
        header: 'Guardia',
        accessorFn: (row) => row.guardia.nombre,
    },
    {
        id: 'documento_tipo',
        header: 'Acreditación',
        cell: ({ row }) => row.original.documento_tipo.label,
    },
    {
        accessorKey: 'observacion',
        header: 'Observación',
        cell: ({ row }) => (
            <span className="block max-w-xs truncate">
                {row.original.observacion ?? '-'}
            </span>
        ),
    },
];
