import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router, setLayoutProps } from '@inertiajs/react';
import { Package, Plus } from 'lucide-react';

import { AdaptiveTable } from '@/components/blocks/adaptive-table';
import type {
    CollectionData,
    DataTableRef,
} from '@/components/blocks/data-table';
import InputSimpleSearch from '@/components/blocks/input-simple-search';
import { usePermissions } from '@/hooks/use-permissions';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { index } from '@/routes/paquetes';

import CreatePaqueteDrawer from './components/create-drawer';
import { columns } from './components/index-columns';
import PaqueteMobileCard from './components/index-mobile-card';
import type { PaqueteTuristico } from './types/paquete';

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

interface Props {
    paquetes: CollectionData<PaqueteTuristico>;
    filtros: {
        buscar: string | null;
    };
    localidades: Localidad[];
    sitios: Sitio[];
    eventos: Evento[];
    categorias: CategoriaOption[];
}

export default function PaquetesIndex({
    paquetes,
    filtros,
    localidades,
    sitios,
    eventos,
    categorias,
}: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);
    const [showCreateDrawer, setShowCreateDrawer] = useState(false);
    const { hasAnyRole } = usePermissions();
    const { t } = useTranslation(['paquetes', 'common']);

    const handleSearch = (value: string) => {
        tableRef.current?.resetPagination();
        router.reload({
            onStart: () => setProcessing(true),
            data: { ...filtros, buscar: value, page: 1 },
            onFinish: () => setProcessing(false),
        });
    };

    const handlePageChange = (page: number) => {
        router.reload({
            onStart: () => setProcessing(true),
            data: { ...filtros, page },
            onFinish: () => setProcessing(false),
        });
    };

    useEffect(() => {
        setLayoutProps({
            pageTitle: t('page_title'),
            pageDescription: t('page_description'),
            browserTitle: t('page_title'),
            icon: Package,
            breadcrumbs: [{ title: t('page_title'), href: index.url() }],
            quickActions: [
                {
                    id: 'new-paquete',
                    label: t('nuevo_paquete'),
                    icon: Plus,
                    onClick: () => setShowCreateDrawer(true),
                    show: hasAnyRole(['owner']),
                },
            ],
        });
    }, []);

    return (
        <>
            <AdaptiveTable
                ref={tableRef}
                columns={columns}
                data={paquetes}
                MobileTemplate={PaqueteMobileCard}
                onPageChange={handlePageChange}
                header={
                    <InputSimpleSearch
                        className="max-w-xs"
                        placeholder={`${t('common:buscar')}...`}
                        value={filtros.buscar ?? ''}
                        processing={processing}
                        onSearch={handleSearch}
                    />
                }
            />

            <CreatePaqueteDrawer
                open={showCreateDrawer}
                onOpenChange={setShowCreateDrawer}
                localidades={localidades}
                sitios={sitios}
                eventos={eventos}
                categorias={categorias}
            />
        </>
    );
}

PaquetesIndex.layout = [AdaptiveLayout];
