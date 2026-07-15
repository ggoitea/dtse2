import {
    Compass,
    Heart,
    Map,
    Sparkles,
} from 'lucide-react';

import type { NavItemBottomMobile } from '@/layouts/adaptative/BottomNav';
import { landing } from '@/routes';

export const accesoRapido: NavItemBottomMobile[] = [
    {
        title: 'Novedades',
        href: landing(),
        icon: Compass,
        isActive: false,
    },
    {
        title: 'Mapa',
        href: '/sitios',
        icon: Map,
        isActive: false,
    },
    {
        title: 'Uritu',
        href: '/',
        icon: Sparkles,
        isActive: false,
    },
    {
        title: 'Favoritos',
        href: '/',
        icon: Heart,
        isActive: false,
    },
];

export interface MenuGroup {
    label: string;
    items: [];
}

export const menuPrincipalBarrio: [] = [];

export const menuGroups: MenuGroup[] = [];
