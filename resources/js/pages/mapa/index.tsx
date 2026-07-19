import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Head, setLayoutProps } from '@inertiajs/react';
import type L from 'leaflet';
import { Minus, Plus, Radar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

export default function MapaIndex() {
    const { t } = useTranslation(['mapa', 'common']);
    setLayoutProps({
        pageTitle: t('title'),
        browserTitle: t('title'),
    });
    const [position, setPosition] = useState<Position>(defaultPosition);
    const [radio, setRadio] = useState(5);
    const { sitios, loading, fetchSitios } = useSitiosFetcher();
    const initialLoadDone = useRef(false);

    useEffect(() => {
        if (initialLoadDone.current) {
            return;
        }

        initialLoadDone.current = true;

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    });
                    fetchSitios(
                        pos.coords.latitude,
                        pos.coords.longitude,
                        radio,
                    );
                },
                () => {
                    fetchSitios(
                        defaultPosition.lat,
                        defaultPosition.lng,
                        radio,
                    );
                },
            );
        } else {
            fetchSitios(defaultPosition.lat, defaultPosition.lng, radio);
        }
    }, [fetchSitios, radio]);

    useEffect(() => {
        if (!initialLoadDone.current) {
            return;
        }

        fetchSitios(position.lat, position.lng, radio);
    }, [radio, fetchSitios, position.lat, position.lng]);

    const handleMoveEnd = (center: L.LatLng) => {
        setPosition({ lat: center.lat, lng: center.lng });
    };

    const adjustRadio = (delta: number) => {
        setRadio((prev) => Math.max(1, Math.min(100, prev + delta)));
    };

    return (
        <>
            <div className="relative h-full w-full z-1 aqui1">
                <MapContainer
                    center={[position.lat, position.lng]}
                    zoom={13}
                    className="h-full w-full z-10"
                    zoomControl={false}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEvents onMoveEnd={handleMoveEnd} />

                    {sitios.map((sitio) => (
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
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Controls overlay */}
                <div className="absolute right-4 top-10 z-20 flex flex-col gap-2">
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

                {/* Info overlay */}
                <div className="absolute top-4 left-4 z-[1000]">
                    <Card>
                        <CardContent className="flex items-center gap-2 p-3">
                            <Radar className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                                {sitios.length} {t('sitios_encontrados')}
                            </span>
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