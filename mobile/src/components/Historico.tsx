import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LIMITES } from '../config';
import { useEstacao } from '../EstacaoContext';
import { useLayout } from '../hooks/useLayout';
import { useTheme } from '../ThemeContext';
import { Palette } from '../theme';
import { Leitura } from '../types';
import { avaliarNivel, avaliarPotencia, avaliarVazao, Avaliacao } from '../utils/estado';
import { dataHora, num } from '../utils/formato';
import { Text } from './AppText';
import { Aviso } from './Aviso';
import { Cartao } from './Cartao';
import { Chip } from './Botao';
import { GraficoLinha, Limite } from './GraficoLinha';
import { Selo } from './Selo';

type Chave = 'nivel' | 'vazao' | 'potencia';

interface Serie {
  rotulo: string;
  unidade: string;
  casas: number;
  valor: (l: Leitura) => number;
  limites: Limite[];
  dominio: (maximoDosDados: number) => [number, number];
  avaliar: (v: number) => Avaliacao;
  fora: (v: number) => boolean;
}

// Teto do eixo vertical: arredonda para cima em multiplos de "passo" (4 divisoes ficam com numeros redondos)
const teto = (v: number, passo: number) => Math.ceil(v / passo) * passo;

const SERIES: Record<Chave, Serie> = {
  nivel: {
    rotulo: 'Nível',
    unidade: '%',
    casas: 1,
    valor: (l) => l.nivelReservatorio,
    limites: [
      { valor: LIMITES.nivelMaximo, rotulo: `Máximo ${LIMITES.nivelMaximo}%`, tom: 'warn' },
      { valor: LIMITES.nivelMinimo, rotulo: `Mínimo ${LIMITES.nivelMinimo}%`, tom: 'danger' },
    ],
    dominio: () => [0, 100],
    avaliar: avaliarNivel,
    fora: (v) => v < LIMITES.nivelMinimo || v > LIMITES.nivelMaximo,
  },
  vazao: {
    rotulo: 'Vazão',
    unidade: 'L/min',
    casas: 1,
    valor: (l) => l.vazao,
    limites: [{ valor: LIMITES.vazaoMaxima, rotulo: `Máximo ${LIMITES.vazaoMaxima} L/min`, tom: 'danger' }],
    dominio: (m) => [0, teto(Math.max(LIMITES.vazaoMaxima * 1.2, m * 1.05), 40)],
    avaliar: avaliarVazao,
    fora: (v) => v > LIMITES.vazaoMaxima,
  },
  potencia: {
    rotulo: 'Potência',
    unidade: 'kW',
    casas: 2,
    valor: (l) => l.consumoEletrico,
    limites: [{ valor: LIMITES.consumoMaximo, rotulo: `Máximo ${num(LIMITES.consumoMaximo, 1)} kW`, tom: 'danger' }],
    dominio: (m) => [0, teto(Math.max(LIMITES.consumoMaximo * 1.2, m * 1.05), 4)],
    avaliar: avaliarPotencia,
    fora: (v) => v > LIMITES.consumoMaximo,
  },
};

const MIN = 60 * 1000;
const PERIODOS = [
  { id: '15m', rotulo: '15 min', ms: 15 * MIN },
  { id: '1h', rotulo: '1 hora', ms: 60 * MIN },
  { id: '24h', rotulo: '24 horas', ms: 24 * 60 * MIN },
  { id: 'tudo', rotulo: 'Todas', ms: Infinity },
] as const;
type PeriodoId = (typeof PERIODOS)[number]['id'];

