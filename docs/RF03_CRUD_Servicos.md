# RF03 — CRUD de Serviços com Disponibilidade por Dia da Semana

> Documentação técnica completa de todos os artefatos criados e alterados para atender ao requisito funcional RF03.

---

## 1. Visão Geral do Requisito

**Objetivo:** Permitir que profissionais cadastrados criem, visualizem, editem e desativem serviços. Cada serviço pode ter janelas de disponibilidade configuradas por dia da semana (ex.: segunda das 09:00 às 12:00). Clientes e visitantes podem buscar serviços ativos publicamente com filtros por categoria, subcategoria, dia e texto.

**Ator principal:** Profissional autenticado (criação/edição/exclusão) e usuário público (leitura/busca).

---

## 2. User Stories atendidas

| ID    | Como...             | Quero...                                                        | Para...                                               |
| ----- | ------------------- | --------------------------------------------------------------- | ----------------------------------------------------- |
| US-01 | Profissional        | Criar um serviço com título, descrição, preço e disponibilidade | Que clientes possam me encontrar e agendar            |
| US-02 | Profissional        | Editar qualquer campo do serviço, inclusive disponibilidade     | Manter meus dados atualizados                         |
| US-03 | Profissional        | Desativar (soft-delete) um serviço                              | Retirar da listagem pública sem perder histórico      |
| US-04 | Profissional        | Listar meus serviços (ativos e inativos)                        | Gerenciar meu portfólio                               |
| US-05 | Cliente / visitante | Buscar serviços por categoria, subcategoria, dia e texto        | Encontrar o profissional certo para minha necessidade |
| US-06 | Cliente / visitante | Visualizar os detalhes de um serviço específico                 | Obter informações antes de agendar                    |
| US-07 | Cliente (realtime)  | Ser notificado quando um novo serviço for criado (SSE)          | Receber atualizações em tempo real no app             |

---

## 3. Banco de Dados

### 3.1 Tabela `service` (pré-existente, com adições)

Campos adicionados via migration neste RF:

| Coluna        | Tipo         | Nullable | Descrição                                         | Migration                                      |
| ------------- | ------------ | -------- | ------------------------------------------------- | ---------------------------------------------- |
| `date`        | `DATEONLY`   | sim      | Data de vigência/disponibilidade do serviço       | `20260526140000-add-date-to-service.js`        |
| `price_cents` | `INTEGER`    | sim      | Preço em centavos (tem precedência sobre `price`) | `20260526150000-add-price-cents-to-service.js` |
| `category_id` | `INTEGER FK` | sim      | Referência à categoria raiz (FK → `category.id`)  | `20260527100001-add-category-id-to-service.js` |

### 3.2 Tabela `service_availability` (nova)

Criada pela migration `20260527100000-create-service-availability.js`.

| Coluna        | Tipo         | Nullable | Descrição                                  |
| ------------- | ------------ | -------- | ------------------------------------------ |
| `id`          | `INTEGER PK` | não      | Auto-incremento                            |
| `service_id`  | `INTEGER FK` | não      | Referência a `service.id` (CASCADE delete) |
| `day_of_week` | `SMALLINT`   | não      | 0=Domingo, 1=Segunda, …, 6=Sábado          |
| `start_time`  | `TIME`       | não      | Horário de início (HH:MM:SS)               |
| `end_time`    | `TIME`       | não      | Horário de término (HH:MM:SS)              |
| `created_at`  | `TIMESTAMP`  | não      | Gerado automaticamente                     |
| `updated_at`  | `TIMESTAMP`  | não      | Gerado automaticamente                     |

**Índices criados:**

- `idx_service_availability_service` → `(service_id)`
- `idx_service_availability_service_day` → `(service_id, day_of_week)`

---

## 4. Migrations

| Arquivo                                         | Ação                                                                                               |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `20260526140000-add-date-to-service.js`         | Adiciona coluna `date` (DATEONLY) à tabela `service`                                               |
| `20260526150000-add-price-cents-to-service.js`  | Adiciona coluna `price_cents` (INTEGER) à tabela `service`                                         |
| `20260527100000-create-service-availability.js` | Cria tabela `service_availability` com FK e índices                                                |
| `20260527100001-add-category-id-to-service.js`  | Adiciona coluna `category_id` (FK → `category`) à tabela `service` e índice `idx_service_category` |

