import React, { useEffect, useRef, useState } from 'react';
import { Bell, BellRing, CheckCheck, Settings, Trash } from 'lucide-react';
import { Check, Clock, Info, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { formatTimeAgo } from '@/lib/utils';
import type { Notification } from '@/types';

interface NotificationBellProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onDelete: (id: string) => void;
    onClearAll: () => void;
    onActionClick?: (notification: Notification) => void;
    onOpenSettings?: () => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
    notifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onDelete,
    onClearAll,
    onActionClick,
    onOpenSettings,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    const [jiggle, setJiggle] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLButtonElement>(null);

    const unreadNotifications = notifications.filter((n) => !n.isRead);
    const unreadCount = unreadNotifications.length;

    const displayedNotifications =
        activeTab === 'all' ? notifications : unreadNotifications;

    // Jiggle animation when unread count changes/increases
    useEffect(() => {
        if (unreadCount > 0 && jiggle === false) {
            //eslint-disable-next-line
            setJiggle(true);
            const timer = setTimeout(() => setJiggle(false), 600);

            return () => clearTimeout(timer);
        }
    }, [unreadCount, jiggle]);

    // Click outside listener to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                bellRef.current &&
                !bellRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div id="notification-bell-root" className="relative z-40">
            {/* Interactive Bell Icon Trigger */}
            <button
                id="bell-trigger-btn"
                ref={bellRef}
                onClick={handleToggleOpen}
                aria-label="Campana de Notificaciones"
                className={`relative cursor-pointer rounded-full p-2.5 outline-hidden transition-all duration-200 focus:ring-2 focus:ring-ring ${
                    isOpen
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
                <motion.div
                    animate={
                        jiggle
                            ? {
                                  rotate: [0, -15, 12, -10, 8, -4, 0],
                              }
                            : { rotate: 0 }
                    }
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                >
                    {unreadCount > 0 ? (
                        <BellRing className="h-6 w-6 stroke-2 text-primary" />
                    ) : (
                        <Bell className="h-6 w-6 stroke-2 text-muted-foreground" />
                    )}

                    {/* Animated Badge Count */}
                    <AnimatePresence>
                        {unreadCount > 0 && (
                            <motion.span
                                id="bell-unread-badge"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="pointer-events-none absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-important px-1 font-mono text-[10px] font-bold text-important-foreground"
                            >
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.div>
            </button>

            {/* Floating Popover Dropdown Card */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="bell-dropdown-popover"
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute right-0 z-50 mt-3 flex max-h-125 w-80 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl sm:w-96"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border bg-muted/30 p-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold tracking-tight text-foreground">
                                    Notificaciones
                                </h3>
                                {unreadCount > 0 && (
                                    <span className="rounded-full bg-primary/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
                                        {unreadCount} nuevas
                                    </span>
                                )}
                            </div>

                            {/* Action shortcuts */}
                            <div className="flex items-center gap-1.5">
                                {onOpenSettings && (
                                    <button
                                        id="dropdown-settings-btn"
                                        onClick={() => {
                                            onOpenSettings();
                                            setIsOpen(false);
                                        }}
                                        title="Ajustes de Notificación"
                                        className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted"
                                    >
                                        <Settings className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions Bar */}
                        {notifications.length > 0 && (
                            <div className="flex items-center justify-between border-b border-border bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">
                                <button
                                    id="mark-all-read-btn"
                                    onClick={onMarkAllAsRead}
                                    disabled={unreadCount === 0}
                                    className="flex cursor-pointer items-center gap-1 transition-colors hover:text-primary disabled:opacity-50"
                                >
                                    <CheckCheck className="h-3.5 w-3.5" />
                                    <span>Marcar todo leído</span>
                                </button>

                                <button
                                    id="clear-all-notif-btn"
                                    onClick={onClearAll}
                                    className="flex cursor-pointer items-center gap-1 transition-colors hover:text-destructive"
                                >
                                    <Trash className="h-3 w-3" />
                                    <span>Limpiar panel</span>
                                </button>
                            </div>
                        )}

                        {/* Tab selection */}
                        <div className="flex gap-2 border-b border-border bg-card px-3 pt-2">
                            <button
                                id="tab-all-notifications"
                                onClick={() => setActiveTab('all')}
                                className={`cursor-pointer border-b-2 px-1.5 pb-1.5 text-xs font-bold transition-all ${
                                    activeTab === 'all'
                                        ? 'border-primary text-foreground'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Todas ({notifications.length})
                            </button>
                            <button
                                id="tab-unread-notifications"
                                onClick={() => setActiveTab('unread')}
                                className={`cursor-pointer border-b-2 px-1.5 pb-1.5 text-xs font-bold transition-all ${
                                    activeTab === 'unread'
                                        ? 'border-primary text-foreground'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                No leídas ({unreadCount})
                            </button>
                        </div>

                        {/* Scrollable list content */}
                        <div className="max-h-87.5 space-y-2 divide-y divide-border overflow-y-auto bg-card p-3">
                            <AnimatePresence initial={false}>
                                {displayedNotifications.length > 0 ? (
                                    displayedNotifications.map((notif) => (
                                        <NotificationItem
                                            key={notif.id}
                                            notification={notif}
                                            onMarkAsRead={onMarkAsRead}
                                            onDelete={onDelete}
                                            onActionClick={onActionClick}
                                            compact={true}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        id="bell-empty-state"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center justify-center px-4 py-10 text-center text-muted-foreground"
                                    >
                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <Bell className="h-6 w-6 stroke-[1.5] text-muted-foreground/50" />
                                        </div>
                                        <p className="text-xs font-semibold text-foreground">
                                            {activeTab === 'unread'
                                                ? 'No tienes notificaciones sin leer'
                                                : 'No encontramos notificaciones para mostrar'}
                                        </p>
                                        <p className="mt-1 max-w-50 text-[10px] text-muted-foreground">
                                            {activeTab === 'unread'
                                                ? '¡Excelente! Estás al día con todos tus eventos de hoy.'
                                                : 'Cuando haya nuevas notificaciones, aparecerán aquí.'}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface NotificationItemProps {
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    onActionClick?: (notification: Notification) => void;
    compact?: boolean;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onMarkAsRead,
    onDelete,
    onActionClick,
    compact = false,
}) => {
    const { id, title, url, message, timestamp, isRead, type } = notification;

    // Choose the visual style based on category
    const getCategoryStyles = () => {
        switch (type) {
            case null:
            default:
                return {
                    icon: <Info id={`icon-info-${id}`} className="h-5 w-5" />,
                    bgLight: 'bg-secondary/10 border-secondary/20',
                    dotColor: 'bg-primary',
                };
        }
    };

    const { icon, bgLight, dotColor } = getCategoryStyles();

    return (
        <motion.div
            id={`notif-card-${id}`}
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`group relative overflow-hidden rounded-xl border transition-all duration-200 ${
                isRead
                    ? 'border-border bg-card hover:border-muted-foreground/30'
                    : `${bgLight} border-transparent shadow-sm ring-1 ring-primary/5`
            } ${compact ? 'p-3 text-xs' : 'p-4 text-sm'}`}
        >
            <div className="flex gap-3 leading-relaxed">
                {/* Profile Avatar or Category Icon */}
                <div className="shrink-0">
                    <div
                        id={`cat-icon-container-${id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted"
                    >
                        {icon}
                    </div>
                </div>

                {/* Text Details & Actions */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <h4
                            className={`truncate font-semibold tracking-tight ${isRead ? 'text-muted-foreground' : 'font-bold text-foreground'}`}
                        >
                            {title}
                        </h4>
                        {!isRead && (
                            <span
                                id={`unread-dot-${id}`}
                                className={`h-2.5 w-2.5 rounded-full ${dotColor} shrink-0 animate-pulse`}
                                title="No leído"
                            />
                        )}
                    </div>

                    <p
                        className={`mt-1 font-normal ${isRead ? 'text-muted-foreground' : 'text-foreground/90'} leading-snug wrap-break-word`}
                    >
                        {message}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-medium text-muted-foreground">
                        {/* Timestamp */}
                        <div
                            id={`timestamp-lbl-${id}`}
                            className="flex items-center gap-1.5 font-mono text-muted-foreground"
                        >
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatTimeAgo(timestamp)}</span>
                        </div>

                        {/* Action Labels and Interaction Controls */}
                        <div className="flex items-center gap-2">
                            {url && onActionClick && (
                                <button
                                    id={`action-btn-${id}`}
                                    onClick={() => onActionClick(notification)}
                                    className="cursor-pointer rounded bg-primary px-2.5 py-1 font-medium text-primary-foreground transition duration-150 ease-in-out hover:bg-primary/80 hover:shadow-xs"
                                >
                                    ir
                                </button>
                            )}

                            <div className="ml-2 flex items-center gap-1.5 opacity-85 transition-opacity duration-150 group-hover:opacity-100">
                                {/* Toggle read status button */}
                                <button
                                    id={`toggle-read-btn-${id}`}
                                    onClick={() => onMarkAsRead(id)}
                                    title={
                                        isRead
                                            ? 'Marcar como no leído'
                                            : 'Marcar como leído'
                                    }
                                    className={`cursor-pointer rounded-lg border p-1.5 transition-all duration-150 ${
                                        isRead
                                            ? 'border-border bg-muted text-muted-foreground hover:bg-muted/80'
                                            : 'border-border bg-card text-primary shadow-xs hover:bg-card/80'
                                    }`}
                                >
                                    <Check
                                        className={`h-3.5 w-3.5 ${isRead ? 'text-muted-foreground' : 'stroke-3 text-primary'}`}
                                    />
                                </button>

                                {/* Delete button */}
                                <button
                                    id={`delete-btn-${id}`}
                                    onClick={() => onDelete(id)}
                                    title="Eliminar"
                                    className="cursor-pointer rounded-lg border border-border bg-muted p-1.5 text-muted-foreground transition-all duration-150 hover:border-destructive/50 hover:bg-destructive/20 hover:text-destructive"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
