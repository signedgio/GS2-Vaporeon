import type { Ionicons } from '@expo/vector-icons';
import { LIMITES } from '../config';
import { Tom } from '../theme';
import { Leitura } from '../types';
import { num } from './formato';

export type IconeNome = keyof typeof Ionicons.glyphMap;

export interface Avaliacao {
  tom: Tom;
  rotulo: string; // texto curto do selo
  detalhe: string; // frase de apoio
  icone: IconeNome;
}

// Faixas da vazao e da potencia em relacao ao limite maximo configurado
const FAIXA_ELEVADA = 0.7; // a partir de 70% do limite: elevada (informativo)
const FAIXA_PROXIMA = 0.9; // a partir de 90% do limite: proxima do limite (atencao)

// Folgas do nivel do reservatorio (pontos percentuais)
const FOLGA_MINIMO = 10;
const FOLGA_MAXIMO = 3;

/** Nivel do reservatorio: tem limite minimo e maximo. */
export function avaliarNivel(n: number): Avaliacao {
  const { nivelMinimo: min, nivelMaximo: max } = LIMITES;
  if (n < min) {
    return {
      tom: 'danger',
      rotulo: 'Abaixo do limite mínimo',
      detalhe: `Mínimo configurado: ${min}%.`,
      icone: 'arrow-down-circle',
    };
  }
  if (n > max) {
    return {
      tom: 'warn',
      rotulo: 'Acima do limite máximo',
      detalhe:
        n >= 100
          ? `Máximo configurado: ${max}%. Reservatório cheio. Não há sensor de transbordo, então não dá para confirmar extravasamento.`
          : `Máximo configurado: ${max}%.`,
      icone: 'arrow-up-circle',
    };
  }
  if (n < min + FOLGA_MINIMO) {
    return { tom: 'warn', rotulo: 'Próximo do mínimo', detalhe: `Mínimo configurado: ${min}%.`, icone: 'alert-circle' };
  }
  if (n > max - FOLGA_MAXIMO) {
    return { tom: 'warn', rotulo: 'Próximo do máximo', detalhe: `Máximo configurado: ${max}%.`, icone: 'alert-circle' };
  }
  return { tom: 'ok', rotulo: 'Dentro da faixa', detalhe: `Faixa de operação: ${min}% a ${max}%.`, icone: 'checkmark-circle' };
}

/** Vazao e potencia: so tem limite maximo, entao ha quatro situacoes. */
export function avaliarTeto(valor: number, limite: number, unidade: string, casas: number): Avaliacao {
  const razao = valor / limite;
  const pct = `${Math.round(razao * 100)}% do limite`;
  const max = `${num(limite, casas)} ${unidade}`;
  if (valor > limite) {
    return { tom: 'danger', rotulo: 'Limite excedido', detalhe: `Máximo configurado: ${max}.`, icone: 'close-circle' };
  }
  if (razao >= FAIXA_PROXIMA) {
    return { tom: 'warn', rotulo: 'Próxima do limite', detalhe: `${pct} (máximo ${max}).`, icone: 'alert-circle' };
  }
  if (razao >= FAIXA_ELEVADA) {
    return { tom: 'info', rotulo: 'Elevada', detalhe: `${pct} (máximo ${max}).`, icone: 'trending-up' };
  }
  return { tom: 'ok', rotulo: 'Normal', detalhe: `${pct} (máximo ${max}).`, icone: 'checkmark-circle' };
}

export const avaliarVazao = (v: number) => avaliarTeto(v, LIMITES.vazaoMaxima, 'L/min', 0);
export const avaliarPotencia = (v: number) => avaliarTeto(v, LIMITES.consumoMaximo, 'kW', 1);

export function avaliarLeitura(l: Leitura) {
  return {
    nivel: avaliarNivel(l.nivelReservatorio),
    vazao: avaliarVazao(l.vazao),
    potencia: avaliarPotencia(l.consumoEletrico),
  };
}

export interface VariavelAtencao {
  chave: 'nivel' | 'vazao' | 'potencia';
  nome: string;
  valor: string;
  avaliacao: Avaliacao;
}

/** Lista so as variaveis que pedem atencao (amarelo ou vermelho). "Elevada" e informativa e nao entra. */
export function variaveisEmAtencao(l: Leitura): VariavelAtencao[] {
  const a = avaliarLeitura(l);
  const todas: VariavelAtencao[] = [
    { chave: 'nivel', nome: 'Nível do reservatório', valor: `${num(l.nivelReservatorio, 1)}%`, avaliacao: a.nivel },
    { chave: 'vazao', nome: 'Vazão', valor: `${num(l.vazao, 1)} L/min`, avaliacao: a.vazao },
    { chave: 'potencia', nome: 'Potência elétrica', valor: `${num(l.consumoEletrico, 2)} kW`, avaliacao: a.potencia },
  ];
  return todas.filter((v) => v.avaliacao.tom === 'warn' || v.avaliacao.tom === 'danger');
}