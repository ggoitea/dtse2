import type { SubmitEvent } from 'react';
import { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import propiedades from '@/routes/propiedades';

import type { Propiedad } from '../types/propiedad';

const setDefaultData = (propiedad: Propiedad | null) => ({
    lote: propiedad?.lote || '',
    manzana: propiedad?.manzana || '',
    descripcion: propiedad?.descripcion || '',
    titular: propiedad?.propietario?.nombre || '',
    dni: propiedad?.propietario?.dni || '',
    telefono_nombre: propiedad?.propietario?.nombre || '',
    telefono: propiedad?.propietario?.telefono || '',
    alt_nombre: propiedad?.propietario?.secundario_nombre || '',
    alt_telefono: propiedad?.propietario?.secundario_telefono || '',
});

interface PropiedadDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    propiedad: Propiedad | null;
}

export function PropiedadDrawer({
    open,
    onOpenChange,
    propiedad = null,
}: PropiedadDrawerProps) {
    const [processing, setProcessing] = useState(false);
    const { data, setData, post, put, errors, setError, clearErrors, reset } =
        useForm(setDefaultData(propiedad));

    // Auto-fill telefono_nombre from titular
    useEffect(() => {
        setData('telefono_nombre', data.titular);
    }, [data.titular, setData]);

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        clearErrors();
        setProcessing(true);

        if (propiedad) {
            put(propiedades.update(propiedad.id).url, {
                onError: (errs) => {
                    setError(errs as Record<string, string>);
                    setProcessing(false);
                },
                onSuccess: () => {
                    setProcessing(false);
                    onOpenChange(false);
                },
            });

            return;
        }

        post(propiedades.store().url, {
            onError: (errs) => {
                setError(errs as Record<string, string>);
                setProcessing(false);
            },
            onSuccess: () => {
                toast.success('Propiedad creada con éxito');
                setProcessing(false);
                reset();
                onOpenChange(false);
            },
        });

        return;
    };

    // Reset form when drawer is closed
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
                        <DrawerTitle>Nueva propiedad</DrawerTitle>
                        <DrawerDescription>
                            Complete los datos para registrar una nueva
                            propiedad.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="overflow-y-auto px-4 pb-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel>
                                    Lote N°{' '}
                                    <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Input
                                    value={data.lote}
                                    onChange={(e) =>
                                        setData('lote', e.target.value)
                                    }
                                    placeholder="Ej: 12"
                                    required
                                />
                                <InputError message={errors.lote} />
                            </Field>

                            <Field>
                                <FieldLabel>
                                    Manzana{' '}
                                    <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Input
                                    value={data.manzana}
                                    onChange={(e) =>
                                        setData('manzana', e.target.value)
                                    }
                                    placeholder="Ej: A"
                                    required
                                />
                                <InputError message={errors.manzana} />
                            </Field>

                            <Field>
                                <FieldLabel>Descripción</FieldLabel>
                                <Textarea
                                    value={data.descripcion}
                                    onChange={(e) =>
                                        setData('descripcion', e.target.value)
                                    }
                                    placeholder="Descripción opcional..."
                                    rows={3}
                                />
                                <InputError message={errors.descripcion} />
                            </Field>

                            <Field>
                                <FieldLabel>
                                    Titular{' '}
                                    <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Input
                                    value={data.titular}
                                    onChange={(e) =>
                                        setData('titular', e.target.value)
                                    }
                                    placeholder="Nombre y apellido del titular"
                                    required
                                />
                                <InputError message={errors.titular} />
                            </Field>

                            <Field>
                                <FieldLabel>
                                    DNI <span className="text-red-500">*</span>
                                </FieldLabel>
                                <NumericFormat
                                    customInput={Input}
                                    decimalScale={0}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    value={data.dni}
                                    onValueChange={(e) =>
                                        setData('dni', e.value)
                                    }
                                    placeholder="7 u 8 dígitos"
                                    required
                                    minLength={9}
                                    maxLength={10}
                                />
                                <InputError message={errors.dni} />
                            </Field>
                        </FieldGroup>

                        <Separator className="my-4" />

                        <p className="mb-3 text-sm font-medium">
                            Dato de contacto
                        </p>

                        <FieldGroup>
                            {/* Teléfono principal */}
                            <p className="mb-2 text-xs text-muted-foreground">
                                Teléfono principal (notificaciones)
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Field>
                                    <FieldLabel>
                                        Nombre{' '}
                                        <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        value={data.telefono_nombre}
                                        disabled
                                        placeholder="Se autocompleta con Titular"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>
                                        Nro de teléfono{' '}
                                        <span className="text-red-500">*</span>
                                    </FieldLabel>
                                    <Input
                                        type="tel"
                                        value={data.telefono}
                                        onChange={(e) =>
                                            setData('telefono', e.target.value)
                                        }
                                        placeholder="Ej: 3512345678"
                                        required
                                    />
                                    <InputError message={errors.telefono} />
                                </Field>
                            </div>

                            {/* Teléfono alternativo */}
                            <p className="mt-3 mb-2 text-xs text-muted-foreground">
                                Teléfono alternativo
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Field>
                                    <FieldLabel>Nombre y apellido</FieldLabel>
                                    <Input
                                        value={data.alt_nombre}
                                        onChange={(e) =>
                                            setData(
                                                'alt_nombre',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Nombre de contacto"
                                    />
                                    <InputError message={errors.alt_nombre} />
                                </Field>
                                <Field>
                                    <FieldLabel>Teléfono</FieldLabel>
                                    <Input
                                        type="tel"
                                        value={data.alt_telefono}
                                        onChange={(e) =>
                                            setData(
                                                'alt_telefono',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Ej: 3512345678"
                                    />
                                    <InputError message={errors.alt_telefono} />
                                </Field>
                            </div>
                        </FieldGroup>
                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    onOpenChange(false);
                                }}
                            >
                                Cancelar
                            </Button>
                        </DrawerClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Dar de alta'}
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
