import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { api, ApiOfflineError } from '../api';
import { useEstacao } from '../EstacaoContext';
import { useTheme } from '../ThemeContext';
import { Palette } from '../theme';
import { Atuador } from '../types';
import { IconeNome } from '../utils/estado';
import { hora } from '../utils/formato';
import { Text } from './AppText';
import { Botao } from './Botao';
import { Cartao } from './Cartao';
import { Selo } from './Selo';

const ICONES: Record<string, IconeNome> = { BOMBA: 'sync-circle', VALVULA: 'funnel', ENERGIA: 'sunny' };

type Fase =
  | { tipo: 'ocioso' }
  | { tipo: 'enviando'; alvo: boolean }
  | { tipo: 'sucesso'; mensagem: string }
  | { tipo: 'falha'; mensagem: string };

interface Props {
  atuador: Atuador;
  style?: object;
}

/**
 * Atuador com dois conceitos separados:
 *  - estado confirmado: o que a API registrou como estado do equipamento;
 *  - comando solicitado: o que o usuario acabou de pedir, ate a API confirmar.
 */
export function AtuadorCard({ atuador, style }: Props) {
  const { colors } = useTheme();
  const { conexao, atualizar } = useEstacao();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [fase, setFase] = useState<Fase>({ tipo: 'ocioso' });

  // A mensagem de sucesso some sozinha depois de alguns segundos
  useEffect(() => {
    if (fase.tipo !== 'sucesso') return;
    const t = setTimeout(() => setFase({ tipo: 'ocioso' }), 6000);
    return () => clearTimeout(t);
  }, [fase]);

  const enviando = fase.tipo === 'enviando';
  const offline = conexao === 'offline';
  // Durante o envio o texto do botao nao muda, mesmo que a API ja tenha registrado o novo estado
  const ligarAgora = fase.tipo === 'enviando' ? !fase.alvo : atuador.ligado;
  const acao = ligarAgora ? 'Desligar' : 'Ligar';

  async function comandar() {
    const alvo = !atuador.ligado;
    setFase({ tipo: 'enviando', alvo });
    try {
      const resposta = await api.acionarAtuador(atuador.id, alvo);
      await atualizar();
      setFase(
        resposta.ligado === alvo
          ? { tipo: 'sucesso', mensagem: `Confirmado: ${atuador.nome} agora está ${alvo ? 'ligado' : 'desligado'}.` }
          : { tipo: 'falha', mensagem: 'A API não confirmou o novo estado. Tente de novo.' },
      );
    } catch (e) {
      setFase({
        tipo: 'falha',
        mensagem: e instanceof ApiOfflineError ? 'API fora do ar. O comando não foi enviado.' : (e as Error).message,
      });
    }
  }

  return (
    <Cartao
      titulo={atuador.nome}
      icone={ICONES[atuador.tipo] ?? 'construct'}
      direita={
        <Selo
          tom={atuador.ligado ? 'ok' : 'neutro'}
          icone={atuador.ligado ? 'power' : 'power-outline'}
          texto={atuador.ligado ? 'Ligado' : 'Desligado'}
        />
      }
      style={style}
    >
      <View style={styles.bloco}>
        <Text style={styles.rotulo}>Estado confirmado</Text>
        <Text style={styles.valor}>
          {atuador.ligado ? 'Ligado' : 'Desligado'}
          <Text style={styles.apoio}> · registrado pela API às {hora(atuador.ultimaAtualizacao)}</Text>
        </Text>
      </View>

      <View style={styles.bloco}>
        <Text style={styles.rotulo}>Comando</Text>
        <Botao
          titulo={`${acao} ${atuador.tipo === 'BOMBA' ? 'bomba' : atuador.nome.toLowerCase()}`}
          variante={ligarAgora ? 'secundario' : 'primario'}
          icone={ligarAgora ? 'power-outline' : 'power'}
          carregando={enviando}
          desabilitado={offline}
          onPress={comandar}
          acessibilidadeLabel={`${acao} ${atuador.nome}`}
        />
      </View>

      <View accessibilityLiveRegion="polite" style={{ minHeight: 24 }}>
        {fase.tipo === 'enviando' ? (
          <Selo tom="info" icone="sync" texto={`Comando solicitado: ${fase.alvo ? 'ligar' : 'desligar'}. Aguardando confirmação...`} />
        ) : null}
        {fase.tipo === 'sucesso' ? <Selo tom="ok" icone="checkmark-circle" texto={fase.mensagem} /> : null}
        {fase.tipo === 'falha' ? <Selo tom="danger" icone="close-circle" texto={fase.mensagem} /> : null}
        {offline && fase.tipo === 'ocioso' ? (
          <Text style={styles.apoio}>Sem conexão: os comandos ficam indisponíveis até a API voltar.</Text>
        ) : null}
      </View>
    </Cartao>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    bloco: { marginBottom: 14, gap: 6 },
    rotulo: { color: c.muted, fontSize: 12, fontWeight: '600' },
    valor: { color: c.text, fontSize: 15, fontWeight: '700' },
    apoio: { color: c.muted, fontSize: 12, fontWeight: '400' },
  });