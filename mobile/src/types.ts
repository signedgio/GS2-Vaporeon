export interface Leitura {
  id: number;
  nivelReservatorio: number;
  vazao: number;
  consumoEletrico: number; // potencia instantanea em kW (simulada)
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
  // Preenchidos nos alertas automaticos. Ficam vazios em alertas antigos ou manuais.
  valorMedido?: number | null;
  limite?: number | null;
  unidade?: string | null;
}