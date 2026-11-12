import { useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { api, ApiOfflineError } from '../api';
import { MetricCard } from '../components/MetricCard';
import { OfflineBanner } from '../components/OfflineBanner';
import { TankLevel } from '../components/TankLevel';
import { LIMITES } from '../config';
import { useApiData } from '../hooks/useApiData';
import { colors } from '../theme';
import { avisar } from '../utils/avisar';

function statusNivel(n: number): 'ok' | 'warn' | 'danger' {
  if (n < LIMITES.nivelMinimo) return 'danger';
  if (n > LIMITES.nivelMaximo) return 'warn';
  return 'ok';
}

export function PainelScreen() {
  const { data: leitura, loading, offline, error, refresh } = useApiData(api.ultimaLeitura);
  const [simulando, setSimulando] = useState(false);

  async function simular() {
    setSimulando(true);
    try {
      await api.simularLeitura();
      await refresh();
    } catch (e) {
      avisar(
        e instanceof ApiOfflineError ? 'API fora do ar' : 'Erro',
        e instanceof ApiOfflineError ? 'Nao foi possivel falar com o servidor.' : (e as Error).message,
      );
    } finally {
      setSimulando(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
    >
      <OfflineBanner visible={offline} />

      {loading && !leitura ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} /> : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {!loading && !leitura && !offline && !error ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Nenhuma leitura ainda</Text>
          <Text style={styles.emptyText}>Toque em "Simular leitura" para gerar os primeiros dados.</Text>
        </View>
      ) : null}

      {leitura ? (
        <>
          <TankLevel percent={leitura.nivelReservatorio} status={statusNivel(leitura.nivelReservatorio)} />
          <MetricCard
            icon="water"
            label="Vazao"
            value={leitura.vazao.toFixed(1)}
            unit="L/min"
            status={leitura.vazao > LIMITES.vazaoMaxima ? 'danger' : 'ok'}
            hint={`Limite: ${LIMITES.vazaoMaxima} L/min`}
          />
          <MetricCard
            icon="flash"
            label="Consumo eletrico (simulado)"
            value={leitura.consumoEletrico.toFixed(2)}
            unit="kW"
            status={leitura.consumoEletrico > LIMITES.consumoMaximo ? 'danger' : 'ok'}
            hint={`Limite: ${LIMITES.consumoMaximo} kW`}
          />
          <Text style={styles.updated}>Ultima leitura: {new Date(leitura.dataHora).toLocaleString('pt-BR')}</Text>
        </>
      ) : null}

      <TouchableOpacity style={[styles.button, simulando && { opacity: 0.6 }]} onPress={simular} disabled={simulando}>
        <Text style={styles.buttonText}>{simulando ? 'Simulando...' : 'Simular leitura'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 32 },
  updated: { textAlign: 'center', color: colors.muted, fontSize: 12, marginBottom: 16 },
  button: { backgroundColor: colors.primary, padding: 16, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  error: { color: colors.danger, textAlign: 'center', marginVertical: 12 },
  empty: { alignItems: 'center', padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  emptyText: { marginTop: 6, color: colors.muted, textAlign: 'center' },
});