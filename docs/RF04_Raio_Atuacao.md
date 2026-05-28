# RF04 — Raio de Atuação do Profissional

> Documentação técnica completa de todos os artefatos criados e alterados para atender ao requisito funcional RF04.

---

## 1. Visão Geral do Requisito

**Objetivo:** Permitir que profissionais definam um raio de atuação em quilômetros (`service_radius_km`) a partir do seu endereço principal. Quando clientes buscam disponibilidade ou criam agendamentos, o backend utiliza a fórmula de Haversine para calcular a distância entre o cliente e o profissional — e filtra/rejeita quando a distância ultrapassa o raio configurado.

**Ator principal:** Profissional autenticado (configuração do raio) e cliente/visitante (impactado na busca e no agendamento).

---

## 2. User Stories atendidas

| ID    | Como...             | Quero...                                                                            | Para...                                          |
| ----- | ------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------ |
| US-08 | Profissional        | Definir meu raio de atuação em km                                                   | Receber apenas agendamentos de clientes próximos |
| US-09 | Profissional        | Visualizar meu raio atual                                                           | Verificar minha configuração antes de alterar    |
| US-10 | Profissional        | Atualizar meu raio junto com outras informações do perfil                           | Editar tudo em um único request                  |
| US-11 | Cliente / visitante | Ver apenas profissionais que atendem na minha localização ao buscar disponibilidade | Evitar agendar com alguém que não virá até mim   |
| US-12 | Cliente             | Ser informado claramente quando um profissional não atende na minha área            | Entender o motivo da rejeição do agendamento     |
| US-13 | Cliente             | Passar minhas coordenadas direto na criação do agendamento (sem salvar endereço)    | Agendar de forma mais simples via GPS            |

---

## 3. Banco de Dados

### 3.1 Coluna `service_radius_km` na tabela `professional`

| Coluna              | Tipo      | Nullable | Padrão | Descrição                                                  |
| ------------------- | --------- | -------- | ------ | ---------------------------------------------------------- |
| `service_radius_km` | `INTEGER` | sim      | `null` | Raio de atuação em km. `null` = sem restrição de distância |

**Migration:** `migrations/20260528100000-add-service-radius-to-professional.js`

**Script de população inicial:**

```sql
UPDATE professional SET service_radius_km = 15 WHERE service_radius_km IS NULL;
```

> Executado manualmente durante reconciliação do banco de dados de desenvolvimento. Os seeders novos já inserem `service_radius_km: 15` por padrão.

---

## 4. Migrations

| Arquivo                                                | Ação                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------ |
| `20260528100000-add-service-radius-to-professional.js` | Adiciona coluna `service_radius_km INTEGER NULL` à tabela `professional` |

Conteúdo relevante:

```javascript
up: async (queryInterface, Sequelize) => {
  await queryInterface.addColumn("professional", "service_radius_km", {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null,
  });
};
```

---

## 5. Seeders

### `seeders/005-initial-professionals.js` (alterado)

Adicionado `service_radius_km: 15` em todos os inserts de profissionais demo, garantindo que novos ambientes já tenham um raio padrão configurado.

---

## 6. Models

### `src/models/Professional.ts` (alterado)

**Interface `IProfessional` — campo adicionado:**

```typescript
service_radius_km?: number;   // Raio de atuação em km (inteiro, nullable)
```

**Definição Sequelize adicionada:**

```typescript
service_radius_km: {
  type: DataTypes.INTEGER,
  allowNull: true,
  defaultValue: null,
},
```

---

## 7. Controllers

### `src/controllers/professional.controller.ts` (alterado e estendido)

#### 7.1 `getProfessionalRadius` _(novo)_

```
GET /api/professionals/:id/radius
```

- Autenticação: obrigatória (JWT)
- Verifica que `professional.user_id === userId` do token (somente dono)
- Retorna: `{ service_radius_km: number | null }`

#### 7.2 `updateProfessionalRadius` _(novo)_

```
PUT /api/professionals/:id/radius
```

- Autenticação: obrigatória (JWT)
- Verifica ownership (somente o próprio profissional pode atualizar)
- Body: `{ service_radius_km: number }`
- Validações:
  - `service_radius_km` é obrigatório
  - Deve ser número finito `>= 0`
  - Aplica `Math.floor` (armazena apenas inteiros)
- Retorna: `{ message: "Raio atualizado", service_radius_km: number }`

#### 7.3 `updateProfessional` (já existia — atualizado)

