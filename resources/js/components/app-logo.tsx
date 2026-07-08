import type { ImgHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export default function AppLogo({
    className,
    alt = 'Barrio Blindado',
    darkSrc,
    ...props
}: ImgHTMLAttributes<HTMLImageElement> & { darkSrc?: string }) {
    const lightClassName = cn(
        'object-contain',
        darkSrc ? 'dark:hidden' : null,
        className,
    );
    const darkClassName = cn('hidden object-contain dark:block', className);

    return (
        <>
            <img
                {...props}
                alt={alt}
                src="/img/logo_isologo748x334.png"
                className={lightClassName}
            />
            {darkSrc ? (
                <img
                    {...props}
                    alt={alt}
                    src={darkSrc}
                    className={darkClassName}
                />
            ) : null}
        </>
    );
}
