import { useRef, useState } from 'react';
import { PanResponder, Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../ThemeContext';
import { corDoTom, Tom } from '../theme';
import { Avaliacao } from '../utils/estado';
import { dataHora } from '../utils/formato';
import { Text } from './AppText';

export interface Ponto {
  t: number; // instante em ms
  v: number;
}

export interface Limite {
  valor: number;
  rotulo: string;
  tom: Tom;
}

interface Props {
  pontos: Ponto[]; // em ordem cronologica
  dominioY: [number, number];
  limites: Limite[];
  formatarValor: (v: number) => string; // ja com unidade
  avaliar: (v: number) => Avaliacao;
  fora: (v: number) => boolean; // passou de um limite?
  selecionado: number | null;
  onSelecionar: (i: number | null) => void;
  descricao: string; // texto para leitores de tela
  altura?: number;
}

const M = { l: 46, r: 12, t: 12, b: 28 };
const TOOLTIP_L = 168;

function rotuloTempo(t: number, span: number): string {
  const d = new Date(t);
  if (span <= 10 * 60 * 1000) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  if (span <= 24 * 60 * 60 * 1000) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

/** Grafico de linha com eixos, grade, linhas de limite e tooltip (passe o mouse ou toque no grafico). */
export function GraficoLinha({
  pontos,
  dominioY,
  limites,
  formatarValor,
  avaliar,
  fora,
  selecionado,
  onSelecionar,
  descricao,
  altura = 240,
}: Props) {
  const { colors } = useTheme();
  const [largura, setLargura] = useState(0);

  const w = Math.max(0, largura - M.l - M.r);
  const h = altura - M.t - M.b;
  const [y0, y1] = dominioY;

  // Com uma unica leitura, abre uma janela de 1 min em volta dela
  let tMin = pontos[0].t;
  let tMax = pontos[pontos.length - 1].t;
  if (tMax - tMin < 1000) {
    tMin -= 30000;
    tMax += 30000;
  }
  const span = tMax - tMin;
  const x = (t: number) => M.l + ((t - tMin) / span) * w;
  const y = (v: number) => M.t + h - ((v - y0) / (y1 - y0)) * h;

  const linha = pontos.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const area = `${linha} L${x(pontos[pontos.length - 1].t).toFixed(1)},${y(y0).toFixed(1)} L${x(pontos[0].t).toFixed(1)},${y(y0).toFixed(1)} Z`;

  const ticksY = [0, 1, 2, 3, 4].map((i) => y0 + ((y1 - y0) * i) / 4);
  const ticksX = [0, 1, 2, 3].map((i) => tMin + (span * i) / 3);

  // Escolhe a leitura mais proxima da posicao do mouse/toque
  const escolher = (px: number) => {
    let melhor = 0;
    let menor = Infinity;
    pontos.forEach((p, i) => {
      const d = Math.abs(x(p.t) - px);
      if (d < menor) {
        menor = d;
        melhor = i;
      }
    });
    onSelecionar(melhor);
  };
  const escolherRef = useRef(escolher);
  escolherRef.current = escolher;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => escolherRef.current(e.nativeEvent.locationX),
      onPanResponderMove: (e) => escolherRef.current(e.nativeEvent.locationX),
    }),
  ).current;

  // No navegador, o simples passar do mouse ja mostra o tooltip
  const hover =
    Platform.OS === 'web'
      ? ({
          onMouseMove: (e: { nativeEvent: { offsetX: number } }) => escolherRef.current(e.nativeEvent.offsetX),
          onMouseLeave: () => onSelecionar(null),
        } as object)
      : {};

  const sel = selecionado !== null && selecionado < pontos.length ? pontos[selecionado] : null;
  const av = sel ? avaliar(sel.v) : null;
  const tooltipEsq = sel ? Math.max(4, Math.min(largura - TOOLTIP_L - 4, x(sel.t) - TOOLTIP_L / 2)) : 0;
  const mostrarPontos = pontos.length <= 60;
  const fonte = 'Poppins_500Medium';

  return (
    <View
      style={{ height: altura }}
      onLayout={(e) => setLargura(e.nativeEvent.layout.width)}
      accessible
      accessibilityRole="image"
      accessibilityLabel={descricao}
    >
      {largura > 0 ? (
        <>
          <Svg width={largura} height={altura}>
            {ticksY.map((v) => (
              <Line key={`gy${v}`} x1={M.l} x2={M.l + w} y1={y(v)} y2={y(v)} stroke={colors.border} strokeWidth={1} opacity={0.7} />
            ))}
            {ticksY.map((v) => (
              <SvgText key={`ty${v}`} x={M.l - 8} y={y(v) + 4} fontSize={11} fontFamily={fonte} fill={colors.muted} textAnchor="end">
                {Number.isInteger(v) ? v : v.toFixed(1).replace('.', ',')}
              </SvgText>
            ))}
            {ticksX.map((t, i) => (
              <SvgText
                key={`tx${i}`}
                x={x(t)}
                y={altura - 8}
                fontSize={11}
                fontFamily={fonte}
                fill={colors.muted}
                textAnchor={i === 0 ? 'start' : i === ticksX.length - 1 ? 'end' : 'middle'}
              >
                {rotuloTempo(t, span)}
              </SvgText>
            ))}

            <Path d={area} fill={colors.primary} opacity={0.12} />

            {limites.map((l) => {
              const cor = corDoTom(colors, l.tom);
              return (
                <G key={l.rotulo}>
                  <Line x1={M.l} x2={M.l + w} y1={y(l.valor)} y2={y(l.valor)} stroke={cor} strokeWidth={1.5} strokeDasharray="6 4" />
                  <SvgText x={M.l + 4} y={y(l.valor) - 5} fontSize={11} fontFamily="Poppins_600SemiBold" fill={cor} textAnchor="start">
                    {l.rotulo}
                  </SvgText>
                </G>
              );
            })}

            <Path d={linha} fill="none" stroke={colors.primary} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

            {mostrarPontos
              ? pontos.map((p, i) => (
                  <Circle
                    key={i}
                    cx={x(p.t)}
                    cy={y(p.v)}
                    r={fora(p.v) ? 4.5 : 3.5}
                    fill={fora(p.v) ? colors.danger : colors.primary}
                    stroke={colors.card}
                    strokeWidth={1.5}
                  />
                ))
              : null}

            {sel ? (
              <>
                <Line x1={x(sel.t)} x2={x(sel.t)} y1={M.t} y2={M.t + h} stroke={colors.text} strokeWidth={1} opacity={0.5} />
                <Circle cx={x(sel.t)} cy={y(sel.v)} r={6} fill={fora(sel.v) ? colors.danger : colors.primary} stroke={colors.text} strokeWidth={2} />
              </>
            ) : null}
          </Svg>

          {sel && av ? (
            <View
              pointerEvents="none"
              style={[styles.tooltip, { left: tooltipEsq, width: TOOLTIP_L, backgroundColor: colors.cardAlt, borderColor: colors.border }]}
            >
              <Text style={[styles.tooltipHora, { color: colors.muted }]}>{dataHora(sel.t)}</Text>
              <Text style={[styles.tooltipValor, { color: colors.text }]}>{formatarValor(sel.v)}</Text>
              <Text style={[styles.tooltipEstado, { color: corDoTom(colors, av.tom) }]}>{av.rotulo}</Text>
            </View>
          ) : null}

          <View {...pan.panHandlers} {...hover} style={[StyleSheet.absoluteFill, Platform.OS === 'web' && ({ cursor: 'crosshair' } as object)]} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: { position: 'absolute', top: 4, borderRadius: 10, borderWidth: 1, paddingVertical: 6, paddingHorizontal: 10 },
  tooltipHora: { fontSize: 11 },
  tooltipValor: { fontSize: 15, fontWeight: '700' },
  tooltipEstado: { fontSize: 12, fontWeight: '600' },
});