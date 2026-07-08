import { Link } from '@inertiajs/react';

import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useMenu } from '@/hooks/use-menu';
import { usePermissions } from '@/hooks/use-permissions';
import { dashboard, launcher } from '@/routes';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { hasRole } = usePermissions();
    const { menuAgrupado: menuGroups } = useMenu();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link
                                href={
                                    hasRole('owner') ? dashboard() : launcher()
                                }
                                prefetch
                            >
                                <AppLogo
                                    className="h-8 w-auto"
                                    darkSrc="/img/logo-hb.png"
                                />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {menuGroups.map((group) => (
                    <NavMain
                        key={group.label}
                        group={group.label}
                        items={group.items}
                    />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
