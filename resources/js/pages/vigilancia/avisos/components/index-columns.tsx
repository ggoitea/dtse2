import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { Aviso } from '../types/aviso';
import IndexRowActions from './index-row-actions';

export const columns: ColumnDef<Aviso>[] = [
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => <IndexRowActions aviso={row.original} />,
    },
    {
        id: 'tipo',
        header: 'Tipo',
        cell: ({ row }) => (
            <Badge variant="secondary">{row.original.tipo.label}</Badge>
        ),
    },
    {
        id: 'domicilio',
        header: 'Domicilio',
        cell: ({ row }) => {
            const { lote, manzana } = row.original.domicilio;

            return `L${lote} M${manzana}`;
        },
    },
    {
        id: 'propietario',
        header: 'Propietario',
        cell: ({ row }) => row.original.propietario ?? '-',
    },
    {
        id: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
            const isPendiente = row.original.estado === 'pendiente';

            return (
                <Badge
                    className={
                        isPendiente
                            ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                            : 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400'
                    }
                    variant="outline"
                >
                    {isPendiente ? 'Pendiente' : 'Ingreso'}
                </Badge>
            );
        },
    },
    {
        id: 'fecha',
        header: 'Fecha',
        cell: ({ row }) => row.original.fecha,
    },
];
