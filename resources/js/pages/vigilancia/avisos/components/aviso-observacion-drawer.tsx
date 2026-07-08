import { MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';

import type { Aviso } from '../types/aviso';

interface AvisoObservacionDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    aviso: Aviso;
}

export function AvisoObservacionDrawer({
    open,
    onOpenChange,
    aviso,
}: AvisoObservacionDrawerProps) {
    const tieneAlguna = aviso.observacion || aviso.recepcion_observacion;

    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            direction="bottom"
            dismissible
        >
            <DrawerContent className="w-full! overflow-x-hidden overflow-y-auto sm:max-w-md">
                <DrawerHeader>
                    <DrawerTitle>Observaciones</DrawerTitle>
                    <DrawerDescription>
                        Aviso de tipo{' '}
                        <span className="font-medium text-foreground">
                            {aviso.tipo.label}
                        </span>{' '}
                        — Manzana {aviso.domicilio.manzana} Lote{' '}
                        {aviso.domicilio.lote}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-4 px-4 pb-4">
                    {!tieneAlguna && (
                        <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
                            <MessageSquare className="h-8 w-8 opacity-40" />
                            <p className="text-sm">
                                No hay observaciones registradas para este
                                aviso.
                            </p>
                        </div>
                    )}

                    {aviso.observacion && (
                        <div className="rounded-lg border border-border p-4">
                            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                Observación del residente
                            </p>
                            <p className="text-sm">{aviso.observacion}</p>
                        </div>
                    )}

                    {aviso.recepcion_observacion && (
                        <div className="rounded-lg border border-border p-4">
                            <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                Observación de recepción
                            </p>
                            <p className="text-sm">
                                {aviso.recepcion_observacion}
                            </p>
                        </div>
                    )}
                </div>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cerrar
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
