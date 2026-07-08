import { useEffect, useState } from 'react';
import { router, useForm } from '@inertiajs/react';

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
import { update } from '@/routes/propiedades';

import type { Propiedad } from '../types/propiedad';

interface EditarPropiedadDrawerProps {
    propiedad: Propiedad;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditarPropiedadDrawer({
    propiedad,
    open,
    onOpenChange,
}: EditarPropiedadDrawerProps) {
    const [processing, setProcessing] = useState(false);
    const { data, setData, errors, setError, clearErrors, reset } = useForm({
        lote: propiedad.lote ?? '',
        manzana: propiedad.manzana ?? '',
        descripcion: propiedad.descripcion ?? '',
        titular: propiedad.propietario?.nombre ?? '',
        dni: propiedad.propietario?.dni ?? '',
        telefono_nombre: propiedad.propietario?.nombre ?? '',
        telefono: propiedad.propietario?.telefono ?? '',
        alt_nombre: propiedad.propietario?.secundario_nombre ?? '',
        alt_telefono: propiedad.propietario?.secundario_telefono ?? '',
    });

    useEffect(() => {
        if (open) {
            reset();
            setData({
                lote: propiedad.lote ?? '',
                manzana: propiedad.manzana ?? '',
                descripcion: propiedad.descripcion ?? '',
                titular: propiedad.propietario?.nombre ?? '',
                dni: propiedad.propietario?.dni ?? '',
                telefono_nombre: propiedad.propietario?.nombre ?? '',
                telefono: propiedad.propietario?.telefono ?? '',
                alt_nombre: propiedad.propietario?.secundario_nombre ?? '',
                alt_telefono: propiedad.propietario?.secundario_telefono ?? '',
            });
        }
    }, [open, propiedad, reset, setData]);

    useEffect(() => {
        setData('telefono_nombre', data.titular);
    }, [data.titular, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setProcessing(true);
        router.put(update(propiedad.id).url, data, {
            onError: (errs) => {
                setError(errs as Record<string, string>);
                setProcessing(false);
            },
            onSuccess: () => {
                setProcessing(false);
                onOpenChange(false);
            },
        });
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <form onSubmit={handleSubmit}>
                    <DrawerHeader>
                        <DrawerTitle>Editar propiedad</DrawerTitle>
                        <DrawerDescription>
                            Modifique los datos de la propiedad.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="overflow-y-auto px-4 pb-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Lote N°</FieldLabel>
                                <Input
                                    value={data.lote}
                                    onChange={(e) =>
                                        setData('lote', e.target.value)
                                    }
                                    placeholder="Ej: 12"
                                    required
                                />
                                {errors.lote && (
                                    <p className="text-sm text-red-500">
                                        {errors.lote}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Manzana</FieldLabel>
                                <Input
                                    value={data.manzana}
                                    onChange={(e) =>
                                        setData('manzana', e.target.value)
                                    }
                                    placeholder="Ej: A"
                                    required
                                />
                                {errors.manzana && (
                                    <p className="text-sm text-red-500">
                                        {errors.manzana}
                                    </p>
                                )}
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
                                {errors.descripcion && (
                                    <p className="text-sm text-red-500">
                                        {errors.descripcion}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Titular</FieldLabel>
                                <Input
                                    value={data.titular}
                                    onChange={(e) =>
                                        setData('titular', e.target.value)
                                    }
                                    placeholder="Nombre y apellido del titular"
                                    required
                                />
                                {errors.titular && (
                                    <p className="text-sm text-red-500">
                                        {errors.titular}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>DNI</FieldLabel>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]{7,8}"
                                    maxLength={8}
                                    value={data.dni}
                                    onChange={(e) =>
                                        setData(
                                            'dni',
                                            e.target.value.replace(/\D/g, ''),
                                        )
                                    }
                                    placeholder="7 u 8 dígitos"
                                    required
                                />
                                {errors.dni && (
                                    <p className="text-sm text-red-500">
                                        {errors.dni}
                                    </p>
                                )}
                            </Field>
                        </FieldGroup>

                        <Separator className="my-4" />

                        <p className="mb-3 text-sm font-medium">
                            Dato de contacto
                        </p>

                        <FieldGroup>
                            <p className="mb-2 text-xs text-muted-foreground">
                                Teléfono principal (notificaciones)
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <Field>
                                    <FieldLabel>Nombre</FieldLabel>
                                    <Input
                                        value={data.telefono_nombre}
                                        disabled
                                        placeholder="Se autocompleta con Titular"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Nro de teléfono</FieldLabel>
                                    <Input
                                        type="tel"
                                        value={data.telefono}
                                        onChange={(e) =>
                                            setData('telefono', e.target.value)
                                        }
                                        placeholder="Ej: 3512345678"
                                        required
                                    />
                                    {errors.telefono && (
                                        <p className="text-sm text-red-500">
                                            {errors.telefono}
                                        </p>
                                    )}
                                </Field>
                            </div>

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
                                    {errors.alt_nombre && (
                                        <p className="text-sm text-red-500">
                                            {errors.alt_nombre}
                                        </p>
                                    )}
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
                                    {errors.alt_telefono && (
                                        <p className="text-sm text-red-500">
                                            {errors.alt_telefono}
                                        </p>
                                    )}
                                </Field>
                            </div>
                        </FieldGroup>
                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DrawerClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
