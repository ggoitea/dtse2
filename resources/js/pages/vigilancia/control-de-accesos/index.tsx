import { useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { ClipboardPen, QrCode, ShieldCheck } from 'lucide-react';

import { AdaptiveTable } from '@/components/blocks/adaptive-table';
import type {
    CollectionData,
    DataTableRef,
} from '@/components/blocks/data-table';
import InputSimpleSearch from '@/components/blocks/input-simple-search';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { index } from '@/routes/vigilancia/control-de-accesos';

import CredencialAccesoMobileCard from './components/credencial-acceso-mobile-card';
import { columns } from './components/index-columns';
import RegistrarAccesoDrawer from './components/registrar-acceso-drawer';
import ScanQrDrawer from './components/scan-qr-drawer';
import type { CredencialAcceso, PropiedadOpcion } from './types/control-acceso';

interface Filtros {
    buscar: string | null;
}

interface Props {
    credenciales: CollectionData<CredencialAcceso>;
    filtros: Filtros;
    propiedades: PropiedadOpcion[];
    vehiculoOpciones: { value: string; label: string }[];
}

export default function ControlAccesosIndex({
    credenciales,
    filtros,
    propiedades,
    vehiculoOpciones,
}: Props) {
    const tableRef = useRef<DataTableRef>(null);
    const [processing, setProcessing] = useState(false);
    const [registrarOpen, setRegistrarOpen] = useState(false);
    const [scanOpen, setScanOpen] = useState(false);

    const handleSearch = (value: string) => {
        tableRef.current?.resetPagination();
        router.reload({
            onStart: () => setProcessing(true),
            data: { buscar: value, credencialesPage: 1 },
            onFinish: () => setProcessing(false),
        });
    };

    const handlePageChange = (page: number) => {
        router.reload({
            onStart: () => setProcessing(true),
            data: { credencialesPage: page },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <AdaptiveLayout
                pageTitle="Control de Acceso"
                icon={ShieldCheck}
                pageDescription="Gestión de ingresos físicos al barrio"
                browserTitle="Control de Acceso"
                breadcrumbs={[
                    { title: 'Control de Acceso', href: index.url() },
                ]}
                quickActions={[
                    {
                        id: 'registrar',
                        label: 'Registrar',
                        icon: ClipboardPen,
                        onClick: () => setRegistrarOpen(true),
                    },
                    {
                        id: 'scan',
                        label: 'Scan',
                        icon: QrCode,
                        onClick: () => setScanOpen(true),
                    },
                ]}
            >
                <AdaptiveTable
                    ref={tableRef}
                    data={credenciales}
                    columns={columns}
                    MobileTemplate={CredencialAccesoMobileCard}
                    onPageChange={handlePageChange}
                    header={
                        <InputSimpleSearch
                            className="max-w-xs"
                            placeholder="Buscar por nombre, DNI o patente..."
                            value={filtros.buscar ?? ''}
                            processing={processing}
                            onSearch={handleSearch}
                        />
                    }
                />
            </AdaptiveLayout>

            <RegistrarAccesoDrawer
                open={registrarOpen}
                onOpenChange={setRegistrarOpen}
                propiedades={propiedades}
                vehiculoOpciones={vehiculoOpciones}
            />

            <ScanQrDrawer open={scanOpen} onOpenChange={setScanOpen} />
        </>
    );
}
