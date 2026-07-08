import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Users } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editProfile } from '@/routes/profile';
import { index, store } from '@/routes/settings/users';
import type { Role } from '@/types';

import { UserForm } from './components/user-form';

interface Props {
    roles: Pick<Role, 'id' | 'name'>[];
}

export default function UserCreate({ roles }: Props) {
    const { data, setData, errors, setError, clearErrors } = useForm({
        name: '',
        username: '',
        email: '',
        dni: '',
        telefono: '',
        direccion: '',
        password: '',
        role_id: '' as number | '',
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
                    title="Nuevo Usuario"
                    description="Crea un nuevo usuario para tu organización"
                />

                <UserForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    submitLabel="Crear Usuario"
                    roles={roles}
                />
            </div>
        </SettingsLayout>
    );
}

UserCreate.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        browserTitle="Nuevo Usuario"
        icon={Users}
        breadcrumbs={[
            { title: 'Configuración', href: editProfile().url },
            { title: 'Usuarios', href: index().url },
            { title: 'Nuevo Usuario', href: '#' },
        ]}
    >
        {page}
    </AdaptiveLayout>
);
