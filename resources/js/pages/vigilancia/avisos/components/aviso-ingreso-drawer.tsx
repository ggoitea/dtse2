import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { ingreso } from '@/routes/vigilancia/avisos';

import type { Aviso } from '../types/aviso';

interface AvisoIngresoDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    aviso: Aviso;
}

export function AvisoIngresoDrawer({
    open,
    onOpenChange,
    aviso,
}: AvisoIngresoDrawerProps) {
    const [processing, setProcessing] = useState(false);
    const { data, setData, post, errors, setError, clearErrors, reset } =
        useForm({
            observacion: '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setProcessing(true);

        post(ingreso(aviso.id).url, {
            onError: (errs) => {
                setError(errs as Record<string, string>);
                setProcessing(false);
            },
            onSuccess: () => {
                toast.success('Ingreso confirmado');
                setProcessing(false);
                reset();
                onOpenChange(false);
            },
        });
    };

    useEffect(() => {
        if (!open) {
            reset();
            clearErrors();
        }
    }, [open, reset, clearErrors]);

    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            direction="right"
            dismissible={false}
        >
            <DrawerContent className="w-full! overflow-x-hidden overflow-y-auto sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DrawerHeader>
                        <DrawerTitle>Confirmar ingreso</DrawerTitle>
                        <DrawerDescription>
                            Aviso de tipo{' '}
                            <span className="font-medium text-foreground">
                                {aviso.tipo.label}
                            </span>{' '}
                            — L{aviso.domicilio.lote} M{aviso.domicilio.manzana}
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="overflow-y-auto px-4 pb-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    Observaciones del guardia (opcional)
                                </FieldLabel>
                                <Textarea
                                    value={data.observacion}
                                    onChange={(e) =>
                                        setData('observacion', e.target.value)
                                    }
                                    placeholder="Ej. Persona identificada, placa del vehículo..."
                                    rows={4}
                                />
                                <InputError message={errors.observacion} />
                            </Field>
                        </FieldGroup>
                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancelar
                            </Button>
                        </DrawerClose>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Confirmando...'
                                : 'Confirmar ingreso'}
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
