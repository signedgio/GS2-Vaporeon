import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { IconeNome } from '../utils/estado';
import { Text } from './AppText';

interface Props {
  titulo: string;
  texto?: string;
  icone?: IconeNome;
  carregando?: boolean;
  acao?: ReactNode;
}

/** Estado vazio, de carregamento ou de erro de uma area da tela. */
export function Aviso({ titulo, texto, icone = 'information-circle', carregando = false, acao }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.box} accessibilityRole="summary" accessibilityLiveRegion="polite">
      {carregando ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Ionicons name={icone} size={34} color={colors.muted} />
      )}
      <Text style={[styles.titulo, { color: colors.text }]}>{titulo}</Text>
      {texto ? <Text style={[styles.texto, { color: colors.muted }]}>{texto}</Text> : null}
      {acao}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', gap: 8, paddingVertical: 28, paddingHorizontal: 16 },
  titulo: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  texto: { fontSize: 13, textAlign: 'center', maxWidth: 420 },
});