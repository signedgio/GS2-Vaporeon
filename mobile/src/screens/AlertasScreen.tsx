import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { api, ApiOfflineError } from '../api';
import { Text } from '../components/AppText';
import { Aviso } from '../components/Aviso';
import { Botao, Chip } from '../components/Botao';
import { Cartao } from '../components/Cartao';
import { Selo } from '../components/Selo';
import { useEstacao } from '../EstacaoContext';
import { useApiData } from '../hooks/useApiData';
import { useLayout } from '../hooks/useLayout';
import { useTheme } from '../ThemeContext';
import { Palette, Tom } from '../theme';
import { Falha, Severidade } from '../types';
import { IconeNome } from '../utils/estado';
import { avisar } from '../utils/avisar';
import { dataHora, num } from '../utils/formato';

const SEVERIDADE: Record<Severidade, { rotulo: string; tom: Tom; icone: IconeNome }> = {
  BAIXA: { rotulo: 'Baixa', tom: 'info', icone: 'information-circle' },
  MEDIA: { rotulo: 'Média', tom: 'warn', icone: 'alert-circle' },
  ALTA: { rotulo: 'Alta', tom: 'danger', icone: 'warning' },
  CRITICA: { rotulo: 'Crítica', tom: 'danger', icone: 'close-circle' },
};

function valorComUnidade(v: number | null | undefined, unidade: string | null | undefined): string {
  if (v === null || v === undefined) return 'Não registrada';
  const casas = unidade === 'kW' ? 2 : 1;
  return `${num(v, casas)} ${unidade ?? ''}`.trim();
}

export function AlertasScreen() {
  const { colors } = useTheme();
  const { largo } = useLayout();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { alertasAbertos, atualizar } = useEstacao();
  const [apenasAbertas, setApenasAbertas] = useState(true);
  const { data: falhas, loading, offline, error, refresh } = useApiData(() => api.falhas(apenasAbertas), [apenasAbertas]);
  const [resolvendo, setResolvendo] = useState<number | null>(null);

  async function resolver(id: number) {
    setResolvendo(id);
    try {
      await api.resolverFalha(id);
      await Promise.all([refresh(), atualizar()]);
    } catch (e) {
      avisar(
        e instanceof ApiOfflineError ? 'API fora do ar' : 'Erro',
        e instanceof ApiOfflineError ? 'Não foi possível resolver o alerta agora.' : (e as Error).message,
      );
    } finally {
      setResolvendo(null);
    }
  }

  const abertos = alertasAbertos?.length;

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[styles.conteudo, largo && styles.conteudoLargo]}
      refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
    >
      <View style={{ gap: 4 }}>
        <Text accessibilityRole="header" style={styles.titulo}>
          Alertas
        </Text>
        <Text style={styles.sub}>Cada alerta mostra a leitura que o originou, o limite configurado e quando ocorreu.</Text>
      </View>

      <View style={styles.filtros} accessibilityRole="tablist">
        <Chip rotulo={abertos !== undefined ? `Abertas (${abertos})` : 'Abertas'} ativo={apenasAbertas} onPress={() => setApenasAbertas(true)} />
        <Chip rotulo="Todas" ativo={!apenasAbertas} onPress={() => setApenasAbertas(false)} />
      </View>

      {offline ? (
        <View style={styles.offline} accessibilityRole="alert">
          <Text style={styles.offlineTexto}>
            API fora do ar. {falhas ? 'Mostrando os últimos alertas recebidos.' : 'Os alertas aparecem quando a API voltar.'}
          </Text>
        </View>
      ) : null}
      {error ? <Text style={styles.erro}>A API respondeu com erro: {error}</Text> : null}

      {loading && !falhas ? (
        <Cartao>
          <Aviso carregando titulo="Carregando alertas..." />
        </Cartao>
      ) : null}

      {falhas && falhas.length === 0 ? (
        <Cartao>
          <Aviso
            icone="checkmark-circle"
            titulo={apenasAbertas ? 'Nenhum alerta aberto' : 'Nenhum alerta registrado'}
            texto="Quando uma leitura passar de um limite, o alerta aparece aqui."
          />
        </Cartao>
      ) : null}

      <View style={styles.grade}>
        {(falhas ?? []).map((f) => (
          <CartaoAlerta key={f.id} falha={f} resolvendo={resolvendo === f.id} offline={offline} onResolver={() => resolver(f.id)} />
        ))}
      </View>
    </ScrollView>
  );
}

function CartaoAlerta({
  falha,
  resolvendo,
  offline,
  onResolver,
}: {
  falha: Falha;
  resolvendo: boolean;
  offline: boolean;
  onResolver: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const s = SEVERIDADE[falha.severidade];

  return (
    <Cartao style={[{ flexGrow: 1, flexBasis: 420, flexShrink: 1, maxWidth: '100%' }, falha.resolvida && { opacity: 0.7 }]}>
      <View style={styles.topo}>
        <Selo tom={s.tom} icone={s.icone} texto={`Severidade ${s.rotulo.toLowerCase()}`} />
        <Text style={styles.origem}>{falha.origem}</Text>
      </View>
      <Text style={styles.descricao}>{falha.descricao}</Text>

      <View style={styles.dados}>
        <View style={styles.dado}>
          <Text style={styles.dadoRotulo}>Leitura que originou</Text>
          <Text style={styles.dadoValor}>{valorComUnidade(falha.valorMedido, falha.unidade)}</Text>
        </View>
        <View style={styles.dado}>
          <Text style={styles.dadoRotulo}>Limite configurado</Text>
          <Text style={styles.dadoValor}>{valorComUnidade(falha.limite, falha.unidade)}</Text>
        </View>
        <View style={styles.dado}>
          <Text style={styles.dadoRotulo}>Ocorrido em</Text>
          <Text style={styles.dadoValor}>{dataHora(falha.dataHora)}</Text>
        </View>
      </View>

      {falha.resolvida ? (
        <Selo tom="ok" icone="checkmark-circle" texto="Resolvido" />
      ) : (
        <View style={{ alignSelf: 'flex-start' }}>
          <Botao
            titulo="Marcar como resolvido"
            icone="checkmark"
            carregando={resolvendo}
            desabilitado={offline}
            onPress={onResolver}
            acessibilidadeLabel={`Marcar como resolvido: ${falha.descricao}`}
          />
        </View>
      )}
    </Cartao>
  );
}

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    tela: { flex: 1, backgroundColor: c.background },
    conteudo: { padding: 16, paddingBottom: 40, gap: 16, width: '100%' },
    conteudoLargo: { padding: 24, maxWidth: 1400, alignSelf: 'center' },
    titulo: { fontSize: 20, fontWeight: '700', color: c.text },
    sub: { fontSize: 13, color: c.muted },
    filtros: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    grade: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'stretch' },
    offline: { borderWidth: 1, borderColor: `${c.danger}88`, backgroundColor: `${c.danger}18`, borderRadius: 12, padding: 12 },
    offlineTexto: { color: c.text, fontSize: 13 },
    erro: { color: c.danger, fontSize: 13 },
    topo: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    origem: { color: c.muted, fontSize: 12, fontWeight: '600' },
    descricao: { color: c.text, fontSize: 15, fontWeight: '600', marginVertical: 12 },
    dados: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
    dado: { flexGrow: 1, flexBasis: 110, backgroundColor: c.cardAlt, borderRadius: 10, padding: 10 },
    dadoRotulo: { color: c.muted, fontSize: 11, fontWeight: '600' },
    dadoValor: { color: c.text, fontSize: 14, fontWeight: '700', marginTop: 2, fontVariant: ['tabular-nums'] },
  });