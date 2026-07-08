import type { SubmitEvent } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/vigilancia/control-de-accesos';

import type {
    PropiedadOpcion,
    RegistrarAccesoForm,
} from '../types/control-acceso';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    propiedades: PropiedadOpcion[];
    vehiculoOpciones: { value: string; label: string }[];
}

export default function RegistrarAccesoDrawer({
    open,
    onOpenChange,
    propiedades,
    vehiculoOpciones,
}: Props) {
    const { data, setData, post, errors, clearErrors, reset, processing } =
        useForm<RegistrarAccesoForm>({
            propiedad_id: '',
            nombre: '',
            dni: '',
            vehiculo_tipo: '',
            vehiculo_patente: '',
            observacion: '',
            nombre_dni_vehiculo_observacion_observacion: null,
        });

    const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        post(store().url, {
            onSuccess: () => {
                toast.success('Ingreso registrado correctamente.');
                reset();
                onOpenChange(false);
            },
        });
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            reset();
            clearErrors();
        }

        onOpenChange(nextOpen);
    };

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerContent>
                <form onSubmit={handleSubmit}>
                    <DrawerHeader>
                        <DrawerTitle>Registrar ingreso manual</DrawerTitle>
                        <DrawerDescription>
                            Completá los datos de la persona que ingresa sin
                            credencial.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="space-y-4 px-4 pb-4">
                        <FieldGroup>
                            {/* Propiedad */}
                            <Field>
                                <FieldLabel>Propiedad de destino</FieldLabel>
                                <Select
                                    value={data.propiedad_id}
                                    onValueChange={(v) => {
                                        setData('propiedad_id', v);
                                        clearErrors('propiedad_id');
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una propiedad..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {propiedades.map((p) => (
                                            <SelectItem
                                                key={p.value}
                                                value={String(p.value)}
                                            >
                                                {p.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.propiedad_id} />
                            </Field>

                            {/* Nombre y Apellido */}
                            <Field>
                                <FieldLabel>Nombre y Apellido</FieldLabel>
                                <Input
                                    value={data.nombre}
                                    onChange={(e) => {
                                        setData('nombre', e.target.value);
                                        clearErrors('nombre');
                                    }}
                                    placeholder="Ej. Juan Rodríguez"
                                />
                                <InputError message={errors.nombre} />
                            </Field>

                            {/* DNI */}
                            <Field>
                                <FieldLabel>DNI</FieldLabel>
                                <Input
                                    value={data.dni}
                                    onChange={(e) => {
                                        setData('dni', e.target.value);
                                        clearErrors('dni');
                                    }}
                                    placeholder="Ej. 30123456"
                                />
                                <InputError message={errors.dni} />
                            </Field>

                            {/* Vehículo y Patente */}
                            <div className="grid grid-cols-2 gap-3">
                                <Field>
                                    <FieldLabel>Vehículo</FieldLabel>
                                    <Select
                                        value={data.vehiculo_tipo}
                                        onValueChange={(v) => {
                                            setData('vehiculo_tipo', v);
                                            clearErrors('vehiculo_tipo');
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tipo..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehiculoOpciones.map((op) => (
                                                <SelectItem
                                                    key={op.value}
                                                    value={op.value}
                                                >
                                                    {op.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.vehiculo_tipo}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Patente</FieldLabel>
                                    <Input
                                        value={data.vehiculo_patente}
                                        onChange={(e) => {
                                            setData(
                                                'vehiculo_patente',
                                                e.target.value.toUpperCase(),
                                            );
                                            clearErrors('vehiculo_patente');
                                        }}
                                        placeholder="Ej. ABC123"
                                    />
                                    <InputError
                                        message={errors.vehiculo_patente}
                                    />
                                </Field>
                            </div>

                            {/* Observación */}
                            <Field>
                                <FieldLabel>Detalle de autorización</FieldLabel>
                                <Textarea
                                    value={data.observacion}
                                    onChange={(e) => {
                                        setData('observacion', e.target.value);
                                        clearErrors('observacion');
                                    }}
                                    placeholder="Ej. Ingreso autorizado por propietario Juan Palote por teléfono..."
                                    rows={3}
                                />
                                <InputError message={errors.observacion} />
                            </Field>
                            <Field>
                                <InputError
                                    message={
                                        errors.nombre_dni_vehiculo_observacion_observacion
                                    }
                                />
                            </Field>
                        </FieldGroup>
                    </div>

                    <DrawerFooter>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Registrando...'
                                : 'Registrar ingreso'}
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline" type="button">
                                Cancelar
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
