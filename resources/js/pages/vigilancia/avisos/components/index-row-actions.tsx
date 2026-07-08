import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Eye, LogIn, MoreVertical, Trash2 } from 'lucide-react';

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
import { usePermissions } from '@/hooks/use-permissions';
import { destroy } from '@/routes/vigilancia/avisos';

import type { Aviso } from '../types/aviso';
import { AvisoIngresoDrawer } from './aviso-ingreso-drawer';
import { AvisoObservacionDrawer } from './aviso-observacion-drawer';

interface Props {
    aviso: Aviso;
}

export default function IndexRowActions({ aviso }: Props) {
    const [ingresoOpen, setIngresoOpen] = useState(false);
    const [eliminarOpen, setEliminarOpen] = useState(false);
    const [observacionOpen, setObservacionOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const { hasRole } = usePermissions();

    const hasObservacion = !!(aviso.observacion || aviso.recepcion_observacion);

    const handleEliminar = () => {
        setProcessing(true);
        router.delete(destroy(aviso.id).url, {
            onSuccess: () => setEliminarOpen(false),
            onFinish: () => setProcessing(false),
        });
    };

    const can_informar_ingreso =
        hasRole('security') && !aviso.has_marcado_ingreso;
    const can_eliminar = hasRole('propietario') && !aviso.has_marcado_ingreso;

    return (
        <div className="flex flex-row items-center justify-end gap-2">
            {hasObservacion && (
                <Button onClick={() => setObservacionOpen(true)}>
                    <Eye />
                    Ver observación
                </Button>
            )}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                        <MoreVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    {can_informar_ingreso && (
                        <>
                            {hasObservacion && <DropdownMenuSeparator />}
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    onClick={() => setIngresoOpen(true)}
                                >
                                    <LogIn />
                                    Informar ingreso
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}

                    {can_eliminar && (
                        <>
                            {can_informar_ingreso && <DropdownMenuSeparator />}
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => setEliminarOpen(true)}
                                >
                                    <Trash2 />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AvisoObservacionDrawer
                open={observacionOpen}
                onOpenChange={setObservacionOpen}
                aviso={aviso}
            />

            <AvisoIngresoDrawer
                open={ingresoOpen}
                onOpenChange={setIngresoOpen}
                aviso={aviso}
            />

            <ConfirmActionDialog
                open={eliminarOpen}
                onOpenChange={setEliminarOpen}
                title="Eliminar aviso"
                description={
                    <>
                        ¿Estás seguro de que deseas eliminar este aviso de tipo{' '}
                        <span className="font-medium text-foreground">
                            {aviso.tipo.label}
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
