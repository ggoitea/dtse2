import { useState } from 'react';
import { router } from '@inertiajs/react';

import { ConfirmActionDialog } from '@/components/confirm-action-dialog';
import { destroy } from '@/routes/settings/roles';
import type { Role } from '@/types';

interface Props {
    role: Role;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteRoleDialog({ role, open, onOpenChange }: Props) {
    const [processing, setProcessing] = useState(false);

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleDelete = () => {
        setProcessing(true);
        router.delete(destroy.url(role.id), {
            onSuccess: handleClose,
            onFinish: () => setProcessing(false),
        });
    };

    const hasUsers = (role.users_count ?? 0) > 0;

    return (
        <ConfirmActionDialog
            open={open}
            onOpenChange={handleClose}
            title="Eliminar Rol"
            description={
                hasUsers ? (
                    <>
                        No se puede eliminar el rol{' '}
                        <span className="font-medium text-foreground capitalize">
                            {role.name}
                        </span>{' '}
                        porque tiene {role.users_count} usuario(s) asignado(s).
                        Reasigna los usuarios a otro rol antes de eliminar este.
                    </>
                ) : (
                    <>
                        ¿Estas seguro de que deseas eliminar el rol{' '}
                        <span className="font-medium text-foreground capitalize">
                            {role.name}
                        </span>
                        ? Esta accion no se puede deshacer.
                    </>
                )
            }
            processing={processing}
            onConfirm={handleDelete}
            confirmLabel="Eliminar"
            showConfirmAction={!hasUsers}
        />
    );
}
