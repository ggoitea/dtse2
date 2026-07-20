import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router, useForm } from '@inertiajs/react';
import { Calendar } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import { AdaptiveLayout } from '@/layouts/adaptative-layout';
import { edit as editRoute, index } from '@/routes/eventos';

import { EventoForm } from './components/evento-form';
import type { Evento } from './types/evento';

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
    evento: Evento;
    localidades: Localidad[];
    sitios: Sitio[];
}

export default function EventoEdit({ evento, localidades, sitios }: Props) {
    const { t } = useTranslation(['eventos', 'common']);
    const { data, setData, errors, setError, clearErrors } = useForm({
        localidad_id: evento.localidad_id,
        sitio_id: evento.sitio_id ?? ('' as number | ''),
        nombre: evento.nombre,
        descripcion: evento.descripcion ?? '',
        fecha: evento.fecha,
        inicio: evento.inicio ?? '',
        fin: evento.fin ?? '',
        domicilio_calle: evento.domicilio_calle,
        domicilio_numero: evento.domicilio_numero ?? '',
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();
        setProcessing(true);
        router.put(editRoute.url(evento.id), data, {
            onError: (errors) => {
                setError(errors as Record<string, string>);
                setProcessing(false);
            },
        });
    };

    return (
        <AdaptiveLayout
            pageTitle={t('editar_evento')}
            browserTitle={t('editar_evento')}
            icon={Calendar}
            breadcrumbs={[
                { title: t('page_title'), href: index.url() },
                { title: t('editar_evento'), href: '#' },
            ]}
        >
            <div className="space-y-6">
                <HeadingSmall
                    title={t('editar_evento')}
                    description={evento.nombre}
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
                    isEdit
                />
            </div>
        </AdaptiveLayout>
    );
}
