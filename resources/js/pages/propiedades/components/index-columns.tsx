import type { ColumnDef } from '@tanstack/react-table';

import type { Propiedad } from '../types/propiedad';
import IndexRowActions from './index-row-actions';

export const columns: ColumnDef<Propiedad>[] = [
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => <IndexRowActions propiedad={row.original} />,
    },
    {
        accessorKey: 'lote',
        header: 'Lote',
    },
    {
        accessorKey: 'manzana',
        header: 'Manzana',
    },
    {
        accessorKey: 'descripcion',
        header: 'Descripción',
    },
    {
        header: 'Titular',
        accessorFn: (row) => row.propietario?.nombre ?? '-',
    },
    {
        header: 'DNI',
        accessorFn: (row) => row.propietario?.dni ?? '-',
    },
    {
        id: 'Teléfono',
        header: 'Tél. principal',
        accessorFn: (row) => row.propietario?.telefono ?? '-',
    },
    {
        id: 'secundario_telefono',
        header: 'Tél. alternativo',
        accessorFn: (row) => row.propietario?.secundario_telefono ?? '-',
    },
];
