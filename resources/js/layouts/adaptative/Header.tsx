import type { ComponentType, ReactNode } from 'react';
import { createElement } from 'react';
import { Layers } from 'lucide-react';

import { cn } from '@/lib/utils';

interface HeaderProps {
    title?: string;
    icon?: ComponentType<{ size?: number | string; className?: string }>;
    actions?: ReactNode;
}

export function Header({ title, icon, actions }: HeaderProps) {
    return (
        <header
            id="header"
            className="fixed top-0 right-0 left-0 z-40 border-b border-card-foreground/5 bg-card/80 backdrop-blur-md"
        >
            <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div
                        id="user-avatar"
                        className={cn(
                            'h-8 w-8 shrink-0 overflow-hidden rounded border border-card-foreground/10 bg-linear-to-tr from-orange-400 to-rose-400',
                            'flex items-center justify-center',
                        )}
                    >
                        {icon ? (
                            createElement(icon, {
                                size: 25,
                                className: 'text-white',
                            })
                        ) : (
                            <Layers
                                size={'32'}
                                className="text-card-foreground"
                            />
                        )}
                    </div>
                    {title && (
                        <h1
                            id="header-title"
                            className="text-lg font-medium tracking-tight text-card-foreground/90"
                        >
                            {title}
                        </h1>
                    )}
                </div>

                <div id="header-actions" className="flex items-center gap-2">
                    {actions || <div></div>}
                </div>
            </div>
        </header>
    );
}
