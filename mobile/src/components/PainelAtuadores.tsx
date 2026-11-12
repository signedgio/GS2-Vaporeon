import { useMemo, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api, ApiOfflineError } from '../api';
import { useApiData } from '../hooks/useApiData';
import { useTheme } from '../ThemeContext';
import { Palette } from '../theme';
import { avisar } from '../utils/avisar';
import { Text } from './AppText';
import { Secao } from './Secao';

const ICONES: Record<string, keyof typeof Ionicons.glyphMap> = {
  BOMBA: 'sync-circle',
  VALVULA: 'funnel',
  ENERGIA: 'sunny',
};

/** Atuadores com chave liga/desliga direto no Painel. */
export function PainelAtuadores() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { data: atuadores, offline, refresh } = useApiData(api.atuadores);
  const [pendente, setPendente] = useState<number | null>(null);

  async function alternar(id: number, ligar: boolean) {
    setPendente(id);
    try {
      await api.acionarAtuador(id, ligar);
      await refresh();
    } catch (e) {
      avisar(
        e instanceof ApiOfflineError ? 'API fora do ar' : 'Erro',
        e instanceof ApiOfflineError ? 'Não foi possível acionar o atuador agora.' : (e as Error).message,
      );
    } finally {
      setPendente(null);
    }
  }

  return (
    <Secao titulo="Atuadores" icone="options">
      {!atuadores ? <Text style={styles.vazio}>{offline ? 'Sem conexão com a estação.' : 'Carregando...'}</Text> : null}
      {(atuadores ?? []).map((a) => (
        <View key={a.id} style={styles.linha}>
          <Ionicons name={ICONES[a.tipo] ?? 'construct'} size={24} color={a.ligado ? colors.ok : colors.muted} />
          <View style={{ flex: 1 }}>
            <Text style={styles.nome}>{a.nome}</Text>
            <Text style={[styles.estado, { color: a.ligado ? colors.ok : colors.muted }]}>
              {a.ligado ? 'LIGADO' : 'DESLIGADO'}
            </Text>
          </View>
          <Switch
            value={a.ligado}
            disabled={pendente === a.id || offline}
            onValueChange={(v) => alternar(a.id, v)}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>
      ))}
    </Secao>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    nome: { fontSize: 14, fontWeight: '600', color: c.text },
    estado: { fontSize: 11, fontWeight: '700', marginTop: 1 },
    vazio: { color: c.muted, fontSize: 13 },
  });