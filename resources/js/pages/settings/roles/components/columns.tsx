import type { ColumnDef } from '@tanstack/react-table';
import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { Role } from '@/types';

import { RoleRowActions } from './role-row-actions';

export const columns: ColumnDef<Role>[] = [
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => <RoleRowActions row={row} />,
    },
    {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => (
            <span className="font-medium capitalize">{row.original.name}</span>
        ),
    },
    {
        accessorKey: 'users_count',
        header: 'Usuarios',
        cell: ({ row }) => (
            <Badge variant="secondary">{row.original.users_count ?? 0}</Badge>
        ),
    },
    {
        accessorKey: 'permissions_count',
        header: 'Permisos',
        cell: ({ row }) => (
            <Badge variant="secondary">
                {row.original.permissions_count ?? 0}
            </Badge>
        ),
    },
    {
        accessorKey: 'default_empleado',
        header: 'Por defecto',
        cell: ({ row }) =>
            row.original.default_empleado ? (
                <div className="flex items-center justify-center gap-1">
                    <Check className="text-green-500" />
                </div>
            ) : (
                ''
            ),
    },
];
