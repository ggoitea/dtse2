import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';

import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { dashboard } from '@/routes';

export default function Dashboard() {
    const { t } = useTranslation();

    return (
        <AdaptiveLayout
            pageTitle="Dashboard"
            pageDescription="Panel principal de la aplicación"
            browserTitle="Dashboard"
            icon={LayoutGrid}
            breadcrumbs={[{ title: 'Dashboard', href: dashboard().url }]}
        >
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="flex h-full items-center justify-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('guillermo')}
                            </p>
                        </div>
                        <img src="img/logo_diseño.jpg" />
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    <img src="img/logo_diseño.jpg" />
                </div>
            </div>
        </AdaptiveLayout>
    );
}
