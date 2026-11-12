import { useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { api, ApiOfflineError } from '../api';
import { Text } from '../components/AppText';
import { OfflineBanner } from '../components/OfflineBanner';
import { useApiData } from '../hooks/useApiData';
import { useLayout } from '../hooks/useLayout';
import { useTheme } from '../ThemeContext';
import { Palette, radius } from '../theme';
import { Severidade } from '../types';
import { avisar } from '../utils/avisar';

const ROTULO: Record<Severidade, string> = {
  BAIXA: 'BAIXA',
  MEDIA: 'MÉDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRÍTICA',
};

export function AlertasScreen() {
  const { colors, shadow } = useTheme();
  const { largo } = useLayout();
  const styles = useMemo(() => makeStyles(colors, shadow), [colors, shadow]);
  const corSeveridade: Record<Severidade, string> = {
    BAIXA: colors.ok,
    MEDIA: colors.warn,
    ALTA: colors.danger,
    CRITICA: colors.critical,
  };

  const [apenasAbertas, setApenasAbertas] = useState(true);
  const { data: falhas, loading, offline, error, refresh } = useApiData(
    () => api.falhas(apenasAbertas),
    [apenasAbertas],
  );

  async function resolver(id: number) {
    try {
      await api.resolverFalha(id);
      await refresh();
    } catch (e) {
      avisar(
        e instanceof ApiOfflineError ? 'API fora do ar' : 'Erro',
        e instanceof ApiOfflineError ? 'Não foi possível resolver o alerta agora.' : (e as Error).message,
      );
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, largo && styles.contentLargo]}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
    >
      <OfflineBanner visible={offline} />

      <View style={styles.filters}>
        {[true, false].map((aberto) => (
          <TouchableOpacity
            key={String(aberto)}
            style={[styles.chip, apenasAbertas === aberto && styles.chipActive]}
            onPress={() => setApenasAbertas(aberto)}
          >
            <Text style={[styles.chipText, apenasAbertas === aberto && styles.chipTextActive]}>
              {aberto ? 'Abertas' : 'Todas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && !falhas ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {falhas && falhas.length === 0 && !offline ? (
        <Text style={styles.empty}>Nenhum alerta {apenasAbertas ? 'aberto' : 'registrado'} 🎉</Text>
      ) : null}

      <View style={styles.lista}>
        {(falhas ?? []).map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              { borderLeftColor: corSeveridade[item.severidade], width: largo ? '49%' : '100%' },
              item.resolvida && { opacity: 0.55 },
            ]}
          >
            <View style={styles.topRow}>
              <Text style={[styles.sev, { color: corSeveridade[item.severidade] }]}>{ROTULO[item.severidade]}</Text>
              <Text style={styles.origem}>{item.origem}</Text>
            </View>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <View style={styles.bottomRow}>
              <Text style={styles.data}>{new Date(item.dataHora).toLocaleString('pt-BR')}</Text>
              {item.resolvida ? (
                <Text style={styles.resolvida}>Resolvida</Text>
              ) : (
                <TouchableOpacity onPress={() => resolver(item.id)} disabled={offline}>
                  <Text style={[styles.resolver, offline && { opacity: 0.4 }]}>Marcar como resolvida</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const makeStyles = (c: Palette, shadow: { boxShadow: string }) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.background },
    content: { padding: 16, paddingBottom: 32 },
    contentLargo: { padding: 28, width: '100%', maxWidth: 1400, alignSelf: 'center' },
    filters: { flexDirection: 'row', gap: 8, marginBottom: 14 },
    chip: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 20, backgroundColor: c.card, borderWidth: 1, borderColor: c.border },
    chipActive: { backgroundColor: c.primary, borderColor: c.primary },
    chipText: { color: c.muted, fontWeight: '600' },
    chipTextActive: { color: '#fff' },
    lista: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: { backgroundColor: c.card, borderRadius: radius, borderLeftWidth: 6, padding: 16, marginBottom: 14, ...shadow },
    topRow: { flexDirection: 'row', justifyContent: 'space-between' },
    sev: { fontWeight: '800', fontSize: 12 },
    origem: { color: c.muted, fontSize: 12 },
    descricao: { fontSize: 15, color: c.text, marginVertical: 8 },
    bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    data: { color: c.muted, fontSize: 12 },
    resolver: { color: c.primary, fontWeight: '700', fontSize: 13 },
    resolvida: { color: c.ok, fontWeight: '700', fontSize: 13 },
    error: { color: c.danger, textAlign: 'center', marginVertical: 12 },
    empty: { textAlign: 'center', color: c.muted, marginTop: 40, fontSize: 15 },
  });