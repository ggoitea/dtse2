import type { InertiaLinkProps } from '@inertiajs/react';
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatTimeAgo(isoString: string): string {
    try {
        const date = new Date(isoString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 5) {
            return 'Ahora mismo';
        }

        if (seconds < 60) {
            return `Hace ${seconds} s`;
        }

        const minutes = Math.floor(seconds / 60);

        if (minutes < 60) {
            return `Hace ${minutes} min`;
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            return `Hace ${hours} h`;
        }

        const days = Math.floor(hours / 24);

        if (days === 1) {
            return 'Ayer';
        }

        if (days < 7) {
            return `Hace ${days} días`;
        }

        // Fallback to standard Spanish short date format (DD/MM/YYYY)
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    } catch (_err) {
        console.log('Error parsing date:', _err);

        return 'Hace poco';
    }
}
