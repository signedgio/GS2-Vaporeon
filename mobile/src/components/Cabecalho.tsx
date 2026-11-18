import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEstacao } from '../EstacaoContext';
import { useLayout } from '../hooks/useLayout';
import { useTheme } from '../ThemeContext';
import { Palette } from '../theme';
import { hora } from '../utils/formato';
import { Text } from './AppText';
import { Selo } from './Selo';
import { ThemeToggle } from './ThemeToggle';

/** Cabecalho fixo: marca, descricao curta, estado da conexao e horario da ultima atualizacao. */
export function Cabecalho() {
  const { colors } = useTheme();
  const { largo } = useLayout();
  const insets = useSafeAreaInsets();
  const { conexao, atualizadoEm } = useEstacao();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const selo =
    conexao === 'online' ? (
      <Selo tom="ok" icone="wifi" texto="Conectado à API" />
    ) : conexao === 'offline' ? (
      <Selo tom="danger" icone="cloud-offline" texto="API fora do ar" />
    ) : (
      <Selo tom="info" icone="sync" texto="Conectando..." />
    );

  const atualizacao = atualizadoEm
    ? `${conexao === 'offline' ? 'Última atualização' : 'Atualizado'} às ${hora(atualizadoEm)}`
    : 'Aguardando os primeiros dados';

  return (
    <View style={[styles.barra, { paddingTop: insets.top + 12 }]}>
      <View style={[styles.conteudo, largo && styles.conteudoLargo]}>
        <View style={styles.marca}>
          <View style={styles.logo}>
            <Ionicons name="water" size={22} color={colors.primary} />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text accessibilityRole="header" style={styles.nome}>
              Vaporeon
            </Text>
            <Text style={styles.descricao} numberOfLines={largo ? 1 : 2}>
              Monitoramento de água e energia da estação
            </Text>
          </View>
        </View>

        <View style={styles.status}>
          <View accessibilityLiveRegion="polite" style={{ alignItems: largo ? 'flex-end' : 'flex-start', gap: 4 }}>
            {selo}
            <Text style={styles.hora}>{atualizacao}</Text>
          </View>
          <ThemeToggle />
        </View>
      </View>
    </View>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    barra: {
      backgroundColor: c.header,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      paddingBottom: 12,
      paddingHorizontal: 16,
    },
    conteudo: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
    conteudoLargo: { paddingHorizontal: 12 },
    marca: { flexDirection: 'row', alignItems: 'center', gap: 12, flexShrink: 1 },
    logo: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: c.cardAlt,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nome: { color: c.text, fontSize: 22, fontFamily: 'LibreBaskerville_700Bold' },
    descricao: { color: c.muted, fontSize: 12.5 },
    status: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    hora: { color: c.muted, fontSize: 12 },
  });