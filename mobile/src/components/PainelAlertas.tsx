import { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api';
import { useApiData } from '../hooks/useApiData';
import { useTheme } from '../ThemeContext';
import { Palette } from '../theme';
import { Severidade } from '../types';
import { Text } from './AppText';
import { Secao } from './Secao';

const ROTULO: Record<Severidade, string> = { BAIXA: 'BAIXA', MEDIA: 'MÉDIA', ALTA: 'ALTA', CRITICA: 'CRÍTICA' };

/** Resumo dos alertas abertos, com atalho para a aba Alertas. */
export function PainelAlertas() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const navigation = useNavigation();
  const { data: falhas, offline } = useApiData(() => api.falhas(true));

  const cor: Record<Severidade, string> = {
    BAIXA: colors.ok,
    MEDIA: colors.warn,
    ALTA: colors.danger,
    CRITICA: colors.critical,
  };
  const total = falhas?.length ?? 0;

  return (
    <Secao
      titulo={total > 0 ? `Alertas abertos (${total})` : 'Alertas abertos'}
      icone="warning"
      direita={
        <TouchableOpacity onPress={() => navigation.navigate('Alertas' as never)}>
          <Text style={styles.ver}>Ver todos</Text>
        </TouchableOpacity>
      }
    >
      {!falhas ? <Text style={styles.vazio}>{offline ? 'Sem conexão com a estação.' : 'Carregando...'}</Text> : null}
      {falhas && total === 0 ? <Text style={styles.vazio}>Nenhum alerta aberto 🎉</Text> : null}
      {(falhas ?? []).slice(0, 3).map((f) => (
        <View key={f.id} style={[styles.item, { borderLeftColor: cor[f.severidade] }]}>
          <View style={styles.topo}>
            <Text style={[styles.sev, { color: cor[f.severidade] }]}>{ROTULO[f.severidade]}</Text>
            <Text style={styles.origem}>{f.origem}</Text>
          </View>
          <Text style={styles.descricao}>{f.descricao}</Text>
        </View>
      ))}
      {total > 3 ? <Text style={styles.mais}>+ {total - 3} outros alertas abertos</Text> : null}
    </Secao>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    ver: { color: c.primary, fontWeight: '700', fontSize: 13 },
    vazio: { color: c.muted, fontSize: 13 },
    item: { borderLeftWidth: 4, paddingLeft: 12, paddingVertical: 4, marginBottom: 10 },
    topo: { flexDirection: 'row', justifyContent: 'space-between' },
    sev: { fontWeight: '800', fontSize: 11 },
    origem: { color: c.muted, fontSize: 11 },
    descricao: { color: c.text, fontSize: 13, marginTop: 2 },
    mais: { color: c.muted, fontSize: 12, marginTop: 2 },
  });