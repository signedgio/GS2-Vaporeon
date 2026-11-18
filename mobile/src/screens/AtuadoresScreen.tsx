import { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '../components/AppText';
import { AtuadorCard } from '../components/AtuadorCard';
import { Aviso } from '../components/Aviso';
import { Cartao } from '../components/Cartao';
import { useEstacao } from '../EstacaoContext';
import { useLayout } from '../hooks/useLayout';
import { useTheme } from '../ThemeContext';
import { Palette } from '../theme';

export function AtuadoresScreen() {
  const { colors } = useTheme();
  const { largo } = useLayout();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { atuadores, conexao, carregando, atualizar } = useEstacao();
  const offline = conexao === 'offline';

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[styles.conteudo, largo && styles.conteudoLargo]}
      refreshControl={<RefreshControl refreshing={false} onRefresh={atualizar} />}
    >
      <View style={{ gap: 4 }}>
        <Text accessibilityRole="header" style={styles.titulo}>
          Atuadores
        </Text>
        <Text style={styles.sub}>
          O estado confirmado é o que a API registrou. O comando solicitado fica em andamento até a API confirmar.
        </Text>
      </View>

      {!atuadores ? (
        <Cartao>
          {carregando ? (
            <Aviso carregando titulo="Carregando atuadores..." />
          ) : (
            <Aviso
              icone={offline ? 'cloud-offline' : 'construct'}
              titulo={offline ? 'API fora do ar' : 'Nenhum atuador cadastrado'}
              texto={offline ? 'Os atuadores aparecem quando a API voltar.' : undefined}
            />
          )}
        </Cartao>
      ) : (
        <View style={styles.grade}>
          {atuadores.map((a) => (
            <AtuadorCard key={a.id} atuador={a} style={{ flexGrow: 1, flexBasis: 340, flexShrink: 1, maxWidth: '100%' }} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    conteudo: { padding: 16, paddingBottom: 40, gap: 16, width: '100%' },
    conteudoLargo: { padding: 24, maxWidth: 1400, alignSelf: 'center' },
    titulo: { fontSize: 20, fontWeight: '700', color: c.text },
    sub: { fontSize: 13, color: c.muted },
    grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' },
  });