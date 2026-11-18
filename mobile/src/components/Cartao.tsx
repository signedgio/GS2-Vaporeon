import { ReactNode, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { Palette, radius } from '../theme';
import { IconeNome } from '../utils/estado';
import { Text } from './AppText';

interface Props {
  titulo?: string;
  subtitulo?: string;
  icone?: IconeNome;
  direita?: ReactNode;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/** Cartao padrao do app: superficie um pouco mais clara que o fundo, borda suave e titulo opcional. */
export function Cartao({ titulo, subtitulo, icone, direita, style, children }: Props) {
  const { colors, shadow } = useTheme();
  const styles = useMemo(() => makeStyles(colors, shadow), [colors, shadow]);
  return (
    <View style={[styles.card, style]}>
      {titulo ? (
        <View style={styles.header}>
          <View style={styles.titulo}>
            {icone ? <Ionicons name={icone} size={20} color={colors.primary} /> : null}
            <View style={{ flexShrink: 1 }}>
              <Text accessibilityRole="header" style={styles.tituloTexto}>
                {titulo}
              </Text>
              {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
            </View>
          </View>
          {direita}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const makeStyles = (c: Palette, shadow: { boxShadow: string }) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.card,
      borderRadius: radius,
      borderWidth: 1,
      borderColor: c.border,
      padding: 18,
      ...shadow,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 14,
    },
    titulo: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
    tituloTexto: { fontSize: 15, fontWeight: '700', color: c.text },
    subtitulo: { fontSize: 12, color: c.muted, marginTop: 1 },
  });