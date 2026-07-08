import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Loader2, Plus, Search, Shield } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';

import { DataTable } from '@/components/data-table';
import HeadingSmall from '@/components/heading-small';
import type { PaginatedData } from '@/components/pagination';
import { Pagination } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePermissions } from '@/hooks/use-permissions';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editProfile } from '@/routes/profile';
import { create, index } from '@/routes/settings/roles';
import type { Role } from '@/types';

import { columns } from './components/columns';

interface Props {
    roles: PaginatedData<Role>;
    filters: {
        search?: string;
    };
}

export default function RolesIndex({ roles, filters }: Props) {
    const { can } = usePermissions();
    const [search, setSearch] = useState(filters.search ?? '');
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            index().url,
            { search: value || undefined },
            {
                preserveState: true,
                preserveScroll: true,
                onStart: () => setIsSearching(true),
                onFinish: () => setIsSearching(false),
            },
        );
    }, 500);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        debouncedSearch(value.trim());
    };

    return (
        <SettingsLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <HeadingSmall
                        title="Configuración de roles"
                        description="Gestiona los roles y permisos de tu equipo"
                    />
                    {can('roles.create') && (
                        <Button asChild size="sm">
                            <Link href={create().url}>
                                <Plus className="size-4" />
                                Nuevo Rol
                            </Link>
                        </Button>
                    )}
                </div>

                <div className="relative w-full max-w-xs">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pr-9 pl-9"
                    />
                    {isSearching && (
                        <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <DataTable
                        columns={columns}
                        data={roles.data}
                        emptyMessage="No se encontraron roles."
                    />

                    <Pagination data={roles} />
                </div>
            </div>
        </SettingsLayout>
    );
}

RolesIndex.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        browserTitle="Roles"
        icon={Shield}
        breadcrumbs={[
            { title: 'Configuración', href: editProfile().url },
            { title: 'Roles', href: index().url },
        ]}
    >
        {page}
    </AdaptiveLayout>
);
