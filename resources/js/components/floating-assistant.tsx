import { useEffect, useRef, useState } from 'react';
import { Link, useHttp, usePage } from '@inertiajs/react';
import { Compass, Send, Sparkles, User, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import perfil from '@/assets/perfil_uritu.jpg';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { asistente } from '@/routes/api';
import { recarga } from '@/routes/credito';
import type { ChatMessage } from '@/types/chat';

interface FloatingAssistantProps {
    onSuggestCity?: (city: string) => void;
}

export function FloatingAssistant(props: FloatingAssistantProps) {
    // Contador persistente para generar IDs sin llamar a funciones impuras
    // UseRef mantiene el contador entre renders sin violar reglas de render puro.
    const messageIdRef = useRef(0);
    const { onSuggestCity } = props;
    const { data, setData, post, processing, errors } = useHttp({
        consulta: ''
    })
    const { auth } = usePage().props


    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            sender: 'assistant',
            text: '¡Hola! Soy Uritu 🦜, tu asistente virtual de turismo de Santiago del Estero. ¿En qué puedo ayudarte hoy?',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [creditDialogOpen, setCreditDialogOpen] = useState(false);
    const [creditDialogType, setCreditDialogType] = useState<'unauthenticated' | 'no-credits'>('unauthenticated');

    // Auto-scroll to the bottom of the conversation
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, processing]);

    const suggestions = [
        {
            text: '🍲 Comida típica',
            prompt: '¿Cuáles son los platos típicos e imperdibles de Santiago del Estero?',
        },
        {
            text: '🎶 Festivales y peñas',
            prompt: 'Cuéntame sobre las peñas folclóricas y festivales más populares.',
        },
        {
            text: '🌿 Termas de Río Hondo',
            prompt: '¿Qué puedo hacer en las Termas de Río Hondo y cómo llegar?',
        },
        {
            text: '🏛️ Qué visitar gratis',
            prompt: 'Recomiéndame 5 actividades gratuitas o paseos culturales en Santiago del Estero.',
        },
    ];

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || processing) {
            return;
        }

        const userMsg: ChatMessage = {
            id: (++messageIdRef.current).toString(),
            sender: 'user',
            text: text.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setData('consulta', text.trim())

        post(asistente.url(), {
            onSuccess: (response) => {
                const assistantMsg: ChatMessage = {
                    id: (++messageIdRef.current).toString(),
                    sender: 'assistant',
                    text: response.respuesta,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMsg]);
            },
            onError: (err) => {

                const errorMsg: ChatMessage = {
                    id: (++messageIdRef.current).toString(),
                    sender: 'assistant',
                    text: err.creditos ? '¡Uy! Parece que hubo un problema. ' + err.creditos : '¡Uy! Parece que hubo un problema de conexión con mi servidor. De todos modos, ¡déjame contarte que Santiago del Estero es famosa por sus empanadas santiagueñas al horno de barro, el cabrito, y sus cálidas peñas como la de la familia Carabajal! ¿Qué más te gustaría saber?',
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorMsg]);

                if (err.creditos) {
                    setCreditDialogType(auth.user ? 'no-credits' : 'unauthenticated');
                    setCreditDialogOpen(true);
                }
            }
        });
    };

    const handleSuggestionClick = (prompt: string) => {
        handleSendMessage(prompt);
    };

    return (
        <>
            {/* Draggable Floating Globe Balloon button using Framer Motion */}
            <motion.div
                drag
                dragElastic={0.15}
                dragMomentum={false}
                whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="fixed left-6 bottom-20 z-50 cursor-grab md:bottom-8"
                style={{ touchAction: 'none' }} // Prevents page scroll during drag on mobile
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                id="floating-assistant-balloon"
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative flex h-25 w-25 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-gradient-to-tr from-[#00327d]/90 to-[#0047ab]/90 text-white shadow-[0_8px_32px_rgba(0,71,171,0.3)] backdrop-blur-md focus:outline-none active:shadow-md md:h-[68px] md:w-[68px]"
                    title="Abrir Asistente DTSE"
                    id="assistant-trigger-btn"
                >
                    {/* Video background */}
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="-inset-0.1 absolute h-26 w-26 rounded-full object-cover"
                    >
                        <source
                            src="/vid/uritu_mundial.webm"
                            type="video/webm"
                        />
                    </video>

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00327d]/40 to-[#0047ab]/40" />

                    {/* Animated pulsing outer rings */}
                    <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-full bg-white/20 opacity-40" />
                    <span className="pointer-events-none absolute -inset-1 animate-pulse rounded-full border border-white/20" />
                </button>
            </motion.div>

            {/* Assistant Overlay Sheet */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 220,
                        }}
                        className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-t-3xl border border-white/50 bg-white/70 shadow-[0_16px_48px_rgba(0,0,0,0.15)] backdrop-blur-xl md:inset-auto md:right-8 md:bottom-28 md:h-[580px] md:max-h-none md:w-[380px] md:rounded-2xl"
                        id="assistant-chat-panel"
                    >
                        {/* Header */}
                        <div className="relative flex items-center justify-between overflow-hidden bg-[#00327d]/90 px-5 py-4 text-white shadow-sm backdrop-blur-md">
                            {/* background glows */}
                            <div className="pointer-events-none absolute top-[-50%] left-[-20%] h-[150px] w-[150px] rounded-full bg-[#0047ab]/40 blur-2xl" />
                            <div className="pointer-events-none absolute right-[-10%] bottom-[-50%] h-[120px] w-[120px] rounded-full bg-[#ffe16d]/20 blur-xl" />

                            <div className="relative flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                                    <img src={perfil} className="h-9 w-9 rounded-full  bg-white/10" />
                                </div>
                                <div>
                                    <h3 className="font-montserrat flex items-center gap-1.5 text-sm leading-none font-bold">
                                        Uritu
                                    </h3>
                                    <span className="mt-0.5 inline-block font-sans text-[10px] text-gray-200/80">
                                        Asistente virtual de turismo
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                                id="close-assistant-btn"
                            >
                                <X className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        {/* Conversation Area */}
                        <div className="flex flex-1 scrollbar-thin flex-col gap-3 overflow-y-auto bg-white/20 p-4 backdrop-blur-md">
                            {messages.map((msg) => {
                                const isAssistant = msg.sender === 'assistant';

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex max-w-[85%] items-start gap-2 ${isAssistant
                                            ? 'self-start'
                                            : 'flex-row-reverse self-end'
                                            }`}
                                    >
                                        {/* Avatar circle */}
                                        <div
                                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isAssistant
                                                ? 'bg-[#00327d]/10 text-[#00327d]'
                                                : 'bg-[#fcd400]/20 text-[#705d00]'
                                                }`}
                                        >
                                            {isAssistant ? (
                                                <Compass className="h-4 w-4" />
                                            ) : (
                                                <User className="h-4 w-4" />
                                            )}
                                        </div>

                                        {/* Bubble box */}
                                        <div className="flex flex-col">
                                            <div
                                                className={`rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${isAssistant
                                                    ? 'rounded-tl-none border border-white/40 bg-white/60 text-gray-800 backdrop-blur-sm'
                                                    : 'rounded-tr-none bg-[#00327d]/90 text-white backdrop-blur-sm'
                                                    }`}
                                            >
                                                <p className="whitespace-pre-line">
                                                    {msg.text}
                                                </p>
                                            </div>
                                            <span className="mt-1 self-end px-1 text-[9px] text-gray-400">
                                                {msg.timestamp.toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    },
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {processing && (
                                <div className="flex max-w-[80%] items-start gap-2 self-start">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00327d]/10 text-[#00327d]">
                                        <Compass className="h-4 w-4 animate-spin" />
                                    </div>
                                    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-none border border-white/40 bg-white/60 p-3 text-sm text-gray-500 shadow-sm backdrop-blur-sm">
                                        <span>Escribiendo</span>
                                        <span className="flex gap-0.5">
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 delay-75" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 delay-150" />
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 delay-300" />
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Predefined suggestion chips */}
                        {messages.length === 1 && (
                            <div className="flex flex-col gap-1.5 border-t border-white/15 bg-white/15 px-4 pt-2 pb-2 backdrop-blur-md">
                                <span className="px-1 text-[10px] font-semibold text-gray-500">
                                    Prueba preguntando:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                    {suggestions.map((sug, i) => (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                handleSuggestionClick(
                                                    sug.prompt,
                                                )
                                            }
                                            className="max-w-full truncate rounded-full border border-white/40 bg-white/40 px-2.5 py-1 text-left text-xs text-gray-700 shadow-sm backdrop-blur-md transition-all hover:border-[#00327d]/30 hover:bg-white/60 hover:text-[#00327d]"
                                        >
                                            {sug.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input Bar */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage(inputValue);
                            }}
                            className="flex items-center gap-2 border-t border-white/20 bg-white/30 p-3 backdrop-blur-md"
                        >
                            <input
                                type="text"
                                placeholder="Pregúntame algo..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={processing}
                                className="flex-1 rounded-xl border border-white/40 bg-white/50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition-colors outline-none focus:border-[#00327d]"
                                id="assistant-chat-input"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || processing}
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${inputValue.trim() && !processing
                                    ? 'bg-[#00327d] text-white shadow-md active:scale-95'
                                    : 'bg-gray-100 text-gray-300'
                                    }`}
                                id="assistant-send-btn"
                            >
                                <Send className="h-4.5 w-4.5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* Credit limit AlertDialog */}
            <AlertDialog open={creditDialogOpen} onOpenChange={setCreditDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {creditDialogType === 'unauthenticated'
                                ? 'Cuenta requerida'
                                : 'Sin créditos disponibles'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {creditDialogType === 'unauthenticated'
                                ? 'Para seguir consultando a Uritu, necesitás crear una cuenta o iniciar sesión si ya tenés una.'
                                : 'Te quedaste sin créditos para realizar consultas. Recargá tu saldo para seguir usando el asistente.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cerrar</AlertDialogCancel>
                        {creditDialogType === 'unauthenticated' ? (
                            <>
                                <AlertDialogAction asChild>
                                    <Link href="/login">Iniciar sesión</Link>
                                </AlertDialogAction>
                                <AlertDialogAction asChild>
                                    <Link href="/register">Registrarme</Link>
                                </AlertDialogAction>
                            </>
                        ) : (
                            <AlertDialogAction asChild>
                                <Link href={recarga.url()}>Ir a recargar</Link>
                            </AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}