/** Historico das leituras: um indicador por vez, com periodo, limites, tooltip e resumo (minimo, media, maximo). */
export function Historico() {
  const { colors } = useTheme();
  const { largo } = useLayout();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { historico, conexao, carregando } = useEstacao();
  const [chave, setChave] = useState<Chave>('nivel');
  const [periodoId, setPeriodoId] = useState<PeriodoId>('tudo');
  const [sel, setSel] = useState<number | null>(null);

  const serie = SERIES[chave];
  const periodo = PERIODOS.find((p) => p.id === periodoId)!;

  // A API devolve da mais recente para a mais antiga. No grafico queremos ordem cronologica.
  const leituras = useMemo(() => {
    const agora = Date.now();
    return historico.filter((l) => agora - new Date(l.dataHora).getTime() <= periodo.ms).reverse();
  }, [historico, periodo]);

  const pontos = useMemo(
    () => leituras.map((l) => ({ t: new Date(l.dataHora).getTime(), v: serie.valor(l) })),
    [leituras, serie],
  );

  const valores = pontos.map((p) => p.v);
  const maximo = valores.length ? Math.max(...valores) : 0;
  const minimo = valores.length ? Math.min(...valores) : 0;
  const media = valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;

  const idx = sel !== null && sel < pontos.length ? sel : null;
  const destaque = pontos.length ? pontos[idx ?? pontos.length - 1] : null;
  const avDestaque = destaque ? serie.avaliar(destaque.v) : null;
  const fmt = (v: number) => `${num(v, serie.casas)} ${serie.unidade}`;

  function trocar(fn: () => void) {
    setSel(null);
    fn();
  }

  let vazio: { titulo: string; texto: string; carregando?: boolean } | null = null;
  if (pontos.length === 0) {
    if (carregando) vazio = { titulo: 'Carregando histórico...', texto: 'Buscando as leituras na API.', carregando: true };
    else if (conexao === 'offline' && historico.length === 0)
      vazio = { titulo: 'Sem histórico disponível', texto: 'A API está fora do ar e ainda não há leituras guardadas neste aparelho.' };
    else if (historico.length === 0)
      vazio = { titulo: 'Ainda não há leituras', texto: 'Use "Gerar leitura simulada" para criar as primeiras medições de demonstração.' };
    else
      vazio = { titulo: `Sem leituras em ${periodo.rotulo}`, texto: 'Escolha um período maior para ver leituras mais antigas.' };
  }

  return (
    <Cartao
      titulo="Histórico das leituras"
      subtitulo={pontos.length ? `${pontos.length} ${pontos.length === 1 ? 'leitura' : 'leituras'} no período` : undefined}
      icone="stats-chart"
      direita={<Selo tom="neutro" icone="flask" texto="Dados simulados" pequeno />}
      style={{ flexGrow: 2, flexBasis: 520, flexShrink: 1, maxWidth: '100%' }}
    >
      <View style={styles.controles} accessibilityRole="tablist">
        {(Object.keys(SERIES) as Chave[]).map((k) => (
          <Chip key={k} rotulo={SERIES[k].rotulo} ativo={chave === k} onPress={() => trocar(() => setChave(k))} />
        ))}
      </View>
      <View style={styles.controles} accessibilityRole="tablist">
        <Text style={styles.rotuloControle}>Período</Text>
        {PERIODOS.map((p) => (
          <Chip key={p.id} rotulo={p.rotulo} ativo={periodoId === p.id} onPress={() => trocar(() => setPeriodoId(p.id))} />
        ))}
      </View>

      {vazio ? (
        <Aviso titulo={vazio.titulo} texto={vazio.texto} icone="analytics" carregando={vazio.carregando} />
      ) : (
        <>
          <Text style={styles.eixoTitulo}>
            {serie.rotulo} ({serie.unidade})
          </Text>
          <GraficoLinha
            pontos={pontos}
            dominioY={serie.dominio(maximo)}
            limites={serie.limites}
            formatarValor={fmt}
            avaliar={serie.avaliar}
            fora={serie.fora}
            selecionado={idx}
            onSelecionar={setSel}
            altura={largo ? 260 : 220}
            descricao={`Gráfico de ${serie.rotulo} em ${serie.unidade}. ${pontos.length} leituras simuladas. Mínimo ${fmt(minimo)}, média ${fmt(media)}, máximo ${fmt(maximo)}.`}
          />

          <View style={styles.legenda}>
            <View style={styles.legendaItem}>
              <View style={[styles.legendaLinha, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendaTexto}>Medição simulada</Text>
            </View>
            <View style={styles.legendaItem}>
              <View style={[styles.legendaPonto, { backgroundColor: colors.danger }]} />
              <Text style={styles.legendaTexto}>Fora do limite</Text>
            </View>
            <View style={styles.legendaItem}>
              <View style={[styles.legendaTracejado, { borderColor: colors.warn }]} />
              <Text style={styles.legendaTexto}>Limite configurado</Text>
            </View>
          </View>

          {destaque && avDestaque ? (
            <View style={styles.leitura} accessibilityLiveRegion="polite">
              <Text style={styles.leituraTexto}>
                {idx !== null ? 'Leitura selecionada' : 'Última leitura do período'} · {dataHora(destaque.t)}
              </Text>
              <View style={styles.leituraValor}>
                <Text style={styles.leituraNumero}>{fmt(destaque.v)}</Text>
                <Selo tom={avDestaque.tom} icone={avDestaque.icone} texto={avDestaque.rotulo} pequeno />
              </View>
            </View>
          ) : null}

          <View style={styles.resumo}>
            {(
              [
                ['Mínimo', minimo],
                ['Média', media],
                ['Máximo', maximo],
              ] as const
            ).map(([nome, v]) => (
              <View key={nome} style={styles.resumoItem}>
                <Text style={styles.resumoNome}>{nome}</Text>
                <Text style={styles.resumoValor}>{fmt(v)}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </Cartao>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    controles: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 10 },
    rotuloControle: { color: c.muted, fontSize: 12, fontWeight: '600', marginRight: 2 },
    eixoTitulo: { color: c.muted, fontSize: 12, fontWeight: '600', marginTop: 6, marginBottom: 2 },
    legenda: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 8 },
    legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendaLinha: { width: 18, height: 3, borderRadius: 2 },
    legendaPonto: { width: 10, height: 10, borderRadius: 5 },
    legendaTracejado: { width: 18, height: 0, borderTopWidth: 2, borderStyle: 'dashed' },
    legendaTexto: { color: c.muted, fontSize: 12 },
    leitura: { marginTop: 14, backgroundColor: c.cardAlt, borderRadius: 12, padding: 12, gap: 4 },
    leituraTexto: { color: c.muted, fontSize: 12 },
    leituraValor: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
    leituraNumero: { color: c.text, fontSize: 20, fontWeight: '800', fontVariant: ['tabular-nums'] },
    resumo: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
    resumoItem: { flexGrow: 1, flexBasis: 90, backgroundColor: c.cardAlt, borderRadius: 12, padding: 10 },
    resumoNome: { color: c.muted, fontSize: 11, fontWeight: '600' },
    resumoValor: { color: c.text, fontSize: 15, fontWeight: '700', marginTop: 2, fontVariant: ['tabular-nums'] },
  });