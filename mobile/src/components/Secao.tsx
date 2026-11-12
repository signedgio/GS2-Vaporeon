import { ReactNode, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { Palette, radius } from '../theme';
import { Text } from './AppText';

interface Props {
  titulo: string;
  icone: keyof typeof Ionicons.glyphMap;
  direita?: ReactNode;
  children: ReactNode;
}

/** Cartao com titulo, usado pelas secoes do Painel (atuadores, alertas, historico). */
export function Secao({ titulo, icone, direita, children }: Props) {
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadow), [colors, shadow]);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titulo}>
          <Ionicons name={icone} size={20} color={colors.primary} />
          <Text style={styles.tituloTexto}>{titulo}</Text>
        </View>
        {direita}
      </View>
      {children}
    </View>
  );
}

const makeStyles = (c: Palette, shadow: { boxShadow: string }) =>
  StyleSheet.create({
    card: { backgroundColor: c.card, borderRadius: radius, padding: 18, marginBottom: 14, ...shadow },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
    titulo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    tituloTexto: { fontSize: 16, fontWeight: '700', color: c.text },
  });