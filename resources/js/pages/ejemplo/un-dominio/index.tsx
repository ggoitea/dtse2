import { Cog, Plus } from 'lucide-react';

import type { QuickAction } from '@/layouts/adaptive-layout';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { esqueleto } from '@/routes/ejemplo';

const quickActions: QuickAction[] = [
    {
        id: 'accion-2',
        label: 'Accion 2',
        icon: Cog,
        onClick: () => {},
    },
    {
        id: 'accion-1',
        label: 'Accion 1',
        icon: Plus,
        onClick: () => {},
    },
];

export default function UnDominioIndexPage() {
    return <>Contenido principal de la web</>;
}

UnDominioIndexPage.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        pageTitle="Ejemplo estandar index"
        pageDescription="Esta es una pagina de ejemplo para mostrar la distribucion de componentes en la vista"
        browserTitle="Ejemplo estandar index"
        quickActions={quickActions}
        breadcrumbs={[
            { title: 'Ejemplos', href: esqueleto.url() },
            { title: 'Un Dominio', href: esqueleto.url() },
        ]}
    >
        {page}
    </AdaptiveLayout>
);
