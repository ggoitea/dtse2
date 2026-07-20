import type { ComponentType, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Toaster } from 'sonner';

import PageSection from '@/components/blocks/page-section';
import { FloatingAssistant } from '@/components/floating-assistant';
import { Button } from '@/components/ui/button';
import { useMenu } from '@/hooks/use-menu';
import { useIsMobile } from '@/hooks/use-mobile';

import { BottomNav } from './adaptative/BottomNav';
import { FloatingActionButton } from './adaptative/FloatingActionButton';
import { Header } from './adaptative/Header';
import AppLayout from './app-layout';

const ZonaActionBuilder = ({
    quickActions,
}: {
    quickActions: QuickAction[];
}): ReactNode => {
    return (
        <div className="flex flex-row gap-2">
            {quickActions
                .filter((action) => action.show !== false)
                .map((action) => (
                    <Button
                        size={'sm'}
                        key={action.id}
                        onClick={action.onClick}
                        variant="outline"
                        onMouseOver={action.prefetch}
                    >
                        <action.icon />
                        {action.label}
                    </Button>
                ))}
        </div>
    );
};

export interface QuickAction {
    id: string;
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    prefetch?: () => void;
    color?: string;
    show?: boolean;
}

export interface AdaptiveLayoutProps {
    pageTitle?: string;
    pageDescription?: string;
    browserTitle?: string;
    children: React.ReactNode;
    headerActions?: React.ReactNode;
    quickActions?: QuickAction[];
    avatarUrl?: string;
    breadcrumbs?: { title: string; href: string }[];
    zoneActions?: React.ReactNode;
    icon?: ComponentType<{ size?: number | string; className?: string }>;
}

export function AdaptiveLayout({
    pageTitle,
    pageDescription,
    browserTitle,
    zoneActions,
    children,

    headerActions,
    icon,
    quickActions = [],
    breadcrumbs,
}: AdaptiveLayoutProps) {
    const isMobile = useIsMobile();
    const { accesoRapido } = useMenu();


    if (!isMobile) {
        return (
            <>
                <AppLayout breadcrumbs={breadcrumbs}>
                    <PageSection
                        pageTitle={pageTitle}
                        pageDescription={pageDescription}
                        browserTitle={browserTitle}
                        zoneActions={ZonaActionBuilder({
                            quickActions: quickActions,
                        })}
                    >
                        {children}
                    </PageSection>
                </AppLayout>
            </>
        );
    }

    return (
        <>
            <div className="flex h-dvh flex-col bg-background font-sans text-foreground selection:bg-white/20">
                {/* Header */}
                <Header title={pageTitle} actions={headerActions} icon={icon} />
                {/* Main Content Area */}
                <main className="mx-auto w-full max-w-lg flex-1 overflow-y-auto px-4 pt-20 pb-16">
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {zoneActions}
                        </motion.div>
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Floating Action Button Group */}
                <FloatingActionButton
                    actions={quickActions.filter(
                        (action) => action.show !== false,
                    )}
                />

                {/* Floating draggable assistant bubble */}
                <FloatingAssistant />

                {/* Bottom Navigation */}
                <BottomNav items={accesoRapido} />
                <Toaster position={'top-center'} richColors={true} />
            </div>
        </>
    );
}
