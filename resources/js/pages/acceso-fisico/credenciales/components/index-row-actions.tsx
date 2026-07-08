import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Ban, CheckCircle, Eye, MoreVertical, Trash2 } from 'lucide-react';

import { ConfirmActionDialog } from '@/components/confirm-action-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { activar, destroy, suspender } from '@/routes/credenciales';

import type { Credencial } from '../types/credencial';
import VerCredencialDrawer from './ver-credencial-drawer';

interface Props {
    credencial: Credencial;
}

export default function IndexRowActions({ credencial }: Props) {
    const [verOpen, setVerOpen] = useState(false);
    const [eliminarOpen, setEliminarOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleActivar = () => {
        router.post(activar(credencial.id).url);
    };

    const handleSuspender = () => {
        router.post(suspender(credencial.id).url);
    };

    const handleEliminar = () => {
        setProcessing(true);
        router.delete(destroy(credencial.id).url, {
            onSuccess: () => setEliminarOpen(false),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <div className="flex items-center justify-end gap-4">
            <Button onClick={() => setVerOpen(true)}>
                <Eye />
                Ver credencial
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <MoreVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        {credencial.can.activar && (
                            <DropdownMenuItem onClick={handleActivar}>
                                <CheckCircle />
                                Activar
                            </DropdownMenuItem>
                        )}

                        {credencial.can.suspender && (
                            <DropdownMenuItem onClick={handleSuspender}>
                                <Ban />
                                Suspender
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setEliminarOpen(true)}
                        >
                            <Trash2 />
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <VerCredencialDrawer
                credencial={credencial}
                open={verOpen}
                onOpenChange={setVerOpen}
            />

            <ConfirmActionDialog
                open={eliminarOpen}
                onOpenChange={setEliminarOpen}
                title="Eliminar credencial"
                description={
                    <>
                        ¿Estás seguro de que deseas eliminar la credencial de{' '}
                        <span className="font-medium text-foreground">
                            {credencial.nombre ?? credencial.tipo.label}
                        </span>
                        ? Esta acción no se puede deshacer.
                    </>
                }
                processing={processing}
                onConfirm={handleEliminar}
                confirmLabel="Eliminar"
            />
        </div>
    );
}
