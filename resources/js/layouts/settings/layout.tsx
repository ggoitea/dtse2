import { type PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';

import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useActiveUrl } from '@/hooks/use-active-url';
import { usePermissions } from '@/hooks/use-permissions';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editPassword } from '@/routes/security';
import { index as rolesIndex } from '@/routes/settings/roles';
import { index as usersIndex } from '@/routes/settings/users';
import { show } from '@/routes/two-factor';
import { type NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Perfil',
        href: edit(),
        icon: null,
        // can: ['*'],
    },
    {
        title: 'Contraseña',
        href: editPassword(),
        icon: null,
        // can: ['*'],
    },
    {
        title: 'Autenticación 2FA',
        href: show(),
        icon: null,
        // can: ['*'],
    },
    {
        title: 'Usuarios',
        href: usersIndex(),
        icon: null,
        // can: ['*'],
    },
    {
        title: 'Roles',
        href: rolesIndex(),
        icon: null,
        // can: ['*'],
    },
    {
        title: 'Tema',
        href: editAppearance(),
        icon: null,
        // can: ['*'],
    },
];

interface SettingsLayoutProps extends PropsWithChildren {
    wide?: boolean;
}

export default function SettingsLayout({
    children,
    wide,
}: SettingsLayoutProps) {
    const { urlIsActive } = useActiveUrl();

    const { canAny } = usePermissions();

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <div className="">
            <Heading
                title="Configuración"
                description="Administra tu perfil y la configuración de tu cuenta"
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => {
                            if (item.can && canAny(item.can) === false) {
                                return null;
                            }

                            return (
                                <Button
                                    key={`${toUrl(item.href)}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start', {
                                        'bg-muted': urlIsActive(item.href),
                                    })}
                                >
                                    <Link href={item.href}>
                                        {item.icon && (
                                            <item.icon className="h-4 w-4" />
                                        )}
                                        {item.title}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div
                    className={cn('flex-1 md:max-w-2xl', {
                        'md:max-w-none': wide,
                    })}
                >
                    <section
                        className={cn('max-w-xl space-y-12', {
                            'max-w-none': wide,
                        })}
                    >
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
