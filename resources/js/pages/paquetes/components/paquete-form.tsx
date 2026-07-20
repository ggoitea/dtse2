import { useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Localidad {
    id: number;
    nombre: string;
}

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

interface EventoData {
    localidad_id: number | '';
    sitio_id: number | '';
    nombre: string;
    descripcion: string;
    fecha: string;
    inicio: string;
    fin: string;
    domicilio_calle: string;
    domicilio_numero: string;
}

interface PaqueteFormData {
    modelable_type: string;
    modelable_id: number | '';
    nombre: string;
    descripcion: string;
    categoria: string;
    destino: string;
    duracion: string;
    evento_data: EventoData;
}

interface Props {
    data: PaqueteFormData;
    setData: <K extends keyof PaqueteFormData>(
        key: K,
        value: PaqueteFormData[K],
    ) => void;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    localidades: Localidad[];
    sitios: Sitio[];
    eventos: Evento[];
    categorias: CategoriaOption[];
    isEdit?: boolean;
}

export function PaqueteForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    localidades,
    sitios,
    eventos,
    categorias,
}: Props) {
    const [asociacion, setAsociacion] = useState<
        'sitio' | 'evento' | 'nuevo_evento'
    >(
        data.modelable_type === 'App\\Models\\Sitio'
            ? 'sitio'
            : data.modelable_type === 'App\\Models\\Evento'
              ? 'evento'
              : data.evento_data.nombre
                ? 'nuevo_evento'
                : 'sitio',
    );

    const sitiosFiltrados = sitios.filter(
        (s) => s.localidad_id === Number(data.evento_data.localidad_id),
    );

    const eventosFiltrados = eventos.filter(
        (e) => e.localidad_id === Number(data.evento_data.localidad_id),
    );

    useEffect(() => {
        if (asociacion === 'sitio') {
            setData('modelable_type', 'App\\Models\\Sitio');
        } else if (asociacion === 'evento') {
            setData('modelable_type', 'App\\Models\\Evento');
        } else {
            setData('modelable_type', '');
            setData('modelable_id', '');
        }
    }, [asociacion, setData]);

    const handleLocalidadChange = (value: string) => {
        setData('evento_data', {
            ...data.evento_data,
            localidad_id: value ? Number(value) : '',
            sitio_id: '',
        });
        setData('modelable_id', '');
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="evento_localidad_id">Nodo</Label>
                    <Select
                        value={
                            data.evento_data.localidad_id
                                ? String(data.evento_data.localidad_id)
                                : ''
                        }
                        onValueChange={handleLocalidadChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar nodo" />
                        </SelectTrigger>
                        <SelectContent>
                            {localidades.map((loc) => (
                                <SelectItem key={loc.id} value={String(loc.id)}>
                                    {loc.nombre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors['evento_data.localidad_id']} />
                </div>

                <div className="grid gap-2">
                    <Label>Asociar a</Label>
                    <RadioGroup
                        value={asociacion}
                        onValueChange={(
                            value: 'sitio' | 'evento' | 'nuevo_evento',
                        ) => setAsociacion(value)}
                        className="flex flex-row gap-4"
                    >
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="sitio" id="asoc_sitio" />
                            <Label htmlFor="asoc_sitio" className="font-normal">
                                Sitio
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem value="evento" id="asoc_evento" />
                            <Label
                                htmlFor="asoc_evento"
                                className="font-normal"
                            >
                                Evento existente
                            </Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <RadioGroupItem
                                value="nuevo_evento"
                                id="asoc_nuevo"
                            />
                            <Label htmlFor="asoc_nuevo" className="font-normal">
                                Nuevo evento
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {asociacion === 'sitio' && data.evento_data.localidad_id && (
                    <div className="grid gap-2">
                        <Label>Sitio</Label>
                        <Select
                            value={
                                data.modelable_id
                                    ? String(data.modelable_id)
                                    : ''
                            }
                            onValueChange={(value) =>
                                setData(
                                    'modelable_id',
                                    value ? Number(value) : '',
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar sitio" />
                            </SelectTrigger>
                            <SelectContent>
                                {sitiosFiltrados.map((sitio) => (
                                    <SelectItem
                                        key={sitio.id}
                                        value={String(sitio.id)}
                                    >
                                        {sitio.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.modelable_id} />
                    </div>
                )}

                {asociacion === 'evento' && data.evento_data.localidad_id && (
                    <div className="grid gap-2">
                        <Label>Evento</Label>
                        <Select
                            value={
                                data.modelable_id
                                    ? String(data.modelable_id)
                                    : ''
                            }
                            onValueChange={(value) =>
                                setData(
                                    'modelable_id',
                                    value ? Number(value) : '',
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar evento" />
                            </SelectTrigger>
                            <SelectContent>
                                {eventosFiltrados.map((evento) => (
                                    <SelectItem
                                        key={evento.id}
                                        value={String(evento.id)}
                                    >
                                        {evento.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.modelable_id} />
                    </div>
                )}

                {asociacion === 'nuevo_evento' && (
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
                                value={data.evento_data.nombre}
                                onChange={(e) =>
                                    setData('evento_data', {
                                        ...data.evento_data,
                                        nombre: e.target.value,
                                    })
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
                                value={data.evento_data.descripcion}
                                onChange={(e) =>
                                    setData('evento_data', {
                                        ...data.evento_data,
                                        descripcion: e.target.value,
                                    })
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
                                    value={data.evento_data.fecha}
                                    onChange={(e) =>
                                        setData('evento_data', {
                                            ...data.evento_data,
                                            fecha: e.target.value,
                                        })
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
                                    value={data.evento_data.inicio}
                                    onChange={(e) =>
                                        setData('evento_data', {
                                            ...data.evento_data,
                                            inicio: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="evento_fin">Hora de fin</Label>
                                <Input
                                    id="evento_fin"
                                    type="time"
                                    value={data.evento_data.fin}
                                    onChange={(e) =>
                                        setData('evento_data', {
                                            ...data.evento_data,
                                            fin: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid gap-2 md:grid-cols-3 md:gap-4">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="evento_calle">Calle</Label>
                                <Input
                                    id="evento_calle"
                                    value={data.evento_data.domicilio_calle}
                                    onChange={(e) =>
                                        setData('evento_data', {
                                            ...data.evento_data,
                                            domicilio_calle: e.target.value,
                                        })
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
                                    value={data.evento_data.domicilio_numero}
                                    onChange={(e) =>
                                        setData('evento_data', {
                                            ...data.evento_data,
                                            domicilio_numero: e.target.value,
                                        })
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
                                        value={cat.value}
                                    >
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.categoria} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="destino">Destino</Label>
                        <Input
                            id="destino"
                            value={data.destino}
                            onChange={(e) => setData('destino', e.target.value)}
                            placeholder="Destino"
                        />
                        <InputError message={errors.destino} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="duracion">Duración</Label>
                        <Input
                            id="duracion"
                            value={data.duracion}
                            onChange={(e) =>
                                setData('duracion', e.target.value)
                            }
                            placeholder="Ej: 3 días"
                        />
                        <InputError message={errors.duracion} />
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
}