---

## 5. Seeders

| Arquivo                                            | Descrição                                                                                                                                                                                                           |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `007-initial-reformas-services.js`                 | Insere 7 serviços predefinidos (um por profissional, baseados na subcategoria "Reformas & Reparos"). Verificação de duplicatas por `(professional_id, title)` para idempotência                                     |
| `20260527200000-initial-service-availabilities.js` | Popula `service_availability` para os 7 serviços do seeder 007. Cada serviço recebe padrão de disponibilidade variado (turnos manhã/tarde, dias úteis, finais de semana) para cenários de desenvolvimento realistas |

---

## 6. Models

### `src/models/Service.ts`

Interface `IService`:

```typescript
{
  id?: number;
  title: string;
  description?: string;
  price: number;
  price_cents?: number;   // Adicionado no RF03
  duration: number;
  date?: Date;            // Adicionado no RF03
  banner_uri?: string;
  active?: boolean;
  category_id?: number;   // Adicionado no RF03
  subcategory_id: number;
  professional_id: number;
}
```

### `src/models/ServiceAvailability.ts` _(novo)_

Interface `IServiceAvailability`:

```typescript
{
  id?: number;
  service_id: number;
  day_of_week: number;   // 0 = Domingo, 6 = Sábado
  start_time: string;    // HH:MM ou HH:MM:SS
  end_time: string;      // HH:MM ou HH:MM:SS
}
```

Configuração Sequelize: `tableName: "service_availability"`, `underscored: true`, `timestamps: true`, com índices `idx_service_availability_service` e `idx_service_availability_service_day`.

### `src/models/associations.ts`

Associações adicionadas:

- `ServiceModel.hasMany(ServiceAvailabilityModel, { as: "Availabilities", foreignKey: "service_id" })`
- `ServiceAvailabilityModel.belongsTo(ServiceModel, { foreignKey: "service_id" })`
- `ServiceModel.belongsTo(ProfessionalModel, { as: "Professional", foreignKey: "professional_id" })`
- `ServiceModel.belongsTo(SubCategoryModel, { as: "Subcategory", foreignKey: "subcategory_id" })`

---

## 7. Utils

### `src/utils/serviceAvailability.utils.ts` _(novo)_

Funções exportadas:

| Função                                               | Descrição                                                                                                                                                                                                       |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `timeToMinutes(time: string): number`                | Converte string `"HH:MM"` ou `"HH:MM:SS"` para minutos desde meia-noite                                                                                                                                         |
| `validateAvailabilities(items): AvailabilityError[]` | Valida array de disponibilidades. Checa: tipo objeto, `day` ∈ [0..6], formato `HH:MM` para `start`/`end`, `start < end`, e ausência de sobreposição no mesmo dia. Retorna lista de erros com índice e mensagem. |

Tipos:

- `AvailabilityInput { day: number; start: string; end: string; }`
- `AvailabilityError { index: number; message: string; }`

### `src/utils/sse.ts` _(novo)_

Sistema de Server-Sent Events genérico por canal.

| Função/Export                        | Descrição                                                                                      |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `addSSEClient(channel, res)`         | Registra cliente SSE em um canal; retorna objeto `SSEClient { id, res }`                       |
| `removeSSEClient(channel, clientId)` | Remove cliente ao fechar conexão                                                               |
| `emitSSE(channel, event, data)`      | Envia evento para todos os clientes conectados no canal                                        |
| `sseHandler(channel)`                | Middleware Express: configura headers `text/event-stream`, heartbeat de 25s, limpeza ao fechar |

Usado em: criação de serviço emite `emitSSE("services", "new_service", {...})`.

---

## 8. Middlewares

### `src/middlewares/service.validation.ts` _(novo)_

| Função                          | Quando usada                                   | Validações                                                                                                                                                                                                                         |
| ------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `validateCreateService`         | Rota legada `POST /professionals/:id/services` | `title` obrigatório, `duration` inteiro > 0, `price` ou `price_cents` >= 0, `subcategory_id` obrigatório                                                                                                                           |
| `validateCreateServiceTopLevel` | Rota principal `POST /services`                | Tudo acima + `description` obrigatória, `category_id` obrigatório, validação completa de `availabilities[]` via `validateAvailabilities()`                                                                                         |
| `validateUpdateService`         | `PUT /services/:id`                            | Cada campo é opcional; valida `title` (string não vazia), `duration` (inteiro > 0), `price` (>= 0), `price_cents` (inteiro >= 0), `category_id`/`subcategory_id` (inteiros > 0), `availabilities[]` via `validateAvailabilities()` |

