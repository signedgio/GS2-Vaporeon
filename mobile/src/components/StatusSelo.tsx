import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { Palette, radius } from '../theme';
import { Text } from './AppText';

export type EstadoEstacao = 'ok' | 'atencao' | 'offline';

const CONFIG: Record<EstadoEstacao, { texto: string; sub: string; icone: keyof typeof Ionicons.glyphMap }> = {
  ok: { texto: 'Estação operando normalmente', sub: 'Todos os valores dentro dos limites.', icone: 'checkmark-circle' },
  atencao: { texto: 'Atenção: valores fora do limite', sub: 'Confira os alertas abertos abaixo.', icone: 'alert-circle' },
  offline: { texto: 'Sem conexão com a estação', sub: 'Mostrando os últimos dados disponíveis.', icone: 'cloud-offline' },
};

/** Faixa no topo do Painel com a situacao geral da estacao. */
export function StatusSelo({ estado }: { estado: EstadoEstacao }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const cor = estado === 'ok' ? colors.ok : estado === 'atencao' ? colors.warn : colors.danger;
  const { texto, sub, icone } = CONFIG[estado];
  return (
    <View style={[styles.faixa, { backgroundColor: `${cor}22`, borderColor: cor }]}>
      <Ionicons name={icone} size={30} color={cor} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.texto, { color: cor }]}>{texto}</Text>
        <Text style={styles.sub}>{sub}</Text>
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
      borderWidth: 1.5,
      borderRadius: radius,
      paddingVertical: 14,
      paddingHorizontal: 18,
      marginBottom: 14,
    },
    texto: { fontSize: 16, fontWeight: '700' },
    sub: { fontSize: 12, color: c.muted, marginTop: 1 },
  });