```
PUT /api/professionals/:id
```

Aceita opcionalmente `service_radius_km` junto com `description` e `main_address_id`. Aplica as mesmas validações (finito, >= 0, `Math.floor`).

#### 7.4 `searchProfessionalAvailability` (alterado)

Lógica adicionada ao loop de resultados:

```typescript
// Se o profissional definiu raio e o cliente enviou lat/lng → filtra por distância
const profRadius = prof.service_radius_km
  ? Number(prof.service_radius_km)
  : null;
if (profRadius && hasLatLng && distance > profRadius) {
  return null; // profissional filtrado da listagem
}
```

- Calcula distância entre `prof.MainAddress` (lat/lng) e as coordenadas do cliente via Haversine.
- Ordena resultados por distância crescente quando lat/lng estão presentes.
- Corrigido bug de seleção de serviço: itera `prof.Services` e usa o primeiro com slots disponíveis (evita selecionar o serviço errado quando um profissional tem múltiplos serviços na mesma subcategoria).

---

### `src/controllers/appointment.controller.ts` (alterado)

#### `createAppointment` — aceita coordenadas diretas e valida raio

**Campos novos aceitos no body:**

- `client_lat` (float) — latitude do cliente
- `client_lng` (float) — longitude do cliente

**Lógica de coordenadas:**

```
1. Se client_lat e client_lng estiverem no body → usa diretamente
2. Senão, se address_id estiver no body → busca Address e usa lat/lng do endereço
3. Se nenhum dos dois → agendamento criado sem validação de distância
```

**Validação de raio:**

```typescript
if (
  professional.MainAddress &&
  clientLat !== null &&
  clientLng !== null &&
  professional.service_radius_km
) {
  const dist = haversine(profLat, profLng, clientLat, clientLng);
  if (dist > professional.service_radius_km) {
    return res.status(400).json({
      error:
        "O endereço do cliente está fora do raio de atuação do profissional",
    });
  }
}
```

- `address_id` deixou de ser obrigatório — o agendamento pode ser feito com `client_lat`/`client_lng` ou sem qualquer localização (quando o profissional não tem raio configurado).
- Erro HTTP 400 com mensagem clara quando fora do raio.

---

## 8. Fórmula de Distância (Haversine)

Implementada inline em `appointment.controller.ts` e em `professional.controller.ts`:

$$
d = 2R \cdot \arctan2\left(\sqrt{a}, \sqrt{1-a}\right)
$$

onde:

$$
a = \sin^2\!\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\!\left(\frac{\Delta\lambda}{2}\right)
$$

- $R = 6371$ km (raio médio da Terra)
- $\phi$ = latitude em radianos
- $\lambda$ = longitude em radianos

**Resultado:** distância em km entre dois pontos geográficos.

---

## 9. Routes

### `src/routes/professional.routes.ts` (alterado)

Rotas adicionadas:

| Método | Caminho       | Middleware       | Handler                    | Descrição                                    |
| ------ | ------------- | ---------------- | -------------------------- | -------------------------------------------- |
| `GET`  | `/:id/radius` | `authMiddleware` | `getProfessionalRadius`    | Retorna `service_radius_km` do profissional  |
| `PUT`  | `/:id/radius` | `authMiddleware` | `updateProfessionalRadius` | Atualiza `service_radius_km` (somente dono)  |
| `PUT`  | `/:id`        | `authMiddleware` | `updateProfessional`       | Atualiza perfil (inclui `service_radius_km`) |

Imports adicionados no arquivo:

```typescript
import {
  // ...existentes...
  getProfessionalRadius,
  updateProfessionalRadius,
} from "../controllers/professional.controller";
```

---

## 10. Tabela de Endpoints — RF04

| Método | Endpoint                                 | Auth | Body / Query                                                                                                  | Resposta principal                                             |
| ------ | ---------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `GET`  | `/api/professionals/:id/radius`          | Sim  | —                                                                                                             | `{ service_radius_km: 15 }`                                    |
| `PUT`  | `/api/professionals/:id/radius`          | Sim  | `{ service_radius_km: 20 }`                                                                                   | `{ message: "Raio atualizado", service_radius_km: 20 }`        |
| `PUT`  | `/api/professionals/:id`                 | Sim  | `{ service_radius_km: 20, description: "..." }`                                                               | Profissional completo atualizado                               |
| `GET`  | `/api/professionals/search-availability` | Não  | `subCategoryId`, `date`, `lat`, `lng` (opcionais)                                                             | Lista de profissionais dentro do raio, ordenados por distância |
| `POST` | `/api/appointments`                      | Sim  | `service_id`, `professional_id`, `start_time`, `end_time` + (`address_id` **ou** `client_lat` + `client_lng`) | 201 Agendamento criado / 400 fora do raio                      |

