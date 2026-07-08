import { useState } from 'react';
import { router } from '@inertiajs/react';
import { MessageCircle, MoreVertical, Trash2 } from 'lucide-react';

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
import { destroy } from '@/routes/vigilancia/reclamos';

import type { Reclamo } from '../types/reclamo';
import { ReclamoRespuestaDrawer } from './reclamo-respuesta-drawer';

interface Props {
    reclamo: Reclamo;
}

export default function IndexRowActions({ reclamo }: Props) {
    const [respuestaOpen, setRespuestaOpen] = useState(false);
    const [eliminarOpen, setEliminarOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleEliminar = () => {
        setProcessing(true);
        router.delete(destroy(reclamo.id).url, {
            onSuccess: () => setEliminarOpen(false),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <MoreVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() => setRespuestaOpen(true)}
                        >
                            <MessageCircle />
                            Dar una respuesta
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    {reclamo.can_be_eliminar && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => setEliminarOpen(true)}
                                >
                                    <Trash2 />
                                    Eliminar reclamo
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <ReclamoRespuestaDrawer
                open={respuestaOpen}
                onOpenChange={setRespuestaOpen}
                reclamo={reclamo}
            />

            <ConfirmActionDialog
                open={eliminarOpen}
                onOpenChange={setEliminarOpen}
                title="Eliminar reclamo"
                description={
                    <>
                        ¿Estás seguro de que deseas eliminar el reclamo de{' '}
                        <span className="font-medium text-foreground">
                            {reclamo.persona.nombre}
                        </span>
                        ? Esta acción no se puede deshacer.
                    </>
                }
                processing={processing}
                onConfirm={handleEliminar}
                confirmLabel="Eliminar"
            />
        </>
    );
}
