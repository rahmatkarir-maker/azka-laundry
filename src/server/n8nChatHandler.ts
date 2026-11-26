export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestPayload {
  message?: unknown;
  sessionId?: unknown;
  history?: unknown;
}

export interface ChatHandlerResult {
  status: number;
  body: {
    reply: string;
    source: 'n8n' | 'fallback';
    error?: string;
  };
}

const MAX_MESSAGE_LENGTH = 2000;
const MAX_SESSION_ID_LENGTH = 120;
const MAX_HISTORY_ITEMS = 10;
const WEBHOOK_TIMEOUT_MS = 28000;

function isDisallowedHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (
    host === 'localhost' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return true;
  }

  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [a, b] = [Number(ipv4Match[1]), Number(ipv4Match[2])];
    if (
      a === 127 ||
      a === 10 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    ) {
      return true;
    }
  }

  if (host.startsWith('fe80:') || host.startsWith('fc') || host.startsWith('fd')) {
    return true;
  }

  return false;
}

function getConfiguredWebhookUrl(): URL | null {
  const rawUrl =
    process.env.N8N_WEBHOOK_URL ||
    process.env.N8N_CHAT_WEBHOOK_URL ||
    '';
  if (!rawUrl.trim()) {
    return null;
  }
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    if (isDisallowedHostname(parsed.hostname)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function isN8nWebhookConfigured(): boolean {
  return getConfiguredWebhookUrl() !== null;
}

function parseNdjsonStream(rawText: string): string | null {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return null;
  }

  const chunks: string[] = [];
  let parsedAnyJson = false;

  for (const line of lines) {
    try {
      const item = JSON.parse(line) as Record<string, unknown>;
      parsedAnyJson = true;
      if (item.type === 'item' && typeof item.content === 'string') {
        chunks.push(item.content);
      } else if (typeof item.output === 'string' && item.output.trim()) {
        chunks.push(item.output);
      } else if (typeof item.text === 'string' && item.text.trim()) {
        chunks.push(item.text);
      }
    } catch {
      // Ignore non-JSON lines in stream
    }
  }

  if (parsedAnyJson && chunks.length > 0) {
    return chunks.join('').trim() || null;
  }
  return null;
}

function extractReplyFromN8nPayload(payload: unknown, depth = 0): string | null {
  if (depth > 5 || payload == null) {
    return null;
  }

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return trimmed || null;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const extracted = extractReplyFromN8nPayload(item, depth + 1);
      if (extracted) return extracted;
    }
    return null;
  }

  if (typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidateKeys = [
      'output',
      'reply',
      'text',
      'message',
      'response',
      'answer',
      'jawaban',
      'content',
      'result',
    ];
    for (const key of candidateKeys) {
      const value = record[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }

    const nestedKeys = ['json', 'data', 'body', 'payload', 'result'];
    for (const key of nestedKeys) {
      if (record[key] && typeof record[key] === 'object') {
        const nested = extractReplyFromN8nPayload(record[key], depth + 1);
        if (nested) return nested;
      }
    }

    // Last resort: first meaningful non-metadata string value in object
    const ignoredKeys = new Set(['status', 'code', 'type', 'id', 'sessionId', 'action']);
    for (const [key, value] of Object.entries(record)) {
      if (!ignoredKeys.has(key) && typeof value === 'string' && value.trim().length > 1) {
        return value.trim();
      }
    }
  }

  return null;
}

export function buildFallbackReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (
    lower.includes('harga') ||
    lower.includes('tarif') ||
    lower.includes('biaya') ||
    lower.includes('berapa')
  ) {
    return [
      'Berikut estimasi tarif awal Azka Laundry Ulee Kareng:',
      '• Cuci + Setrika Reguler: Rp7.000/kg (2–3 hari)',
      '• Cuci Kering Lipat: Rp5.000/kg (1–2 hari)',
      '• Setrika Saja: Rp5.000/kg (1–2 hari)',
      '• Layanan Express: Rp12.000/kg (6–24 jam, kuota terbatas)',
      '• Bed Cover / Selimut: mulai Rp25.000/pcs',
      '',
      'Untuk konfirmasi cepat atau pemesanan, silakan hubungi WhatsApp kami di 0853-5247-9910.',
    ].join('\n');
  }

  if (
    lower.includes('jemput') ||
    lower.includes('antar') ||
    lower.includes('ceurih') ||
    lower.includes('pango') ||
    lower.includes('ilie') ||
    lower.includes('lambhuk') ||
    lower.includes('lokasi') ||
    lower.includes('alamat')
  ) {
    return 'Kami melayani antar-jemput di kawasan Ulee Kareng, Banda Aceh (Simpang Tujuh, Ceurih, Ilie, Pango, Lambhuk, dan sekitarnya) sesuai jadwal harian dan minimum transaksi. Anda bisa mengisi Formulir Pemesanan di halaman ini atau langsung chat WhatsApp ke 0853-5247-9910.';
  }

  if (lower.includes('express') || lower.includes('kilat') || lower.includes('cepat')) {
    return 'Layanan Express tersedia dengan estimasi pengerjaan 6–24 jam (tarif estimasi Rp12.000/kg) sesuai ketersediaan kuota harian. Silakan konfirmasi kuota hari ini via WhatsApp di 0853-5247-9910.';
  }

  if (lower.includes('jam') || lower.includes('buka') || lower.includes('operasional')) {
    return 'Estimasi jam operasional Azka Laundry adalah Setiap Hari pukul 08.00 – 21.00 WIB. Silakan hubungi WhatsApp 0853-5247-9910 untuk penjadwalan jemput cucian.';
  }

  return 'Terima kasih telah menghubungi Azka Laundry Ulee Kareng! Anda dapat menanyakan tarif layanan, jadwal antar-jemput, layanan express, atau langsung memesan lewat WhatsApp resmi kami di 0853-5247-9910.';
}

