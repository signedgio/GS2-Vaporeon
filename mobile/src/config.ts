// ============================================================
// CONFIGURACAO DA API
// Troque o IP abaixo conforme onde o app esta rodando:
//  - Celular fisico (Expo Go): IP do PC na rede Wi-Fi, ex: http://192.168.0.15:8080
//  - Emulador Android:         http://10.0.2.2:8080
//  - Simulador iOS / Web:      http://localhost:8080
// ============================================================
export const API_URL = 'http://192.168.0.10:8080';

/** De quanto em quanto tempo o painel consulta a API (ms). */
export const POLL_INTERVAL_MS = 5000;

/** Tempo maximo de espera por uma resposta antes de considerar a API fora do ar (ms). */
export const REQUEST_TIMEOUT_MS = 4000;

/** Mesmos limites do backend (application.properties), usados para colorir o painel. */
export const LIMITES = {
  nivelMinimo: 20,
  nivelMaximo: 95,
  vazaoMaxima: 120,
  consumoMaximo: 5.0,
};