---

## 9. Controllers

### `src/controllers/service.controller.ts` _(novo)_

| Handler             | Método | Rota                                          | Auth | Descrição                                                                                                                                                                                                                     |
| ------------------- | ------ | --------------------------------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `listAllServices`   | GET    | `/api/services`                               | Não  | Lista serviços ativos públicos com filtros: `category_id`, `subcategory_id`, `q` (LIKE título), `day` (0–6, join por disponibilidade). Paginado (`page`, `limit`). Retorna `{ total, page, limit, data[] }`                   |
| `listMyServices`    | GET    | `/api/services/my`                            | Sim  | Lista todos os serviços (ativos e inativos) do profissional autenticado. Identifica o profissional pelo token JWT. Paginado.                                                                                                  |
| `getService`        | GET    | `/api/services/:id`                           | Não  | Retorna serviço único com `Subcategory`, `Professional` (incluindo `User` e `MainAddress`) e `Availabilities[]` normalizadas para `HH:MM`                                                                                     |
| `createServiceSelf` | POST   | `/api/services`                               | Sim  | Cria serviço para o profissional do token. Rate-limit em memória de 10s por profissional. Aceita `availabilities[]` na mesma transação. Emite evento SSE `new_service`. Valida que `subcategory_id` pertence à `category_id`. |
| `createService`     | POST   | `/api/professionals/:professionalId/services` | Sim  | Rota legada. Cria serviço vinculado ao `professionalId` da URL. Verifica ownership via token.                                                                                                                                 |
| `updateService`     | PUT    | `/api/services/:id`                           | Sim  | Atualiza campos do serviço (qualquer subconjunto). Se `availabilities[]` presente, **substitui** todas as disponibilidades existentes. Verifica ownership via token. Sincroniza `price` ↔ `price_cents`.                      |
| `listServices`      | GET    | `/api/professionals/:professionalId/services` | Não  | Lista serviços ativos de um profissional específico com paginação e `Availabilities[]`. (Rota legada.)                                                                                                                        |
| `deleteService`     | DELETE | `/api/services/:id`                           | Sim  | Soft-delete: seta `active = false`. Verifica ownership. Retorna HTTP 204.                                                                                                                                                     |

**Helpers internos:**

- `normalizeTime(t)` — normaliza `"HH:MM:SS"` para `"HH:MM"`
- `normalizeAvailabilities(avs[])` — aplica `normalizeTime` a todos os horários
- `findServiceWithOwnership(serviceId, userId, res)` — busca serviço e valida que o `user_id` do profissional bate com o token; responde 403/404 automaticamente se não bater
- `DEFAULT_SERVICE_INCLUDE` — `include[]` reutilizável com Subcategory, Professional (User + MainAddress) e Availabilities

---

## 10. Routes

### `src/routes/service.routes.ts` _(novo)_

Base: `/api/services`

| Método   | Caminho   | Middleware(s)                                     | Handler                  |
| -------- | --------- | ------------------------------------------------- | ------------------------ |
| `GET`    | `/`       | —                                                 | `listAllServices`        |
| `GET`    | `/events` | —                                                 | `sseHandler("services")` |
| `GET`    | `/my`     | `authMiddleware`                                  | `listMyServices`         |
| `POST`   | `/`       | `authMiddleware`, `validateCreateServiceTopLevel` | `createServiceSelf`      |
| `GET`    | `/:id`    | —                                                 | `getService`             |
| `PUT`    | `/:id`    | `authMiddleware`, `validateUpdateService`         | `updateService`          |
| `DELETE` | `/:id`    | `authMiddleware`                                  | `deleteService`          |

### `src/routes/professionalService.routes.ts` _(ajustado)_

Base: `/api/professionals/:professionalId/services` (rota legada)

| Método | Caminho | Middleware(s)                             | Handler         |
| ------ | ------- | ----------------------------------------- | --------------- |
| `GET`  | `/`     | —                                         | `listServices`  |
| `POST` | `/`     | `authMiddleware`, `validateCreateService` | `createService` |

