import { Toaster } from 'sonner';

import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
    bellComponent,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
    bellComponent?: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate
            breadcrumbs={breadcrumbs}
            bellComponent={bellComponent}
        >
            {children}
            <Toaster position={'top-right'} richColors={true} />
        </AppLayoutTemplate>
    );
}
