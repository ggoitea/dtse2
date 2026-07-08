import {
    BadgeAlert,
    Bell,
    Building2,
    DoorOpen,
    Home,
    LayoutGrid,
    Settings,
    ShieldCheck,
    UserCog2,
} from 'lucide-react';

import type { NavItemBottomMobile } from '@/layouts/adaptative/BottomNav';
import { dashboard, launcher } from '@/routes';
import RegistroDeCredenciales from '@/routes/credenciales';
import profile from '@/routes/profile';
import propiedades from '@/routes/propiedades';
import perfilPropietario from '@/routes/propietario/perfil';
import RegistroDeAccesos from '@/routes/vigilancia/accesos';
import RegistroDeAvisos from '@/routes/vigilancia/avisos';
import ControlDeAcceso from '@/routes/vigilancia/control-de-accesos';
import PerfilGuardia from '@/routes/vigilancia/perfil';
import RegistroDeReclamos from '@/routes/vigilancia/reclamos';
import type { NavItem } from '@/types';

export const accesoRapido: NavItemBottomMobile[] = [
    // Comun
    {
        title: 'Inicio',
        href: launcher(),
        icon: Home,
        isActive: false,
        hasRole: ['owner', 'propietario', 'security'],
    },

    // Propietarios
    {
        title: 'Perfil',
        href: perfilPropietario.edit(),
        icon: UserCog2,
        isActive: false,
        hasRole: ['propietario'],
    },
    {
        title: 'Accesos',
        href: RegistroDeCredenciales.index(),
        icon: ShieldCheck,
        isActive: false,
        hasRole: ['propietario'],
    },
    {
        title: 'Registro',
        href: RegistroDeAccesos.index(),
        icon: DoorOpen,
        isActive: false,
        hasRole: ['propietario'],
    },
    {
        title: 'Avisos',
        href: RegistroDeAvisos.index(),
        icon: Bell,
        hasRole: ['propietario'],
    },
    {
        title: 'Reclamos',
        href: RegistroDeReclamos.index(),
        icon: BadgeAlert,
        hasRole: ['propietario'],
    },

    // Seguridad
    {
        title: 'Perfil',
        href: PerfilGuardia.edit(),
        icon: UserCog2,
        isActive: false,
        hasRole: ['security'],
    },
    {
        title: 'Accesos',
        href: ControlDeAcceso.index(),
        icon: ShieldCheck,
        isActive: false,
        hasRole: ['security'],
    },
    {
        title: 'Registro',
        href: RegistroDeAccesos.index(),
        icon: DoorOpen,
        isActive: false,
        hasRole: ['security'],
    },
    {
        title: 'Avisos',
        href: RegistroDeAvisos.index(),
        icon: Bell,
        hasRole: ['security'],
    },

    // owner
    {
        title: 'Propiedades',
        href: propiedades.index(),
        icon: Building2,
        isActive: true,
        hasRole: ['owner'],
    },
    {
        title: 'Accesos',
        href: RegistroDeAccesos.index(),
        icon: DoorOpen,
        isActive: false,
        hasRole: ['owner'],
    },
    {
        title: 'Configuración',
        href: profile.edit(),
        icon: Settings,
        isActive: false,
        hasRole: ['owner'],
    },
];

export const menuPrincipalBarrio: NavItem[] = [
    {
        title: 'Tablero',
        href: dashboard(),
        icon: LayoutGrid,
        hasRole: ['owner'],
    },
    {
        title: 'Propiedades',
        href: propiedades.index(),
        icon: Building2,
        hasRole: ['owner'],
    },
    {
        title: 'Registro de accesos',
        href: RegistroDeAccesos.index(),
        icon: DoorOpen,
        hasRole: ['owner'],
    },
    {
        title: 'Registro de reclamos',
        href: RegistroDeReclamos.index(),
        icon: BadgeAlert,
        hasRole: ['owner'],
    },
];

const menuPropietarios: NavItem[] = [
    {
        title: 'Perfil',
        href: perfilPropietario.edit(),
        icon: UserCog2,
        isActive: false,
        hasRole: ['propietario'],
    },
    {
        title: 'Accesos',
        href: RegistroDeCredenciales.index(),
        icon: ShieldCheck,
        isActive: false,
        hasRole: ['propietario'],
    },
    {
        title: 'Avisos',
        href: RegistroDeAvisos.index(),
        icon: Bell,
        hasRole: ['propietario'],
    },
    {
        title: 'Registro',
        href: RegistroDeAccesos.index(),
        icon: DoorOpen,
        isActive: false,
        hasRole: ['propietario'],
    },
    {
        title: 'Reclamos',
        href: RegistroDeReclamos.index(),
        icon: BadgeAlert,
        hasRole: ['propietario'],
    },
];

const menuSeguridad: NavItem[] = [
    {
        title: 'Perfil',
        href: PerfilGuardia.edit(),
        icon: UserCog2,
        isActive: false,
        hasRole: ['security'],
    },
    {
        title: 'Control de accesos',
        href: ControlDeAcceso.index(),
        icon: ShieldCheck,
        isActive: false,
        hasRole: ['security'],
    },
    {
        title: 'Registro de accesos',
        href: RegistroDeAccesos.index(),
        icon: DoorOpen,
        hasRole: ['security'],
    },
    {
        title: 'Avisos',
        href: RegistroDeAvisos.index(),
        icon: Bell,
        hasRole: ['security'],
    },
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
    {
        label: 'Propietarios',
        items: menuPropietarios,
    },
    {
        label: 'Seguridad',
        items: menuSeguridad,
    },
];
