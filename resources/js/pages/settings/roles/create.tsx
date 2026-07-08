import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Shield } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editProfile } from '@/routes/profile';
import { index, store } from '@/routes/settings/roles';
import type { GroupedPermissions } from '@/types';

import { RoleForm } from './components/role-form';

interface Props {
    availablePermissions: GroupedPermissions;
}

export default function RoleCreate({ availablePermissions }: Props) {
    const { data, setData, errors, setError, clearErrors } = useForm({
        name: '',
        permissions: [] as string[],
        default_empleado: false,
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setProcessing(true);

        router.post(store().url, data, {
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
                    description="Crea un nuevo rol con permisos personalizados para los usuarios"
                />

                <RoleForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    submitLabel="Crear Rol"
                    availablePermissions={availablePermissions}
                />
            </div>
        </SettingsLayout>
    );
}

RoleCreate.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        browserTitle="Nuevo Rol"
        icon={Shield}
        breadcrumbs={[
            { title: 'Configuración', href: editProfile().url },
            { title: 'Roles', href: index().url },
            { title: 'Nuevo Rol', href: '#' },
        ]}
    >
        {page}
    </AdaptiveLayout>
);
