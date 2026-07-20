import type { ComponentType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, router, usePage } from '@inertiajs/react';
import { Globe, LogIn, LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { login, logout } from '@/routes';

interface HeaderProps {
    title?: string;
    icon?: ComponentType<{ size?: number | string; className?: string }>;
    actions?: ReactNode;
}

export function Header({ title, actions }: HeaderProps) {
    const { i18n } = useTranslation();
    const { resolvedAppearance } = useAppearance();
    const { auth } = usePage().props;
    const cleanup = useMobileNavigation();
    console.log(auth.user);
    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const handleLanguageChange = (locale: 'es' | 'en' | 'qu' | 'pt') => {
        i18n.changeLanguage(locale);
    };

    return (
        <header
            id="header"
            className="fixed top-0 right-0 left-0 z-40 border-b border-card-foreground/5 bg-card/80 backdrop-blur-md"
        >
            <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    {resolvedAppearance == 'dark' ? (
                        <img
                            src="/img/LogoDTSE_dark.png"
                            alt="Logo"
                            className="h-12"
                        />
                    ) : (
                        <img
                            src="/img/LogoDTSE2.png"
                            alt="Logo"
                            className="h-12"
                        />
                    )}

                    {title && (
                        <h1
                            id="header-title"
                            className="text-lg font-medium tracking-tight text-card-foreground/90"
                        >
                            {title}
                        </h1>
                    )}
                </div>

                <div id="header-actions" className="flex items-center gap-2">
                    {actions || <div></div>}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                aria-label="Seleccionar idioma"
                            >
                                <Globe className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => handleLanguageChange('es')}
                            >
                                <span className="mr-2">🇪🇸</span>
                                Español
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleLanguageChange('en')}
                            >
                                <span className="mr-2">🇺🇸</span>
                                English
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleLanguageChange('qu')}
                            >
                                <span className="mr-2">🇵🇪</span>
                                Quechua
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleLanguageChange('pt')}
                            >
                                <span className="mr-2">🇧🇷</span>
                                Português
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {auth.user ? (
                        <Link
                            href={logout()}
                            as="button"
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-card-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Salir</span>
                        </Link>
                    ) : (
                        <Link
                            href={login()}
                            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-card-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <LogIn className="h-4 w-4" />
                            <span className="hidden sm:inline">Ingresar</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
