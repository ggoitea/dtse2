import { Link } from '@inertiajs/react';

import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side: Visual/Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/img/novedades_hero.png')" }}
                />
                <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-[2px]" />

                {/* Branding Content */}
                <div className="relative z-20 text-white max-w-lg">
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-4 py-2 backdrop-blur-md">
                        <span className="font-semibold tracking-wider">DTSE</span>
                    </div>
                    <h1 className="mb-6 text-5xl font-bold leading-tight">
                        Turismo Santiago del Estero
                    </h1>
                    <p className="mb-10 text-lg leading-relaxed opacity-90">
                        El portal a la cultura, el bienestar y la aventura en el corazón de Argentina.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="rounded-xl border border-white/20  p-6 backdrop-blur-md">
                            <div className="mb-1 text-3xl font-bold">Con tu cuenta</div>
                            <div className="text-sm uppercase tracking-tighter opacity-80">
                                Registrate gratis y aprovechá todos los beneficios disponibles para usuarios registrados.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="relative flex w-full items-center justify-center bg-background p-6 md:p-12 lg:w-1/2 lg:p-24">
                {/* Mobile Logo */}
                <div className="absolute left-8 top-8 flex items-center gap-2 lg:hidden">
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/img/LogoDTSE2.png"
                            alt="DTSE LOGO"
                            className="h-10 w-auto dark:hidden"
                        />
                        <img
                            src="/img/LogoDTSE_dark.png"
                            alt="DTSE LOGO"
                            className="hidden h-10 w-auto dark:block"
                        />
                    </Link>
                </div>

                <div className="w-full max-w-md space-y-8">
                    {/* Header */}
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
                        <p className="text-muted-foreground">{description}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
