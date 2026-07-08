import { useState } from 'react';
import { router } from '@inertiajs/react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

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
import { destroy } from '@/routes/propiedades';

import type { Propiedad } from '../types/propiedad';
import { PropiedadDrawer } from './propiedad-drawer';

interface Props {
    propiedad: Propiedad;
}

export default function IndexRowActions({ propiedad }: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [eliminarOpen, setEliminarOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleEliminar = () => {
        setProcessing(true);
        router.delete(destroy(propiedad.id).url, {
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
                        <DropdownMenuItem onClick={() => setDrawerOpen(true)}>
                            <Pencil />
                            Editar
                        </DropdownMenuItem>
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

            <PropiedadDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                propiedad={propiedad}
            />

            <ConfirmActionDialog
                open={eliminarOpen}
                onOpenChange={setEliminarOpen}
                title="Eliminar propiedad"
                description={
                    <>
                        ¿Estás seguro de que deseas eliminar el lote{' '}
                        <span className="font-medium text-foreground">
                            {propiedad.lote} manzana {propiedad.manzana}
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
