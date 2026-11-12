import { API_URL, REQUEST_TIMEOUT_MS } from './config';
import { Atuador, Falha, Leitura } from './types';

/** Erro quando nao foi possivel falar com a API (desligada, sem rede, timeout). */
export class ApiOfflineError extends Error {
  constructor() {
    super('API fora do ar');
    this.name = 'ApiOfflineError';
  }
}

/** Erro quando a API respondeu, mas com status de erro (404, 400, 500...). */
export class ApiHttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiHttpError';
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
      signal: controller.signal,
    });
  } catch {
    // fetch so rejeita em falha de rede/timeout: e exatamente o caso "API fora do ar"
    throw new ApiOfflineError();
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let mensagem = `Erro ${response.status}`;
    try {
      const corpo = await response.json();
      if (corpo?.erro) mensagem = corpo.erro;
    } catch {
      /* corpo sem JSON */
    }
    throw new ApiHttpError(response.status, mensagem);
  }

  return (await response.json()) as T;
}

export const api = {
  ultimaLeitura: () => request<Leitura>('/api/leituras/ultima'),
  historico: (limite = 20) => request<Leitura[]>(`/api/leituras?limite=${limite}`),
  simularLeitura: () => request<Leitura>('/api/leituras/simular', { method: 'POST' }),

  atuadores: () => request<Atuador[]>('/api/atuadores'),
  acionarAtuador: (id: number, ligar: boolean) =>
    request<Atuador>(`/api/atuadores/${id}/acionar`, {
      method: 'POST',
      body: JSON.stringify({ ligar }),
    }),

  falhas: (apenasAbertas: boolean) =>
    request<Falha[]>(apenasAbertas ? '/api/falhas?resolvida=false' : '/api/falhas'),
  resolverFalha: (id: number) => request<Falha>(`/api/falhas/${id}/resolver`, { method: 'PATCH' }),
};