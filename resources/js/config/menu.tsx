import {
    BadgeAlert,
    Bell,
    Building2,
    CalendarDays,
    ChartArea,
    Compass,
    DoorOpen,
    Heart,
    Home,
    LayoutGrid,
    Map,
    Settings,
    ShieldCheck,
    UserCog2,
} from 'lucide-react';

import type { NavItemBottomMobile } from '@/layouts/adaptative/BottomNav';
import { dashboard, launcher } from '@/routes';
import type { NavItem } from '@/types';

export const accesoRapido: NavItemBottomMobile[] = [
    // Comun
    {
        title: 'Explorar',
        href: launcher(),
        icon: Compass,
        isActive: false,
        hasRole: ['owner', 'propietario', 'security'],
    },
    {
        title: 'Eventos',
        href: dashboard(),
        icon: CalendarDays,
        isActive: false,
        hasRole: ['owner', 'propietario', 'security'],
    },
    {
        title: 'Mapa',
        href: launcher(),
        icon: Map,
        isActive: false,
        hasRole: ['owner', 'propietario', 'security'],
    },
    {
        title: 'Favoritos',
        href: launcher(),
        icon: Heart,
        isActive: false,
        hasRole: ['owner', 'propietario', 'security'],
    },


];

export const menuPrincipalBarrio: NavItem[] = [
    {
        title: 'Tablero',
        href: dashboard(),
        icon: LayoutGrid,
        hasRole: ['owner'],
    },
    // {
    //     title: 'Propiedades',
    //     href: propiedades.index(),
    //     icon: Building2,
    //     hasRole: ['owner'],
    // },
    // {
    //     title: 'Registro de accesos',
    //     href: RegistroDeAccesos.index(),
    //     icon: DoorOpen,
    //     hasRole: ['owner'],
    // },
    // {
    //     title: 'Registro de reclamos',
    //     href: RegistroDeReclamos.index(),
    //     icon: BadgeAlert,
    //     hasRole: ['owner'],
    // },
];

export interface MenuGroup {
    label: string;
    items: NavItem[];
}

export const menuGroups: MenuGroup[] = [
    {
        label: 'Barrio',
        items: menuPrincipalBarrio,
    },
];
