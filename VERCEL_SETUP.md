Configuração para deployment na Vercel

Objetivo
- Hospedar o frontend (páginas estáticas) na Vercel e receber leituras dos ESP32 via uma API serverless (`/api/sensor-data`).

Resumo da arquitetura proposta
- Frontend (souce deste repositório) hospedado na Vercel.
- ESP32 envia leituras via HTTP POST para `https://<seu-app>.vercel.app/api/sensor-data`.
- A função serverless usa Upstash Redis (serviço compatível com ambiente serverless) para armazenar as últimas leituras.
- O frontend faz GET em `/api/sensor-data?limit=10` para obter leituras recentes e atualiza as dashboards.

Passos para configurar (Vercel + Upstash)
1. Criar conta no Upstash (https://upstash.com/) e criar uma instância Redis gratuita.
   - Anote a "REST URL" e o "Token" (REST) fornecidos.

2. Criar projeto na Vercel apontando para este repositório.

3. Definir variáveis de ambiente no dashboard da Vercel (Project -> Settings -> Environment Variables):
   - `UPSTASH_REDIS_REST_URL` = (REST URL da sua instância Upstash)
   - `UPSTASH_REDIS_REST_TOKEN` = (REST token)

4. Deploy na Vercel (automatico via GitHub ou manual via `vercel` CLI).

5. Configurar ESP32 (firmware) para enviar POST para:
   - `https://<seu-app>.vercel.app/api/sensor-data`
   - Exemplo de payload JSON: `{ "deviceId": "ESP32-001", "value": 123, "timestamp": "2026-03-25T..." }`

6. No frontend (browser), obter leituras:
   - GET `https://<seu-app>.vercel.app/api/sensor-data?limit=10`
   - Use o evento `esp32:leitura` (se estiver usando polling local) ou polle a API para atualizar o dashboard.

Notas importantes
- Serverless é stateless: por isso usamos Upstash Redis para armazenar leituras de forma persistente.
- Se desejar push em tempo real para muitos clientes, recomendo usar um serviço de WebSocket (p.ex. Pusher, Ably) ou implementar SSE com um backend persistente.
- Alternativa (sem Upstash): usar um serviço externo (Firebase, Supabase) para armazenar leituras e assinar mudanças.

Testes locais
- Você pode testar a função localmente com `vercel dev` (requer vercel CLI instalado) e definindo as variáveis de ambiente localmente (arquivo `.env` ou `vercel env add`).

Exemplos de comandos locais
```powershell
# instalar vercel CLI se desejar
npm i -g vercel
# rodar localmente (irá emular serverless functions e frontend)
vercel dev
```

Se precisar, eu posso:
- Adicionar um formulário UI para registrar IPs dos ESP32 e alternar entre modos (network vs simulated).
- Gerar o `curl` e o snippet do ESP32 atualizado para enviar para o endpoint final.
- Ajudar a configurar Upstash (passo a passo) e variáveis no Vercel.
