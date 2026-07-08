import { Bike, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';

import type { Credencial } from '../types/credencial';

interface Props {
    credencial: Credencial | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function VerCredencialDrawer({
    credencial,
    open,
    onOpenChange,
}: Props) {
    if (!credencial) {
        return null;
    }

    const qrBase64 = `data:image/png;base64,${credencial.codigo_qr_base64}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(credencial.codigo_qr)}`;

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="right">
            <DrawerContent className="w-full! overflow-x-hidden overflow-y-auto border-0! bg-slate-100 sm:max-w-sm">
                <DrawerHeader className="px-0 pt-0">
                    <DrawerTitle>
                        <div className="relative h-24 bg-black/80">
                            <div className="absolute -bottom-30 left-1/2 -translate-x-1/2 rounded-2xl bg-white p-1 shadow-lg">
                                <div className="rounded-xl bg-slate-100 p-3">
                                    <img
                                        src={qrBase64}
                                        alt="Código QR de credencial"
                                        className="mx-auto w-88 rounded-lg border border-border"
                                    />
                                </div>
                            </div>
                        </div>
                    </DrawerTitle>
                </DrawerHeader>

                {/* <div className="flex flex-col items-center gap-4 px-6 py-4"> */}
                <div className="mt-30 flex flex-col items-center justify-center p-4">
                    <div className="mb-6 space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-800 capitalize">
                            {credencial.nombre ?? '—'}
                        </h2>
                        <p className="text-sm font-medium tracking-widest text-slate-500 uppercase">
                            {credencial.tipo.label}
                        </p>
                    </div>

                    {/* Grid de Datos Técnicos */}
                    <div className="mb-8 grid grid-cols-2 gap-4">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left">
                            <span className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                                DNI
                            </span>
                            <span className="text-sm font-semibold text-slate-700">
                                {credencial.dni ?? '—'}
                            </span>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left">
                            <span className="mb-1 block text-[10px] font-bold text-slate-400 uppercase">
                                Vence
                            </span>
                            <span className="text-sm font-semibold text-slate-700">
                                {credencial.vigente_hasta ?? 'Nunca'}
                            </span>
                        </div>
                    </div>

                    {/* Sección Vehículo */}
                    {credencial.vehiculo &&
                        (credencial.vehiculo.tipo ||
                            credencial.vehiculo.patente) && (
                            <div className="mb-8 flex items-center gap-4 rounded-2xl bg-slate-900 p-4 text-white shadow-md">
                                <div className="rounded-lg bg-slate-800 p-2">
                                    <Bike
                                        size={24}
                                        className="text-slate-300"
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="mb-1 text-[10px] leading-none font-bold text-slate-400 uppercase">
                                        Vehículo Registrado
                                    </p>
                                    <p className="font-semibold">
                                        {credencial.vehiculo.tipo}{' '}
                                        <span className="font-normal text-slate-400">
                                            |
                                        </span>{' '}
                                        {credencial.vehiculo.patente}
                                    </p>
                                </div>
                            </div>
                        )}
                </div>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border border-slate-800 text-black dark:border dark:border-slate-800"
                        >
                            Cerrar
                        </Button>
                    </DrawerClose>
                    <Button asChild>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <MessageCircle />
                            Compartir
                        </a>
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
