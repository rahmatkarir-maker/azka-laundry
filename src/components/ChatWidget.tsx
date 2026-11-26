import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  Bot,
  Loader2,
  MessageCircle,
  MessageSquareText,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import { WHATSAPP_DIRECT_URL, WHATSAPP_DISPLAY } from '../data/laundryData';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const QUICK_PROMPTS = [
  'Berapa tarif cuci setrika per kg?',
  'Bisa antar-jemput ke Ceurih?',
  'Ada layanan express hari ini?',
  'Jam operasional buka jam berapa?',
];

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `azka-${crypto.randomUUID()}`;
  }
  return `azka-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatTimeNow(): string {
  return new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    content:
      'Halo! Selamat datang di Azka Laundry Ulee Kareng. Ada yang bisa kami bantu terkait layanan, estimasi tarif, atau jadwal antar-jemput?',
    time: formatTimeNow(),
  };
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    createWelcomeMessage(),
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const sessionIdRef = useRef<string>(createSessionId());
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isSending]);

  const sendMessage = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      time: formatTimeNow(),
    };

    const nextHistory = [...messages, userMsg]
      .filter((m) => m.id !== 'welcome')
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          sessionId: sessionIdRef.current,
          history: nextHistory,
        }),
      });

      let replyText =
        'Maaf, kami belum dapat memproses pesan Anda saat ini. Silakan hubungi WhatsApp resmi kami di 0853-5247-9910.';

      if (response.ok) {
        const data = (await response.json()) as { reply?: unknown };
        if (typeof data.reply === 'string' && data.reply.trim()) {
          replyText = data.reply.trim();
        }
      } else {
        try {
          const errData = (await response.json()) as { reply?: unknown };
          if (typeof errData.reply === 'string' && errData.reply.trim()) {
            replyText = errData.reply.trim();
          }
        } catch {
          // Keep default helpful Indonesian message
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: replyText,
          time: formatTimeNow(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-err-${Date.now()}`,
          role: 'assistant',
          content:
            'Koneksi terganggu. Anda dapat mencoba mengirim ulang atau langsung chat WhatsApp kami di 0853-5247-9910.',
          time: formatTimeNow(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleReset = () => {
    sessionIdRef.current = createSessionId();
    setMessages([createWelcomeMessage()]);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
      {/* Expandable Chat Panel */}
      {isOpen ? (
        <section
          aria-label="Asisten Chat Azka Laundry"
          className="flex h-[min(540px,calc(100vh-5.5rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-[390px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 bg-[#0F172A] px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0EA5E9] text-white"
                aria-hidden="true"
              >
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate font-display text-sm font-bold tracking-wide text-white">
                  Asisten Azka Laundry
                </h2>
                <p className="truncate text-xs text-slate-300">
                  Tanya tarif, layanan &amp; antar-jemput
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Mulai percakapan baru"
                aria-label="Mulai percakapan baru"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7DD3FC]"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup jendela chat"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7DD3FC]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 space-y-3.5 overflow-y-auto bg-[#F8FAFC] p-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? 'rounded-br-md bg-[#0EA5E9] text-white'
                        : 'rounded-bl-md border border-slate-200/90 bg-white text-[#0F172A]'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="mt-1 px-1 font-mono text-[11px] tabular-nums text-slate-400">
                    {msg.time}
                  </span>
                </div>
              );
            })}

            {/* Quick Starter Prompts (shown on fresh chat) */}
            {messages.length === 1 && !isSending && (
              <div className="pt-1">
                <p className="mb-2 text-xs font-medium text-slate-500">
                  Pertanyaan cepat:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-[#0F172A] transition-colors hover:border-[#0EA5E9] hover:bg-[#F0F9FF] hover:text-[#0369A1] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0EA5E9]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isSending && (
              <div className="flex items-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-600">
                  <Loader2
                    className="h-3.5 w-3.5 animate-spin text-[#0EA5E9]"
                    aria-hidden="true"
                  />
                  <span>Sedang membalas...</span>
                </div>
              </div>
            )}

            <div ref={scrollAnchorRef} />
          </div>

          {/* Quiet Direct WhatsApp Escalation Bar */}
          <div className="flex items-center justify-between border-t border-slate-200/80 bg-[#F0FDFA] px-4 py-2 text-xs text-teal-900">
            <span>Butuh respon langsung admin?</span>
            <a
              href={WHATSAPP_DIRECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-teal-700 underline-offset-2 hover:underline"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {WHATSAPP_DISPLAY}
            </a>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              disabled={isSending}
              placeholder="Tulis pertanyaan Anda..."
              aria-label="Tulis pesan untuk asisten Azka Laundry"
              className="min-h-[44px] flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Kirim pesan"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0EA5E9] text-white transition-colors hover:bg-[#0284C7] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9]"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      ) : (
        /* Unified Floating Action Dock: WhatsApp + Chatbot Launcher */
        <div className="flex items-center gap-2.5">
          <a
            href={WHATSAPP_DIRECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hubungi Azka Laundry via WhatsApp"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-teal-600 px-3.5 text-sm font-semibold text-white shadow-lg transition-transform duration-150 hover:scale-[1.03] hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400 sm:px-4"
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="hidden whitespace-nowrap sm:inline">WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Buka chatbot Asisten Azka Laundry"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0EA5E9] px-4 text-sm font-semibold text-white shadow-lg transition-transform duration-150 hover:scale-[1.03] hover:bg-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9]"
          >
            <MessageSquareText className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">Tanya Asisten</span>
          </button>
        </div>
      )}
    </div>
  );
}
