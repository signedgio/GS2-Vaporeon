export interface Leitura {
  id: number;
  nivelReservatorio: number;
  vazao: number;
  consumoEletrico: number;
  dataHora: string;
}

export interface Atuador {
  id: number;
  nome: string;
  tipo: string;
  ligado: boolean;
  ultimaAtualizacao: string;
}

export type Severidade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface Falha {
  id: number;
  origem: string;
  descricao: string;
  severidade: Severidade;
  resolvida: boolean;
  dataHora: string;
}