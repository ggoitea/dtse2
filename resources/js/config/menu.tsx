import {
    Compass,
    Contact2,
    Heart,
    Map,
    MessageCircle,
    Package,
    Sparkles,
} from 'lucide-react';

import type { NavItemBottomMobile } from '@/layouts/adaptative/BottomNav';
import { landing } from '@/routes';
import { novedades } from '@/routes';
import { index as eventosIndex } from '@/routes/eventos';
import { index as paquetesIndex } from '@/routes/paquetes';
import { mapa } from '@/routes/sitios';

export const accesoRapido: NavItemBottomMobile[] = [
    {
        title: 'Novedades',
        href: novedades(),
        icon: Compass,
        isActive: false,
    },
    {
        title: 'Mapa',
        href: mapa(),
        icon: Map,
        isActive: false,
    },
    {
        title: 'Paquete turístico',
        href: paquetesIndex().url,
        icon: Package,
        isActive: false,
    },
    {
        title: 'Contactanos',
        href: '/',
        icon: MessageCircle,
        isActive: false,
    },
];

export interface MenuGroup {
    label: string;
    items: [];
}

export const menuPrincipalBarrio: [] = [];

export const menuGroups: MenuGroup[] = [];
