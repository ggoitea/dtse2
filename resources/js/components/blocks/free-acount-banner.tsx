import { type ChangeEvent, useEffect, useState } from 'react';
import { useHttp } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    Lock,
    Phone,
    ShieldCheck,
    Star,
    X,
    Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';
import * as planesRoutes from '@/routes/planes';

type PlanKey = 'basico' | 'premium';
type PeriodoFacturacion = 1 | 3 | 6 | 12;

interface PlanData {
    key: PlanKey;
    label: string;
    precio_mensual: number;
    beneficios: string[];
}

const PERIODOS: { value: PeriodoFacturacion; label: string }[] = [
    { value: 1, label: '1 mes' },
    { value: 3, label: '3 meses' },
    { value: 6, label: '6 meses' },
    { value: 12, label: '12 meses' },
];

const PLANES_FALLBACK: Record<PlanKey, PlanData> = {
    basico: {
        key: 'basico',
        label: 'Plan Básico',
        precio_mensual: 0,
        beneficios: [
            'Hasta 80 propiedades',
            'Usuarios ilimitados',
            'Mayor capacidad operativa',
            'Soporte prioritario',
            'Integraciones y reportes avanzados',
        ],
    },
    premium: {
        key: 'premium',
        label: 'Plan Premium',
        precio_mensual: 0,
        beneficios: [
            'Propiedades ilimitadas',
            'Usuarios ilimitados',
            'Guardias ilimitados',
            'Todas las funcionalidades habilitadas',
            'Soporte premium prioritario',
        ],
    },
};

function formatPrice(amount: number): string {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0,
    }).format(amount);
}

