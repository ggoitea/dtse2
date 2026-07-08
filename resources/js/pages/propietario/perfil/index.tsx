import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import { Home } from 'lucide-react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { edit, update } from '@/routes/propietario/perfil';

interface Propietario {
    nombre: string | null;
    dni: string | null;
    telefono: string | null;
    alt_telefono: string | null;
    alt_nombre: string | null;
}

interface Perfil {
    id: number;
    lote: string | null;
    manzana: string | null;
    descripcion: string | null;
    propietario: Propietario | null;
}

interface Props {
    perfil: Perfil;
}

export default function PerfilPropietarioPage({ perfil }: Props) {
    const [processing, setProcessing] = useState(false);

    const { data, setData, errors, setError, clearErrors } = useForm({
        telefono: perfil.propietario?.telefono ?? '',
        alt_telefono: perfil.propietario?.alt_telefono ?? '',
        alt_nombre: perfil.propietario?.alt_nombre ?? '',
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
            {/* Card 1: Propiedad */}
            <Card>
                <CardHeader>
                    <CardTitle>Propiedad</CardTitle>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-3">
                            <Field>
                                <FieldLabel>Lote N°</FieldLabel>
                                <Input
                                    value={perfil.lote ?? ''}
                                    disabled
                                    readOnly
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Manzana</FieldLabel>
                                <Input
                                    value={perfil.manzana ?? ''}
                                    disabled
                                    readOnly
                                />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Descripción</FieldLabel>
                            <Textarea
                                value={perfil.descripcion ?? ''}
                                disabled
                                readOnly
                                rows={3}
                            />
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>

            {/* Card 2: Datos de contacto */}
            <Card>
                <CardHeader>
                    <CardTitle>Datos de contacto</CardTitle>
                </CardHeader>
                <CardContent>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-3">
                            <Field>
                                <FieldLabel>Titular</FieldLabel>
                                <Input
                                    value={perfil.propietario?.nombre ?? ''}
                                    disabled
                                    readOnly
                                />
                            </Field>
                            <Field>
                                <FieldLabel>DNI</FieldLabel>
                                <Input
                                    value={perfil.propietario?.dni ?? ''}
                                    disabled
                                    readOnly
                                />
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
                            <FieldLabel>Teléfono alternativo</FieldLabel>
                            <Input
                                type="tel"
                                value={data.alt_telefono}
                                onChange={(e) =>
                                    setData('alt_telefono', e.target.value)
                                }
                                placeholder="Ej: 3512345678"
                            />
                            <InputError message={errors.alt_telefono} />
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>

            <Button type="submit" disabled={processing} className="w-full">
                {processing ? 'Guardando...' : 'Guardar'}
            </Button>
        </form>
    );
}

PerfilPropietarioPage.layout = (page: React.ReactNode) => (
    <AdaptiveLayout
        pageTitle="Mi perfil"
        pageDescription="Actualizá tus datos de contacto"
        browserTitle="Mi perfil"
        icon={Home}
        breadcrumbs={[{ title: 'Mi perfil', href: edit().url }]}
    >
        {page}
    </AdaptiveLayout>
);
