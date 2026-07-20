import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router, useForm } from '@inertiajs/react';
import { Package } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { edit as editRoute, index } from '@/routes/paquetes';

import { PaqueteForm } from './components/paquete-form';
import type { PaqueteTuristico } from './types/paquete';

interface Localidad {
    id: number;
    nombre: string;
}

interface Sitio {
    id: number;
    nombre: string;
    localidad_id: number;
}

interface Evento {
    id: number;
    nombre: string;
    localidad_id: number;
}

interface CategoriaOption {
    value: string;
    label: string;
}

interface Props {
    paquete: PaqueteTuristico;
    localidades: Localidad[];
    sitios: Sitio[];
    eventos: Evento[];
    categorias: CategoriaOption[];
}

export default function PaqueteEdit({
    paquete,
    localidades,
    sitios,
    eventos,
    categorias,
}: Props) {
    const { t } = useTranslation(['paquetes', 'common']);
    const { data, setData, errors, setError, clearErrors } = useForm({
        modelable_type: paquete.modelable_type,
        modelable_id: paquete.modelable_id,
        nombre: paquete.nombre,
        descripcion: paquete.descripcion ?? '',
        categoria: paquete.categoria,
        destino: paquete.destino ?? '',
        duracion: paquete.duracion ?? '',
        evento_data: {
            localidad_id: '' as number | '',
            sitio_id: '' as number | '',
            nombre: '',
            descripcion: '',
            fecha: '',
            inicio: '',
            fin: '',
            domicilio_calle: '',
            domicilio_numero: '',
        },
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setProcessing(true);
        router.put(editRoute.url(paquete.id), data, {
            onError: (errors) => {
                setError(errors as Record<string, string>);
                setProcessing(false);
            },
        });
    };

    return (
        <AdaptiveLayout
            pageTitle={t('editar_paquete')}
            browserTitle={t('editar_paquete')}
            icon={Package}
            breadcrumbs={[
                { title: t('page_title'), href: index.url() },
                { title: t('editar_paquete'), href: '#' },
            ]}
        >
            <div className="space-y-6">
                <HeadingSmall
                    title={t('editar_paquete')}
                    description={paquete.nombre}
                />

                <PaqueteForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    submitLabel={t('guardar')}
                    localidades={localidades}
                    sitios={sitios}
                    eventos={eventos}
                    categorias={categorias}
                    isEdit
                />
            </div>
        </AdaptiveLayout>
    );
}
