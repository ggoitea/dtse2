import { Link } from '@inertiajs/react';
import type { Row } from '@tanstack/react-table';
import { Pencil, MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePermissions } from '@/hooks/use-permissions';
import { edit } from '@/routes/paquetes';
import type { PaqueteTuristico } from '../types/paquete';

interface Props {
    paquete: PaqueteTuristico;
}

export function PaqueteRowActions({ paquete }: Props) {
    const { can } = usePermissions();

    if (!can('paquetes.edit')) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                    <Link href={edit.url(paquete.id)}>
                        <Pencil className="mr-2 size-4" />
                        Editar
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
