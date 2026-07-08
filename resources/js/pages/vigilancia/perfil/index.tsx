import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { edit, update } from '@/routes/vigilancia/perfil';

interface Perfil {
    nombre: string;
    dni: string;
    telefono: string;
    secundario_telefono: string | null;
}

interface Props {
    perfil: Perfil;
}

export default function GuardiaPerfilPage({ perfil }: Props) {
    const [processing, setProcessing] = useState(false);

    const { data, setData, errors, setError, clearErrors } = useForm({
        telefono: perfil.telefono ?? '',
        secundario_telefono: perfil.secundario_telefono ?? '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setProcessing(true);

        router.put(update().url, data, {
            preserveScroll: true,
            onError: (errs) => {
                setError(errs as Record<string, string>);
                setProcessing(false);
            },
            onSuccess: () => {
                toast.success('Perfil actualizado con éxito');
                setProcessing(false);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Datos del seguridad</CardTitle>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-3">
                            <Field>
                                <FieldLabel>Titular</FieldLabel>
                                <Input
                                    value={perfil.nombre}
                                    disabled
                                    readOnly
                                />
                            </Field>
                            <Field>
                                <FieldLabel>DNI</FieldLabel>
                                <Input value={perfil.dni} disabled readOnly />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>
                                Teléfono principal{' '}
                                <span className="text-red-500">*</span>
                            </FieldLabel>
                            <Input
                                type="tel"
                                value={data.telefono}
                                onChange={(e) =>
                                    setData('telefono', e.target.value)
                                }
                                placeholder="Ej: 3512345678"
                                required
                            />
                            <InputError message={errors.telefono} />
                        </Field>

                        <Field>
                            <FieldLabel>Teléfono secundario</FieldLabel>
                            <Input
                                type="tel"
                                value={data.secundario_telefono}
                                onChange={(e) =>
                                    setData(
                                        'secundario_telefono',
                                        e.target.value,
                                    )
                                }
                                placeholder="Ej: 3512345678"
                            />
                            <InputError message={errors.secundario_telefono} />
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>

            <Button type="submit" disabled={processing} className="w-full">
                {processing ? 'Guardando...' : 'Guardar cambios'}
            </Button>
        </form>
    );
}

GuardiaPerfilPage.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        pageTitle="Mi perfil"
        pageDescription="Actualizá tus datos de contacto"
        browserTitle="Mi perfil"
        icon={Shield}
        breadcrumbs={[{ title: 'Mi perfil', href: edit().url }]}
    >
        {page}
    </AdaptiveLayout>
);
