/** Numero no padrao brasileiro (virgula decimal), com casas fixas. */
export function num(valor: number, casas = 1): string {
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

/** Hora completa, ex.: 14:32:05 */
export function hora(data: Date | string | number): string {
  return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/** Data e hora, ex.: 12/11 14:32:05 */
export function dataHora(data: Date | string | number): string {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}