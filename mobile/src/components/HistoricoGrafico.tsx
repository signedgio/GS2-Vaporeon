import { useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { api } from '../api';
import { LIMITES } from '../config';
import { useApiData } from '../hooks/useApiData';
import { useTheme } from '../ThemeContext';
import { Palette } from '../theme';
import { Leitura } from '../types';
import { Text } from './AppText';
import { Secao } from './Secao';

type Chave = 'nivel' | 'vazao' | 'consumo';

interface Serie {
  rotulo: string;
  unidade: string;
  casas: number;
  limite: number;
  valor: (l: Leitura) => number;
  escala: (maximo: number) => number;
  fora: (v: number) => boolean;
}

const SERIES: Record<Chave, Serie> = {
  nivel: {
    rotulo: 'Nível',
    unidade: '%',
    casas: 1,
    limite: LIMITES.nivelMinimo,
    valor: (l) => l.nivelReservatorio,
    escala: () => 100,
    fora: (v) => v < LIMITES.nivelMinimo || v > LIMITES.nivelMaximo,
  },
  vazao: {
    rotulo: 'Vazão',
    unidade: 'L/min',
    casas: 1,
    limite: LIMITES.vazaoMaxima,
    valor: (l) => l.vazao,
    escala: (m) => Math.max(150, m * 1.1),
    fora: (v) => v > LIMITES.vazaoMaxima,
  },
  consumo: {
    rotulo: 'Consumo',
    unidade: 'kW',
    casas: 2,
    limite: LIMITES.consumoMaximo,
    valor: (l) => l.consumoEletrico,
    escala: (m) => Math.max(8, m * 1.1),
    fora: (v) => v > LIMITES.consumoMaximo,
  },
};

const hora = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

/** Grafico de barras das ultimas leituras, com minimo, media e maximo. */
export function HistoricoGrafico() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [chave, setChave] = useState<Chave>('nivel');
  const { data, offline } = useApiData(() => api.historico(20));

  const serie = SERIES[chave];
  // A API devolve da mais recente para a mais antiga; no grafico queremos o contrario
  const leituras = useMemo(() => [...(data ?? [])].reverse(), [data]);
  const valores = leituras.map(serie.valor);
  const maximo = valores.length ? Math.max(...valores) : 0;
  const minimo = valores.length ? Math.min(...valores) : 0;
  const media = valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
  const escala = serie.escala(maximo);
  const fmt = (v: number) => v.toFixed(serie.casas);

  return (
    <Secao titulo="Histórico das últimas leituras" icone="stats-chart">
      <View style={styles.chips}>
        {(Object.keys(SERIES) as Chave[]).map((k) => (
          <TouchableOpacity key={k} style={[styles.chip, chave === k && styles.chipAtivo]} onPress={() => setChave(k)}>
            <Text style={[styles.chipTexto, chave === k && styles.chipTextoAtivo]}>{SERIES[k].rotulo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {leituras.length === 0 ? (
        <Text style={styles.vazio}>
          {offline ? 'Sem conexão com a estação.' : data ? 'Ainda não há leituras. Use "Simular leitura".' : 'Carregando...'}
        </Text>
      ) : (
        <>
          <View style={styles.grafico}>
            <View style={[styles.limite, { bottom: `${(serie.limite / escala) * 100}%` }]} />
            {valores.map((v, i) => (
              <View
                key={leituras[i].id}
                style={[
                  styles.barra,
                  { height: `${Math.max(2, (v / escala) * 100)}%`, backgroundColor: serie.fora(v) ? colors.danger : colors.water },
                ]}
              />
            ))}
          </View>
          <View style={styles.eixo}>
            <Text style={styles.eixoTexto}>{hora(leituras[0].dataHora)}</Text>
            <Text style={styles.eixoTexto}>{hora(leituras[leituras.length - 1].dataHora)}</Text>
          </View>

          <View style={styles.resumo}>
            {[
              ['Mínimo', minimo],
              ['Média', media],
              ['Máximo', maximo],
            ].map(([nome, v]) => (
              <View key={nome as string} style={styles.resumoItem}>
                <Text style={styles.resumoNome}>{nome as string}</Text>
                <Text style={styles.resumoValor}>
                  {fmt(v as number)} <Text style={styles.resumoUnidade}>{serie.unidade}</Text>
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.legenda}>A linha tracejada marca o limite. Barras vermelhas passaram dele.</Text>
        </>
      )}
    </Secao>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    chips: { flexDirection: 'row', gap: 8, marginBottom: 14 },
    chip: { paddingVertical: 5, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: c.border },
    chipAtivo: { backgroundColor: c.primary, borderColor: c.primary },
    chipTexto: { color: c.muted, fontWeight: '600', fontSize: 13 },
    chipTextoAtivo: { color: '#fff' },
    vazio: { color: c.muted, fontSize: 13 },
    grafico: {
      height: 150,
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 4,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    barra: { flex: 1, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
    limite: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: c.warn },
    eixo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
    eixoTexto: { color: c.muted, fontSize: 10 },
    resumo: { flexDirection: 'row', marginTop: 14, gap: 8 },
    resumoItem: { flex: 1, backgroundColor: c.background, borderRadius: 12, padding: 10 },
    resumoNome: { color: c.muted, fontSize: 11, fontWeight: '600' },
    resumoValor: { color: c.text, fontSize: 16, fontWeight: '700', marginTop: 2 },
    resumoUnidade: { color: c.muted, fontSize: 11, fontWeight: '500' },
    legenda: { color: c.muted, fontSize: 11, marginTop: 10 },
  });