import { useState } from 'react';
import { Link } from '@inertiajs/react';
import type { Row } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePermissions } from '@/hooks/use-permissions';
import { edit } from '@/routes/settings/roles';
import type { Role } from '@/types';

import { DeleteRoleDialog } from './delete-role-dialog';

interface Props {
    row: Row<Role>;
}

export function RoleRowActions({ row }: Props) {
    const role = row.original;
    const { can } = usePermissions();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const canEdit = can('roles.edit');
    const canDelete = can('roles.delete');

    if (!canEdit && !canDelete) {
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
                    {canEdit && (
                        <DropdownMenuItem asChild>
                            <Link href={edit.url(role.id)}>
                                <Pencil className="mr-2 size-4" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {canEdit && canDelete && <DropdownMenuSeparator />}
                    {canDelete && (
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={(role.users_count ?? 0) > 0}
                        >
                            <Trash2 className="mr-2 size-4" />
                            Eliminar
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteRoleDialog
                role={role}
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            />
        </>
    );
}
