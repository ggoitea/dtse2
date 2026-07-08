import { useCallback, useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { store } from '@/routes/credenciales';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tipoOpciones: { value: string; label: string }[];
    vehiculoOpciones: { value: string; label: string }[];
}

const EVENTO = 'evento';

export default function NuevaCredencialDrawer({
    open,
    onOpenChange,
    tipoOpciones,
    vehiculoOpciones,
}: Props) {
    const [processing, setProcessing] = useState(false);
    const [sinVencimiento, setSinVencimiento] = useState(false);
    const [nombresEventuales, setNombresEventuales] = useState<string[]>([]);
    const [nombreInput, setNombreInput] = useState('');

    const { data, setData, post, errors, setError, clearErrors, reset } =
        useForm({
            tipo: '',
            persona_nombre: '',
            persona_dni: '',
            vehiculo_tipo: '',
            vehiculo_patente: '',
            vigente_hasta: '',
            nombres_eventuales: [] as string[],
        });

    const isEvento = data.tipo === EVENTO;

    const agregarNombre = () => {
        const nombre = nombreInput.trim();

        if (!nombre) {
            return;
        }

        const lista = [...nombresEventuales, nombre];
        setNombresEventuales(lista);
        setData('nombres_eventuales', lista);
        setNombreInput('');
    };

    const quitarNombre = (index: number) => {
        const lista = nombresEventuales.filter((_, i) => i !== index);
        setNombresEventuales(lista);
        setData('nombres_eventuales', lista);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        const vigente_hasta = sinVencimiento ? null : data.vigente_hasta;

        if (!isEvento && !sinVencimiento && !vigente_hasta) {
            setError(
                'vigente_hasta' as never,
                'El vencimiento es obligatorio salvo que marques "Sin vencimiento".' as never,
            );

            return;
        }

        if (isEvento && nombresEventuales.length === 0) {
            setError(
                'nombres_eventuales' as never,
                'Debés agregar al menos un invitado.' as never,
            );

            return;
        }

        setProcessing(true);

        post(store().url, {
            onError: (errs) => {
                setError(errs as Record<string, string>);
                setProcessing(false);
            },
            onSuccess: () => {
                toast.success('Credencial generada con éxito');
                setProcessing(false);
                handleReset();
                onOpenChange(false);
            },
        });
    };

    const handleReset = useCallback(() => {
        reset();
        setSinVencimiento(false);
        setNombresEventuales([]);
        setNombreInput('');
        clearErrors();
    }, [reset, clearErrors]);

    useEffect(() => {
        if (!open) {
            handleReset();
        }
    }, [open, handleReset]);

    const actualizarDatoSegunTipo = (tipo: string) => {
        if (tipo === EVENTO) {
            setData((prev) => ({
                ...prev,
                persona_nombre: '',
                persona_dni: '',
                vehiculo_tipo: '',
                vehiculo_patente: '',
            }));
            setSinVencimiento(false);
        } else {
            setNombresEventuales([]);
            setData('nombres_eventuales', []);
            setNombreInput('');
        }
    };

    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            direction="right"
            dismissible={false}
        >
            <DrawerContent className="w-full! overflow-x-hidden overflow-y-auto sm:max-w-md">
                <form onSubmit={handleSubmit} className="flex h-full flex-col">
                    <DrawerHeader>
                        <DrawerTitle>Nueva credencial</DrawerTitle>
                        <DrawerDescription>
                            Complete los datos para generar una nueva credencial
                            de acceso.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex h-full flex-col overflow-y-auto px-4 pb-4">
                        <FieldGroup>
                            {/* Tipo de credencial */}
                            <Field>
                                <FieldLabel>
                                    Tipo de credencial{' '}
                                    <span className="text-red-500">*</span>
                                </FieldLabel>
                                <Select
                                    value={data.tipo}
                                    onValueChange={(v) => {
                                        setData('tipo', v);
                                        actualizarDatoSegunTipo(v);
                                    }}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar tipo..." />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        {tipoOpciones.map((op) => (
                                            <SelectItem
                                                key={op.value}
                                                value={op.value}
                                            >
                                                {op.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.tipo} />
                            </Field>

                            {isEvento ? (
                                <>
                                    {/* Fecha del evento → vigente_hasta */}
                                    <Field>
                                        <FieldLabel>
                                            Fecha del evento{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <Input
                                            type="date"
                                            value={data.vigente_hasta}
                                            onChange={(e) =>
                                                setData(
                                                    'vigente_hasta',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.vigente_hasta}
                                        />
                                    </Field>

                                    {/* Lista de invitados */}
                                    <Field>
                                        <FieldLabel>
                                            Invitados{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </FieldLabel>
                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                value={nombreInput}
                                                onChange={(e) =>
                                                    setNombreInput(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        agregarNombre();
                                                    }
                                                }}
                                                placeholder="Nombre y apellido"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={agregarNombre}
                                            >
                                                <Plus className="size-4" />
                                            </Button>
                                        </div>
                                        {nombresEventuales.length > 0 && (
                                            <ul className="mt-2 space-y-1">
                                                {nombresEventuales.map(
                                                    (nombre, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-center justify-between rounded-md border px-3 py-1.5 text-sm"
                                                        >
                                                            <span>
                                                                {nombre}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    quitarNombre(
                                                                        i,
                                                                    )
                                                                }
                                                                className="ml-2 text-muted-foreground hover:text-destructive"
                                                            >
                                                                <X className="size-3.5" />
                                                            </button>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        )}
                                        <InputError
                                            message={errors.nombres_eventuales}
                                        />
                                    </Field>
                                </>
                            ) : (
                                <>
                                    {/* Nombre y apellido */}
                                    <Field>
                                        <FieldLabel>
                                            Nombre y apellido
                                        </FieldLabel>
                                        <Input
                                            type="text"
                                            value={data.persona_nombre}
                                            onChange={(e) =>
                                                setData(
                                                    'persona_nombre',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ej: Juan Pérez"
                                        />
                                        <InputError
                                            message={errors.persona_nombre}
                                        />
                                    </Field>

                                    {/* DNI */}
                                    <Field>
                                        <FieldLabel>DNI</FieldLabel>
                                        <NumericFormat
                                            customInput={Input}
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            allowNegative={false}
                                            decimalScale={0}
                                            maxLength={10}
                                            value={data.persona_dni}
                                            onValueChange={(values) =>
                                                setData(
                                                    'persona_dni',
                                                    values.value,
                                                )
                                            }
                                            placeholder="Ej: 30123456"
                                        />

                                        <InputError
                                            message={errors.persona_dni}
                                        />
                                    </Field>

                                    {/* Vehículo + Patente en una línea */}
                                    <Field>
                                        <FieldLabel>Vehículo</FieldLabel>
                                        <div className="flex gap-2">
                                            <Select
                                                value={data.vehiculo_tipo}
                                                onValueChange={(v) =>
                                                    setData('vehiculo_tipo', v)
                                                }
                                            >
                                                <SelectTrigger className="w-40 shrink-0">
                                                    <SelectValue placeholder="Tipo..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {vehiculoOpciones.map(
                                                        (op) => (
                                                            <SelectItem
                                                                key={op.value}
                                                                value={op.value}
                                                            >
                                                                {op.label}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="text"
                                                value={data.vehiculo_patente}
                                                onChange={(e) =>
                                                    setData(
                                                        'vehiculo_patente',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Patente"
                                            />
                                        </div>
                                        <InputError
                                            message={errors.vehiculo_tipo}
                                        />
                                        <InputError
                                            message={errors.vehiculo_patente}
                                        />
                                    </Field>

                                    {/* Vencimiento */}
                                    <Field>
                                        <FieldLabel>Vencimiento</FieldLabel>
                                        <Input
                                            type="date"
                                            value={data.vigente_hasta}
                                            onChange={(e) =>
                                                setData(
                                                    'vigente_hasta',
                                                    e.target.value,
                                                )
                                            }
                                            disabled={sinVencimiento}
                                        />
                                        <InputError
                                            message={errors.vigente_hasta}
                                        />
                                    </Field>

                                    {/* Sin vencimiento */}
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="sin-vencimiento"
                                            checked={sinVencimiento}
                                            onCheckedChange={(checked) => {
                                                setSinVencimiento(!!checked);

                                                if (checked) {
                                                    setData(
                                                        'vigente_hasta',
                                                        '',
                                                    );
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor="sin-vencimiento"
                                            className="text-sm"
                                        >
                                            Sin vencimiento
                                        </label>
                                    </div>
                                </>
                            )}
                        </FieldGroup>
                        <DrawerFooter className="mt-auto px-0">
                            <DrawerClose asChild>
                                <Button
                                    size={'lg'}
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                >
                                    Cancelar
                                </Button>
                            </DrawerClose>
                            <Button
                                size={'lg'}
                                type="submit"
                                disabled={processing}
                            >
                                {processing
                                    ? 'Generando...'
                                    : 'Generar credencial'}
                            </Button>
                        </DrawerFooter>
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
