import { Request, Response } from "express";

export interface SSEClient {
  id: string;
  res: Response;
}

// Armazena clientes conectados por canal
const clients = new Map<string, SSEClient[]>();

/** Registra um novo cliente SSE no canal especificado */
export function addSSEClient(channel: string, res: Response): SSEClient {
  const client: SSEClient = {
    id: Math.random().toString(36).slice(2),
    res,
  };
  const list = clients.get(channel) ?? [];
  list.push(client);
  clients.set(channel, list);
  return client;
}

/** Remove um cliente SSE do canal (chamado quando a conexão fecha) */
export function removeSSEClient(channel: string, clientId: string): void {
  const list = clients.get(channel);
  if (!list) return;
  const updated = list.filter((c) => c.id !== clientId);
  if (updated.length === 0) {
    clients.delete(channel);
  } else {
    clients.set(channel, updated);
  }
}

/** Emite um evento SSE para todos os clientes conectados no canal */
export function emitSSE(channel: string, event: string, data: unknown): void {
  const list = clients.get(channel);
  if (!list || list.length === 0) return;
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of list) {
    try {
      client.res.write(payload);
    } catch {
      // cliente desconectado
    }
  }
}

/**
 * Handler Express para o endpoint SSE.
 * Configura headers, mantém a conexão viva com heartbeat de 25s
 * e limpa o cliente ao desconectar.
 */
export function sseHandler(channel: string) {
  return (req: Request, res: Response): void => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // desativa buffer nginx/proxy
    res.flushHeaders();

    // Confirma conexão ao cliente
    res.write(`event: connected\ndata: {"status":"ok"}\n\n`);

    const client = addSSEClient(channel, res);

    // Heartbeat a cada 25s para evitar timeout de proxy/load-balancer
    const heartbeat = setInterval(() => {
      try {
        res.write(": heartbeat\n\n");
      } catch {
        clearInterval(heartbeat);
      }
    }, 25_000);

    req.on("close", () => {
      clearInterval(heartbeat);
      removeSSEClient(channel, client.id);
    });
  };
}