export async function handleN8nChatRequest(
  rawBody: ChatRequestPayload
): Promise<ChatHandlerResult> {
  const rawMessage = typeof rawBody?.message === 'string' ? rawBody.message.trim() : '';
  if (!rawMessage) {
    return {
      status: 400,
      body: {
        reply: 'Mohon tulis pesan terlebih dahulu.',
        source: 'fallback',
        error: 'Pesan tidak boleh kosong.',
      },
    };
  }

  if (rawMessage.length > MAX_MESSAGE_LENGTH) {
    return {
      status: 400,
      body: {
        reply: 'Pesan terlalu panjang. Mohon persingkat pertanyaan Anda.',
        source: 'fallback',
        error: 'Pesan melebihi batas maksimum karakter.',
      },
    };
  }

  const rawSessionId =
    typeof rawBody?.sessionId === 'string' ? rawBody.sessionId.trim() : '';
  const sessionId =
    rawSessionId
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, MAX_SESSION_ID_LENGTH) || `azka-${Date.now()}`;

  const history: ChatHistoryItem[] = Array.isArray(rawBody?.history)
    ? rawBody.history
        .filter(
          (item): item is ChatHistoryItem =>
            Boolean(item) &&
            typeof item === 'object' &&
            ((item as ChatHistoryItem).role === 'user' ||
              (item as ChatHistoryItem).role === 'assistant') &&
            typeof (item as ChatHistoryItem).content === 'string'
        )
        .slice(-MAX_HISTORY_ITEMS)
        .map((item) => ({
          role: item.role,
          content: item.content.slice(0, 1000),
        }))
    : [];

  const validatedUrl = getConfiguredWebhookUrl();

  if (!validatedUrl) {
    return {
      status: 200,
      body: {
        reply: buildFallbackReply(rawMessage),
        source: 'fallback',
      },
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain',
    };

    const authToken = process.env.N8N_WEBHOOK_AUTH_TOKEN?.trim();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(validatedUrl.toString(), {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        action: 'sendMessage',
        chatInput: rawMessage,
        message: rawMessage,
        sessionId,
        history,
        source: 'azka-laundry-website',
        brand: 'AZKA LAUNDRY',
        location: 'Ulee Kareng, Banda Aceh',
        timestamp: new Date().toISOString(),
      }),
    });

    const contentType = response.headers.get('content-type') ?? '';
    const rawText = await response.text();

    if (!response.ok) {
      console.error('[n8n-chat] Upstream webhook returned HTTP', response.status);
      return {
        status: 200,
        body: {
          reply: buildFallbackReply(rawMessage),
          source: 'fallback',
        },
      };
    }

    // Handle streaming NDJSON responses from n8n Chat Trigger
    const streamedReply = parseNdjsonStream(rawText);
    if (streamedReply) {
      return {
        status: 200,
        body: {
          reply: streamedReply,
          source: 'n8n',
        },
      };
    }

    let parsedPayload: unknown = rawText;
    if (
      contentType.includes('application/json') ||
      rawText.trim().startsWith('{') ||
      rawText.trim().startsWith('[')
    ) {
      try {
        parsedPayload = JSON.parse(rawText);
      } catch {
        parsedPayload = rawText;
      }
    }

    const extractedReply = extractReplyFromN8nPayload(parsedPayload);
    if (!extractedReply) {
      return {
        status: 200,
        body: {
          reply: buildFallbackReply(rawMessage),
          source: 'fallback',
        },
      };
    }

    return {
      status: 200,
      body: {
        reply: extractedReply,
        source: 'n8n',
      },
    };
  } catch (err) {
    console.error(
      '[n8n-chat] Webhook request failed:',
      err instanceof Error ? err.name : 'UnknownError'
    );
    return {
      status: 200,
      body: {
        reply: buildFallbackReply(rawMessage),
        source: 'fallback',
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}
