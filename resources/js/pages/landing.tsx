import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Globe, MapPin, MessageCircle, Send, Trees, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { novedades } from '@/routes';

type Stats = {
    departamentos: number;
    nodos: number;
    sitios: number;
};

type Props = {
    stats: Stats;
};

export default function Landing({ stats }: Props) {
    const { t } = useTranslation(['landing', 'common']);
    const { flash } = usePage().props as { flash?: { success?: string } };
    const [isPwaInstallable] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        telefono: '',
        consulta: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contacto', {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title={t('app_full_name', { ns: 'common' })}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 px-4">
                    <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5" />
                    <div className="relative z-10 mx-auto max-w-4xl text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            {t('hero_title')}
                        </h1>
                        <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                            {t('hero_subtitle')}
                        </p>
                        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button size="lg" asChild>
                                <a href={novedades().url}>{t('hero_cta')}</a>
                            </Button>
                            {isPwaInstallable && (
                                <Button size="lg" variant="outline">
                                    {t('hero_download')}
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="border-y bg-muted/30 py-12">
                    <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">{stats.departamentos}</div>
                            <div className="text-sm text-muted-foreground">{t('stats_departamentos')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">{stats.nodos}</div>
                            <div className="text-sm text-muted-foreground">{t('stats_nodos')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">{stats.sitios}</div>
                            <div className="text-sm text-muted-foreground">{t('stats_sitios')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">∞</div>
                            <div className="text-sm text-muted-foreground">{t('stats_experiencia')}</div>
                        </div>
                    </div>
                </section>

                {/* Que es DTSE Section */}
                <section className="px-4 py-20">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="mb-6 text-3xl font-bold text-foreground">{t('que_es_title')}</h2>
                        <p className="mb-4 text-lg text-muted-foreground">{t('que_es_text')}</p>
                        <p className="mb-10 text-lg text-muted-foreground">{t('que_es_mision')}</p>
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card>
                                <CardContent className="flex flex-col items-center p-6">
                                    <Globe className="mb-3 h-10 w-10 text-primary" />
                                    <h3 className="font-semibold">{t('que_es_guia')}</h3>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center p-6">
                                    <Trees className="mb-3 h-10 w-10 text-primary" />
                                    <h3 className="font-semibold">{t('que_es_integracion')}</h3>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center p-6">
                                    <MapPin className="mb-3 h-10 w-10 text-primary" />
                                    <h3 className="font-semibold">{t('que_es_mapa')}</h3>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Viaja de forma inteligente */}
                <section className="bg-muted/30 px-4 py-20">
                    <div className="mx-auto max-w-4xl text-center">
                        <h2 className="mb-4 text-3xl font-bold text-foreground">{t('viaja_title')}</h2>
                        <p className="mb-12 text-lg text-muted-foreground">{t('viaja_text')}</p>
                        <div className="grid gap-8 md:grid-cols-2">
                            <Card>
                                <CardContent className="flex flex-col items-center p-8">
                                    <Zap className="mb-4 h-12 w-12 text-primary" />
                                    <h3 className="mb-2 text-xl font-semibold">{t('tiempo_real_title')}</h3>
                                    <p className="text-muted-foreground">{t('tiempo_real_text')}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center p-8">
                                    <MessageCircle className="mb-4 h-12 w-12 text-primary" />
                                    <h3 className="mb-2 text-xl font-semibold">{t('asistente_title')}</h3>
                                    <p className="text-muted-foreground">{t('asistente_text')}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Contacto Section */}
                <section className="px-4 py-20">
                    <div className="mx-auto max-w-lg">
                        <h2 className="mb-2 text-center text-3xl font-bold text-foreground">{t('contacto_title')}</h2>
                        <p className="mb-8 text-center text-muted-foreground">{t('contacto_text')}</p>

                        {flash?.success && (
                            <div className="mb-6 rounded-lg bg-green-50 p-4 text-center text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                {t('contacto_exito')}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="nombre" className="mb-1 block text-sm font-medium">
                                    {t('nombre', { ns: 'common' })} *
                                </label>
                                <Input
                                    id="nombre"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    required
                                />
                                {errors.nombre && <p className="mt-1 text-sm text-destructive">{errors.nombre}</p>}
                            </div>
                            <div>
                                <label htmlFor="telefono" className="mb-1 block text-sm font-medium">
                                    {t('telefono', { ns: 'common' })} *
                                </label>
                                <Input
                                    id="telefono"
                                    type="tel"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    required
                                />
                                {errors.telefono && <p className="mt-1 text-sm text-destructive">{errors.telefono}</p>}
                            </div>
                            <div>
                                <label htmlFor="consulta" className="mb-1 block text-sm font-medium">
                                    {t('consulta', { ns: 'common' })} *
                                </label>
                                <Textarea
                                    id="consulta"
                                    value={data.consulta}
                                    onChange={(e) => setData('consulta', e.target.value)}
                                    rows={4}
                                    required
                                />
                                {errors.consulta && <p className="mt-1 text-sm text-destructive">{errors.consulta}</p>}
                            </div>
                            <Button type="submit" className="w-full" disabled={processing}>
                                <Send className="mr-2 h-4 w-4" />
                                {t('enviar', { ns: 'common' })}
                            </Button>
                        </form>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t bg-muted/50 py-6 text-center text-sm text-muted-foreground">
                    {t('footer_text')}
                </footer>
            </div>
        </>
    );
}
