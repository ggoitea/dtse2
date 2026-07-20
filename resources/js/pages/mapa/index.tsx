import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { setLayoutProps } from '@inertiajs/react';
import type L from 'leaflet';
import { divIcon } from 'leaflet';
import { Crosshair, Minus, Navigation, Plus, Radar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AdaptiveLayout } from '@/layouts/adaptive-layout';

type SitioMapa = {
    id: number;
    nombre: string;
    latitud: string;
    longitud: string;
    categoria: string;
    distancia?: number;
    localidad: { nombre: string };
};

type Position = {
    lat: number;
    lng: number;
};

const defaultPosition: Position = {
    lat: -27.7952,
    lng: -64.2615,
};

function useSitiosFetcher() {
    const [sitios, setSitios] = useState<SitioMapa[]>([]);
    const [loading, setLoading] = useState(true);
    const abortRef = useRef<AbortController | null>(null);

    const fetchSitios = useCallback(
        async (lat: number, lng: number, radio: number) => {
            abortRef.current?.abort();
            abortRef.current = new AbortController();

            setLoading(true);

            try {
                const response = await fetch(
                    `/sitios/data?lat=${lat}&lng=${lng}&radio=${radio}`,
                    {
                        signal: abortRef.current.signal,
                    },
                );

                if (response.ok) {
                    const data = await response.json();
                    setSitios(data);
                }
            } catch (e) {
                if (e instanceof DOMException && e.name === 'AbortError') {
                    return;
                }

                console.error('Error fetching sitios');
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return { sitios, loading, fetchSitios };
}

function MapEvents({ onMoveEnd }: { onMoveEnd: (center: L.LatLng) => void }) {
    const map = useMap();

    useEffect(() => {
        const handleMoveEnd = () => {
            const center = map.getCenter();
            onMoveEnd(center);
        };

        map.on('moveend', handleMoveEnd);

        return () => {
            map.off('moveend', handleMoveEnd);
        };
    }, [map, onMoveEnd]);

    return null;
}

function FlyToPosition({ position }: { position: Position }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo([position.lat, position.lng], 13, {
            duration: 1.5,
        });
    }, [map, position.lat, position.lng]);

    return null;
}

export default function MapaIndex() {
    const { t } = useTranslation(['mapa', 'common']);
    setLayoutProps({
        pageTitle: t('title'),
        browserTitle: t('title'),
    });
    const [userPosition, setUserPosition] = useState<Position | null>(null);
    const [showRecenter, setShowRecenter] = useState(false);
    const [radio, setRadio] = useState(5);
    const [flyTo, setFlyTo] = useState<Position | null>(null);
    const { sitios, loading, fetchSitios } = useSitiosFetcher();
    const [categoriaFilter, setCategoriaFilter] = useState<string>('all');

    const categorias = [
        ...new Set(sitios.map((s) => s.categoria).filter(Boolean)),
    ];

    const sitiosFiltrados =
        categoriaFilter === 'all'
            ? sitios
            : sitios.filter((s) => s.categoria === categoriaFilter);
    const initialLoadDone = useRef(false);
    const lastFetchRef = useRef<string>('');

    const triggerFetch = useCallback(
        (lat: number, lng: number, r: number) => {
            const key = `${lat.toFixed(4)}_${lng.toFixed(4)}_${r}`;

            if (lastFetchRef.current === key) {
                return;
            }

            lastFetchRef.current = key;
            fetchSitios(lat, lng, r);
        },
        [fetchSitios],
    );

    useEffect(() => {
        if (initialLoadDone.current) {
            return;
        }

        initialLoadDone.current = true;

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const posLat = pos.coords.latitude;
                    const posLng = pos.coords.longitude;
                    const userPos = { lat: posLat, lng: posLng };
                    setUserPosition(userPos);
                    setFlyTo(userPos);
                    triggerFetch(posLat, posLng, radio);
                },
                () => {
                    triggerFetch(
                        defaultPosition.lat,
                        defaultPosition.lng,
                        radio,
                    );
                },
            );
        } else {
            triggerFetch(defaultPosition.lat, defaultPosition.lng, radio);
        }
    }, [triggerFetch, radio]);

    const handleMoveEnd = useCallback(
        (center: L.LatLng) => {
            triggerFetch(center.lat, center.lng, radio);

            if (userPosition) {
                const distance = Math.sqrt(
                    (center.lat - userPosition.lat) ** 2 +
                        (center.lng - userPosition.lng) ** 2,
                );
                setShowRecenter(distance > 0.01);
            }
        },
        [triggerFetch, radio, userPosition],
    );

    const handleRecenter = () => {
        if (userPosition) {
            setFlyTo(userPosition);
            setShowRecenter(false);
        }
    };

    const adjustRadio = (delta: number) => {
        setRadio((prev) => Math.max(1, Math.min(100, prev + delta)));
    };

    return (
        <>
            <div className="aqui1 relative z-1 h-full w-full">
                <MapContainer
                    center={[defaultPosition.lat, defaultPosition.lng]}
                    zoom={13}
                    className="z-10 h-full w-full"
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://dtse.com.ar">DTSE</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEvents onMoveEnd={handleMoveEnd} />
                    {flyTo && <FlyToPosition position={flyTo} />}

                    {userPosition && (
                        <Marker
                            position={[userPosition.lat, userPosition.lng]}
                            icon={divIcon({
                                className: 'custom-user-marker',
                                html: '<div class="user-marker-pulse"></div><div class="user-marker-dot"></div>',
                                iconSize: [24, 24],
                                iconAnchor: [12, 12],
                            })}
                        >
                            <Popup>
                                <span className="font-semibold">
                                    {t('tu_ubicacion')}
                                </span>
                            </Popup>
                        </Marker>
                    )}

                    {sitiosFiltrados.map((sitio) => (
                        <Marker
                            key={sitio.id}
                            position={[
                                parseFloat(sitio.latitud),
                                parseFloat(sitio.longitud),
                            ]}
                        >
                            <Popup>
                                <div className="min-w-[200px]">
                                    <h3 className="font-semibold">
                                        {sitio.nombre}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {sitio.localidad.nombre}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {sitio.categoria}
                                    </p>
                                    {sitio.distancia && (
                                        <p className="mt-1 text-xs text-primary">
                                            {sitio.distancia.toFixed(1)}{' '}
                                            {t('km')}
                                        </p>
                                    )}
                                    <Button
                                        className="w-full text-foreground"
                                        variant={'default'}
                                        asChild
                                    >
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${sitio.latitud},${sitio.longitud}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Navigation className="h-3 w-3 text-foreground" />
                                            <span className="text-foreground">
                                                {t('como_llegar')}
                                            </span>
                                        </a>
                                    </Button>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Controls overlay */}
                <div className="absolute top-10 right-4 z-20 flex flex-col gap-2">
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => adjustRadio(5)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Card className="px-3 py-2 text-center text-xs">
                        {radio} {t('km')}
                    </Card>
                    <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => adjustRadio(-5)}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                </div>

                {/* Recenter button */}
                {showRecenter && (
                    <div className="absolute bottom-8 left-1/2 z-[1000] -translate-x-1/2">
                        <Button
                            variant="default"
                            size="sm"
                            className="shadow-lg"
                            onClick={handleRecenter}
                        >
                            <Crosshair className="mr-2 h-4 w-4" />
                            {t('tu_ubicacion')}
                        </Button>
                    </div>
                )}

                {/* Info overlay */}
                <div className="absolute top-4 left-4 z-[1000]">
                    <Card>
                        <CardContent className="flex flex-col gap-2 p-3">
                            <div className="flex items-center gap-2">
                                <Radar className="h-4 w-4 text-primary" />
                                <span className="text-sm">
                                    {sitiosFiltrados.length}{' '}
                                    {t('sitios_encontrados')}
                                </span>
                            </div>
                            {categorias.length > 0 && (
                                <Select
                                    value={categoriaFilter}
                                    onValueChange={setCategoriaFilter}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue
                                            placeholder={t('filtrar_categoria')}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            {t('todas')}
                                        </SelectItem>
                                        {categorias.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {loading && (
                    <div className="absolute top-1/2 left-1/2 z-[1000] -translate-x-1/2 -translate-y-1/2">
                        <Card>
                            <CardContent className="p-4">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}

MapaIndex.layout = [AdaptiveLayout];
