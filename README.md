# Vaporeon — Smart Water & Energy Station

Painel de operação de uma estação inteligente de água e energia, desenvolvido para a **Global Solution 2** das disciplinas **Advanced Programming and Mobile DEV** e **Técnicas Avançadas de Programação**.

## Integrantes:
* Giovanna Carmona Roman Lopes – RM: 563469;
* Ian Batinga Barbosa – RM: 561435;
* Pedro Araújo dos Santos – RM: 563583

## Sistema:
O sistema é dividido em duas partes:

| Pasta | O que é | Tecnologia |
|-------|---------|------------|
| [`backend/`](backend) | API REST que registra leituras, aciona atuadores e lista falhas | Java 17 · Spring Boot · H2 (modo arquivo) |
| [`mobile/`](mobile) | App com o painel de operação da estação | React Native (Expo) · TypeScript |

## O que o painel mostra:
1. **Níveis** do reservatório (%);
2. **Vazão** da água (L/min);
3. **Consumo elétrico simulado** (kW);
4. **Alertas de falha** (gerados automaticamente quando uma leitura passa dos limites, ou registrados manualmente);
5. **Atuadores** (bomba, válvulas, inversor) que podem ser ligados/desligados pelo app.

Se a API ficar fora do ar, o app não trava: exibe o aviso "API fora do ar", mantém os últimos dados na tela e reconecta sozinho quando o servidor volta.


