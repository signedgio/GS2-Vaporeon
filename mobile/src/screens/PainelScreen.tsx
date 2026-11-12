import { useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { api, ApiOfflineError } from '../api';
import { Text } from '../components/AppText';
import { Gotinha } from '../components/Gotinha';
import { MetricCard } from '../components/MetricCard';
import { OfflineBanner } from '../components/OfflineBanner';
import { TankLevel } from '../components/TankLevel';
import { LIMITES } from '../config';
import { useApiData } from '../hooks/useApiData';
import { useLayout } from '../hooks/useLayout';
import { useTheme } from '../ThemeContext';
import { Palette, radius } from '../theme';
import { avisar } from '../utils/avisar';

function statusNivel(n: number): 'ok' | 'warn' | 'danger' {
  if (n < LIMITES.nivelMinimo) return 'danger';
  if (n > LIMITES.nivelMaximo) return 'warn';
  return 'ok';
}

export function PainelScreen() {
  const { colors, shadow } = useTheme();
  const { largo } = useLayout();
  const styles = useMemo(() => makeStyles(colors, shadow), [colors, shadow]);
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
        e instanceof ApiOfflineError ? 'Não foi possível falar com o servidor.' : (e as Error).message,
      );
    } finally {
      setSimulando(false);
    }
  }

  const nivelStatus = leitura ? statusNivel(leitura.nivelReservatorio) : 'ok';
  const vazaoStatus = leitura && leitura.vazao > LIMITES.vazaoMaxima ? 'danger' : 'ok';
  const consumoStatus = leitura && leitura.consumoEletrico > LIMITES.consumoMaximo ? 'danger' : 'ok';
  const precisaAtencao = nivelStatus !== 'ok' || vazaoStatus !== 'ok' || consumoStatus !== 'ok';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, largo && styles.contentLargo]}
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
          <View style={largo ? styles.grid : undefined}>
            <View style={largo ? styles.coluna : undefined}>
              <TankLevel percent={leitura.nivelReservatorio} status={nivelStatus} grande={largo} />
            </View>
            <View style={largo ? styles.coluna : undefined}>
              <MetricCard
                icon="water"
                label="Vazão"
                value={leitura.vazao.toFixed(1)}
                unit="L/min"
                status={vazaoStatus}
                hint={`Limite: ${LIMITES.vazaoMaxima} L/min`}
              />
              <MetricCard
                icon="flash"
                label="Consumo elétrico (simulado)"
                value={leitura.consumoEletrico.toFixed(2)}
                unit="kW"
                status={consumoStatus}
                hint={`Limite: ${LIMITES.consumoMaximo} kW`}
              />
            </View>
          </View>
          <Text style={styles.updated}>Última leitura: {new Date(leitura.dataHora).toLocaleString('pt-BR')}</Text>
        </>
      ) : null}

      <TouchableOpacity style={[styles.button, simulando && { opacity: 0.6 }]} onPress={simular} disabled={simulando}>
        <Text style={styles.buttonText}>{simulando ? 'Simulando...' : 'Simular leitura'}</Text>
      </TouchableOpacity>

      <View style={styles.mascote}>
        <Gotinha tamanho={54} atencao={precisaAtencao || offline} />
        <Text style={styles.mascoteTexto}>
          {offline
            ? 'Sem conexão com a estação...'
            : precisaAtencao
              ? 'Atenção: confira os alertas da estação.'
              : 'Tudo sob controle por aqui!'}
        </Text>
      </View>
    </ScrollView>
  );
}

const makeStyles = (c: Palette, shadow: { boxShadow: string }) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.background },
    content: { padding: 16, paddingBottom: 32 },
    contentLargo: { padding: 28, width: '100%', maxWidth: 1400, alignSelf: 'center' },
    grid: { flexDirection: 'row', gap: 18, alignItems: 'stretch' },
    coluna: { flex: 1 },
    updated: { textAlign: 'center', color: c.muted, fontSize: 12, marginBottom: 16 },
    button: { backgroundColor: c.primary, padding: 16, borderRadius: 14, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    error: { color: c.danger, textAlign: 'center', marginVertical: 12 },
    empty: { alignItems: 'center', padding: 24 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: c.text },
    emptyText: { marginTop: 6, color: c.muted, textAlign: 'center' },
    mascote: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      marginTop: 22,
      alignSelf: 'center',
      backgroundColor: c.card,
      borderRadius: radius,
      paddingVertical: 8,
      paddingHorizontal: 20,
      ...shadow,
    },
    mascoteTexto: { color: c.muted, fontSize: 13, fontWeight: '500' },
  });