// Endereco da API (backend Spring Boot).
// Navegador no mesmo computador do backend: http://localhost:8080
// Celular (Expo Go): troque pelo IP do PC na rede Wi-Fi, ex: http://192.168.0.15:8080
export const API_URL = 'http://localhost:8080';

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