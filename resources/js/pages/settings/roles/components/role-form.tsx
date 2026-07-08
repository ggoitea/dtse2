import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { GroupedPermissions } from '@/types';

interface RoleFormData {
    name: string;
    permissions: string[];
    default_empleado: boolean;
}

interface Props {
    data: RoleFormData;
    setData: <K extends keyof RoleFormData>(
        key: K,
        value: RoleFormData[K],
    ) => void;
    errors: Partial<Record<keyof RoleFormData, string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
    availablePermissions: GroupedPermissions;
}

export function RoleForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    submitLabel,
    availablePermissions,
}: Props) {
    const [search, setSearch] = useState('');

    const togglePermission = (permission: string) => {
        const currentPermissions = data.permissions;

        if (currentPermissions.includes(permission)) {
            setData(
                'permissions',
                currentPermissions.filter((p) => p !== permission),
            );
        } else {
            setData('permissions', [...currentPermissions, permission]);
        }
    };

    const toggleGroup = (groupPermissions: string[]) => {
        const allSelected = groupPermissions.every((p) =>
            data.permissions.includes(p),
        );

        if (allSelected) {
            setData(
                'permissions',
                data.permissions.filter((p) => !groupPermissions.includes(p)),
            );
        } else {
            const newPermissions = new Set([
                ...data.permissions,
                ...groupPermissions,
            ]);
            setData('permissions', Array.from(newPermissions));
        }
    };

    const selectAll = () => {
        const filteredPermissionValues = Object.values(filteredPermissions)
            .flat()
            .map((p) => p.value);
        const newPermissions = new Set([
            ...data.permissions,
            ...filteredPermissionValues,
        ]);
        setData('permissions', Array.from(newPermissions));
    };

    const deselectAll = () => {
        setData('permissions', []);
    };

    /* eslint-disable */
    const filteredPermissions = useMemo(() => {
        if (!search) return availablePermissions;

        const filtered: GroupedPermissions = {};
        const searchTerm = search.toLowerCase();

        Object.entries(availablePermissions).forEach(([group, permissions]) => {
            const matchingPermissions = permissions.filter(
                (p) =>
                    p.label.toLowerCase().includes(searchTerm) ||
                    group.toLowerCase().includes(searchTerm),
            );

            if (matchingPermissions.length > 0) {
                filtered[group] = matchingPermissions;
            }
        });

        return filtered;
    }, [availablePermissions, search]);
    /* eslint-enable */
    const totalSelected = data.permissions.length;

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name" className="text-base font-medium">
                        Nombre del rol
                    </Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ej: Administrador, Editor, Visualizador"
                        className="h-11"
                        required
                        autoFocus
                    />
                    <InputError message={errors.name} />
                </div>
                {/* <div className="grid gap-2">
                    <FieldLabel>
                        <Field orientation="horizontal">
                            <Checkbox
                                checked={checked()}
                                id="toggle-checkbox-2"
                                name="toggle-checkbox-2"
                                onCheckedChange={(v) => {
                                    setData('default_empleado', v as boolean);
                                }}
                            />
                            <FieldContent>
                                <FieldTitle>
                                    Por defecto para empleados
                                </FieldTitle>
                                <FieldDescription>
                                    Los empleados se crear con este rol asignado
                                    automáticamente.
                                </FieldDescription>
                            </FieldContent>
                        </Field>
                    </FieldLabel>
                    <InputError message={errors.default_empleado} />
                </div> */}
            </div>

            <Separator />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <Label className="text-lg font-semibold">
                            Permisos
                        </Label>
                        {totalSelected > 0 && (
                            <Badge
                                variant="secondary"
                                className="rounded-full px-2"
                            >
                                {totalSelected} seleccionados
                            </Badge>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={selectAll}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Marcar todo
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={deselectAll}
                            className="text-xs text-muted-foreground hover:text-foreground"
                        >
                            Limpiar
                        </Button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Buscar permisos o grupos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <InputError message={errors.permissions} />

                <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(filteredPermissions).map(
                        ([group, permissions]) => {
                            const groupPermissionValues = permissions.map(
                                (p) => p.value,
                            );
                            const allSelected = groupPermissionValues.every(
                                (p) => data.permissions.includes(p),
                            );
                            const someSelected = groupPermissionValues.some(
                                (p) => data.permissions.includes(p),
                            );

                            return (
                                <div
                                    key={group}
                                    className="flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-colors hover:border-accent-foreground/20"
                                >
                                    <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id={`group-${group}`}
                                                checked={allSelected}
                                                data-state={
                                                    someSelected && !allSelected
                                                        ? 'indeterminate'
                                                        : undefined
                                                }
                                                onCheckedChange={() =>
                                                    toggleGroup(
                                                        groupPermissionValues,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`group-${group}`}
                                                className="cursor-pointer text-xs font-bold tracking-wider text-muted-foreground uppercase"
                                            >
                                                {group}
                                            </Label>
                                        </div>
                                    </div>
                                    <div className="space-y-3 p-4">
                                        {permissions.map((permission) => (
                                            <div
                                                key={permission.value}
                                                className="group/item -m-1 flex items-center gap-3 rounded-md p-1 transition-colors hover:bg-accent/50"
                                            >
                                                <Checkbox
                                                    id={permission.value}
                                                    checked={data.permissions.includes(
                                                        permission.value,
                                                    )}
                                                    onCheckedChange={() =>
                                                        togglePermission(
                                                            permission.value,
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={permission.value}
                                                    className="flex-1 cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {permission.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        },
                    )}
                </div>

                {Object.keys(filteredPermissions).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            No se encontraron permisos que coincidan con "
                            {search}"
                        </p>
                        <Button
                            variant="link"
                            className="mt-2"
                            onClick={() => setSearch('')}
                        >
                            Limpiar búsqueda
                        </Button>
                    </div>
                )}
            </div>

            <Separator />

            <div className="flex items-center justify-end pt-4">
                <Button
                    size="lg"
                    type="submit"
                    disabled={processing}
                    className="px-8"
                >
                    {processing ? 'Guardando...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
