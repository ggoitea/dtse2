import { useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { ClipboardList, Plus, Printer } from 'lucide-react';

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
import { index, pdf } from '@/routes/vigilancia/reclamos';

import { columns } from './components/index-columns';
import ReclamoMobileCard from './components/index-mobile-card';
import { ReclamoDrawer } from './components/reclamo-drawer';
import type { Reclamo } from './types/reclamo';

// ---------------------------------------------------------------------------
// Interfaces de props del servidor
// ---------------------------------------------------------------------------

interface Filtros {
    buscar: string | null;
    propiedad_id: string | null;
    desde: string | null;
    hasta: string | null;
}

interface OpcionEnum {
    value: string;
    label: string;
}

interface PropiedadOpcion {
    value: number;
    label: string;
}

interface Props {
    reclamos: CollectionData<Reclamo>;
    filtros: Filtros;
    propiedades: PropiedadOpcion[];
    estadoOpciones: OpcionEnum[];
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
                        <SelectItem key={p.value} value={String(p.value)}>
                            {p.label}
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

export default function ReclamosIndex({
    reclamos,
    filtros,
    propiedades,
}: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { hasRole } = usePermissions();

    // Búsqueda con debounce interno de InputSimpleSearch
    const handleSearch = (value: string) => {
        tableRef.current?.resetPagination();
        router.reload({
            onStart: () => setProcessing(true),
            data: { ...filtros, buscar: value, reclamosPage: 1 },
            onFinish: () => setProcessing(false),
        });
    };

    const handlePageChange = (page: number) => {
        router.reload({
            onStart: () => setProcessing(true),
            data: { reclamosPage: page },
            onFinish: () => setProcessing(false),
        });
    };

    // Construir los items del FilterPopover con closures para acceder a las
    // props del servidor (propiedades) que los componentes necesitan.
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
        [filtros, propiedades],
    );

    const handleImprimir = () => {
        const queryParams: Record<string, string> = {};

        if (filtros.buscar) {
            queryParams.buscar = filtros.buscar;
        }

        if (filtros.propiedad_id) {
            queryParams.propiedad_id = filtros.propiedad_id;
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

    const canGenerarReclamos = hasRole('propietario');

    return (
        <>
            <AdaptiveLayout
                pageTitle="Reclamos"
                icon={ClipboardList}
                pageDescription="Registro de reclamos"
                browserTitle="Reclamos"
                breadcrumbs={[{ title: 'Reclamos', href: index.url() }]}
                quickActions={[
                    {
                        id: 'nuevo-reclamo',
                        label: 'Generar Nuevo Reclamo',
                        icon: Plus,
                        onClick: () => setDrawerOpen(true),
                        show: canGenerarReclamos,
                    },
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
                    data={reclamos}
                    columns={columns}
                    MobileTemplate={ReclamoMobileCard}
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
                                            reclamosPage: 1,
                                        },
                                        onFinish: () => setProcessing(false),
                                    });
                                }}
                            />
                        </div>
                    }
                />
            </AdaptiveLayout>

            <ReclamoDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
        </>
    );
}
