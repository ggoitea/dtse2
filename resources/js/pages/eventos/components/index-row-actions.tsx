import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    Calendar,
    CalendarDays,
    MapPin,
    MoreHorizontal,
    Pencil,
    Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePermissions } from '@/hooks/use-permissions';
import { destroy, edit } from '@/routes/eventos';

import type { Evento } from '../types/evento';

interface Props {
    evento: Evento;
}

export function EventoRowActions({ evento }: Props) {
    const { can } = usePermissions();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const canEdit = can('eventos.edit');
    const canDelete = can('eventos.delete');

    if (!canEdit && !canDelete) {
        return null;
    }

    const handleDelete = () => {
        router.delete(destroy.url(evento.id), {
            onSuccess: () => {
                setShowDeleteConfirm(false);
            },
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {canEdit && (
                        <DropdownMenuItem asChild>
                            <Link href={edit.url(evento.id)}>
                                <Pencil className="mr-2 size-4" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                    )}
                    {canEdit && canDelete && <DropdownMenuSeparator />}
                    {canDelete && (
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash2 className="mr-2 size-4" />
                            Eliminar
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="rounded-lg bg-background p-6 shadow-lg">
                        <p className="mb-4 text-sm">
                            ¿Estás seguro de que deseas eliminar este evento?
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
