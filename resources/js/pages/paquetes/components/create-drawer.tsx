import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router, useForm } from '@inertiajs/react';
import { Package } from 'lucide-react';

import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { create as createRoute } from '@/routes/paquetes';

import { EventoOpcion, PaqueteForm, PaqueteFormData, SitioOpcion } from './paquete-form';
import { Option } from '@/types/global';

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
    open: boolean;
    onOpenChange: (open: boolean) => void;
    localidades: Option[];
    sitios: SitioOpcion[];
    eventos: EventoOpcion[];
    categorias: CategoriaOption[];
}

export default function CreatePaqueteDrawer({
    open,
    onOpenChange,
    localidades,
    sitios,
    eventos,
    categorias,
}: Props) {
    const { t } = useTranslation(['paquetes', 'common']);
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { post, data, setData, errors, setError, clearErrors, processing } = useForm<PaqueteFormData>({
        localidad_id: null,
        asignar_a: 'sitio',
        sitio_id: null,
        evento_id: null,
        evento_data: null,
        nombre: '',
        descripcion: '',
        categoria: '',
    });

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        clearErrors();
        post(createRoute().url, {
            onError: (errors) => {
                setError(errors as Record<string, string>);
            },
            onFinish: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <Drawer
            open={open}
            onOpenChange={onOpenChange}
            direction="right"
            dismissible={false}

        >
            <DrawerContent ref={containerRef} className='w-full! lg:max-w-sm!'>
                <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-2">
                        <Package className="size-5" />
                        {t('nuevo_paquete')}
                    </DrawerTitle>
                    <DrawerDescription>
                        {t('page_description')}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto px-4">
                    <PaqueteForm
                        localidades={localidades}
                        sitios={sitios}
                        eventos={eventos}
                        categorias={categorias}
                        containerRef={containerRef}
                        ref={formRef}

                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        onSubmit={handleSubmit}
                        submitLabel={t('guardar')}
                    />
                </div>

                <DrawerFooter>
                    <Button
                        type="button"
                        disabled={processing}
                        onClick={() => formRef.current?.requestSubmit()}
                    >
                        {processing && <Spinner />}
                        {t('guardar')}
                    </Button>
                    <DrawerClose asChild>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            {t('common:cancelar')}
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
