import type { ImgHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export default function AppLogoIcon({
    className,
    alt = 'Barrio Blindado',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            alt={alt}
            src="/img/logo_isotipo500x500.png"
            className={cn('object-contain', className)}
        />
    );
}
