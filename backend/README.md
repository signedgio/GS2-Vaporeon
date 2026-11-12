# Vaporeon — Backend (Spring Boot)

API REST da Smart Water & Energy Station. Java 17 + Spring Boot 4 + Spring Data JPA + H2 em **modo arquivo**.

**Integrantes:**

| Nome completo | RM |
|---------------|----|
| Giovanna Carmona Roman Lopes | RM563469 |
| Ian Batinga Barbosa | RM561435 |
| Pedro Araújo dos Santos | RM563583 |

## Integrantes:
* Giovanna Carmona Roman Lopes – RM: 563469;
* Ian Batinga Barbosa – RM: 561435;
* Pedro Araújo dos Santos – RM: 563583


## Como executar

Pré-requisito: **JDK 17 ou superior** (não precisa instalar o Maven, o projeto usa o Maven Wrapper).

```powershell
cd backend
.\mvnw spring-boot:run
```

No Linux/Mac use `./mvnw spring-boot:run`.

A API sobe em **http://localhost:8080**. A documentação interativa (Swagger UI) fica em **http://localhost:8080/swagger-ui.html** e a especificação OpenAPI em http://localhost:8080/v3/api-docs.

## Banco de dados

Os dados ficam gravados no arquivo `backend/data/estacao.mv.db` (`jdbc:h2:file:./data/estacao`), então **sobrevivem a reinícios**. Na primeira execução são criados 4 atuadores padrão. Para zerar tudo, pare a aplicação e apague a pasta `backend/data/`.

## Endpoints

### Leituras — `/api/leituras`

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/leituras` | Registra uma leitura. Gera alertas automáticos se passar dos limites |
| `POST` | `/api/leituras/simular` | Gera e registra uma leitura simulada (usada na demo) |
| `GET` | `/api/leituras/ultima` | Leitura mais recente (`404` se não houver nenhuma) |
| `GET` | `/api/leituras?limite=50` | Histórico, da mais recente para a mais antiga (máx. 500) |

Corpo do `POST /api/leituras`:

```json
{ "nivelReservatorio": 72.5, "vazao": 80.0, "consumoEletrico": 3.4 }
```

Validações: `nivelReservatorio` entre 0 e 100; `vazao` e `consumoEletrico` ≥ 0; todos obrigatórios (senão `400`).

### Atuadores — `/api/atuadores`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/atuadores` | Lista atuadores e estados |
| `POST` | `/api/atuadores/{id}/acionar` | Liga/desliga um atuador (`404` se o id não existir) |

Corpo do `POST /api/atuadores/{id}/acionar`:

```json
{ "ligar": true }
```

### Falhas — `/api/falhas`

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/falhas` | Lista todas as falhas (mais recentes primeiro) |
| `GET` | `/api/falhas?resolvida=false` | Lista só as falhas abertas |
| `POST` | `/api/falhas` | Registra uma falha manualmente |
| `PATCH` | `/api/falhas/{id}/resolver` | Marca a falha como resolvida |

Corpo do `POST /api/falhas`:

```json
{ "origem": "Bomba principal", "descricao": "Ruído anormal no motor", "severidade": "ALTA" }
```

`severidade`: `BAIXA`, `MEDIA`, `ALTA` ou `CRITICA`.

### Alertas automáticos

Ao registrar uma leitura, o backend abre uma falha se:

| Condição | Severidade |
|----------|-----------|
| nível < 20% | ALTA |
| nível > 95% | MEDIA |
| vazão > 120 L/min | CRITICA |
| consumo > 5 kW | ALTA |

Os limites ficam em `application.properties` (`vaporeon.limites.*`). Não é criado alerta repetido enquanto o anterior ainda estiver aberto.

### Erros

As respostas de erro seguem o formato:

```json
{ "timestamp": "2026-11-11T10:00:00", "status": 404, "erro": "Atuador 99 nao encontrado" }
```

## Provando a persistência

```powershell
# 1. Com a API no ar, registre uma leitura
Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/leituras -ContentType "application/json" -Body '{"nivelReservatorio":15,"vazao":130,"consumoEletrico":6}'

# 2. Confira que ela e os alertas gerados existem
Invoke-RestMethod http://localhost:8080/api/leituras/ultima
Invoke-RestMethod http://localhost:8080/api/falhas

# 3. PARE a aplicação (Ctrl+C) e SUBA de novo (.\mvnw spring-boot:run)

# 4. Os mesmos dados continuam lá
Invoke-RestMethod http://localhost:8080/api/leituras/ultima
Invoke-RestMethod http://localhost:8080/api/falhas
```