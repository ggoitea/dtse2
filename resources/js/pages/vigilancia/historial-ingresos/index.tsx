import { useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { ClipboardList, Printer } from 'lucide-react';

import { AdaptiveTable } from '@/components/blocks/adaptive-table';
import type {
    CollectionData,
    DataTableRef,
} from '@/components/blocks/data-table';
import type {
    FilterComponentProps,
    FilterItemProps,
} from '@/components/blocks/filter-popover';
import FilterPopover from '@/components/blocks/filter-popover';
import InputSimpleSearch from '@/components/blocks/input-simple-search';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { index, pdf } from '@/routes/vigilancia/accesos';

import { columns } from './components/index-columns';
import AccesoMobileCard from './components/index-mobile-card';
import type { Acceso } from './types/acceso';

// ---------------------------------------------------------------------------
// Interfaces de props del servidor
// ---------------------------------------------------------------------------

interface Filtros {
    buscar: string | null;
    propiedad_id: string | null;
    movimiento: string | null;
    tipo: string | null;
    desde: string | null;
    hasta: string | null;
}

interface OpcionEnum {
    value: string;
    label: string;
}

interface PropiedadOpcion {
    id: number;
    label: string;
}

interface Props {
    accesos: CollectionData<Acceso>;
    filtros: Filtros;
    propiedades: PropiedadOpcion[];
    movimientoOpciones: OpcionEnum[];
    tipoOpciones: OpcionEnum[];
}

// ---------------------------------------------------------------------------
// Componentes de filtros internos
// ---------------------------------------------------------------------------

const PropiedadFilter = ({
    value,
    onValueChange,
    propiedades,
}: FilterComponentProps & { propiedades: PropiedadOpcion[] }) => (
    <FieldGroup>
        <Field>
            <FieldLabel>Propiedad</FieldLabel>
            <Select value={value || ''} onValueChange={onValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Todas las propiedades" />
                </SelectTrigger>
                <SelectContent>
                    {propiedades.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                            {p.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    </FieldGroup>
);

const MovimientoFilter = ({
    value,
    onValueChange,
    opciones,
}: FilterComponentProps & { opciones: OpcionEnum[] }) => (
    <FieldGroup>
        <Field>
            <FieldLabel>Movimiento</FieldLabel>
            <Select value={value || ''} onValueChange={onValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                    {opciones.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    </FieldGroup>
);

const TipoFilter = ({
    value,
    onValueChange,
    opciones,
}: FilterComponentProps & { opciones: OpcionEnum[] }) => (
    <FieldGroup>
        <Field>
            <FieldLabel>Tipo</FieldLabel>
            <Select value={value || ''} onValueChange={onValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                    {opciones.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    </FieldGroup>
);

const DesdeFilter = ({ value, onValueChange }: FilterComponentProps) => (
    <FieldGroup>
        <Field>
            <FieldLabel>Desde</FieldLabel>
            <Input
                type="date"
                value={value || ''}
                onChange={(e) => onValueChange(e.target.value)}
                className="w-full"
            />
        </Field>
    </FieldGroup>
);

const HastaFilter = ({ value, onValueChange }: FilterComponentProps) => (
    <FieldGroup>
        <Field>
            <FieldLabel>Hasta</FieldLabel>
            <Input
                type="date"
                value={value || ''}
                onChange={(e) => onValueChange(e.target.value)}
                className="w-full"
            />
        </Field>
    </FieldGroup>
);

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------

export default function HistorialIngresosIndex({
    accesos,
    filtros,
    propiedades,
    movimientoOpciones,
    tipoOpciones,
}: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);

    // Búsqueda con debounce interno de InputSimpleSearch
    const handleSearch = (value: string) => {
        tableRef.current?.resetPagination();
        router.reload({
            onStart: () => setProcessing(true),
            data: { ...filtros, buscar: value, accesosPage: 1 },
            onFinish: () => setProcessing(false),
        });
    };

    const handlePageChange = (page: number) => {
        router.reload({
            onStart: () => setProcessing(true),
            data: { accesosPage: page },
            onFinish: () => setProcessing(false),
        });
    };

    // Construir los items del FilterPopover con closures para acceder a las
    // props del servidor (propiedades, opciones) que los componentes necesitan.
    const componentesDeFiltro: FilterItemProps[] = useMemo(
        () => [
            {
                key: 'propiedad_id',
                value: filtros.propiedad_id ?? null,
                component: (props: FilterComponentProps) => (
                    <PropiedadFilter {...props} propiedades={propiedades} />
                ),
            },
            {
                key: 'movimiento',
                value: filtros.movimiento ?? null,
                component: (props: FilterComponentProps) => (
                    <MovimientoFilter
                        {...props}
                        opciones={movimientoOpciones}
                    />
                ),
            },
            {
                key: 'tipo',
                value: filtros.tipo ?? null,
                component: (props: FilterComponentProps) => (
                    <TipoFilter {...props} opciones={tipoOpciones} />
                ),
            },
            {
                key: 'desde',
                value: filtros.desde ?? null,
                component: DesdeFilter,
            },
            {
                key: 'hasta',
                value: filtros.hasta ?? null,
                component: HastaFilter,
            },
        ],
        [filtros, propiedades, movimientoOpciones, tipoOpciones],
    );

    const handleImprimir = () => {
        const queryParams: Record<string, string> = {};

        if (filtros.buscar) {
            queryParams.buscar = filtros.buscar;
        }

        if (filtros.propiedad_id) {
            queryParams.propiedad_id = filtros.propiedad_id;
        }

        if (filtros.movimiento) {
            queryParams.movimiento = filtros.movimiento;
        }

        if (filtros.tipo) {
            queryParams.tipo = filtros.tipo;
        }

        if (filtros.desde) {
            queryParams.desde = filtros.desde;
        }

        if (filtros.hasta) {
            queryParams.hasta = filtros.hasta;
        }

        window.open(
            pdf.url(
                Object.keys(queryParams).length > 0
                    ? { query: queryParams }
                    : undefined,
            ),
            '_blank',
        );
    };

    return (
        <AdaptiveLayout
            pageTitle="Historial de Ingresos"
            icon={ClipboardList}
            pageDescription="Registro de ingresos y salidas"
            browserTitle="Historial de Ingresos"
            breadcrumbs={[
                { title: 'Historial de Ingresos', href: index.url() },
            ]}
            quickActions={[
                {
                    id: 'imprimir',
                    label: 'Imprimir',
                    icon: Printer,
                    onClick: handleImprimir,
                },
            ]}
        >
            <AdaptiveTable
                ref={tableRef}
                data={accesos}
                columns={columns}
                MobileTemplate={AccesoMobileCard}
                onPageChange={handlePageChange}
                header={
                    <div className="flex w-full flex-row items-center justify-between gap-4">
                        <InputSimpleSearch
                            className="max-w-xs"
                            placeholder="Buscar por nombre o DNI..."
                            value={filtros.buscar ?? ''}
                            processing={processing}
                            onSearch={handleSearch}
                        />
                        <FilterPopover
                            items={componentesDeFiltro}
                            onApply={(data) => {
                                tableRef.current?.resetPagination();
                                router.reload({
                                    onStart: () => setProcessing(true),
                                    data: {
                                        ...filtros,
                                        ...data,
                                        accesosPage: 1,
                                    },
                                    onFinish: () => setProcessing(false),
                                });
                            }}
                        />
                    </div>
                }
            />
        </AdaptiveLayout>
    );
}
