import * as React from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Command as CommandIcon,
    LayoutGrid,
    LogOut,
    Search,
    X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { Badge } from '@/components/ui/badge';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { useMenu } from '@/hooks/use-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { logout } from '@/routes';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const GROUP_COLORS: Record<string, string> = {
    Comercial: 'bg-blue-500',
    Catálogo: 'bg-purple-500',
    Operaciones: 'bg-emerald-500',
    Finanzas: 'bg-amber-500',
};

const FALLBACK_COLOR = 'bg-zinc-500';

export default function Launcher() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [time, setTime] = React.useState(new Date());
    const isMobile = useIsMobile();
    const { accesoRapido, menuAgrupado } = useMenu();

    const accessibleGroups = menuAgrupado;

    const allAccessibleItems = accessibleGroups.flatMap((group) =>
        group.items.map((item) => ({
            ...item,
            color: GROUP_COLORS[group.label] ?? FALLBACK_COLOR,
        })),
    );

    const dockItems = accesoRapido.slice(0, 5);

    React.useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);

        return () => clearInterval(timer);
    }, []);

    const formattedTime = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
    const formattedDate = time.toLocaleDateString([], {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    // Toggle launcher with Cmd+K or Ctrl+K
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }

            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        document.addEventListener('keydown', down);

        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] font-sans text-white">
            {/* Background Atmosphere */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
                <div className="absolute right-[-10%] bottom-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
            </div>

            {/* Status Bar */}
            <header className="relative z-10 flex items-center justify-between border-b border-white/5 bg-black/20 px-6 py-3 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium tracking-widest text-zinc-400 uppercase">
                            {appName}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-sm font-medium tabular-nums">
                        {formattedTime}
                    </div>
                    <Link
                        href={logout()}
                        method="post"
                        as="button"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <LogOut size={14} />
                        Cerrar sesión
                    </Link>
                </div>
            </header>

            <main className="relative z-10 flex min-h-[calc(100vh-120px)] flex-col items-center justify-center px-4">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-12 text-center"
                >
                    <h2 className="mb-4 text-sm font-medium tracking-[0.3em] text-zinc-500 uppercase">
                        Bienvenido
                    </h2>
                    <h1 className="mb-4 bg-linear-to-b from-white to-zinc-500 bg-clip-text text-6xl font-bold tracking-tighter text-transparent md:text-8xl">
                        {formattedTime}
                    </h1>
                    <p className="serif text-lg font-light text-zinc-400 italic">
                        {formattedDate}
                    </p>
                </motion.div>

                {/* Search Trigger */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-16 w-full max-w-2xl"
                >
                    <button
                        onClick={() => setIsOpen(true)}
                        className="group relative flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-white/10"
                    >
                        <Search
                            className="text-zinc-500 transition-colors group-hover:text-white"
                            size={20}
                        />
                        <span className="text-lg text-zinc-400 transition-colors group-hover:text-zinc-300">
                            ¿Qué acción realizarás?
                        </span>
                        <div className="ml-auto flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-zinc-500">
                            <CommandIcon size={10} />
                            <span>K</span>
                        </div>
                    </button>
                </motion.div>

                {/* App Grid */}
                <div className="grid w-full max-w-4xl grid-cols-4 gap-8 md:grid-cols-8">
                    {allAccessibleItems.map((item, index) => (
                        <motion.button
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index + 0.4 }}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.visit(item.href)}
                            className="group flex flex-col items-center gap-3"
                        >
                            <div
                                className={`h-14 w-14 rounded-2xl md:h-16 md:w-16 ${item.color} flex items-center justify-center shadow-lg shadow-black/20 transition-all duration-300 group-hover:shadow-white/5`}
                            >
                                {item.icon && (
                                    <item.icon
                                        size={28}
                                        className="text-white"
                                    />
                                )}
                            </div>
                            <span className="text-[11px] font-medium tracking-wider text-zinc-500 uppercase transition-colors group-hover:text-white">
                                {item.title}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </main>

            {/* Dock / Footer */}
            {!isMobile && (
                <footer className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2">
                    <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-2xl">
                        {dockItems.map((item) => {
                            return (
                                <button
                                    key={`dock-${item.title}`}
                                    onClick={() => router.visit(item.href)}
                                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform hover:scale-110 active:scale-95`}
                                >
                                    {item.icon && (
                                        <item.icon
                                            size={20}
                                            className="text-white"
                                        />
                                    )}
                                </button>
                            );
                        })}
                        <div className="mx-1 h-8 w-px bg-white/10" />
                        <button
                            onClick={() => setIsOpen(true)}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition-colors hover:bg-white/10"
                        >
                            <LayoutGrid size={20} className="text-zinc-400" />
                        </button>
                    </div>
                </footer>
            )}

            {/* Command Palette Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-2xl"
                        >
                            <div className="absolute top-1 right-3 md:hidden">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Cerrar"
                                    className="rounded-md bg-white/5 p-2 transition-colors hover:bg-white/10"
                                >
                                    <X size={16} className="text-zinc-300" />
                                </button>
                            </div>
                            <Command className="bg-transparent">
                                <div className="flex items-center border-b border-white/5 px-4">
                                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    <CommandInput
                                        placeholder="Escribe un comando o busca..."
                                        className="flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <CommandList className="scrollbar-hide max-h-100 overflow-y-auto p-2">
                                    <CommandEmpty className="py-6 text-center text-sm text-zinc-500">
                                        No se encontraron resultados.
                                    </CommandEmpty>
                                    {accessibleGroups.map(
                                        (group, groupIndex) => (
                                            <React.Fragment key={group.label}>
                                                {groupIndex > 0 && (
                                                    <CommandSeparator className="my-2 bg-white/5" />
                                                )}
                                                <CommandGroup
                                                    heading={group.label}
                                                    className="px-2 py-1 text-xs font-medium tracking-widest text-zinc-500 uppercase"
                                                >
                                                    {group.items.map((item) => {
                                                        const color =
                                                            GROUP_COLORS[
                                                                group.label
                                                            ] ?? FALLBACK_COLOR;

                                                        return (
                                                            <CommandItem
                                                                key={item.title}
                                                                onSelect={() => {
                                                                    router.visit(
                                                                        item.href,
                                                                    );
                                                                    setIsOpen(
                                                                        false,
                                                                    );
                                                                }}
                                                                className="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5"
                                                            >
                                                                <div
                                                                    className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center`}
                                                                >
                                                                    {item.icon && (
                                                                        <item.icon
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="text-white"
                                                                        />
                                                                    )}
                                                                </div>
                                                                <span className="text-zinc-200 group-hover:text-white">
                                                                    {item.title}
                                                                </span>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="ml-auto border-white/10 text-[10px] text-zinc-500"
                                                                >
                                                                    {
                                                                        group.label
                                                                    }
                                                                </Badge>
                                                            </CommandItem>
                                                        );
                                                    })}
                                                </CommandGroup>
                                            </React.Fragment>
                                        ),
                                    )}
                                </CommandList>
                                <div className="flex items-center justify-between border-t border-white/5 bg-black/20 px-4 py-3 font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
                                    <div className="flex gap-4">
                                        <span>↑↓ Navegar</span>
                                        <span>↵ Seleccionar</span>
                                    </div>
                                    <span>Esc para cerrar</span>
                                </div>
                            </Command>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
