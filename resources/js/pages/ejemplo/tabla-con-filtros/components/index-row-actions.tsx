import { router } from '@inertiajs/react';
import { Eye, MoreVertical, ShareIcon, TrashIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { tablaConFiltrosShow } from '@/routes/ejemplo';
import type { User } from '@/types';

interface Props {
    usuario: User;
}
export default function IndexRowActions({ usuario }: Props) {
    const handleVer = () => {
        router.visit(tablaConFiltrosShow(usuario.id));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size={'sm'}>
                    <MoreVertical />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleVer}>
                        <Eye />
                        Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                        <ShareIcon />
                        Compartir
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive" disabled>
                        <TrashIcon />
                        Borrar
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
