import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import type { Row } from '@tanstack/react-table';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePermissions } from '@/hooks/use-permissions';
import { edit } from '@/routes/settings/users';
import type { User } from '@/types';

import { DeleteUserDialog } from './delete-user-dialog';

interface Props {
    row: Row<User>;
}

export function UserRowActions({ row }: Props) {
    const user = row.original;
    const { can } = usePermissions();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { auth } = usePage().props;

    const canEdit = can('users.edit');
    const canDelete = can('users.delete');
    const isCurrentUser = auth.user.id === user.id;
    const isOwner = user.roles?.some((role) => role.name === 'owner');

    if (!can('users.view') && !canEdit && !canDelete) {
        return null;
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {can('users.view') && (
                        <DropdownMenuItem asChild>
                            <Link
                            // href={show(user.id).url}
                            >
                                <Eye className="mr-2 size-4" />
                                Ver legajo
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {canEdit && (
                        <DropdownMenuItem asChild>
                            <Link href={edit.url(user.id)}>
                                <Pencil className="mr-2 size-4" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {(can('users.view') || canEdit) && canDelete && (
                        <DropdownMenuSeparator />
                    )}
                    {canDelete && (
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isCurrentUser || isOwner}
                        >
                            <Trash2 className="mr-2 size-4" />
                            Eliminar
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteUserDialog
                user={user}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            />
        </>
    );
}
