import type { User } from '@/types';

export interface UserLegajoTicket {
    id: number;
    ticket_nro_formateado: string;
    cliente: {
        id: number;
        razon_social: string;
    };
    descripcion: string;
    prioridad: string;
    prioridad_label: string;
    estado: string;
    estado_label: string;
    created_at: string | null;
}

export interface UserLegajoProps {
    user: Pick<
        User,
        'id' | 'name' | 'username' | 'email' | 'dni' | 'telefono' | 'direccion'
    > & {
        role?: string | null;
        created_at: string | null;
    };
    performance: {
        filters: {
            mode: 'year' | 'month' | 'range';
            year: string | null;
            month: string | null;
            date_from: string | null;
            date_to: string | null;
        };
        kpis: {
            correctivos: number;
            preventivos: number;
            total: number;
        };
        chart: {
            title: string;
            points: Array<{
                label: string;
                correctivos: number;
                preventivos: number;
                total: number;
            }>;
        };
        correctivos: UserLegajoTicket[];
        preventivos: UserLegajoTicket[];
    };
    activity: {
        items: unknown[];
        message: string;
    };
}
