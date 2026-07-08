import type { ColumnDef } from '@tanstack/react-table';

import type { User } from '@/types';

import IndexRowActions from './index-row-actions';

export const columns: ColumnDef<User>[] = [
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <IndexRowActions usuario={row.original} />,
    },
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
];