Registrado em `server.ts` via `professionalRoutes` (sub-rota).

---

## 11. SSE — Endpoint de eventos em tempo real

**`GET /api/services/events`**

- Protocolo: Server-Sent Events (`text/event-stream`)
- Eventos emitidos:
  - `connected` — emitido ao conectar (`{"status":"ok"}`)
  - `new_service` — emitido ao criar um serviço (`{ id, title, price, category_id, subcategory_id, professional_id }`)
  - `: heartbeat` — comentário enviado a cada 25s para manter conexão viva

**Uso no cliente (browser/React Native):**

```javascript
const es = new EventSource("http://localhost:3000/api/services/events");
es.addEventListener("new_service", (e) => {
  const service = JSON.parse(e.data);
  console.log("Novo serviço:", service);
});
```

---

## 12. Testes automatizados

### `src/utils/__tests__/serviceAvailability.test.ts` _(novo)_

Cobre a função `validateAvailabilities()`:

| Caso de teste                                 | Resultado esperado             |
| --------------------------------------------- | ------------------------------ |
| Lista vazia                                   | `[]` (sem erros)               |
| Entradas válidas sem sobreposição             | `[]`                           |
| Dois intervalos no mesmo dia sem sobreposição | `[]`                           |
| `day` fora de [0..6]                          | erro no índice correspondente  |
| `start` em formato inválido (`"9:00"`)        | erro sobre `start`             |
| `end` em formato inválido                     | erro sobre `end`               |
| `start >= end` (invertido)                    | erro "start deve ser anterior" |
| `start == end`                                | erro                           |
| Dois intervalos no mesmo dia com sobreposição | erro de sobreposição           |

Executar: `npm test` ou `npx jest src/utils/__tests__/serviceAvailability.test.ts`

---

## 13. Registro em `server.ts`

```typescript
import serviceRoutes from "./src/routes/service.routes";
// ...
app.use("/api/services", serviceRoutes);
```

---

## 14. Exemplos de Requisição

### Criar serviço (profissional autenticado)

```http
POST /api/services
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Limpeza residencial",
  "description": "Limpeza completa com produtos incluídos",
  "price": 120.50,
  "category_id": 1,
  "subcategory_id": 3,
  "duration": 90,
  "availabilities": [
    { "day": 1, "start": "09:00", "end": "12:00" },
    { "day": 3, "start": "14:00", "end": "18:00" }
  ]
}
```

**Resposta 201:**

```json
{
  "service": {
    "id": 7,
    "title": "Limpeza residencial",
    "price": 120.5,
    "price_cents": 12050,
    "duration": 90,
    "active": true,
    "category_id": 1,
    "subcategory_id": 3,
    "professional_id": 6,
    "Availabilities": [
      { "id": 1, "day_of_week": 1, "start_time": "09:00", "end_time": "12:00" },
      { "id": 2, "day_of_week": 3, "start_time": "14:00", "end_time": "18:00" }
    ],
    "Professional": {
      "id": 6,
      "User": { "name": "Iago Silva", "avatar_uri": "..." },
      "MainAddress": { "city": "Sorocaba", "state": "SP" }
    },
    "Subcategory": { "id": 3, "title": "Limpeza", "category_id": 1 }
  }
}
```

### Buscar serviços públicos

```http
GET /api/services?subcategory_id=3&day=1&page=1&limit=20
```

### Atualizar serviço (substitui disponibilidades)

```http
PUT /api/services/7
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 130.00,
  "availabilities": [
    { "day": 2, "start": "08:00", "end": "17:00" }
  ]
}
```

### Desativar serviço

```http
DELETE /api/services/7
Authorization: Bearer <token>
```

→ HTTP 204 No Content

---

## 15. Erros e Códigos HTTP

| HTTP | Situação                                                                           |
| ---- | ---------------------------------------------------------------------------------- |
| 400  | Campo obrigatório ausente, `price` inválido, disponibilidade inválida/sobreposição |
| 401  | Token ausente ou inválido                                                          |
| 403  | Token pertence a outro profissional (tentativa de editar serviço alheio)           |
| 404  | Serviço não encontrado                                                             |
| 429  | Rate-limit de criação: menos de 10s desde a última criação pelo mesmo profissional |
| 500  | Erro interno do servidor                                                           |
