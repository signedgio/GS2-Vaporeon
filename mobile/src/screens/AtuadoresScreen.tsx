import { useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api, ApiOfflineError } from '../api';
import { Text } from '../components/AppText';
import { OfflineBanner } from '../components/OfflineBanner';
import { useApiData } from '../hooks/useApiData';
import { useLayout } from '../hooks/useLayout';
import { useTheme } from '../ThemeContext';
import { Palette, radius } from '../theme';
import { avisar } from '../utils/avisar';

const ICONES: Record<string, keyof typeof Ionicons.glyphMap> = {
  BOMBA: 'sync-circle',
  VALVULA: 'funnel',
  ENERGIA: 'sunny',
};

export function AtuadoresScreen() {
  const { colors, shadow } = useTheme();
  const { largo } = useLayout();
  const styles = useMemo(() => makeStyles(colors, shadow), [colors, shadow]);
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
        e instanceof ApiOfflineError ? 'Não foi possível acionar o atuador agora.' : (e as Error).message,
      );
    } finally {
      setPendente(null);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, largo && styles.contentLargo]}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
    >
      <OfflineBanner visible={offline} />
      {loading && !atuadores ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.lista}>
        {(atuadores ?? []).map((item) => (
          <View key={item.id} style={[styles.card, { width: largo ? '49%' : '100%' }]}>
            <Ionicons name={ICONES[item.tipo] ?? 'construct'} size={30} color={item.ligado ? colors.ok : colors.muted} />
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
    lista: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: c.card,
      borderRadius: radius,
      padding: 18,
      marginBottom: 14,
      ...shadow,
    },
    nome: { fontSize: 16, fontWeight: '700', color: c.text },
    estado: { fontSize: 12, fontWeight: '700', marginTop: 2 },
    error: { color: c.danger, textAlign: 'center', marginVertical: 12 },
  });