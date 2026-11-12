import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiHttpError, ApiOfflineError } from '../api';
import { POLL_INTERVAL_MS } from '../config';

interface State<T> {
  data: T | null;
  loading: boolean;
  offline: boolean; // API nao respondeu
  error: string | null; // API respondeu com erro
}

/**
 * Busca dados da API e repete a cada POLL_INTERVAL_MS.
 * Se a API cair, mantem os ultimos dados na tela e marca offline=true (nunca lanca excecao).
 * Quando a API volta, se recupera sozinho na proxima tentativa.
 */
export function useApiData<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, offline: false, error: null });
  const mounted = useRef(true);

  const load = useCallback(async () => {
    try {
      const data = await fetcher();
      if (mounted.current) setState({ data, loading: false, offline: false, error: null });
    } catch (e) {
      if (!mounted.current) return;
      if (e instanceof ApiOfflineError) {
        setState((s) => ({ ...s, loading: false, offline: true }));
      } else if (e instanceof ApiHttpError) {
        // 404 em /ultima = ainda nao ha leituras: nao e erro de verdade
        setState({ data: null, loading: false, offline: false, error: e.status === 404 ? null : e.message });
      } else {
        setState((s) => ({ ...s, loading: false, error: 'Erro inesperado' }));
      }
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mounted.current = true;
    load();
    const timer = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      mounted.current = false;
      clearInterval(timer);
    };
  }, [load]);

  return { ...state, refresh: load };
}