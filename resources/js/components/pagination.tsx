import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    links: PaginationLink[];
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

interface PaginationProps {
    data: PaginatedData<unknown>;
}

export function Pagination({ data }: PaginationProps) {
    if (data.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between px-2">
            <div className="text-sm text-muted-foreground">
                Mostrando {data.from} a {data.to} de {data.total} resultados
            </div>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!data.prev_page_url}
                    asChild={!!data.prev_page_url}
                >
                    {data.prev_page_url ? (
                        <Link href={data.prev_page_url} preserveState>
                            <ChevronLeft className="size-4" />
                            Anterior
                        </Link>
                    ) : (
                        <>
                            <ChevronLeft className="size-4" />
                            Anterior
                        </>
                    )}
                </Button>

                <div className="mx-2 text-sm text-muted-foreground">
                    Pagina {data.current_page} de {data.last_page}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={!data.next_page_url}
                    asChild={!!data.next_page_url}
                >
                    {data.next_page_url ? (
                        <Link href={data.next_page_url} preserveState>
                            Siguiente
                            <ChevronRight className="size-4" />
                        </Link>
                    ) : (
                        <>
                            Siguiente
                            <ChevronRight className="size-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
