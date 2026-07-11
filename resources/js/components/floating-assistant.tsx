import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Compass, User } from 'lucide-react';
import { ChatMessage } from '@/types/chat';

interface FloatingAssistantProps {
  onSuggestCity?: (city: string) => void;
}

export function FloatingAssistant({ onSuggestCity }: FloatingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '¡Hola! Soy tu asistente de viajes de DTSE. Pregúntame sobre qué hacer en Santiago del Estero, comida típica, paseos imperdibles o cualquier lugar que desees descubrir.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the conversation
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const suggestions = [
    { text: '🍲 Comida típica', prompt: '¿Cuáles son los platos típicos e imperdibles de Santiago del Estero?' },
    { text: '🎶 Festivales y peñas', prompt: 'Cuéntame sobre las peñas folclóricas y festivales más populares.' },
    { text: '🌿 Termas de Río Hondo', prompt: '¿Qué puedo hacer en las Termas de Río Hondo y cómo llegar?' },
    { text: '🏛️ Qué visitar gratis', prompt: 'Recomiéndame 5 actividades gratuitas o paseos culturales en Santiago del Estero.' },
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || 'Lo siento, no pude obtener una respuesta en este momento.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error contacting assistant backend:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: '¡Uy! Parece que hubo un problema de conexión con mi servidor. De todos modos, ¡déjame contarte que Santiago del Estero es famosa por sus empanadas santiagueñas al horno de barro, el cabrito, y sus cálidas peñas como la de la familia Carabajal! ¿Qué más te gustaría saber?',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
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
        className="fixed bottom-20 md:bottom-8 right-6 z-50 cursor-grab"
        style={{ touchAction: 'none' }} // Prevents page scroll during drag on mobile
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        id="floating-assistant-balloon"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-25 h-25 md:w-[68px] md:h-[68px] rounded-full bg-gradient-to-tr from-[#00327d]/90 to-[#0047ab]/90 backdrop-blur-md text-white flex items-center justify-center shadow-[0_8px_32px_rgba(0,71,171,0.3)] border-2 border-white/20 active:shadow-md focus:outline-none overflow-hidden"
          title="Abrir Asistente DTSE"
          id="assistant-trigger-btn"
        >
          {/* Video background */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute -inset-0.1 w-26 h-26 object-cover rounded-full"
          >
            <source src="/vid/uritu_mundial.webm" type="video/webm" />
          </video>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#00327d]/40 to-[#0047ab]/40 rounded-full" />

          {/* Animated pulsing outer rings */}
          <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-40 -z-10 pointer-events-none" />
          <span className="absolute -inset-1 rounded-full border border-white/20 animate-pulse pointer-events-none" />


        </button>
      </motion.div>

      {/* Assistant Overlay Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-x-0 bottom-0 md:inset-auto md:bottom-28 md:right-8 md:w-[380px] md:h-[580px] bg-white/70 backdrop-blur-xl rounded-t-3xl md:rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.15)] border border-white/50 z-50 flex flex-col overflow-hidden max-h-[85vh] md:max-h-none"
            id="assistant-chat-panel"
          >
            {/* Header */}
            <div className="bg-[#00327d]/90 backdrop-blur-md text-white px-5 py-4 flex items-center justify-between shadow-sm relative overflow-hidden">
              {/* background glows */}
              <div className="absolute top-[-50%] left-[-20%] w-[150px] h-[150px] bg-[#0047ab]/40 blur-2xl rounded-full pointer-events-none" />
              <div className="absolute bottom-[-50%] right-[-10%] w-[120px] h-[120px] bg-[#ffe16d]/20 blur-xl rounded-full pointer-events-none" />

              <div className="relative flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-[#fcd400]" />
                </div>
                <div>
                  <h3 className="font-montserrat font-bold text-sm leading-none flex items-center gap-1.5">
                    Asistente DTSE
                  </h3>
                  <span className="text-[10px] text-gray-200/80 font-sans mt-0.5 inline-block">
                    Turismo inteligente • Activo
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                id="close-assistant-btn"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-white/20 backdrop-blur-md flex flex-col gap-3 scrollbar-thin">
              {messages.map((msg) => {
                const isAssistant = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 max-w-[85%] ${isAssistant ? 'self-start' : 'self-end flex-row-reverse'
                      }`}
                  >
                    {/* Avatar circle */}
                    <div
                      className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${isAssistant ? 'bg-[#00327d]/10 text-[#00327d]' : 'bg-[#fcd400]/20 text-[#705d00]'
                        }`}
                    >
                      {isAssistant ? <Compass className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    {/* Bubble box */}
                    <div className="flex flex-col">
                      <div
                        className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isAssistant
                          ? 'bg-white/60 text-gray-800 rounded-tl-none border border-white/40 backdrop-blur-sm'
                          : 'bg-[#00327d]/90 text-white rounded-tr-none backdrop-blur-sm'
                          }`}
                      >
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>
                      <span className="text-[9px] text-gray-400 mt-1 px-1 self-end">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-start gap-2 max-w-[80%] self-start">
                  <div className="w-7 h-7 rounded-full bg-[#00327d]/10 text-[#00327d] shrink-0 flex items-center justify-center">
                    <Compass className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white/60 p-3 rounded-2xl rounded-tl-none border border-white/40 text-sm text-gray-500 shadow-sm flex items-center gap-1.5 backdrop-blur-sm">
                    <span>Escribiendo</span>
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300" />
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Predefined suggestion chips */}
            {messages.length === 1 && (
              <div className="bg-white/15 backdrop-blur-md px-4 pb-2 flex flex-col gap-1.5 border-t border-white/15 pt-2">
                <span className="text-[10px] text-gray-500 font-semibold px-1">Prueba preguntando:</span>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(sug.prompt)}
                      className="text-xs bg-white/40 backdrop-blur-md text-gray-700 hover:text-[#00327d] hover:bg-white/60 border border-white/40 hover:border-[#00327d]/30 px-2.5 py-1 rounded-full transition-all text-left shadow-sm truncate max-w-full"
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
              className="p-3 bg-white/30 backdrop-blur-md border-t border-white/20 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Pregúntame algo..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="flex-1 text-sm bg-white/50 border border-white/40 focus:border-[#00327d] rounded-xl px-3 py-2.5 text-gray-800 placeholder-gray-400 outline-none transition-colors"
                id="assistant-chat-input"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${inputValue.trim() && !isLoading
                  ? 'bg-[#00327d] text-white shadow-md active:scale-95'
                  : 'bg-gray-100 text-gray-300'
                  }`}
                id="assistant-send-btn"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
