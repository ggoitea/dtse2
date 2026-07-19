import { Link } from '@inertiajs/react';

// import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-card sm:bg-background sm:p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8 bg-card p-6 sm:rounded-xl sm:border sm:shadow-sm">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href="/"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <img
                                src="/img/logo_isologo748x334.png"
                                alt="Barrio Blindado"
                                className="h-18 w-auto sm:h-22 dark:hidden"
                            />
                            <img
                                src="/img/logo-vb.png"
                                alt="Barrio Blindado"
                                className="hidden h-18 w-auto sm:h-22 dark:block"
                            />
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
