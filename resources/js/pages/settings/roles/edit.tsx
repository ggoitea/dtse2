import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Shield } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editProfile } from '@/routes/profile';
import { index, update } from '@/routes/settings/roles';
import type { GroupedPermissions, Role } from '@/types';

import { RoleForm } from './components/role-form';

interface Props {
    role: Role;
    availablePermissions: GroupedPermissions;
}

export default function RoleEdit({ role, availablePermissions }: Props) {
    const { data, setData, errors, setError, clearErrors } = useForm({
        name: role.name,
        permissions: role.permissions,
        default_empleado: role.default_empleado,
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setProcessing(true);
        router.put(update.url(role.id), data, {
            onError: (errors) => {
                setError(errors as Record<string, string>);
                setProcessing(false);
            },
        });
    };

    return (
        <SettingsLayout>
            <div className="space-y-6">
                <HeadingSmall
                    title="Configuración de roles"
                    description={`Modifica los permisos del rol "${role.name}"`}
                />

                <RoleForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    submitLabel="Guardar Cambios"
                    availablePermissions={availablePermissions}
                />
            </div>
        </SettingsLayout>
    );
}

RoleEdit.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        browserTitle="Editar Rol"
        icon={Shield}
        breadcrumbs={[
            { title: 'Configuración', href: editProfile().url },
            { title: 'Roles', href: index().url },
        ]}
    >
        {page}
    </AdaptiveLayout>
);
