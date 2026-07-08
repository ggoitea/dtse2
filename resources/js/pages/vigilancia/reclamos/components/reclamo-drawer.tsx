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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/vigilancia/reclamos';

interface ReclamoDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ReclamoDrawer({ open, onOpenChange }: ReclamoDrawerProps) {
    const [processing, setProcessing] = useState(false);
    const { data, setData, post, errors, setError, clearErrors, reset } =
        useForm({
            fecha_suceso: '',
            detalle: '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setProcessing(true);

        post(store().url, {
            onError: (errs) => {
                setError(errs as Record<string, string>);
                setProcessing(false);
            },
            onSuccess: () => {
                toast.success('Reclamo enviado con éxito');
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
                        <DrawerTitle>Nuevo reclamo</DrawerTitle>
                        <DrawerDescription>
                            Complete los datos para registrar un nuevo reclamo.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="overflow-y-auto px-4 pb-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    Fecha del suceso{' '}
                                    <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Input
                                    type="datetime-local"
                                    value={data.fecha_suceso}
                                    onChange={(e) =>
                                        setData('fecha_suceso', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.fecha_suceso} />
                            </Field>

                            <Field>
                                <FieldLabel>
                                    Detalles del reclamo{' '}
                                    <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Textarea
                                    value={data.detalle}
                                    onChange={(e) =>
                                        setData('detalle', e.target.value)
                                    }
                                    placeholder="Describa el inconveniente..."
                                    rows={5}
                                    required
                                />
                                <InputError message={errors.detalle} />
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
                            {processing ? 'Enviando...' : 'Enviar reclamo'}
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
