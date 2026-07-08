import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { useDebouncer } from '@tanstack/react-pacer';
import { Building2, Plus, Printer } from 'lucide-react';

import { AdaptiveTable } from '@/components/blocks/adaptive-table';
import type {
    CollectionData,
    DataTableRef,
} from '@/components/blocks/data-table';
import InputSimpleSearch from '@/components/blocks/input-simple-search';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { index, pdf } from '@/routes/propiedades';

import { columns } from './components/index-columns';
import { PropiedadDrawer } from './components/propiedad-drawer';
import PropiedadMobileGrid from './components/propiedad-mobile-grid';
import type { Propiedad } from './types/propiedad';

interface Filtros {
    buscar: string | null;
}

interface Props {
    propiedades: CollectionData<Propiedad>;
    filtros: Filtros;
}

export default function PropiedadesIndexPage({ propiedades, filtros }: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Listen for custom event dispatched by the layout's quickAction
    useEffect(() => {
        const handler = () => setDrawerOpen(true);
        document.addEventListener('abrir-nueva-propiedad', handler);

        return () =>
            document.removeEventListener('abrir-nueva-propiedad', handler);
    }, []);

    const searchDebouncer = useDebouncer(
        (value: string) => {
            if (tableRef.current) {
                tableRef.current.resetPagination();
            }

            router.reload({
                onStart: () => setProcessing(true),
                data: { ...filtros, buscar: value, propiedadesPage: 1 },
                onFinish: () => setProcessing(false),
            });
        },
        { wait: 500 },
    );

    const handleSearch = (value: string) => searchDebouncer.maybeExecute(value);

    const handlePageChange = (page: number) => {
        router.reload({
            onStart: () => setProcessing(true),
            data: { propiedadesPage: page },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdaptiveLayout
            pageTitle="Propiedades"
            icon={Building2}
            pageDescription="Listado de propiedades del barrio"
            browserTitle="Propiedades"
            breadcrumbs={[{ title: 'Propiedades', href: index.url() }]}
            quickActions={[
                {
                    id: 'nuevo-lote',
                    label: 'Nuevo lote',
                    icon: Plus,
                    onClick: () =>
                        document.dispatchEvent(
                            new CustomEvent('abrir-nueva-propiedad'),
                        ),
                },
                {
                    id: 'imprimir',
                    label: 'Imprimir',
                    icon: Printer,
                    onClick: () => {
                        const options = filtros.buscar
                            ? { query: { buscar: filtros.buscar } }
                            : undefined;
                        window.open(pdf.url(options), '_blank');
                    },
                },
            ]}
        >
            <AdaptiveTable
                data={propiedades}
                columns={columns}
                MobileTemplate={PropiedadMobileGrid}
                onPageChange={handlePageChange}
                tableRef={tableRef}
                header={
                    <div className="flex w-full flex-row items-center justify-between gap-4">
                        <InputSimpleSearch
                            className="max-w-xs"
                            placeholder="Buscar por nombre o DNI..."
                            value={filtros.buscar ?? ''}
                            processing={processing}
                            onSearch={handleSearch}
                        />
                    </div>
                }
            />

            <PropiedadDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                propiedad={null}
            />
        </AdaptiveLayout>
    );
}