---

## 11. Comportamentos por Cenário

| Cenário                                                               | Comportamento do backend                                    |
| --------------------------------------------------------------------- | ----------------------------------------------------------- |
| Profissional sem `service_radius_km` (null)                           | Sem filtro de distância — aparece para todos os clientes    |
| Cliente busca sem `lat`/`lng`                                         | Sem filtro de distância — todos os profissionais aparecem   |
| Cliente busca com `lat`/`lng` dentro do raio do profissional          | Profissional aparece na listagem                            |
| Cliente busca com `lat`/`lng` fora do raio do profissional            | Profissional é removido da listagem (retorna `null` no map) |
| Cliente cria agendamento com `client_lat`/`client_lng` dentro do raio | Agendamento criado normalmente                              |
| Cliente cria agendamento com `client_lat`/`client_lng` fora do raio   | HTTP 400 com mensagem explicativa                           |
| Cliente cria agendamento com `address_id` — endereço dentro do raio   | Agendamento criado normalmente                              |
| Cliente cria agendamento com `address_id` — endereço fora do raio     | HTTP 400 com mensagem explicativa                           |
| Cliente cria agendamento sem localização alguma                       | Agendamento criado (sem validação de raio)                  |

---

## 12. Validações e Regras de Negócio

- `service_radius_km` deve ser um número finito `>= 0`.
- O backend aplica `Math.floor` antes de salvar — valores fracionados (ex.: `0.5`) são truncados para `0`. Para suportar frações, alterar o tipo para `FLOAT` no model e migration.
- Ownership: somente o profissional cujo `user_id` bate com o token pode alterar seu raio.
- A distância é calculada sempre a partir do `MainAddress` do profissional (`professional.main_address_id`).
- Se o profissional não tem `MainAddress` cadastrado, a validação de raio é ignorada (sem erro).

---

## 13. Exemplos de Requisição

### Atualizar raio (endpoint dedicado)

```http
PUT /api/professionals/6/radius
Authorization: Bearer <token>
Content-Type: application/json

{ "service_radius_km": 20 }
```

**Resposta 200:**

```json
{ "message": "Raio atualizado", "service_radius_km": 20 }
```

### Buscar profissionais disponíveis por localização

```http
GET /api/professionals/search-availability?subCategoryId=6&date=2026-06-02&lat=-23.5178&lng=-47.4732
```

Profissionais com `service_radius_km` menor que a distância calculada são excluídos do resultado. Os demais são ordenados por distância crescente.

### Criar agendamento com coordenadas diretas (sem address_id)

```http
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "service_id": 6,
  "professional_id": 6,
  "start_time": "2026-06-02T09:00:00Z",
  "end_time": "2026-06-02T10:00:00Z",
  "client_lat": -23.5178,
  "client_lng": -47.4732
}
```

**Resposta 400 (fora do raio):**

```json
{
  "error": "O endereço do cliente está fora do raio de atuação do profissional"
}
```

---

## 14. Erros e Códigos HTTP

| HTTP | Situação                                                            |
| ---- | ------------------------------------------------------------------- |
| 400  | `service_radius_km` ausente, negativo, ou não numérico ao atualizar |
| 400  | `client_lat`/`client_lng` inválidos (NaN, infinito)                 |
| 400  | Cliente fora do raio do profissional ao criar agendamento           |
| 401  | Token ausente ou inválido                                           |
| 403  | Tentativa de atualizar o raio de outro profissional                 |
| 404  | Profissional não encontrado                                         |

---

## 15. Considerações de Evolução

- **Suporte a frações de km:** alterar `service_radius_km` de `INTEGER` para `FLOAT/DECIMAL(6,2)` no model, migration e remover `Math.floor` nos controllers.
- **Raio padrão global:** criar variável de ambiente `DEFAULT_SERVICE_RADIUS_KM` para profissionais sem raio definido, em vez de ignorar o filtro.
- **Exibir raio no card do profissional:** adicionar `service_radius_km` ao retorno de `GET /api/professionals/:id` para o frontend exibir no perfil público.
- **Cálculo de distância centralizado:** extrair a função Haversine para `src/utils/geo.utils.ts` e reaproveitar nos dois controllers.
