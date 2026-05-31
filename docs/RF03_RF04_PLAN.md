## Plano: RF03 (Gestão de Bicos) & RF04 (Filtros por Raio)

Objetivo: implementar as rotas e telas para gerenciar serviços oferecidos (`Bicos`) e permitir filtros de raio de atuação.

Escopo RF03 - Gestão de Bicos (CRUD)
- Backend:
  - Rotas REST: `POST /services`, `GET /services`, `GET /services/:id`, `PUT /services/:id`, `DELETE /services/:id`.
  - Validações: título, descrição opcional, preço decimal, duração int, `subcategory_id`, `professional_id`.
  - Controllers e Services separados: `service.controller`, `service.service`.
  - Tests unitários e integração para cada endpoint.
  - Autorização: somente profissionais autenticados podem criar/editar/remover seus serviços.

- Frontend:
  - Telas: `ServiceList`, `ServiceForm` (criar/editar), `ServiceDetail`.
  - Componentes: `ServiceItem`, `ServiceFormFields`.
  - Integração com API: chamadas axios usando endpoints acima.

Escopo RF04 - Filtros por Raio de Atuação
- Backend:
  - Implementar filtros em `GET /services` aceitando `lat`, `lng`, `radius` (km) e calculando distância via fórmula Haversine ou função do DB (PostGIS opcional).
  - Ordenação por distância quando `lat/lng` fornecidos.
  - Índices geoespaciais recomendados (se Postgres + PostGIS).

- Frontend:
  - Adicionar filtros na `ServiceList`: campo de localização (usar mapa ou input de CEP), slider de raio, botão `Aplicar`.
  - Ao aplicar, enviar `lat`, `lng`, `radius` para a API e exibir resultados.
  - UX: mostrar distância em cada `ServiceItem`.

Plano de trabalho (sprint curta)
1. Backend: criar rotas básicas e modelo mínimo (2 dias).
2. Backend: adicionar filtro por raio e testes (2 dias).
3. Frontend: criar telas `ServiceList` e `ServiceForm` (2 dias).
4. Frontend: integrar filtros e testes manuais (1-2 dias).
5. Revisão de segurança (autorização) e documentação (1 dia).

Notas técnicas
- Reutilizar modelo `Service` existente (`src/models/Service.ts`).
- Reaproveitar validações e middlewares de autenticação.
- Para desenvolvimento local, usar coordenadas fixas e testar com o mapa do Google/Mapbox.

Checklist de PRs
- `feat(backend): add services CRUD` (inclui migrations/validators/tests)
- `feat(backend): add services radius filter` (documentação + performance notes)
- `feat(frontend): services list + form screens` (inclui navigation)
- `feat(frontend): radius filter UI` (unit e2e manual)

---
Crie issues/PRs por item da checklist e me avise se quer que eu gere os arquivos iniciais (rotas/controllers/screens) neste repositório agora.
