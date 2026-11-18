import { ComponentProps, ReactNode, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../ThemeContext';
import { Palette } from '../theme';
import { Avaliacao, IconeNome } from '../utils/estado';
import { num } from '../utils/formato';
import { Text } from './AppText';
import { Cartao } from './Cartao';
import { FaixaBarra } from './FaixaBarra';
import { Selo } from './Selo';

interface Props {
  titulo: string;
  icone: IconeNome;
  valor: number;
  casas: number;
  unidade: string;
  avaliacao: Avaliacao;
  faixa: string; // texto da faixa de operacao
  barra: Omit<ComponentProps<typeof FaixaBarra>, 'tom' | 'valor'>;
  visual?: ReactNode; // desenho extra ao lado do valor (ex.: reservatorio)
}

/** Indicador principal: valor em destaque, unidade, estado, faixa de operacao e marca de dado simulado. */
export function IndicadorCard({ titulo, icone, valor, casas, unidade, avaliacao, faixa, barra, visual }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Cartao
      titulo={titulo}
      icone={icone}
      direita={<Selo tom="neutro" icone="flask" texto="Simulado" pequeno />}
      style={[styles.card, visual ? styles.cardLargo : null]}
    >
      <View style={styles.corpo}>
        {visual}
        <View style={{ flex: 1, minWidth: 140 }}>
          <View
            style={styles.valorLinha}
            accessible
            accessibilityLabel={`${titulo}: ${num(valor, casas)} ${unidade}. ${avaliacao.rotulo}.`}
          >
            <Text style={[styles.valor, { color: colors.text }]}>{num(valor, casas)}</Text>
            <Text style={styles.unidade}>{unidade}</Text>
          </View>
          <Selo tom={avaliacao.tom} icone={avaliacao.icone} texto={avaliacao.rotulo} />
          <Text style={styles.detalhe}>{avaliacao.detalhe}</Text>
        </View>
      </View>
      <FaixaBarra {...barra} valor={valor} tom={avaliacao.tom} />
      <Text style={styles.faixa}>{faixa}</Text>
    </Cartao>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    card: { flexGrow: 1, flexBasis: 280, flexShrink: 1, maxWidth: '100%' },
    cardLargo: { flexBasis: 400, flexGrow: 1.3 },
    corpo: { flexDirection: 'row', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
    valorLinha: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 8 },
    valor: { fontSize: 44, fontWeight: '800', fontVariant: ['tabular-nums'], lineHeight: 52 },
    unidade: { fontSize: 16, fontWeight: '600', color: c.muted },
    detalhe: { fontSize: 12.5, color: c.muted, marginTop: 8 },
    faixa: { fontSize: 12, color: c.muted, marginTop: 8 },
  });