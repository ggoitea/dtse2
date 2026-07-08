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
import { responder } from '@/routes/vigilancia/reclamos';

import type { Reclamo } from '../types/reclamo';

interface ReclamoRespuestaDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    reclamo: Reclamo;
}

export function ReclamoRespuestaDrawer({
    open,
    onOpenChange,
    reclamo,
}: ReclamoRespuestaDrawerProps) {
    const [processing, setProcessing] = useState(false);
    const { data, setData, post, errors, setError, clearErrors, reset } =
        useForm({
            respuesta: '',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setProcessing(true);

        post(responder(reclamo.id).url, {
            onError: (errs) => {
                setError(errs as Record<string, string>);
                setProcessing(false);
            },
            onSuccess: () => {
                toast.success('Respuesta enviada con éxito');
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
                        <DrawerTitle>Dar una respuesta</DrawerTitle>
                        <DrawerDescription>
                            Reclamo de{' '}
                            <span className="font-medium text-foreground">
                                {reclamo.persona.nombre}
                            </span>{' '}
                            — L{reclamo.propiedad.lote} M
                            {reclamo.propiedad.manzana}
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="overflow-y-auto px-4 pb-4">
                        {reclamo.detalle && (
                            <div className="mb-4 rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">
                                <p className="mb-1 font-medium text-foreground">
                                    Reclamo original:
                                </p>
                                <p>{reclamo.detalle}</p>
                            </div>
                        )}

                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    Respuesta{' '}
                                    <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Textarea
                                    value={data.respuesta}
                                    onChange={(e) =>
                                        setData('respuesta', e.target.value)
                                    }
                                    placeholder="Escriba su respuesta..."
                                    rows={5}
                                    required
                                />
                                <InputError message={errors.respuesta} />
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
                            {processing ? 'Enviando...' : 'Enviar respuesta'}
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