const FREE_LIMITS = [
    'Máximo 10 usuarios',
    'Máximo 8 propiedades',
    'Máximo 2 guardias',
];

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    const [planes, setPlanes] =
        useState<Record<PlanKey, PlanData>>(PLANES_FALLBACK);
    const [loadingPlanes, setLoadingPlanes] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

    const { data, setData, post, processing } = useHttp({
        nombre: '',
        apellido: '',
        email: '',
        phone_prefix: '+54',
        phone_number: '',
        codigo_postal: '',
        direccion: '',
        direccion_numero: '',
        plan: 'basico' as PlanKey,
        periodo: 1 as PeriodoFacturacion,
    });

    useEffect(() => {
        if (!isOpen) {
            return;
        } else {
            // eslint-disable-next-line
            setLoadingPlanes(true);
            fetch(planesRoutes.precios.url())
                .then((res) => res.json())
                .then((fetchedPlanes: PlanData[]) => {
                    const planesMap = fetchedPlanes.reduce(
                        (acc, p) => {
                            acc[p.key] = p;

                            return acc;
                        },
                        {} as Record<PlanKey, PlanData>,
                    );
                    setPlanes((prev) => ({ ...prev, ...planesMap }));
                })
                .finally(() => setLoadingPlanes(false));
        }
    }, [isOpen]);

    const plan = planes[data.plan];
    const precioMensual = plan.precio_mensual;
    const precioTotal = precioMensual * data.periodo;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(planesRoutes.solicitarPago.url(), {
            onSuccess: (response) => {
                const res = response as { payment_url?: string };
                setCheckoutUrl(res.payment_url ?? null);
            },
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData(e.target.name as keyof typeof data, e.target.value);
    };

    const handleClose = () => {
        setCheckoutUrl(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-start justify-center overflow-y-auto p-4 md:items-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative my-4 flex w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl md:my-0 md:max-h-[90vh] md:flex-row md:overflow-hidden"
                    >
                        {/* Sidebar */}
                        <div className="flex flex-col justify-between bg-indigo-600 p-8 text-white md:w-2/5">
                            <div>
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                                    <ShieldCheck
                                        className="text-white"
                                        size={24}
                                    />
                                </div>
                                <h2 className="mb-2 text-2xl font-bold">
                                    Expandí tu barrio
                                </h2>
                                <p className="mb-6 text-sm leading-relaxed text-indigo-100">
                                    Tu plan actual tiene limitaciones. Elegí el
                                    plan que mejor se adapta a la escala de tu
                                    operación.
                                </p>

                                {/* Free plan limits */}
                                <div className="mb-6 rounded-xl bg-white/10 p-4">
                                    <p className="mb-3 text-xs font-bold tracking-wider text-indigo-200 uppercase">
                                        Plan gratuito actual
                                    </p>
                                    <ul className="space-y-2">
                                        {FREE_LIMITS.map((limit, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-2 text-sm text-indigo-100"
                                            >
                                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-300" />
                                                {limit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Plan toggle */}
                                <div className="mb-6 flex rounded-xl bg-white/10 p-1">
                                    {(['basico', 'premium'] as PlanKey[]).map(
                                        (key) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() =>
                                                    setData('plan', key)
                                                }
                                                className={cn(
                                                    'flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all',
                                                    data.plan === key
                                                        ? 'bg-white text-indigo-700 shadow'
                                                        : 'text-indigo-100 hover:text-white',
                                                )}
                                            >
                                                {key === 'premium' && (
                                                    <Star
                                                        size={12}
                                                        className="mr-1 mb-0.5 inline"
                                                    />
                                                )}
                                                {planes[key].label}
                                            </button>
                                        ),
                                    )}
                                </div>

                                {/* Plan benefits */}
                                <AnimatePresence mode="wait">
                                    <motion.ul
                                        key={data.plan}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-3"
                                    >
                                        {plan.beneficios.map((benefit, i) => (
                                            <li
                                                key={i}
                                                className="flex items-center gap-3 text-sm font-medium"
                                            >
                                                <ShieldCheck
                                                    size={16}
                                                    className="shrink-0 text-indigo-300"
                                                />
                                                {benefit}
                                            </li>
                                        ))}
                                    </motion.ul>
                                </AnimatePresence>

                                {/* Periodo de facturación */}
                                <div className="mt-6">
                                    <p className="mb-2 text-xs font-bold tracking-wider text-indigo-200 uppercase">
                                        Período de facturación
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {PERIODOS.map(({ value, label }) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() =>
                                                    setData('periodo', value)
                                                }
                                                className={cn(
                                                    'rounded-lg px-3 py-2 text-sm font-semibold transition-all',
                                                    data.periodo === value
                                                        ? 'bg-white text-indigo-700 shadow'
                                                        : 'bg-white/10 text-indigo-100 hover:bg-white/20',
                                                )}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${data.plan}-${data.periodo}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-8 border-t border-indigo-500/30 pt-6"
                                >
                                    <p className="mb-1 text-xs font-bold tracking-wider text-indigo-300 uppercase">
                                        {plan.label} · {data.periodo}{' '}
                                        {data.periodo === 1 ? 'mes' : 'meses'}
                                    </p>
                                    {loadingPlanes ? (
                                        <div className="h-10 w-32 animate-pulse rounded bg-white/20" />
                                    ) : (
                                        <>
                                            <p className="text-3xl font-bold">
                                                {formatPrice(precioTotal)}
                                            </p>
                                            {data.periodo > 1 && (
                                                <p className="mt-0.5 text-xs text-indigo-300">
                                                    {formatPrice(precioMensual)}{' '}
                                                    /mes
                                                </p>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Formulario */}
                        <div className="flex-1 bg-gray-50 p-8 md:overflow-y-auto">
                            {checkoutUrl ? (
                                <div className="flex h-full flex-col items-center justify-center text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600"
                                    >
                                        <ShieldCheck size={40} />
                                    </motion.div>
                                    <h3 className="mb-2 text-2xl font-bold text-gray-900">
                                        ¡Solicitud enviada!
                                    </h3>
                                    <p className="mb-2 text-gray-600">
                                        Tu solicitud para el{' '}
                                        <span className="font-semibold text-indigo-700">
                                            {plan.label}
                                        </span>{' '}
                                        fue procesada.
                                    </p>
                                    <p className="mb-8 text-sm text-gray-500">
                                        Hacé clic en el botón para completar el
                                        pago de forma segura a través de
                                        MercadoPago.
                                    </p>
                                    <a
                                        href={checkoutUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mb-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95"
                                    >
                                        Ir a pagar
                                        <ArrowUpRight size={20} />
                                    </a>
                                    <button
                                        onClick={handleClose}
                                        className="text-sm text-gray-400 transition-colors hover:text-gray-600"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5 text-[#444]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Datos de contacto
                                            </h3>
                                            <p className="mt-0.5 text-sm text-gray-500">
                                                Completá tus datos para procesar
                                                la suscripción.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="text-gray-400 transition-colors hover:text-gray-600"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    {/* Nombre y apellido */}
                                    <div className="grid grid-cols-1 gap-4 text-[#444] md:grid-cols-2">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                                Nombre
                                            </label>
                                            <input
                                                required
                                                name="nombre"
                                                value={data.nombre}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Juan"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                                Apellido
                                            </label>
                                            <input
                                                required
                                                name="apellido"
                                                value={data.apellido}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Pérez"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            Email
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="juan@empresa.com"
                                        />
                                    </div>

                                    {/* Teléfono */}
                                    <div className="space-y-1">
                                        <label className="flex items-center gap-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            <Phone size={12} />
                                            Teléfono
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                required
                                                name="phone_prefix"
                                                value={data.phone_prefix}
                                                onChange={handleChange}
                                                className="w-20 rounded-lg border border-gray-200 bg-white px-3 py-2 text-center font-mono transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="+54"
                                            />
                                            <input
                                                required
                                                name="phone_number"
                                                value={data.phone_number}
                                                onChange={handleChange}
                                                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="11 1234 5678"
                                            />
                                        </div>
                                    </div>

                                    {/* Dirección */}
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                                Dirección
                                            </label>
                                            <input
                                                required
                                                name="direccion"
                                                value={data.direccion}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Av. Corrientes"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                                Número
                                            </label>
                                            <input
                                                required
                                                name="direccion_numero"
                                                value={data.direccion_numero}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="1234"
                                            />
                                        </div>
                                    </div>

                                    {/* Código postal */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                            Código Postal
                                        </label>
                                        <input
                                            required
                                            name="codigo_postal"
                                            value={data.codigo_postal}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="C1043"
                                        />
                                    </div>

                                    {/* Plan resumen */}
                                    <div className="flex items-center justify-between rounded-xl bg-indigo-50 p-4">
                                        <div>
                                            <p className="text-xs font-bold tracking-wide text-indigo-900 uppercase">
                                                {plan.label}
                                            </p>
                                            <p className="mt-0.5 text-sm text-indigo-700">
                                                {data.periodo}{' '}
                                                {data.periodo === 1
                                                    ? 'mes'
                                                    : 'meses'}
                                            </p>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatPrice(precioTotal)}
                                        </p>
                                    </div>

                                    <button
                                        disabled={processing}
                                        type="submit"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {processing ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        ease: 'linear',
                                                    }}
                                                    className="h-6 w-6 rounded-full border-2 border-white/30 border-t-white"
                                                />
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <Zap size={20} />
                                                Solicitar suscripción
                                            </>
                                        )}
                                    </button>

                                    <p className="flex items-center justify-center gap-1 text-center text-xs text-gray-400">
                                        <Lock size={12} /> Tus datos están
                                        protegidos y se usan únicamente para
                                        procesar tu suscripción.
                                    </p>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export default function FreeAccountBanner() {
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    return (
        <>
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={cn(
                    'sticky top-0 z-50 flex items-center justify-between bg-indigo-600 px-4 py-3 text-white shadow-md',
                    'mb-2 rounded-lg',
                )}
            >
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white/20 p-2">
                        <AlertCircle size={20} className="text-white" />
                    </div>
                    <div>
                        <p className="font-medium">
                            Estás utilizando el plan gratuito. Actualizá tu
                            cuenta para gestionar tu barrio sin límites.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold whitespace-nowrap text-indigo-600 transition-colors hover:bg-indigo-50 active:scale-95"
                >
                    Ver planes
                    <ArrowRight size={16} />
                </button>
            </motion.div>
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />
        </>
    );
}
