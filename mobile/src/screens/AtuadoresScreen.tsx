import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api, ApiOfflineError } from '../api';
import { OfflineBanner } from '../components/OfflineBanner';
import { useApiData } from '../hooks/useApiData';
import { colors, radius } from '../theme';
import { avisar } from '../utils/avisar';

const ICONES: Record<string, keyof typeof Ionicons.glyphMap> = {
  BOMBA: 'sync-circle',
  VALVULA: 'funnel',
  ENERGIA: 'sunny',
};

export function AtuadoresScreen() {
  const { data: atuadores, loading, offline, error, refresh } = useApiData(api.atuadores);
  const [pendente, setPendente] = useState<number | null>(null);

  async function alternar(id: number, ligar: boolean) {
    setPendente(id);
    try {
      await api.acionarAtuador(id, ligar);
      await refresh();
    } catch (e) {
      avisar(
        e instanceof ApiOfflineError ? 'API fora do ar' : 'Erro',
        e instanceof ApiOfflineError ? 'Nao foi possivel acionar o atuador agora.' : (e as Error).message,
      );
    } finally {
      setPendente(null);
    }
  }

  return (
    <View style={styles.screen}>
      <OfflineBanner visible={offline} />
      {loading && !atuadores ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={atuadores ?? []}
        keyExtractor={(a) => String(a.id)}
        onRefresh={refresh}
        refreshing={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons name={ICONES[item.tipo] ?? 'construct'} size={28} color={item.ligado ? colors.ok : colors.muted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={[styles.estado, { color: item.ligado ? colors.ok : colors.muted }]}>
                {item.ligado ? 'LIGADO' : 'DESLIGADO'}
              </Text>
            </View>
            <Switch
              value={item.ligado}
              disabled={pendente === item.id || offline}
              onValueChange={(v) => alternar(item.id, v)}
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: radius,
    padding: 16,
    marginBottom: 12,
  },
  nome: { fontSize: 16, fontWeight: '700', color: colors.text },
  estado: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  error: { color: colors.danger, textAlign: 'center', marginVertical: 12 },
});