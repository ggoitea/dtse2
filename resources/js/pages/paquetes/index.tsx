import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router, setLayoutProps } from '@inertiajs/react';
import { Package } from 'lucide-react';

import { AdaptiveTable } from '@/components/blocks/adaptive-table';
import type {
    CollectionData,
    DataTableRef,
} from '@/components/blocks/data-table';
import InputSimpleSearch from '@/components/blocks/input-simple-search';
import { usePermissions } from '@/hooks/use-permissions';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { create, index } from '@/routes/paquetes';

import { columns } from './components/index-columns';
import PaqueteMobileCard from './components/index-mobile-card';
import type { PaqueteTuristico } from './types/paquete';

interface Props {
    paquetes: CollectionData<PaqueteTuristico>;
    filtros: {
        buscar: string | null;
    };
}

export default function PaquetesIndex({ paquetes, filtros }: Props) {

    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);
    const { can } = usePermissions();
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

    const goToCreate = () => {
        router.visit(create.url());
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
                    icon: Package,
                    onClick: goToCreate,
                    show: can('paquetes.create'),
                },
            ],
        });
    }, []);

    return (
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
    );
}

PaquetesIndex.layout = [AdaptiveLayout];
