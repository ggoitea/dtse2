import { forwardRef, SubmitEventHandler, useEffect, useMemo, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Option } from '@/types/global';

interface Sitio {
    id: number;
    nombre: string;
    localidad_id: number;
}

interface Evento {
    id: number;
    nombre: string;
    localidad_id: number;
}

interface CategoriaOption {
    value: string;
    label: string;
}


export interface SitioOpcion extends Option {
    localidad_id: number;
}

export interface EventoOpcion extends Option {
    localidad_id: number;
}

export interface PaqueteFormData {
    localidad_id: number | null;
    asignar_a: 'sitio' | 'evento' | 'nuevo_evento';
    sitio_id: number | null;
    evento_id: number | null;
    evento_data: {
        nombre: string;
        descripcion: string;
        fecha: string;
        inicio: string;

        fin: string | null;
        domicilio_calle: string;
        domicilio_numero: string;
    } | null;
    nombre: string;
    descripcion: string;
    categoria: string;
}

interface Props {
    localidades: Option[];
    sitios: SitioOpcion[];
    eventos: EventoOpcion[];
    categorias: Option[];

    data: PaqueteFormData;
    setData: <K extends keyof PaqueteFormData>(
        key: K,
        value: PaqueteFormData[K],
    ) => void;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    onSubmit: SubmitEventHandler<HTMLFormElement>;
    submitLabel: string;

    containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const PaqueteForm = forwardRef<HTMLFormElement, Props>(
    function PaqueteForm(
        {
            localidades,
            sitios,
            eventos,
            categorias,

            data,
            setData,
            errors,
            processing,
            onSubmit,
            submitLabel,

            containerRef,
        },
        ref,
    ) {
        console.log('sitios', sitios);
        const sitiosFiltrados = useMemo(() => {
            return sitios.filter(
                (s) => s.localidad_id === Number(data.localidad_id),
            );
        }, [sitios, data.localidad_id]);

        const eventosFiltrados = useMemo(() => {
            return eventos.filter(
                (e) => e.localidad_id === Number(data.localidad_id),
            );
        }, [eventos, data.localidad_id]);

        return (
            <form ref={ref} onSubmit={onSubmit} className="space-y-6">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="evento_localidad_id">Nodo</Label>
                        <Combobox
                            items={localidades}
                            value={localidades.find(
                                (l) =>
                                    l.value ===
                                    Number(data.localidad_id),
                            )}
                            onValueChange={(v) => {
                                setData('localidad_id', v ? Number(v.value) : null);
                            }}
                        >
                            <ComboboxInput
                                placeholder="Seleccionar nodo"
                                className="w-full"
                            />
                            <ComboboxContent container={containerRef}>
                                <ComboboxEmpty>
                                    No se encontraron nodos.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(item: Option) => (
                                        <ComboboxItem
                                            key={item.value}
                                            value={item}
                                        >
                                            {item.label}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                        <InputError message={errors['localidad_id']} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Asociar a</Label>
                        <ToggleGroup
                            type="single"
                            value={data.asignar_a}
                            onValueChange={(value) => {
                                if (value) {
                                    setData('asignar_a', value as 'sitio' | 'evento' | 'nuevo_evento');
                                }
                            }}
                            variant="outline"
                            spacing={0}
                            className="w-full"
                        >
                            <ToggleGroupItem value="sitio" className="flex-1">
                                Sitio
                            </ToggleGroupItem>
                            <ToggleGroupItem value="evento" className="flex-1">
                                Evento
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="nuevo_evento"
                                className="flex-1"
                            >
                                Nuevo evento
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    {data.asignar_a === 'sitio' && (
                        <div className="grid gap-2">
                            <Label>Sitio</Label>
                            <Combobox
                                items={sitios}
                                value={sitios.find(
                                    (s) =>
                                        s.value ===
                                        Number(data.sitio_id),
                                )}
                                onValueChange={(v) => {
                                    setData('sitio_id', v ? Number(v.value) : null);
                                }}
                            >
                                <ComboboxInput
                                    placeholder="Seleccionar sitio"
                                    className="w-full"
                                />
                                <ComboboxContent container={containerRef}>
                                    <ComboboxEmpty>
                                        No se encontraron sitio.
                                    </ComboboxEmpty>
                                    <ComboboxList>
                                        {(item: Option) => (
                                            <ComboboxItem
                                                key={item.value}
                                                value={item}
                                            >
                                                {item.label}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                            <InputError message={errors['sitio_id']} />

                        </div>
                    )}

                    {data.asignar_a === 'evento' && (
                        <div className="grid gap-2">
                            <Label>Evento</Label>
                            <Combobox
                                items={eventos}
                                value={eventos.find(
                                    (e) =>
                                        e.value ===
                                        Number(data.evento_id),
                                )}
                                onValueChange={(v) => {
                                    setData('evento_id', v ? Number(v.value) : null);
                                }}
                            >
                                <ComboboxInput
                                    placeholder="Seleccionar nodo"
                                    className="w-full"
                                />
                                <ComboboxContent container={containerRef}>
                                    <ComboboxEmpty>
                                        No se encontraron eventos.
                                    </ComboboxEmpty>
                                    <ComboboxList>
                                        {(item: EventoOpcion) => (
                                            <ComboboxItem
                                                key={item.value}
                                                value={item}
                                            >
                                                {item.label}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                            <InputError message={errors.modelable_id} />
                        </div>
                    )}

                    {data.asignar_a === 'nuevo_evento' && (
                        <div className="space-y-4 rounded-lg border border-border p-4">
                            <Label className="text-base font-semibold">
                                Datos del evento
                            </Label>
                            <div className="grid gap-2">
                                <Label htmlFor="evento_nombre">
                                    Nombre del evento
                                </Label>
                                <Input
                                    id="evento_nombre"
                                    value={data.evento_data?.nombre || ''}
                                    onChange={(e) =>
                                        setData('evento_data', data.evento_data ? {
                                            ...data.evento_data,
                                            nombre: e.target.value,
                                        } : null)
                                    }
                                    placeholder="Nombre del evento"
                                    required
                                />
                                <InputError
                                    message={errors['evento_data.nombre']}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="evento_descripcion">
                                    Descripción del evento
                                </Label>
                                <Input
                                    id="evento_descripcion"
                                    value={data.evento_data?.descripcion ?? ''}
                                    onChange={(e) =>
                                        setData('evento_data', data.evento_data ? {
                                            ...data.evento_data,
                                            descripcion: e.target.value,
                                        } : null)
                                    }
                                    placeholder="Descripción"
                                />
                            </div>
                            <div className="grid gap-2 md:grid-cols-3 md:gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="evento_fecha">
                                        Fecha del evento
                                    </Label>
                                    <Input
                                        id="evento_fecha"
                                        type="date"
                                        value={data.evento_data?.fecha ?? ''}
                                        onChange={(e) =>
                                            setData('evento_data', data.evento_data ? {
                                                ...data.evento_data,
                                                fecha: e.target.value,
                                            } : null)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors['evento_data.fecha']}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="evento_inicio">
                                        Hora de inicio
                                    </Label>
                                    <Input
                                        id="evento_inicio"
                                        type="time"
                                        value={data.evento_data?.inicio ?? ''}
                                        onChange={(e) =>
                                            setData('evento_data', data.evento_data ? {
                                                ...data.evento_data,
                                                inicio: e.target.value,
                                            } : null)
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="evento_fin">Hora de fin</Label>
                                    <Input
                                        id="evento_fin"
                                        type="time"
                                        value={data.evento_data?.fin ?? ''}
                                        onChange={(e) =>
                                            setData('evento_data', data.evento_data ? {
                                                ...data.evento_data,
                                                fin: e.target.value,
                                            } : null)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2 md:grid-cols-3 md:gap-4">
                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="evento_calle">Calle</Label>
                                    <Input
                                        id="evento_calle"
                                        value={data.evento_data?.domicilio_calle ?? ''}
                                        onChange={(e) =>
                                            setData('evento_data', data.evento_data ? {
                                                ...data.evento_data,
                                                domicilio_calle: e.target.value,
                                            } : null)
                                        }
                                        placeholder="Dirección"
                                        required
                                    />
                                    <InputError
                                        message={
                                            errors['evento_data.domicilio_calle']
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="evento_numero">Número</Label>
                                    <Input
                                        id="evento_numero"
                                        value={data.evento_data?.domicilio_numero ?? ''}
                                        onChange={(e) =>
                                            setData('evento_data', data.evento_data ? {
                                                ...data.evento_data,
                                                domicilio_numero: e.target.value,
                                            } : null)
                                        }
                                        placeholder="Número"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre del paquete</Label>
                        <Input
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            placeholder="Nombre del paquete"
                            required
                        />
                        <InputError message={errors.nombre} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Input
                            id="descripcion"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            placeholder="Descripción del paquete"
                        />
                        <InputError message={errors.descripcion} />
                    </div>

                    <div className="grid gap-2 md:grid-cols-3 md:gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="categoria">Categoría</Label>
                            <Select
                                value={data.categoria}
                                onValueChange={(value) =>
                                    setData('categoria', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categorias.map((cat) => (
                                        <SelectItem
                                            key={cat.value}
                                            value={cat.value.toString()}
                                        >
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.categoria} />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Guardando...' : submitLabel}
                    </Button>
                </div>
            </form>
        );
    },
);
