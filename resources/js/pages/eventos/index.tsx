import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router, usePage } from '@inertiajs/react';
import { Calendar } from 'lucide-react';

import { AdaptiveTable } from '@/components/blocks/adaptive-table';
import type {
    CollectionData,
    DataTableRef,
} from '@/components/blocks/data-table';
import InputSimpleSearch from '@/components/blocks/input-simple-search';
import { usePermissions } from '@/hooks/use-permissions';
import { AdaptiveLayout } from '@/layouts/adaptative-layout';
import { create, index } from '@/routes/eventos';

import { columns } from './components/index-columns';
import EventoMobileCard from './components/index-mobile-card';
import type { Evento } from './types/evento';

interface Props {
    eventos: CollectionData<Evento>;
    filtros: {
        buscar: string | null;
    };
}

export default function EventosIndex({ eventos, filtros }: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);
    const { can } = usePermissions();
    const { t } = useTranslation(['eventos', 'common']);

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

    return (
        <AdaptiveLayout
            pageTitle={t('page_title')}
            pageDescription={t('page_description')}
            browserTitle={t('page_title')}
            icon={Calendar}
            breadcrumbs={[{ title: t('page_title'), href: index.url() }]}
            quickActions={[
                {
                    id: 'new-evento',
                    label: t('crear_evento'),
                    icon: Calendar,
                    onClick: goToCreate,
                    show: can('eventos.create'),
                },
            ]}
        >
            <AdaptiveTable
                ref={tableRef}
                columns={columns}
                data={eventos}
                MobileTemplate={EventoMobileCard}
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
        </AdaptiveLayout>
    );
}
