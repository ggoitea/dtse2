import { useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

import type {
    CollectionData,
    DataTableRef,
} from '@/components/blocks/data-table';
import { DataTable, TableSection } from '@/components/blocks/data-table';
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
import { Separator } from '@/components/ui/separator';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { tablaConFiltros } from '@/routes/ejemplo';
import type { User } from '@/types';

import { columns } from './components/index-columns';

const GeneroFilter = ({ onValueChange, value }: FilterComponentProps) => {
    return (
        <FieldGroup>
            <Field>
                <FieldLabel>Género</FieldLabel>
                <Select value={value} onValueChange={onValueChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona un género" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="femenino">Femenino</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                </Select>
            </Field>
        </FieldGroup>
    );
};

const AlturaFilter = ({ onValueChange, value }: FilterComponentProps) => {
    return (
        <FieldGroup>
            <Field>
                <FieldLabel>Altura</FieldLabel>
                <Input
                    type="number"
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    placeholder="Ingresa una altura"
                    className="w-full"
                />
            </Field>
        </FieldGroup>
    );
};

interface Props {
    usuarios: CollectionData<User>;
    filtros: {
        search: string;
        genero?: string | null;
        altura?: string | null;
    };
}

export default function TablaConFiltrosIndexPage({ filtros, usuarios }: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);

    const componentesDeFiltro: FilterItemProps[] = useMemo(
        () => [
            {
                key: 'altura',
                value: filtros.altura ?? null,
                component: AlturaFilter,
            },
            {
                key: 'genero',
                value: filtros.genero ?? null,
                component: GeneroFilter,
            },
        ],
        [filtros],
    );

    const handleFilterChange = (filter: string, value: string) => {
        tableRef.current?.resetPagination();
        router.reload({
            onStart: () => setProcessing(true),
            data: {
                ...filtros,
                [filter]: value,
                page: 1,
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handlePageChange = (page: number) => {
        router.reload({
            onStart: () => setProcessing(true),
            data: {
                page: page,
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Separator className="my-4" />
            <TableSection
                header={
                    <>
                        <div className="flex flex-row items-center justify-between">
                            <InputSimpleSearch
                                className="max-w-xs"
                                placeholder="Buscar..."
                                value={filtros.search}
                                processing={processing}
                                onSearch={(resul) => {
                                    handleFilterChange('search', resul);
                                }}
                            />
                        </div>
                        <FilterPopover
                            items={componentesDeFiltro}
                            onApply={(data) => {
                                console.log(data);
                            }}
                        />
                    </>
                }
            >
                <DataTable
                    ref={tableRef}
                    columns={columns}
                    data={usuarios}
                    onPageChange={(val) => handlePageChange(val)}
                />
            </TableSection>
        </>
    );
}

TablaConFiltrosIndexPage.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        pageTitle="Ejemplo tabla con filtros"
        pageDescription="Esta es una pagina de ejemplo para mostrar la distribucion de componentes en la vista"
        browserTitle="Ejemplo tabla con filtros"
        breadcrumbs={[
            { title: 'Ejemplos', href: tablaConFiltros.url() },
            { title: 'Tabla con filtros', href: tablaConFiltros.url() },
        ]}
    >
        {page}
    </AdaptiveLayout>
);
