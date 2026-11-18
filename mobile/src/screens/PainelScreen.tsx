import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { api, ApiOfflineError } from '../api';
import { AtuadorCard } from '../components/AtuadorCard';
import { Text } from '../components/AppText';
import { Aviso } from '../components/Aviso';
import { Botao } from '../components/Botao';
import { Cartao } from '../components/Cartao';
import { Historico } from '../components/Historico';
import { IndicadorCard } from '../components/IndicadorCard';
import { Reservatorio } from '../components/Reservatorio';
import { ResumoAtencao } from '../components/ResumoAtencao';
import { Selo } from '../components/Selo';
import { API_URL, LIMITES, POLL_INTERVAL_MS } from '../config';
import { useEstacao } from '../EstacaoContext';
import { useLayout } from '../hooks/useLayout';
import { useTheme } from '../ThemeContext';
import { Palette, radius } from '../theme';
import { avaliarLeitura } from '../utils/estado';
import { hora, num } from '../utils/formato';
import { avisar } from '../utils/avisar';

export function PainelScreen() {
  const { colors } = useTheme();
  const { largo } = useLayout();
  const navigation = useNavigation();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { leitura, atuadores, conexao, carregando, erro, atualizadoEm, atualizar } = useEstacao();
  const [gerando, setGerando] = useState(false);

  const offline = conexao === 'offline';
  const avaliacao = leitura ? avaliarLeitura(leitura) : null;
  const bomba = atuadores?.find((a) => a.nome.toLowerCase().includes('bomba'));

  async function gerarLeitura() {
    setGerando(true);
    try {
      await api.simularLeitura();
      await atualizar();
    } catch (e) {
      avisar(
        e instanceof ApiOfflineError ? 'API fora do ar' : 'Erro',
        e instanceof ApiOfflineError ? 'Não foi possível falar com o servidor.' : (e as Error).message,
      );
    } finally {
      setGerando(false);
    }
  }

  const botaoGerar = (
    <Botao
      titulo="Gerar leitura simulada"
      icone="flask"
      variante="fantasma"
      carregando={gerando}
      desabilitado={offline}
      onPress={gerarLeitura}
    />
  );

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[styles.conteudo, largo && styles.conteudoLargo]}
      refreshControl={<RefreshControl refreshing={false} onRefresh={atualizar} />}
    >
      {offline ? (
        <View style={styles.offline} accessibilityRole="alert">
          <Ionicons name="cloud-offline" size={24} color={colors.danger} />
          <View style={{ flex: 1 }}>
            <Text style={styles.offlineTitulo}>API fora do ar</Text>
            <Text style={styles.offlineTexto}>
              Não foi possível falar com {API_URL}.{' '}
              {atualizadoEm ? `Mostrando os últimos dados, recebidos às ${hora(atualizadoEm)}. ` : ''}
              Nova tentativa a cada {POLL_INTERVAL_MS / 1000} s.
            </Text>
          </View>
        </View>
      ) : null}

      {erro ? (
        <View style={styles.offline} accessibilityRole="alert">
          <Ionicons name="close-circle" size={24} color={colors.danger} />
          <Text style={[styles.offlineTexto, { flex: 1 }]}>A API respondeu com erro: {erro}</Text>
        </View>
      ) : null}

      {leitura ? <ResumoAtencao leitura={leitura} onVerAlertas={() => navigation.navigate('Alertas' as never)} /> : null}

      <View style={styles.secao}>
        <View style={{ gap: 4 }}>
          <Text accessibilityRole="header" style={styles.secaoTitulo}>
            Indicadores
          </Text>
          <Selo tom="neutro" icone="flask" texto="Medições simuladas" pequeno />
        </View>
        {botaoGerar}
      </View>

      {!leitura ? (
        <Cartao>
          {carregando ? (
            <Aviso titulo="Carregando medições..." texto="Conectando à API da estação." carregando />
          ) : offline ? (
            <Aviso icone="cloud-offline" titulo="Sem dados para mostrar" texto="Assim que a API voltar, as medições aparecem aqui." />
          ) : (
            <Aviso
              icone="water-outline"
              titulo="Nenhuma leitura ainda"
              texto='A estação ainda não registrou medições. Use "Gerar leitura simulada" para criar a primeira.'
            />
          )}
        </Cartao>
      ) : (
        <View style={styles.grade}>
          <IndicadorCard
            titulo="Nível do reservatório"
            icone="beaker"
            valor={leitura.nivelReservatorio}
            casas={1}
            unidade="%"
            avaliacao={avaliacao!.nivel}
            faixa={`Faixa de operação: ${LIMITES.nivelMinimo}% a ${LIMITES.nivelMaximo}%`}
            barra={{ dominio: [0, 100], seguro: [LIMITES.nivelMinimo, LIMITES.nivelMaximo] }}
            visual={<Reservatorio percent={leitura.nivelReservatorio} />}
          />
          <IndicadorCard
            titulo="Vazão"
            icone="water"
            valor={leitura.vazao}
            casas={1}
            unidade="L/min"
            avaliacao={avaliacao!.vazao}
            faixa={`Faixa de operação: 0 a ${LIMITES.vazaoMaxima} L/min`}
            barra={{ dominio: [0, LIMITES.vazaoMaxima * 1.25], seguro: [0, LIMITES.vazaoMaxima] }}
          />
          <IndicadorCard
            titulo="Potência elétrica"
            icone="flash"
            valor={leitura.consumoEletrico}
            casas={2}
            unidade="kW"
            avaliacao={avaliacao!.potencia}
            faixa={`Faixa de operação: 0 a ${num(LIMITES.consumoMaximo, 1)} kW`}
            barra={{ dominio: [0, LIMITES.consumoMaximo * 1.25], seguro: [0, LIMITES.consumoMaximo] }}
          />
        </View>
      )}
      {leitura ? (
        <Text style={styles.atualizada}>Leitura registrada às {hora(leitura.dataHora)} · valores gerados por simulação</Text>
      ) : null}

      <View style={[styles.grade, { marginTop: 16 }]}>
        <Historico />
        {bomba ? (
          <AtuadorCard atuador={bomba} style={{ flexGrow: 1, flexBasis: 320, flexShrink: 1, maxWidth: '100%', alignSelf: 'flex-start' }} />
        ) : (
          <Cartao titulo="Bomba principal" icone="sync-circle" style={{ flexGrow: 1, flexBasis: 320, flexShrink: 1, maxWidth: '100%', alignSelf: 'flex-start' }}>
            <Aviso
              carregando={carregando}
              icone="cloud-offline"
              titulo={carregando ? 'Carregando...' : 'Sem dados da bomba'}
              texto={carregando ? undefined : 'O estado do equipamento aparece quando a API responder.'}
            />
          </Cartao>
        )}
      </View>
    </ScrollView>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    conteudo: { padding: 16, paddingBottom: 40, gap: 16, width: '100%' },
    conteudoLargo: { padding: 24, maxWidth: 1400, alignSelf: 'center' },
    grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' },
    secao: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 },
    secaoTitulo: { fontSize: 20, fontWeight: '700', color: c.text },
    atualizada: { color: c.muted, fontSize: 12 },
    offline: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: `${c.danger}88`,
      backgroundColor: `${c.danger}18`,
      borderRadius: radius,
      padding: 14,
    },
    offlineTitulo: { color: c.danger, fontSize: 15, fontWeight: '700' },
    offlineTexto: { color: c.text, fontSize: 13 },
  });