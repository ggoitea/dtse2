import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Head, setLayoutProps } from '@inertiajs/react';
import { Calendar, MapPin, Package, Search } from 'lucide-react';

// import { landing } from '@/routes';
import fondo from '@/assets/novedades_hero.jpg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';

type Sitio = {
    id: number;
    nombre: string;
    descripcion: string | null;
    categoria: string;
    estado: string;
    archivo_default: { path: string } | null;
    eventos: Evento[];
    paquetes: PaqueteTuristico[];
    localidad: { nombre: string; departamento: { nombre: string } };
};

type Evento = {
    id: number;
    nombre: string;
    fecha: string;
    estado: string;
};

type PaqueteTuristico = {
    id: number;
    nombre: string;
    categoria: string;
    estado: string;
};

type Categoria = {
    value: string;
    label: string;
};

type Props = {
    sitios: Sitio[];
    eventos: Evento[];
    categorias: Categoria[];
};

export default function NovedadesIndex({ sitios, categorias }: Props) {
    const { t } = useTranslation(['novedades', 'common']);
    setLayoutProps({
        pageTitle: t('hero_title'),
        browserTitle: t('hero_title'),
    });
    const [buscar, setBuscar] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');

    const handleSearch = () => {
        // router.get(landing().url, { buscar, categoria: categoriaFiltro }, { preserveState: true });
    };

    const handleCategoria = (cat: string) => {
        setCategoriaFiltro(cat);
        // router.get(landing().url, { buscar, categoria: cat }, { preserveState: true });
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section
                className="relative bg-linear-to-br from-primary/10 via-background to-primary/5 bg-cover bg-center px-4 py-16 text-center"
                style={{ backgroundImage: `url(${fondo})` }}
            >
                <div className="absolute inset-0 bg-black/72"></div>
                <div className="relative">
                    <h1 className="mb-3 text-3xl font-bold text-foreground">
                        {t('hero_title')}
                    </h1>
                    <p className="mb-8 text-muted-foreground">
                        {t('hero_subtitle')}dsd
                    </p>
                </div>

                {/* Search */}
                <div className="relative mx-auto flex max-w-md gap-2">
                    <Input
                        className="bg-white/50! text-black! placeholder:text-black/70!"
                        placeholder={t('buscar_placeholder')}
                        value={buscar}
                        onChange={(e) => setBuscar(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <Button onClick={handleSearch}>
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </section>

            {/* Category Filters */}
            <section className="border-b px-4 py-4">
                <div className="scrollbar-hide mx-auto flex max-w-5xl gap-2 overflow-x-auto pb-2">
                    <Button
                        variant={categoriaFiltro === '' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleCategoria('')}
                    >
                        {t('filtro_todas')}
                    </Button>
                    {categorias.map((cat) => (
                        <Button
                            key={cat.value}
                            variant={
                                categoriaFiltro === cat.value
                                    ? 'default'
                                    : 'outline'
                            }
                            size="sm"
                            onClick={() => handleCategoria(cat.value)}
                            className="shrink-0"
                        >
                            {cat.label}
                        </Button>
                    ))}
                </div>
            </section>

            {/* Sitios List */}
            <section className="mx-auto max-w-5xl px-4 py-8">
                {sitios.length === 0 ? (
                    <p className="py-12 text-center text-muted-foreground">
                        {t('sin_sitios')}
                    </p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sitios.map((sitio) => (
                            <Card key={sitio.id} className="overflow-hidden">
                                <div className="relative h-40 bg-muted">
                                    {sitio.archivo_default ? (
                                        <img
                                            src={`/storage/${sitio.archivo_default.path}`}
                                            alt={sitio.nombre}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <MapPin className="h-10 w-10 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    {sitio.eventos.length > 0 && (
                                        <Badge
                                            className="absolute top-2 right-2"
                                            variant="secondary"
                                        >
                                            <Calendar className="mr-1 h-3 w-3" />
                                            {t('proximo')}{' '}
                                            {sitio.eventos.length} {t('dias')}
                                        </Badge>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="mb-1 font-semibold">
                                        {sitio.nombre}
                                    </h3>
                                    <p className="mb-2 text-sm text-muted-foreground">
                                        {sitio.localidad.nombre},{' '}
                                        {sitio.localidad.departamento.nombre}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {sitio.categoria}
                                    </Badge>
                                    {sitio.paquetes.length > 0 && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="mt-2 p-0"
                                        >
                                            <Package className="mr-1 h-3 w-3" />
                                            {t('ver_paquetes')} (
                                            {sitio.paquetes.length})
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

NovedadesIndex.layout = [AdaptiveLayout];
