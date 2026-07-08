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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/vigilancia/avisos';

interface OpcionEnum {
    value: string;
    label: string;
}

interface AvisoDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tipoOpciones: OpcionEnum[];
}

export function AvisoDrawer({
    open,
    onOpenChange,
    tipoOpciones,
}: AvisoDrawerProps) {
    const [processing, setProcessing] = useState(false);
    const { data, setData, post, errors, setError, clearErrors, reset } =
        useForm({
            tipo: '',
            observacion: '',
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
                toast.success('Aviso enviado a la guardia');
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
                        <DrawerTitle>Nuevo aviso</DrawerTitle>
                        <DrawerDescription>
                            Complete los datos para notificar a la guardia.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="overflow-y-auto px-4 pb-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    Tipo de aviso{' '}
                                    <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Select
                                    value={data.tipo}
                                    onValueChange={(val) =>
                                        setData('tipo', val)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un tipo..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tipoOpciones.map((opcion) => (
                                            <SelectItem
                                                key={opcion.value}
                                                value={opcion.value}
                                            >
                                                {opcion.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.tipo} />
                            </Field>

                            <Field>
                                <FieldLabel>
                                    Observación para la guardia (opcional)
                                </FieldLabel>
                                <Textarea
                                    value={data.observacion}
                                    onChange={(e) =>
                                        setData('observacion', e.target.value)
                                    }
                                    placeholder="Ej. Ingrese detalles que considere importantes..."
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
                            {processing ? 'Enviando...' : 'Notificar a guardia'}
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
