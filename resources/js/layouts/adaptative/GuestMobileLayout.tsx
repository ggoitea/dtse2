import type { ComponentType, ReactNode } from 'react';

import { Header } from './Header';

interface GuestMobileLayoutProps {
    title?: string;
    icon?: ComponentType<{ size?: number | string; className?: string }>;
    children: ReactNode;
}

export function GuestMobileLayout({
    title,
    icon,
    children,
}: GuestMobileLayoutProps) {
    return (
        <div className="min-h-screen bg-[#0A0A0A] font-sans text-[#E0E0E0] selection:bg-white/20">
            <Header title={title} icon={icon} />
            <main className="mx-auto max-w-lg px-4 pt-20 pb-6">{children}</main>
        </div>
    );
}
