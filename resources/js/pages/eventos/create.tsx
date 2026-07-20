import { router, useForm } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import HeadingSmall from '@/components/heading-small';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';
import { create, index } from '@/routes/eventos';

import { EventoForm } from './components/evento-form';

interface Localidad {
    id: number;
    nombre: string;
}

interface Sitio {
    id: number;
    nombre: string;
    localidad_id: number;
    domicilio_calle: string;
    domicilio_numero: string | null;
}

interface Props {
    localidades: Localidad[];
    sitios: Sitio[];
}

export default function EventoCreate({ localidades, sitios }: Props) {
    const { t } = useTranslation(['eventos', 'common']);
    const { data, setData, errors, setError, clearErrors } = useForm({
        localidad_id: '' as number | '',
        sitio_id: '' as number | '',
        nombre: '',
        descripcion: '',
        fecha: '',
        inicio: '',
        fin: '',
        domicilio_calle: '',
        domicilio_numero: '',
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
        <AdaptiveLayout
            pageTitle={t('crear_evento')}
            browserTitle={t('crear_evento')}
            icon={Calendar}
            breadcrumbs={[
                { title: t('page_title'), href: index.url() },
                { title: t('crear_evento'), href: '#' },
            ]}
        >
            <div className="space-y-6">
                <HeadingSmall
                    title={t('crear_evento')}
                    description={t('page_description')}
                />

                <EventoForm
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    onSubmit={handleSubmit}
                    submitLabel={t('guardar')}
                    localidades={localidades}
                    sitios={sitios}
                />
            </div>
        </AdaptiveLayout>
    );
}
