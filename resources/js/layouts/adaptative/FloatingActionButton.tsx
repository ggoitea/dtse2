import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import type { QuickAction } from '../adaptive-layout';

interface FloatingActionButtonProps {
    actions: QuickAction[];
}

export function FloatingActionButton({ actions }: FloatingActionButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (!actions.length) {
        return null;
    }

    // If there's only one action, show it directly
    if (actions.length === 1) {
        const action = actions[0];
        const Icon = action.icon;

        return (
            <div className="fixed right-6 bottom-24 z-50">
                <button
                    id={`quick-action-${action.id}`}
                    onClick={action.onClick}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-floating-foreground bg-floating text-floating-foreground shadow-2xl shadow-white/10 transition-transform hover:scale-105 active:scale-95"
                    aria-label={action.label}
                    onTouchStart={action.prefetch}
                >
                    <Icon className="h-7 w-7" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed right-6 bottom-24 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <div className="mb-2 flex flex-col items-end gap-3">
                        {actions.map((action, index) => {
                            const Icon = action.icon;

                            return (
                                <motion.div
                                    key={action.id}
                                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                    transition={{
                                        delay:
                                            (actions.length - index - 1) * 0.05,
                                    }}
                                    className="flex items-center gap-3"
                                >
                                    <span className="rounded-lg border border-white/5 bg-pressed px-3 py-1.5 text-sm text-pressed-foreground/90 shadow-xl">
                                        {action.label}
                                    </span>
                                    <button
                                        onClick={() => {
                                            action.onClick();
                                            setIsOpen(false);
                                        }}
                                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-important text-important-foreground shadow-xl transition-transform hover:scale-105"
                                    >
                                        <Icon className="h-5 w-5" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>

            <button
                id="fab-main-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-300 ${
                    isOpen
                        ? 'border border-important-foreground/10 bg-pressed text-important-foreground'
                        : 'bg-important text-important-foreground shadow-important/20'
                }`}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 135 : 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                    <Plus className="h-7 w-7" />
                </motion.div>
            </button>

            {/* Backdrop for multiple actions */}
            {isOpen && (
                <div
                    className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
