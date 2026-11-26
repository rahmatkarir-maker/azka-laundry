import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  handleN8nChatRequest,
  isN8nWebhookConfigured,
} from './src/server/n8nChatHandler.ts';

const PORT = 3000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 25;

const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  const entry = requestBuckets.get(clientKey);
  if (!entry || now > entry.resetAt) {
    requestBuckets.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }
  entry.count += 1;
  return false;
}

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/chat', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
      ok: true,
      webhookConfigured: isN8nWebhookConfigured(),
    });
  });

  app.post('/api/chat', async (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        reply:
          'Terlalu banyak pesan dalam waktu singkat. Mohon tunggu sebentar sebelum mengirim pesan kembali.',
        source: 'fallback',
        error: 'Rate limit exceeded',
      });
      return;
    }

    const result = await handleN8nChatRequest(req.body ?? {});
    res.status(result.status).json(result.body);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Azka Laundry server running on http://localhost:${PORT}`);
  });
}

startServer();
