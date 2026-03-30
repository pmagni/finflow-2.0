import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import type { ChatMessage } from '../hooks/useChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const suggestions = [
  '¿Cuál estrategia me conviene más para pagar deudas?',
  '¿Cómo puedo crear un fondo de emergencia?',
  'Dame un plan para ahorrar el 20% de mis ingresos',
  '¿Qué es la regla 50/30/20?',
];

export default function Chat() {
  const { messages, loading, error, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !loading) {
      sendMessage(trimmed);
      setInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 mb-5">
              <Sparkles className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-surface-900">Asistente Financiero IA</h2>
            <p className="mt-2 text-sm text-surface-500 text-center max-w-md">
              Pregúntame cualquier cosa sobre finanzas personales, estrategias de pago de deudas, presupuestos o ahorro.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left p-3 rounded-lg border border-surface-200 text-sm text-surface-700 hover:bg-surface-50 hover:border-surface-300 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
            {messages.map((message, index) => (
              <MessageBubble key={index} message={message} userEmail={user?.email} />
            ))}
            {loading && messages[messages.length - 1]?.content === '' && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 shrink-0">
                  <Bot className="w-4 h-4 text-primary-700" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-surface-100">
                  <Loader2 className="w-4 h-4 text-surface-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-surface-200 bg-white p-4">
        {error && (
          <p className="text-xs text-danger-600 text-center mb-2">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-3xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              placeholder="Pregunta sobre tus finanzas..."
              disabled={loading}
              rows={1}
              className="w-full min-h-[44px] max-h-32 px-4 py-3 rounded-xl border border-surface-300 bg-white text-surface-900 text-sm placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
            aria-label="Enviar mensaje"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message, userEmail }: { message: ChatMessage; userEmail?: string }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {isUser ? (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-200 shrink-0">
          <span className="text-xs font-bold text-surface-600">
            {userEmail?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 shrink-0">
          <Bot className="w-4 h-4 text-primary-700" />
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'rounded-2xl rounded-tr-none bg-primary-600 text-white'
            : 'rounded-2xl rounded-tl-none bg-surface-100 text-surface-800'
        }`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            code: ({ children }) => (
              <code className="px-1.5 py-0.5 rounded bg-black/10 text-xs font-mono">{children}</code>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
