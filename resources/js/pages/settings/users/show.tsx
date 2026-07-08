import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, ShieldCheck, UserRound, Users } from 'lucide-react';

import { DataTable } from '@/components/data-table3';
import { EmptyCollectionState } from '@/components/empty-collection-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePermissions } from '@/hooks/use-permissions';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { cn } from '@/lib/utils';
import { edit as editProfile } from '@/routes/profile';
import { edit, index } from '@/routes/settings/users';

import { legajoTicketColumns } from './components/legajo-ticket-columns';
import { PerformanceActivityChart } from './components/performance-activity-chart';
import type { UserLegajoProps } from './types';

const FILTER_MODES = [
    { value: 'year', label: 'Por año' },
    { value: 'month', label: 'Por mes' },
    { value: 'range', label: 'Entre fechas' },
] as const;

export default function UserShow({
    user,
    performance,
    activity,
}: UserLegajoProps) {
    const { can } = usePermissions();
    const canEdit = can('users.edit');
    const [filters, setFilters] = useState(performance.filters);
    const hasPerformanceActivity = performance.kpis.total > 0;

    const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // router.get(
        //     show(user.id).url,
        //     {
        //         filter_mode: filters.mode,
        //         year: filters.mode === 'year' ? filters.year : undefined,
        //         month: filters.mode === 'month' ? filters.month : undefined,
        //         date_from:
        //             filters.mode === 'range' ? filters.date_from : undefined,
        //         date_to: filters.mode === 'range' ? filters.date_to : undefined,
        //     },
        //     {
        //         preserveState: true,
        //         preserveScroll: true,
        //     },
        // );
    };

    return (
        <SettingsLayout wide>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <UserRound className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">
                                    {user.name}
                                </h2>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">@{user.username}</Badge>
                            <Badge variant="outline">
                                {user.role ?? 'Sin rol'}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {canEdit && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={edit(user.id).url}>
                                    <Pencil className="size-4" />
                                    Editar usuario
                                </Link>
                            </Button>
                        )}
                        <Button variant="outline" size="sm" asChild>
                            <Link href={index().url}>
                                <ArrowLeft className="size-4" />
                                Volver
                            </Link>
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="datos" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="datos">
                            Datos de usuario
                        </TabsTrigger>
                        <TabsTrigger value="rendimiento">
                            Rendimiento
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="datos" className="space-y-4">
                        <div className="grid gap-4 xl:grid-cols-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <CardTitle>Datos generales</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Información de contacto y referencia
                                            personal.
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <DetailField
                                        label="Nombre y apellido"
                                        value={user.name}
                                    />
                                    <DetailField
                                        label="DNI"
                                        // value={user.dni}
                                    />
                                    <DetailField
                                        label="Teléfono"
                                        // value={user.telefono}
                                    />
                                    <DetailField
                                        label="Dirección"
                                        // value={user.direccion}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <CardTitle>Datos de acceso</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Credenciales visibles y rol asignado
                                            dentro del tenant.
                                        </p>
                                    </div>
                                    <ShieldCheck className="size-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2">
                                    <DetailField
                                        label="Usuario"
                                        value={user.username}
                                    />
                                    <DetailField
                                        label="Rol"
                                        value={user.role}
                                    />
                                    <DetailField
                                        label="Email"
                                        value={user.email}
                                    />
                                    <DetailField
                                        label="Contraseña"
                                        value="******"
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actividad en el sistema</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <EmptyCollectionState
                                    message="Actividad próximamente"
                                    description={activity.message}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rendimiento" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Filtros de rendimiento</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleApplyFilters}
                                    className="grid gap-4 lg:grid-cols-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="filter_mode">
                                            Modo
                                        </Label>
                                        <select
                                            id="filter_mode"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                                            value={filters.mode}
                                            onChange={(event) =>
                                                setFilters((current) => ({
                                                    ...current,
                                                    mode: event.target.value as
                                                        | 'year'
                                                        | 'month'
                                                        | 'range',
                                                }))
                                            }
                                        >
                                            {FILTER_MODES.map((mode) => (
                                                <option
                                                    key={mode.value}
                                                    value={mode.value}
                                                >
                                                    {mode.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {filters.mode === 'year' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="year">Año</Label>
                                            <Input
                                                id="year"
                                                value={filters.year ?? ''}
                                                onChange={(event) =>
                                                    setFilters((current) => ({
                                                        ...current,
                                                        year: event.target
                                                            .value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    )}

                                    {filters.mode === 'month' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="month">Mes</Label>
                                            <Input
                                                id="month"
                                                type="month"
                                                value={filters.month ?? ''}
                                                onChange={(event) =>
                                                    setFilters((current) => ({
                                                        ...current,
                                                        month: event.target
                                                            .value,
                                                    }))
                                                }
                                            />
                                        </div>
                                    )}

                                    {filters.mode === 'range' && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="date_from">
                                                    Desde
                                                </Label>
                                                <Input
                                                    id="date_from"
                                                    type="date"
                                                    value={
                                                        filters.date_from ?? ''
                                                    }
                                                    onChange={(event) =>
                                                        setFilters(
                                                            (current) => ({
                                                                ...current,
                                                                date_from:
                                                                    event.target
                                                                        .value,
                                                            }),
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="date_to">
                                                    Hasta
                                                </Label>
                                                <Input
                                                    id="date_to"
                                                    type="date"
                                                    value={
                                                        filters.date_to ?? ''
                                                    }
                                                    onChange={(event) =>
                                                        setFilters(
                                                            (current) => ({
                                                                ...current,
                                                                date_to:
                                                                    event.target
                                                                        .value,
                                                            }),
                                                        )
                                                    }
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="flex items-end">
                                        <Button type="submit" size="sm">
                                            Aplicar filtro
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="grid gap-4 md:grid-cols-3">
                            <KpiCard
                                title="Tickets correctivos"
                                value={performance.kpis.correctivos}
                            />
                            <KpiCard
                                title="Tickets preventivos"
                                value={performance.kpis.preventivos}
                            />
                            <KpiCard
                                title="Total asignados"
                                value={performance.kpis.total}
                            />
                        </div>

                        {hasPerformanceActivity ? (
                            <>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Actividad del período
                                        </CardTitle>
                                        <CardDescription>
                                            Visualización de tickets correctivos
                                            y preventivos.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <PerformanceActivityChart
                                            points={performance.chart.points}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Correctivos asignados
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {performance.correctivos.length > 0 ? (
                                            <DataTable
                                                columns={legajoTicketColumns}
                                                data={performance.correctivos}
                                                emptyMessage="No hay tickets correctivos para el período seleccionado."
                                            />
                                        ) : (
                                            <EmptyCollectionState
                                                message="Sin tickets correctivos"
                                                description="No se encontraron tickets correctivos asignados al usuario en este período."
                                            />
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>
                                            Preventivos asignados
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {performance.preventivos.length > 0 ? (
                                            <DataTable
                                                columns={legajoTicketColumns}
                                                data={performance.preventivos}
                                                emptyMessage="No hay tickets preventivos para el período seleccionado."
                                            />
                                        ) : (
                                            <EmptyCollectionState
                                                message="Sin tickets preventivos"
                                                description="No se encontraron tickets preventivos asignados al usuario en este período."
                                            />
                                        )}
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Sin actividad en el período
                                    </CardTitle>
                                    <CardDescription>
                                        No se encontraron tickets correctivos ni
                                        preventivos con los filtros
                                        seleccionados.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <EmptyCollectionState
                                        message="No hay tickets asignados"
                                        description="Probá cambiar el rango o el modo de filtro para revisar otro período."
                                    />
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </SettingsLayout>
    );
}

UserShow.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        browserTitle="Legajo de usuario"
        icon={Users}
        breadcrumbs={[
            { title: 'Configuración', href: editProfile().url },
            { title: 'Usuarios', href: index().url },
        ]}
    >
        {page}
    </AdaptiveLayout>
);

function DetailField({
    label,
    value,
    className,
}: {
    label: string;
    value?: string | null;
    className?: string;
}) {
    return (
        <div className={cn('space-y-1', className)}>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {label}
            </p>
            <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                {value && value.length > 0 ? value : '—'}
            </div>
        </div>
    );
}

function KpiCard({ title, value }: { title: string; value: number }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-semibold tracking-tight">
                    {value}
                </div>
            </CardContent>
        </Card>
    );
}
