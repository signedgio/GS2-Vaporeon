import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api, ApiOfflineError } from '../api';
import { OfflineBanner } from '../components/OfflineBanner';
import { useApiData } from '../hooks/useApiData';
import { colors, radius } from '../theme';
import { Severidade } from '../types';
import { avisar } from '../utils/avisar';

const COR_SEVERIDADE: Record<Severidade, string> = {
  BAIXA: colors.ok,
  MEDIA: colors.warn,
  ALTA: colors.danger,
  CRITICA: colors.critical,
};

export function AlertasScreen() {
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
        e instanceof ApiOfflineError ? 'Nao foi possivel resolver o alerta agora.' : (e as Error).message,
      );
    }
  }

  return (
    <View style={styles.screen}>
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

      <FlatList
        data={falhas ?? []}
        keyExtractor={(f) => String(f.id)}
        onRefresh={refresh}
        refreshing={false}
        ListEmptyComponent={
          !loading && !offline ? <Text style={styles.empty}>Nenhum alerta {apenasAbertas ? 'aberto' : 'registrado'} 🎉</Text> : undefined
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: COR_SEVERIDADE[item.severidade] }, item.resolvida && { opacity: 0.55 }]}>
            <View style={styles.topRow}>
              <Text style={[styles.sev, { color: COR_SEVERIDADE[item.severidade] }]}>{item.severidade}</Text>
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
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.muted, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  card: { backgroundColor: colors.card, borderRadius: radius, borderLeftWidth: 6, padding: 14, marginBottom: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sev: { fontWeight: '800', fontSize: 12 },
  origem: { color: colors.muted, fontSize: 12 },
  descricao: { fontSize: 15, color: colors.text, marginVertical: 8 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  data: { color: colors.muted, fontSize: 12 },
  resolver: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  resolvida: { color: colors.ok, fontWeight: '700', fontSize: 13 },
  error: { color: colors.danger, textAlign: 'center', marginVertical: 12 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
});