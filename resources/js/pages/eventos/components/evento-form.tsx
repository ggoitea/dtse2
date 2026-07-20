import { useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    domicilio_calle: string;
    domicilio_numero: string | null;
}

interface EventoFormData {
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

interface Props {
    data: EventoFormData;
    setData: <K extends keyof EventoFormData>(
        key: K,
        value: EventoFormData[K],
    ) => void;
    errors: Partial<Record<keyof EventoFormData, string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    localidades: Localidad[];
    sitios: Sitio[];
    isEdit?: boolean;
}

export function EventoForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    localidades,
    sitios,
    isEdit = false,
}: Props) {
    const asociarSitio = data.sitio_id !== '';
    const sitiosFiltrados = sitios.filter(
        (s) => s.localidad_id === Number(data.localidad_id),
    );

    useEffect(() => {
        if (data.sitio_id) {
            const sitio = sitios.find((s) => s.id === Number(data.sitio_id));

            if (sitio) {
                setData('domicilio_calle', sitio.domicilio_calle);
                setData('domicilio_numero', sitio.domicilio_numero ?? '');
            }
        }
    }, [data.sitio_id]);

    const handleLocalidadChange = (value: string) => {
        setData('localidad_id', value ? Number(value) : '');
        setData('sitio_id', '');
    };

    const handleAsociarSitioChange = (checked: boolean | 'indeterminate') => {
        if (!checked) {
            setData('sitio_id', '');
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="localidad_id">Nodo</Label>
                    <Select
                        value={
                            data.localidad_id ? String(data.localidad_id) : ''
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
                    <InputError message={errors.localidad_id} />
                </div>

                {data.localidad_id && (
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="asociar_sitio"
                                checked={asociarSitio}
                                onCheckedChange={handleAsociarSitioChange}
                            />
                            <Label htmlFor="asociar_sitio">
                                Asociar a un sitio
                            </Label>
                        </div>
                        {asociarSitio && (
                            <>
                                <Select
                                    value={
                                        data.sitio_id
                                            ? String(data.sitio_id)
                                            : ''
                                    }
                                    onValueChange={(value) =>
                                        setData(
                                            'sitio_id',
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
                                <InputError message={errors.sitio_id} />
                            </>
                        )}
                    </div>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                        id="nombre"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        placeholder="Nombre del evento"
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
                        placeholder="Descripción del evento"
                    />
                    <InputError message={errors.descripcion} />
                </div>

                <div className="grid gap-2 md:grid-cols-3 md:gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="fecha">Fecha</Label>
                        <Input
                            id="fecha"
                            type="date"
                            value={data.fecha}
                            onChange={(e) => setData('fecha', e.target.value)}
                            required
                        />
                        <InputError message={errors.fecha} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="inicio">Hora de inicio</Label>
                        <Input
                            id="inicio"
                            type="time"
                            value={data.inicio}
                            onChange={(e) => setData('inicio', e.target.value)}
                        />
                        <InputError message={errors.inicio} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="fin">Hora de fin</Label>
                        <Input
                            id="fin"
                            type="time"
                            value={data.fin}
                            onChange={(e) => setData('fin', e.target.value)}
                        />
                        <InputError message={errors.fin} />
                    </div>
                </div>

                <div className="grid gap-2 md:grid-cols-3 md:gap-4">
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="domicilio_calle">Calle</Label>
                        <Input
                            id="domicilio_calle"
                            value={data.domicilio_calle}
                            onChange={(e) =>
                                setData('domicilio_calle', e.target.value)
                            }
                            placeholder="Dirección"
                            required
                            disabled={asociarSitio && !!data.sitio_id}
                        />
                        <InputError message={errors.domicilio_calle} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="domicilio_numero">Número</Label>
                        <Input
                            id="domicilio_numero"
                            value={data.domicilio_numero}
                            onChange={(e) =>
                                setData('domicilio_numero', e.target.value)
                            }
                            placeholder="Número"
                            disabled={asociarSitio && !!data.sitio_id}
                        />
                        <InputError message={errors.domicilio_numero} />
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
