import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';

import type { Credencial } from '../types/credencial';
import IndexRowActions from './index-row-actions';

export const columns: ColumnDef<Credencial>[] = [
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => <IndexRowActions credencial={row.original} />,
    },
    {
        id: 'tipo',
        header: 'Tipo',
        cell: ({ row }) => (
            <Badge variant="secondary">{row.original.tipo.label}</Badge>
        ),
    },
    {
        id: 'nombre',
        header: 'Nombre',
        accessorFn: (row) => row.nombre ?? '—',
    },
    {
        id: 'dni',
        header: 'DNI',
        accessorFn: (row) => row.dni ?? '—',
    },
    {
        id: 'transporte',
        header: 'Transporte',
        cell: ({ row }) => {
            const v = row.original.vehiculo;

            if (!v || (!v.tipo && !v.patente)) {
                return '—';
            }

            return [v.tipo, v.patente].filter(Boolean).join(' · ');
        },
    },
    {
        id: 'estado',
        header: 'Estado',
        cell: ({ row }) => {
            const activa = row.original.estado.value === 'activa';

            return (
                <Badge
                    variant={activa ? 'default' : 'secondary'}
                    className={
                        activa
                            ? 'bg-green-500/15 text-green-700 hover:bg-green-500/20 dark:bg-green-500/20 dark:text-green-400'
                            : 'bg-red-500/10 text-red-600 hover:bg-red-500/15 dark:bg-red-500/20 dark:text-red-400'
                    }
                >
                    {row.original.estado.label}
                </Badge>
            );
        },
    },
];
