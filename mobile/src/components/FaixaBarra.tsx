import { StyleSheet, View } from 'react-native';
import { useTheme } from '../ThemeContext';
import { corDoTom, Tom } from '../theme';

interface Props {
  valor: number;
  dominio: [number, number]; // escala total da barra
  seguro: [number, number]; // trecho considerado dentro da faixa de operacao
  tom: Tom;
}

/** Barra horizontal: o trecho verde e a faixa de operacao e o marcador mostra onde a leitura esta. */
export function FaixaBarra({ valor, dominio, seguro, tom }: Props) {
  const { colors } = useTheme();
  const [d0, d1] = dominio;
  const pct = (v: number) => `${Math.max(0, Math.min(100, ((v - d0) / (d1 - d0)) * 100))}%` as const;
  const cor = corDoTom(colors, tom);

  return (
    <View style={[styles.trilha, { backgroundColor: colors.cardAlt }]} accessible={false}>
      <View
        style={[
          styles.seguro,
          { left: pct(seguro[0]), width: `${((seguro[1] - seguro[0]) / (d1 - d0)) * 100}%`, backgroundColor: `${colors.ok}55` },
        ]}
      />
      <View style={[styles.marcador, { left: pct(valor), backgroundColor: cor, borderColor: colors.card }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  trilha: { height: 10, borderRadius: 5, marginTop: 14, justifyContent: 'center' },
  seguro: { position: 'absolute', top: 0, bottom: 0, borderRadius: 5 },
  marcador: { position: 'absolute', width: 16, height: 16, borderRadius: 8, borderWidth: 3, marginLeft: -8 },
});