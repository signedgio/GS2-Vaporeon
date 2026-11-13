import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { useApiData } from './hooks/useApiData';
import { Atuador, Falha, Leitura } from './types';

export type Conexao = 'conectando' | 'online' | 'offline';

interface Estacao {
  conexao: Conexao;
  atualizadoEm: Date | null; // ultima vez que a API respondeu com dados
  leitura: Leitura | null;
  historico: Leitura[]; // da mais recente para a mais antiga (ate 500)
  atuadores: Atuador[] | null;
  alertasAbertos: Falha[] | null;
  erro: string | null;
  carregando: boolean;
  atualizar: () => Promise<void>;
}

const EstacaoContext = createContext<Estacao | null>(null);

/**
 * Consulta a API a cada poucos segundos e entrega os dados para o app todo.
 * Se a API cair, os ultimos dados continuam disponiveis e conexao vira "offline".
 */
export function EstacaoProvider({ children }: { children: ReactNode }) {
  const l = useApiData(api.ultimaLeitura);
  const h = useApiData(() => api.historico(500));
  const a = useApiData(api.atuadores);
  const f = useApiData(() => api.falhas(true));
  const [atualizadoEm, setAtualizadoEm] = useState<Date | null>(null);

  useEffect(() => {
    if (l.data || h.data || a.data || f.data) setAtualizadoEm(new Date());
  }, [l.data, h.data, a.data, f.data]);

  const atualizar = useCallback(async () => {
    await Promise.all([l.refresh(), h.refresh(), a.refresh(), f.refresh()]);
  }, [l.refresh, h.refresh, a.refresh, f.refresh]);

  const offline = l.offline || h.offline || a.offline || f.offline;
  const carregando = l.loading && h.loading && a.loading && f.loading;
  const conexao: Conexao = offline ? 'offline' : carregando ? 'conectando' : 'online';
  const erro = l.error ?? h.error ?? a.error ?? f.error;

  const value = useMemo<Estacao>(
    () => ({
      conexao,
      atualizadoEm,
      leitura: l.data,
      historico: h.data ?? [],
      atuadores: a.data,
      alertasAbertos: f.data,
      erro,
      carregando,
      atualizar,
    }),
    [conexao, atualizadoEm, l.data, h.data, a.data, f.data, erro, carregando, atualizar],
  );

  return <EstacaoContext.Provider value={value}>{children}</EstacaoContext.Provider>;
}

export function useEstacao(): Estacao {
  const ctx = useContext(EstacaoContext);
  if (!ctx) throw new Error('useEstacao precisa estar dentro de EstacaoProvider');
  return ctx;
}