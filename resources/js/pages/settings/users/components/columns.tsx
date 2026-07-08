import { Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { show } from '@/routes/settings/users';
import type { User } from '@/types';

import { UserRowActions } from './user-row-actions';

export const columns: ColumnDef<User>[] = [
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 p-0"
                    asChild
                >
                    <Link
                    // href={show(row.original.id).url}
                    >
                        <Eye className="size-4" />
                        <span className="sr-only">Ver legajo</span>
                    </Link>
                </Button>
                <UserRowActions row={row} />
            </div>
        ),
    },
    {
        accessorKey: 'name',
        header: 'Nombre',
        cell: ({ row }) => (
            <Link
                // href={show(row.original.id).url}
                className="font-medium transition-colors hover:text-primary"
            >
                {row.original.name}
            </Link>
        ),
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
            <span className="text-muted-foreground">{row.original.email}</span>
        ),
    },
    {
        id: 'role',
        header: 'Rol',
        cell: ({ row }) => {
            const role = row.original.roles?.[0];

            return role ? (
                <Badge variant="secondary" className="capitalize">
                    {role.name}
                </Badge>
            ) : (
                <span className="text-muted-foreground">Sin rol</span>
            );
        },
    },
];
