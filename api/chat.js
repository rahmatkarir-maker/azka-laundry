const MAX_MESSAGE_LENGTH = 2000;
const MAX_SESSION_ID_LENGTH = 120;
const MAX_HISTORY_ITEMS = 10;
const MAX_BODY_BYTES = 32 * 1024;
const WEBHOOK_TIMEOUT_MS = 28000;

function isDisallowedHostname(hostname) {
  const host = String(hostname || '').toLowerCase().replace(/^\[|\]$/g, '');
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
    const a = Number(ipv4Match[1]);
    const b = Number(ipv4Match[2]);
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

function getConfiguredWebhookUrl() {
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

function parseNdjsonStream(rawText) {
  const lines = String(rawText || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return null;
  }

  const chunks = [];
  let parsedAnyJson = false;

  for (const line of lines) {
    try {
      const item = JSON.parse(line);
      parsedAnyJson = true;
      if (item && typeof item === 'object') {
        if (item.type === 'item' && typeof item.content === 'string') {
          chunks.push(item.content);
        } else if (typeof item.output === 'string' && item.output.trim()) {
          chunks.push(item.output);
        } else if (typeof item.text === 'string' && item.text.trim()) {
          chunks.push(item.text);
        }
      }
    } catch {
      // Ignore non-JSON lines
    }
  }

  if (parsedAnyJson && chunks.length > 0) {
    return chunks.join('').trim() || null;
  }
  return null;
}

function extractReplyFromN8nPayload(payload, depth = 0) {
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
      const value = payload[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }

    const nestedKeys = ['json', 'data', 'body', 'payload', 'result'];
    for (const key of nestedKeys) {
      if (payload[key] && typeof payload[key] === 'object') {
        const nested = extractReplyFromN8nPayload(payload[key], depth + 1);
        if (nested) return nested;
      }
    }

    const ignoredKeys = new Set(['status', 'code', 'type', 'id', 'sessionId', 'action']);
    for (const [key, value] of Object.entries(payload)) {
      if (!ignoredKeys.has(key) && typeof value === 'string' && value.trim().length > 1) {
        return value.trim();
      }
    }
  }

  return null;
}

function isDefaultN8nAckMessage(text) {
  const lower = String(text || '').trim().toLowerCase();
  return (
    lower === 'workflow was started' ||
    lower === 'workflow got started' ||
    lower === 'webhook received'
  );
}

function buildFallbackReply(userMessage) {
  const lower = String(userMessage || '').toLowerCase();

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

function buildAuthHeaders() {
  const headers = {
    Accept: 'application/json, text/plain',
  };
  const authToken = (process.env.N8N_WEBHOOK_AUTH_TOKEN || '').trim();
  const authHeaderName = (process.env.N8N_WEBHOOK_AUTH_HEADER || '').trim();
  if (authToken) {
    if (authHeaderName && authHeaderName.toLowerCase() !== 'authorization') {
      headers[authHeaderName] = authToken;
    } else {
      headers['Authorization'] = authToken.toLowerCase().startsWith('bearer ')
        ? authToken
        : `Bearer ${authToken}`;
    }
  }
  return headers;
}

function sendJson(res, statusCode, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    const chained = res.status(statusCode);
    if (chained && typeof chained.json === 'function') {
      chained.json(data);
      return;
    }
  }
  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
}

async function readRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    return req.body.trim() ? JSON.parse(req.body) : {};
  }

  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    const buf = typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk);
    totalBytes += buf.length;
    if (totalBytes > MAX_BODY_BYTES) {
      throw new Error('PAYLOAD_TOO_LARGE');
    }
    chunks.push(buf);
  }

  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    sendJson(res, 200, {
      ok: true,
      webhookConfigured: getConfiguredWebhookUrl() !== null,
    });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    sendJson(res, 405, {
      reply: 'Metode tidak diizinkan.',
      source: 'fallback',
      reason: 'method_not_allowed',
    });
    return;
  }

  let parsedBody;
  try {
    parsedBody = await readRequestBody(req);
  } catch (err) {
    const isTooLarge = err instanceof Error && err.message === 'PAYLOAD_TOO_LARGE';
    sendJson(res, isTooLarge ? 413 : 400, {
      reply: isTooLarge
        ? 'Pesan terlalu besar. Mohon persingkat pertanyaan Anda.'
        : 'Format permintaan tidak valid.',
      source: 'fallback',
      reason: isTooLarge ? 'payload_too_large' : 'invalid_json',
    });
    return;
  }

  const rawMessage = typeof parsedBody.message === 'string' ? parsedBody.message.trim() : '';
  if (!rawMessage) {
    sendJson(res, 400, {
      reply: 'Mohon tulis pesan terlebih dahulu.',
      source: 'fallback',
      reason: 'empty_message',
    });
    return;
  }

  if (rawMessage.length > MAX_MESSAGE_LENGTH) {
    sendJson(res, 400, {
      reply: 'Pesan terlalu panjang. Mohon persingkat pertanyaan Anda.',
      source: 'fallback',
      reason: 'message_too_long',
    });
    return;
  }

  const rawSessionId =
    typeof parsedBody.sessionId === 'string' ? parsedBody.sessionId.trim() : '';
  const sessionId =
    rawSessionId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, MAX_SESSION_ID_LENGTH) ||
    `azka-${Date.now()}`;

  const history = Array.isArray(parsedBody.history)
    ? parsedBody.history
        .filter(
          (item) =>
            Boolean(item) &&
            typeof item === 'object' &&
            (item.role === 'user' || item.role === 'assistant') &&
            typeof item.content === 'string'
        )
        .slice(-MAX_HISTORY_ITEMS)
        .map((item) => ({
          role: item.role,
          content: item.content.slice(0, 1000),
        }))
    : [];

  const validatedUrl = getConfiguredWebhookUrl();
  if (!validatedUrl) {
    sendJson(res, 200, {
      reply: buildFallbackReply(rawMessage),
      source: 'fallback',
      reason: 'webhook_not_configured',
    });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const baseHeaders = buildAuthHeaders();
    const payloadObj = {
      action: 'sendMessage',
      chatInput: rawMessage,
      message: rawMessage,
      sessionId,
      history,
      source: 'azka-laundry-website',
      brand: 'AZKA LAUNDRY',
      location: 'Ulee Kareng, Banda Aceh',
      timestamp: new Date().toISOString(),
    };

    let response = await fetch(validatedUrl.toString(), {
      method: 'POST',
      headers: {
        ...baseHeaders,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(payloadObj),
    });

    // If user left n8n Webhook node on default HTTP method GET, automatically retry once via GET
    if (response.status === 404 || response.status === 405) {
      const firstErrText = await response.text();
      if (
        response.status === 405 ||
        firstErrText.toLowerCase().includes('not registered') ||
        firstErrText.toLowerCase().includes('get')
      ) {
        const getUrl = new URL(validatedUrl.toString());
        getUrl.searchParams.set('message', rawMessage);
        getUrl.searchParams.set('chatInput', rawMessage);
        getUrl.searchParams.set('sessionId', sessionId);
        response = await fetch(getUrl.toString(), {
          method: 'GET',
          headers: baseHeaders,
          signal: controller.signal,
        });
      }
    }

    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();

    if (!response.ok) {
      console.error('[api/chat] Upstream n8n webhook HTTP', response.status);
      sendJson(res, 200, {
        reply: buildFallbackReply(rawMessage),
        source: 'fallback',
        reason: `upstream_http_${response.status}`,
      });
      return;
    }

    const streamedReply = parseNdjsonStream(rawText);
    if (streamedReply) {
      sendJson(res, 200, {
        reply: streamedReply,
        source: 'n8n',
        reason: 'connected',
      });
      return;
    }

    let parsedPayload = rawText;
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
    if (!extractedReply || isDefaultN8nAckMessage(extractedReply)) {
      if (extractedReply && isDefaultN8nAckMessage(extractedReply)) {
        console.error(
          '[api/chat] n8n webhook returned immediate ack ("Workflow was started"). Set Webhook Respond mode to "Using Respond to Webhook Node".'
        );
      }
      sendJson(res, 200, {
        reply: buildFallbackReply(rawMessage),
        source: 'fallback',
        reason: extractedReply ? 'workflow_started_only' : 'empty_n8n_reply',
      });
      return;
    }

    sendJson(res, 200, {
      reply: extractedReply,
      source: 'n8n',
      reason: 'connected',
    });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'AbortError';
    console.error('[api/chat] Webhook request failed:', err instanceof Error ? err.name : 'Error');
    sendJson(res, 200, {
      reply: buildFallbackReply(rawMessage),
      source: 'fallback',
      reason: isTimeout ? 'timeout' : 'network_error',
    });
  } finally {
    clearTimeout(timeout);
  }
}
