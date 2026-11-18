import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { corDoTom, Palette, radius } from '../theme';
import { variaveisEmAtencao } from '../utils/estado';
import { Leitura } from '../types';
import { Text } from './AppText';
import { Botao } from './Botao';
import { Selo } from './Selo';

interface Props {
  leitura: Leitura;
  onVerAlertas: () => void;
}

/** Diz em uma olhada como esta o sistema e, se houver problema, qual variavel exige atencao. */
export function ResumoAtencao({ leitura, onVerAlertas }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const itens = variaveisEmAtencao(leitura);

  if (itens.length === 0) {
    return (
      <View style={[styles.faixa, { borderColor: `${colors.ok}88`, backgroundColor: `${colors.ok}18` }]} accessibilityRole="summary">
        <Ionicons name="checkmark-circle" size={26} color={colors.ok} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.titulo, { color: colors.ok }]}>Sistema operando normalmente</Text>
          <Text style={styles.sub}>Nível, vazão e potência elétrica estão dentro dos limites configurados.</Text>
        </View>
      </View>
    );
  }

  const critico = itens.some((i) => i.avaliacao.tom === 'danger');
  const corGeral = critico ? colors.danger : colors.warn;

  return (
    <View
      style={[styles.faixa, { borderColor: `${corGeral}88`, backgroundColor: `${corGeral}18`, alignItems: 'flex-start' }]}
      accessibilityRole="alert"
    >
      <Ionicons name={critico ? 'close-circle' : 'alert-circle'} size={26} color={corGeral} />
      <View style={{ flex: 1, gap: 10 }}>
        <Text style={[styles.titulo, { color: corGeral }]}>
          {itens.length === 1 ? '1 indicador exige atenção' : `${itens.length} indicadores exigem atenção`}
        </Text>
        {itens.map((i) => (
          <View key={i.chave} style={styles.item}>
            <Text style={styles.itemNome}>
              {i.nome}: <Text style={[styles.itemValor, { color: corDoTom(colors, i.avaliacao.tom) }]}>{i.valor}</Text>
            </Text>
            <Selo tom={i.avaliacao.tom} icone={i.avaliacao.icone} texto={i.avaliacao.rotulo} pequeno />
          </View>
        ))}
        <View style={{ alignSelf: 'flex-start' }}>
          <Botao titulo="Ver alertas" variante="secundario" icone="warning" onPress={onVerAlertas} />
        </View>
      </View>
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    faixa: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      borderWidth: 1,
      borderRadius: radius,
      paddingVertical: 14,
      paddingHorizontal: 18,
    },
    titulo: { fontSize: 16, fontWeight: '700' },
    sub: { fontSize: 13, color: c.muted, marginTop: 1 },
    item: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
    itemNome: { fontSize: 14, color: c.text, fontWeight: '500' },
    itemValor: { fontWeight: '800' },
  });