import { Paintbrush } from 'lucide-react';

import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';

export default function Appearance() {
    return (
        <SettingsLayout>
            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Configuración de apariencia"
                    description="Actualiza la apariencia de tu cuenta"
                />
                <AppearanceTabs />
            </div>
        </SettingsLayout>
    );
}

Appearance.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        browserTitle="Apariencia"
        icon={Paintbrush}
        breadcrumbs={[
            { title: 'Configuración', href: editProfile().url },
            { title: 'Apariencia', href: editAppearance().url },
        ]}
    >
        {page}
    </AdaptiveLayout>
);
