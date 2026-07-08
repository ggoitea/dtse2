import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { tablaConFiltros } from '@/routes/ejemplo';

interface Props {
    usuario: {
        name: string;
    };
}

export default function TablaConFiltrosShowPage({ usuario }: Props) {
    return <div>ejemplo show del usuario: {usuario.name}</div>;
}

TablaConFiltrosShowPage.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        pageTitle="Usuario"
        pageDescription="Muestra detalles de un usuario en particular"
        browserTitle="Usuario"
        breadcrumbs={[
            { title: 'Tabla con filtros', href: tablaConFiltros.url() },
            { title: 'Usuario', href: '#' },
        ]}
    >
        {page}
    </AdaptiveLayout>
);
