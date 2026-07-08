import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

import { ConfirmActionDialog } from '@/components/confirm-action-dialog';
import { destroy } from '@/routes/settings/users';
import type { SharedData, User } from '@/types';

interface Props {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({ user, open, onOpenChange }: Props) {
    const [processing, setProcessing] = useState(false);
    const { auth } = usePage<SharedData>().props;

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleDelete = () => {
        setProcessing(true);
        router.delete(destroy.url(user.id), {
            onSuccess: handleClose,
            onFinish: () => setProcessing(false),
        });
    };

    const isCurrentUser = auth.user.id === user.id;
    const isOwner = user.roles?.some((role) => role.name === 'owner');
    const canDelete = !isCurrentUser && !isOwner;

    return (
        <ConfirmActionDialog
            open={open}
            onOpenChange={handleClose}
            title="Eliminar Usuario"
            description={
                isCurrentUser ? (
                    <>No puedes eliminarte a ti mismo.</>
                ) : isOwner ? (
                    <>
                        No se puede eliminar a{' '}
                        <span className="font-medium text-foreground">
                            {user.name}
                        </span>{' '}
                        porque tiene el rol de propietario.
                    </>
                ) : (
                    <>
                        ¿Estas seguro de que deseas eliminar al usuario{' '}
                        <span className="font-medium text-foreground">
                            {user.name}
                        </span>
                        ? Esta accion no se puede deshacer.
                    </>
                )
            }
            processing={processing}
            onConfirm={handleDelete}
            confirmLabel="Eliminar"
            showConfirmAction={canDelete}
        />
    );
}
