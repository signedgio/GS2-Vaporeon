# Vaporeon — App Mobile (React Native + Expo)

Painel de operação da **Smart Water & Energy Station**. Mostra o nível do reservatório, a vazão, o consumo elétrico simulado e os alertas de falha, e permite ligar/desligar os atuadores. Os dados vêm da API do backend (`../backend`).

## Telas

| Tela | O que mostra |
|------|--------------|
| **Painel** | Nível do reservatório, vazão, consumo elétrico simulado, última leitura e botão "Simular leitura" |
| **Atuadores** | Lista de bombas/válvulas com chave liga/desliga |
| **Alertas** | Falhas abertas (ou todas), com severidade e botão "Marcar como resolvida" |

Os dados se atualizam sozinhos a cada 5 segundos.

## Como executar

Pré-requisitos: **Node.js 18+** e o **backend rodando** (veja `../backend/README.md`).

```powershell
cd mobile
npm install
npx expo start --web
```

O app abre no navegador em `http://localhost:8081`.

Para abrir no celular, instale o app **Expo Go**, rode `npx expo start` e escaneie o QR code. Nesse caso, em `src/config.ts`, troque `API_URL` pelo IP do computador na rede Wi-Fi (por exemplo `http://192.168.0.15:8080`). Celular e computador precisam estar na mesma rede.

## Endereço da API

Fica em `src/config.ts`:

```ts
export const API_URL = 'http://localhost:8080';
```

## Como o app trata a API fora do ar

- Toda chamada passa por `src/api.ts`, com timeout de 4 segundos. Falha de rede ou timeout vira um erro específico (`ApiOfflineError`).
- O hook `src/hooks/useApiData.ts` captura esse erro, **mantém os últimos dados na tela** e marca o estado como offline. O app nunca trava.
- Todas as telas mostram o banner vermelho **"API fora do ar"** e desabilitam os botões de ação.
- Como o hook continua tentando a cada 5 segundos, o app volta ao normal sozinho quando o backend retorna.

## Estrutura

```
mobile/
├── App.tsx                  # navegação por abas
└── src/
    ├── config.ts            # URL da API, intervalos e limites
    ├── api.ts               # chamadas HTTP + tratamento de erro
    ├── types.ts             # tipos (Leitura, Atuador, Falha)
    ├── theme.ts             # cores
    ├── hooks/useApiData.ts  # busca periódica + estado offline
    ├── utils/avisar.ts      # aviso na tela (celular e navegador)
    ├── components/          # MetricCard, TankLevel, OfflineBanner
    └── screens/             # Painel, Atuadores, Alertas
```