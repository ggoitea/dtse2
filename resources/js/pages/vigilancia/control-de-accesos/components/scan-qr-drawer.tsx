import { useCallback, useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import type { IScannerControls } from '@zxing/browser';
import { BrowserQRCodeReader } from '@zxing/browser';
import {
    AlertCircle,
    Camera,
    CheckCircle2,
    LogIn,
    QrCode,
    X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
import { ingresar, validarQr } from '@/routes/vigilancia/control-de-accesos';

import type {
    CredencialAcceso,
    ValidarQrResponse,
} from '../types/control-acceso';

type Estado =
    | { tipo: 'idle' }
    | { tipo: 'escaneando' }
    | { tipo: 'validando' }
    | { tipo: 'valido'; credencial: CredencialAcceso }
    | { tipo: 'invalido'; mensaje: string; credencial?: CredencialAcceso }
    | { tipo: 'registrando' };

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ScanQrDrawer({ open, onOpenChange }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsRef = useRef<IScannerControls | null>(null);
    const readerRef = useRef<BrowserQRCodeReader | null>(null);
    const [estado, setEstado] = useState<Estado>({ tipo: 'idle' });
    const [camaraError, setCamaraError] = useState<string | null>(null);

    const detenerEscaner = useCallback(() => {
        controlsRef.current?.stop();
        controlsRef.current = null;
    }, []);

    const iniciarEscaner = useCallback(async () => {
        setCamaraError(null);
        setEstado({ tipo: 'escaneando' });

        try {
            if (!readerRef.current) {
                readerRef.current = new BrowserQRCodeReader();
            }

            const devices = await BrowserQRCodeReader.listVideoInputDevices();

            if (devices.length === 0) {
                setCamaraError(
                    'No se encontró ninguna cámara en este dispositivo.',
                );
                setEstado({ tipo: 'idle' });

                return;
            }

            const deviceId = devices[devices.length - 1].deviceId;

            if (!videoRef.current) {
                return;
            }

            controlsRef.current = await readerRef.current.decodeFromVideoDevice(
                deviceId,
                videoRef.current,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                async (result, error) => {
                    if (!result || controlsRef.current === null) {
                        return;
                    }

                    const codigoQr = result.getText();
                    detenerEscaner();
                    setEstado({ tipo: 'validando' });

                    try {
                        const response = await fetch(validarQr().url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN':
                                    document
                                        .querySelector(
                                            'meta[name="csrf-token"]',
                                        )
                                        ?.getAttribute('content') ?? '',
                            },
                            body: JSON.stringify({ codigo_qr: codigoQr }),
                        });

                        const data: ValidarQrResponse = await response.json();

                        if (data.valido && data.credencial) {
                            setEstado({
                                tipo: 'valido',
                                credencial: data.credencial,
                            });
                        } else {
                            setEstado({
                                tipo: 'invalido',
                                mensaje:
                                    data.mensaje ??
                                    'El código QR no es válido.',
                                credencial: data.credencial,
                            });
                        }
                    } catch {
                        setEstado({
                            tipo: 'invalido',
                            mensaje:
                                'No se pudo validar el código QR. Intentá de nuevo.',
                        });
                    }
                },
            );
        } catch (err) {
            const mensaje =
                err instanceof Error && err.name === 'NotAllowedError'
                    ? 'Se denegó el acceso a la cámara. Habilitá los permisos en tu navegador.'
                    : 'No se pudo iniciar la cámara. Verificá los permisos.';
            setCamaraError(mensaje);
            setEstado({ tipo: 'idle' });
        }
    }, [detenerEscaner]);

    const handleIngresar = useCallback(
        (credencial: CredencialAcceso) => {
            setEstado({ tipo: 'registrando' });
            router.post(
                ingresar(credencial.id).url,
                {},
                {
                    onSuccess: () => {
                        toast.success('Ingreso registrado correctamente.');
                        onOpenChange(false);
                    },
                    onError: () => {
                        setEstado({ tipo: 'valido', credencial });
                        toast.error(
                            'No se pudo registrar el ingreso. Intentá de nuevo.',
                        );
                    },
                },
            );
        },
        [onOpenChange],
    );

    const reiniciarEscaneo = () => {
        // setEstado({ tipo: 'escaneando' });
        iniciarEscaner();
        setCamaraError(null);
    };

    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            if (!nextOpen) {
                detenerEscaner();
                setEstado({ tipo: 'idle' });
                setCamaraError(null);
            } else {
                iniciarEscaner();
            }

            onOpenChange(nextOpen);
        },
        [detenerEscaner, onOpenChange, iniciarEscaner],
    );

    useEffect(() => {
        if (!open) {
            return;
        }

        const id = window.setTimeout(() => {
            iniciarEscaner();
        }, 0);

        return () => {
            window.clearTimeout(id);
        };
    }, [open, iniciarEscaner]);

    const isEscaneando = estado.tipo === 'escaneando';
    const isValidando = estado.tipo === 'validando';
    const isRegistrando = estado.tipo === 'registrando';
    const mostrarVideo = isEscaneando || isValidando;

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-2">
                        <QrCode className="size-5" />
                        Escanear credencial QR
                    </DrawerTitle>
                    <DrawerDescription>
                        Apuntá la cámara al código QR de la credencial para
                        registrar el ingreso.
                    </DrawerDescription>
                </DrawerHeader>

                <div className="space-y-4 px-4 pb-4">
                    {/* Visor de cámara */}
                    <div
                        className={
                            mostrarVideo
                                ? 'relative overflow-hidden rounded-xl border border-border bg-black'
                                : 'hidden'
                        }
                    >
                        <video
                            ref={videoRef}
                            className="w-full"
                            style={{ aspectRatio: '4/3', objectFit: 'cover' }}
                        />
                        {isValidando && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                <div className="text-center text-white">
                                    <div className="mb-2 text-sm font-medium">
                                        Validando QR...
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Estado: idle / error de cámara */}
                    {estado.tipo === 'idle' && (
                        <div className="flex flex-col items-center gap-4 py-4">
                            {camaraError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="size-4" />
                                    <AlertDescription>
                                        {camaraError}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <Button onClick={iniciarEscaner} className="gap-2">
                                <Camera className="size-4" />
                                Habilitar cámara
                            </Button>
                        </div>
                    )}

                    {/* Estado: QR válido */}
                    {estado.tipo === 'valido' && (
                        <div className="space-y-3 rounded-xl border border-green-500/30 bg-green-500/5 p-4">
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="size-4 shrink-0" />
                                <span className="font-medium">
                                    Credencial válida
                                </span>
                            </div>
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Nombre
                                    </span>
                                    <span className="font-medium">
                                        {estado.credencial.nombre ?? '—'}
                                    </span>
                                </div>
                                {estado.credencial.dni && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            DNI
                                        </span>
                                        <span>{estado.credencial.dni}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        Tipo
                                    </span>
                                    <Badge variant="secondary">
                                        {estado.credencial.tipo.label}
                                    </Badge>
                                </div>
                                {estado.credencial.vehiculo && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Vehículo
                                        </span>
                                        <span className="font-medium">
                                            {estado.credencial.vehiculo.tipo ??
                                                '—'}
                                        </span>
                                    </div>
                                )}
                                {estado.credencial.vehiculo?.patente && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Patente
                                        </span>
                                        <span className="font-medium">
                                            {estado.credencial.vehiculo.patente}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Estado: QR inválido o credencial suspendida/vencida */}
                    {estado.tipo === 'invalido' && (
                        <div className="space-y-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                            <div className="flex items-center gap-2 text-destructive">
                                <AlertCircle className="size-4 shrink-0" />
                                <span className="font-medium">
                                    QR no válido
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {estado.mensaje}
                            </p>
                            {estado.credencial && (
                                <div className="space-y-1 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">
                                            Credencial:{' '}
                                        </span>
                                        <span className="font-medium">
                                            {estado.credencial.nombre ??
                                                estado.credencial.tipo.label}
                                        </span>
                                        {' · '}
                                        <Badge variant="secondary">
                                            {estado.credencial.estado.label}
                                        </Badge>
                                    </div>
                                    {estado.credencial.vehiculo && (
                                        <div className="text-sm text-muted-foreground">
                                            <span className="mr-1">
                                                Vehículo:
                                            </span>
                                            <span className="mr-2 font-medium">
                                                {estado.credencial.vehiculo
                                                    .tipo ?? '—'}
                                            </span>
                                            {estado.credencial.vehiculo
                                                .patente && (
                                                <span className="font-medium">
                                                    Patente:{' '}
                                                    {
                                                        estado.credencial
                                                            .vehiculo.patente
                                                    }
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DrawerFooter>
                    {estado.tipo === 'valido' && (
                        <Button
                            onClick={() => handleIngresar(estado.credencial)}
                            disabled={isRegistrando}
                        >
                            <LogIn className="size-4" />
                            {isRegistrando
                                ? 'Registrando...'
                                : 'Confirmar ingreso'}
                        </Button>
                    )}

                    {(estado.tipo === 'invalido' || estado.tipo === 'idle') &&
                        !isEscaneando && (
                            <Button
                                variant="outline"
                                onClick={reiniciarEscaneo}
                            >
                                <X className="size-4" />
                                {estado.tipo === 'invalido'
                                    ? 'Escanear otro QR'
                                    : 'Reintentar'}
                            </Button>
                        )}

                    <DrawerClose asChild>
                        <Button variant="ghost">Cerrar</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
