import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { ArrowLeft, Users } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editProfile } from '@/routes/profile';
import { index, update } from '@/routes/settings/users';
import type { Role } from '@/types';

import { UserForm } from './components/user-form';

interface UserData {
    id: number;
    name: string;
    username: string;
    email: string;
    dni: string | null;
    telefono: string | null;
    direccion: string | null;
    role_id: number | null;
}

interface Props {
    user: UserData;
    roles: Pick<Role, 'id' | 'name'>[];
}

export default function UserEdit({ user, roles }: Props) {
    const { data, setData, errors, setError, clearErrors } = useForm({
        name: user.name,
        username: user.username,
        email: user.email,
        dni: user.dni ?? '',
        telefono: user.telefono ?? '',
        direccion: user.direccion ?? '',
        password: '',
        role_id: (user.role_id ?? '') as number | '',
    });
    const [processing, setProcessing] = useState(false);

    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();

            return;
        }

        router.visit(index().url);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setProcessing(true);
        router.put(update.url(user.id), data, {
            onError: (errors) => {
                setError(errors as Record<string, string>);
                setProcessing(false);
            },
        });
    };

    return (
        <SettingsLayout>
            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <HeadingSmall
                        title="Editar Usuario"
                        description={`Modifica la información de ${user.name}`}
                    />

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleBack}
                    >
                        <ArrowLeft className="size-4" />
                        Volver
                    </Button>
                </div>

                <UserForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    submitLabel="Guardar Cambios"
                    roles={roles}
                    isEdit
                />
            </div>
        </SettingsLayout>
    );
}

UserEdit.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        browserTitle="Editar Usuario"
        icon={Users}
        breadcrumbs={[
            { title: 'Configuración', href: editProfile().url },
            { title: 'Usuarios', href: index().url },
        ]}
    >
        {page}
    </AdaptiveLayout>
);
