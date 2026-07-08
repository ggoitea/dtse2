import { useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { useDebouncer } from '@tanstack/react-pacer';
import { CreditCard, Plus } from 'lucide-react';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { index } from '@/routes/credenciales';

import CredencialMobileCard from './components/credencial-mobile-card';
import { columns } from './components/index-columns';
import NuevaCredencialDrawer from './components/nueva-credencial-drawer';
import type { Credencial } from './types/credencial';

// ---------------------------------------------------------------------------
// Interfaces de props del servidor
// ---------------------------------------------------------------------------

interface Filtros {
    buscar: string | null;
    tipo: string | null;
}

interface Props {
    credenciales: CollectionData<Credencial>;
    filtros: Filtros;
    tipoOpciones: { value: string; label: string }[];
    vehiculoOpciones: { value: string; label: string }[];
}

// ---------------------------------------------------------------------------
// Componente de filtro por tipo
// ---------------------------------------------------------------------------

const TipoFilter = ({
    value,
    onValueChange,
    tipoOpciones,
}: FilterComponentProps & {
    tipoOpciones: { value: string; label: string }[];
}) => (
    <FieldGroup>
        <Field>
            <FieldLabel>Tipo de acceso</FieldLabel>
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

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------

export default function CredencialesIndex({
    credenciales,
    filtros,
    tipoOpciones,
    vehiculoOpciones,
}: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const searchDebouncer = useDebouncer(
        (value: string) => {
            tableRef.current?.resetPagination();
            router.reload({
                onStart: () => setProcessing(true),
                data: { ...filtros, buscar: value, credencialesPage: 1 },
                onFinish: () => setProcessing(false),
            });
        },
        { wait: 500 },
    );

    const handleSearch = (value: string) => searchDebouncer.maybeExecute(value);

    const handlePageChange = (page: number) => {
        router.reload({
            onStart: () => setProcessing(true),
            data: { credencialesPage: page },
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
        ],
        [filtros, tipoOpciones],
    );

    return (
        <>
            <AdaptiveLayout
                pageTitle="Credenciales"
                icon={CreditCard}
                pageDescription="Gestión de credenciales de acceso físico"
                browserTitle="Credenciales"
                breadcrumbs={[{ title: 'Credenciales', href: index.url() }]}
                quickActions={[
                    {
                        id: 'nueva-credencial',
                        label: 'Generar nueva credencial',
                        icon: Plus,
                        onClick: () => setDrawerOpen(true),
                    },
                ]}
            >
                <AdaptiveTable
                    ref={tableRef}
                    data={credenciales}
                    columns={columns}
                    MobileTemplate={CredencialMobileCard}
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
                                items={filterItems}
                                onApply={(data) => {
                                    tableRef.current?.resetPagination();
                                    router.reload({
                                        onStart: () => setProcessing(true),
                                        data: {
                                            ...filtros,
                                            ...data,
                                            credencialesPage: 1,
                                        },
                                        onFinish: () => setProcessing(false),
                                    });
                                }}
                            />
                        </div>
                    }
                />
            </AdaptiveLayout>

            <NuevaCredencialDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                tipoOpciones={tipoOpciones}
                vehiculoOpciones={vehiculoOpciones}
            />
        </>
    );
}
