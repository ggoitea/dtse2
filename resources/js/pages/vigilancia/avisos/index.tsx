import { useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { useDebouncer } from '@tanstack/react-pacer';
import { Bell, Plus } from 'lucide-react';

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
import { usePermissions } from '@/hooks/use-permissions';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { index } from '@/routes/vigilancia/avisos';

import { AvisoDrawer } from './components/aviso-drawer';
import { columns } from './components/index-columns';
import AvisoMobileCard from './components/index-mobile-card';
import type { Aviso } from './types/aviso';

// ---------------------------------------------------------------------------
// Interfaces de props del servidor
// ---------------------------------------------------------------------------

interface OpcionEnum {
    value: string;
    label: string;
}

interface Filtros {
    tipo: string | null;
    solo_sin_ingreso: boolean;
    buscar: string | null;
    fecha_desde: string | null;
    fecha_hasta: string | null;
}

interface Props {
    avisos: CollectionData<Aviso>;
    filtros: Filtros;
    tipoOpciones: OpcionEnum[];
}

// ---------------------------------------------------------------------------
// Componentes de filtro avanzado
// ---------------------------------------------------------------------------

const TipoFilter = ({
    value,
    onValueChange,
    tipoOpciones,
}: FilterComponentProps & { tipoOpciones: OpcionEnum[] }) => (
    <FieldGroup>
        <Field>
            <FieldLabel>Tipo de aviso</FieldLabel>
            <Select value={value || ''} onValueChange={onValueChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                    {tipoOpciones.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                            {op.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Field>
    </FieldGroup>
);

const FechaDesdeFilter = ({ value, onValueChange }: FilterComponentProps) => (
    <FieldGroup>
        <Field>
            <FieldLabel>Fecha desde</FieldLabel>
            <Input
                type="date"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
            />
        </Field>
    </FieldGroup>
);

const FechaHastaFilter = ({ value, onValueChange }: FilterComponentProps) => (
    <FieldGroup>
        <Field>
            <FieldLabel>Fecha hasta</FieldLabel>
            <Input
                type="date"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
            />
        </Field>
    </FieldGroup>
);

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------

export default function AvisosIndex({ avisos, filtros, tipoOpciones }: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { hasRole } = usePermissions();

    const searchDebouncer = useDebouncer(
        (value: string) => {
            tableRef.current?.resetPagination();
            router.reload({
                onStart: () => setProcessing(true),
                data: { ...filtros, buscar: value, avisosPage: 1 },
                onFinish: () => setProcessing(false),
            });
        },
        { wait: 500 },
    );

    const handleSearch = (value: string) => searchDebouncer.maybeExecute(value);

    const handlePageChange = (page: number) => {
        router.reload({
            onStart: () => setProcessing(true),
            data: { avisosPage: page },
            onFinish: () => setProcessing(false),
        });
    };

    const filterItems: FilterItemProps[] = useMemo(
        () => [
            {
                key: 'tipo',
                value: filtros.tipo ?? null,
                component: (props: FilterComponentProps) => (
                    <TipoFilter {...props} tipoOpciones={tipoOpciones} />
                ),
            },
            {
                key: 'fecha_desde',
                value: filtros.fecha_desde ?? null,
                component: FechaDesdeFilter,
            },
            {
                key: 'fecha_hasta',
                value: filtros.fecha_hasta ?? null,
                component: FechaHastaFilter,
            },
        ],
        [filtros, tipoOpciones],
    );

    const canGenerarAvisos = hasRole('propietario');

    return (
        <>
            <AdaptiveLayout
                pageTitle="Avisos"
                icon={Bell}
                pageDescription="Avisos para la guardia"
                browserTitle="Avisos"
                breadcrumbs={[{ title: 'Avisos', href: index.url() }]}
                quickActions={[
                    {
                        id: 'nuevo-aviso',
                        label: 'Generar nuevo aviso',
                        icon: Plus,
                        onClick: () => setDrawerOpen(true),
                        show: canGenerarAvisos,
                    },
                ]}
            >
                <AdaptiveTable
                    ref={tableRef}
                    data={avisos}
                    columns={columns}
                    MobileTemplate={AvisoMobileCard}
                    onPageChange={handlePageChange}
                    header={
                        <div className="flex w-full flex-row items-center justify-between gap-4">
                            <InputSimpleSearch
                                className="max-w-xs"
                                placeholder="Buscar por propietario o domicilio..."
                                value={filtros.buscar ?? ''}
                                processing={processing}
                                onSearch={handleSearch}
                            />
                            <FilterPopover
                                items={filterItems}
                                onApply={(data) => {
                                    tableRef.current?.resetPagination();
                                    router.reload({
                                        onStart: () => setProcessing(true),
                                        data: {
                                            ...filtros,
                                            ...data,
                                            avisosPage: 1,
                                        },
                                        onFinish: () => setProcessing(false),
                                    });
                                }}
                            />
                        </div>
                    }
                />
            </AdaptiveLayout>

            <AvisoDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                tipoOpciones={tipoOpciones}
            />
        </>
    );
}
