import type { InertiaLinkProps } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

import { useActiveUrl } from '@/hooks/use-active-url';
import { usePermissions } from '@/hooks/use-permissions';

export interface NavItemBottomMobile {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
    can?: string[];
    hasRole?: string[];
}

interface BottomNavProps {
    items: NavItemBottomMobile[];
}

export function BottomNav({ items }: BottomNavProps) {
    const { urlIsActive } = useActiveUrl();
    const { canAny, hasAnyRole } = usePermissions();

    return (
        <nav
            id="bottom-nav"
            className="pb-safe fixed right-0 bottom-0 left-0 z-40 border-t border-white/5 bg-[#0f0f0f]"
        >
            <div className="mx-auto flex h-20 max-w-lg items-end justify-around">
                {items.map((item, index) => {
                    if (
                        (item.can && !canAny(item.can)) ||
                        (item.hasRole && !hasAnyRole(item.hasRole))
                    ) {
                        return null;
                    }

                    const isActive = urlIsActive(item.href); // || item.isActive;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={index}
                            prefetch={['mount', 'click']}
                            cacheFor="30s"
                            href={item.href}
                            className="relative flex h-full w-full flex-col items-center justify-center gap-1 transition-colors"
                        >
                            <div
                                className={`p-1 transition-colors ${isActive ? 'text-orange-500' : 'text-white/40 hover:text-white/60'}`}
                            >
                                {Icon && <Icon className="h-6 w-6" />}
                            </div>
                            <span
                                className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${isActive ? 'text-orange-500' : 'text-white/30'}`}
                            >
                                {item.title}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="active-indicator"
                                    className="absolute bottom-1 h-1 w-1 rounded-full bg-orange-500"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
