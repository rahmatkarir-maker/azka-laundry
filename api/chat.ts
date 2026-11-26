import { handleN8nChatRequest, type ChatRequestPayload } from '../src/server/n8nChatHandler.ts';

interface ServerlessReq {
  method?: string;
  body?: ChatRequestPayload | string;
}

interface ServerlessRes {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (data: unknown) => void;
    end: () => void;
  };
}

export default async function handler(req: ServerlessReq, res: ServerlessRes) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({
      reply: 'Metode tidak diizinkan.',
      source: 'fallback',
      error: 'Method Not Allowed',
    });
    return;
  }

  let parsedBody: ChatRequestPayload = {};
  if (typeof req.body === 'string') {
    try {
      parsedBody = JSON.parse(req.body) as ChatRequestPayload;
    } catch {
      res.status(400).json({
        reply: 'Format permintaan tidak valid.',
        source: 'fallback',
        error: 'Invalid JSON body',
      });
      return;
    }
  } else if (req.body && typeof req.body === 'object') {
    parsedBody = req.body;
  }

  const result = await handleN8nChatRequest(parsedBody);
  res.status(result.status).json(result.body);
}
