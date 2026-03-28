# 🚀 Integração API Backend - GEO-SCAN

## Visão Geral

O projeto agora está integrado com o backend em **https://geo-scan-backend.vercel.app** para buscar dados de vibração em tempo real.

## 📋 Configuração

### 1. Variável Global de API

Um arquivo centralizado `api-config.js` gerencia toda a configuração da API:

```javascript
const API = {
    base: 'https://geo-scan-backend.vercel.app',
    endpoints: {
        vibration: '/vibration',
        rfid: '/rfid'
    }
};
```

**Para alterar o domínio do backend**, edite apenas este arquivo:
```
Frontend/api-config.js
```

### 2. Usar em Qualquer Dashboard

Adicione o script de configuração no topo do seu arquivo HTML:

```html
<script src="../api-config.js"></script>
```

Agora você tem acesso às funções globais:
- `fetchAPI(endpoint, options)` - Fazer requisições
- `enviarVibração(deviceId, value)` - Enviar dados
- `obterUltimoRFID()` - Buscar RFID

---

## 🔧 Exemplos de Uso

### Buscar Dados de Vibração

```javascript
// Buscar últimas 10 leituras
const dados = await fetchAPI('/vibration?limit=10');

if (dados && dados.length > 0) {
    console.log(`Encontradas ${dados.length} leituras`);
    dados.forEach(leitura => {
        console.log(`${leitura.deviceId}: ${leitura.value} mm/s`);
    });
}
```

### Enviar Vibração para Backend

```javascript
// Enviar nova leitura
const success = await enviarVibração('sensor-01', 15.5);

if (success) {
    console.log('Vibração registrada com sucesso!');
}
```

### Atualizar Campo em Tempo Real

```javascript
async function atualizarVibracaoTempoReal() {
    const dados = await fetchAPI('/vibration?limit=1');
    
    if (dados && dados.length > 0) {
        const valor = parseFloat(dados[0].value).toFixed(1);
        
        // Atualizar elemento no HTML
        document.getElementById('vibracao-card').textContent = valor + ' mm/s';
    }
}

// Atualizar a cada 30 segundos
setInterval(atualizarVibracaoTempoReal, 30000);
```

---

## 📊 Dashboards Atualizados

### 1. **dashboard-analise.html**
- ✅ Busca vibração ao carregar
- ✅ Atualiza a cada 30 segundos
- ✅ Exibe em tempo real no KPI "Vibração"

### 2. **dashboard-inicio.html**
- ✅ Carrega tabela de vibrações
- ✅ Atualiza automaticamente
- ✅ Renderiza últimas 10 leituras

---

## 🧪 Ferramenta de Teste

Acesse a ferramenta de teste integrada:

```
http://localhost:3000/test-api.html
```

### Funcionalidades:
- ✅ Verificar conectividade com backend
- ✅ Buscar leituras de vibração
- ✅ Enviar novas vibrações
- ✅ Testar endpoint RFID
- ✅ Histórico de requisições

---

## 🔌 Endpoints Disponíveis

### GET /vibration
Busca leituras de vibração

**Parâmetros:**
- `limit` (opcional): Número de registros (padrão: 10)

**Exemplo:**
```bash
GET https://geo-scan-backend.vercel.app/vibration?limit=10
```

**Resposta:**
```json
[
    {
        "id": 1,
        "deviceId": "sensor-01",
        "value": 15.5,
        "timestamp": "2026-03-28T10:30:00Z"
    }
]
```

### POST /vibration
Envia nova leitura de vibração

**Body:**
```json
{
    "deviceId": "sensor-01",
    "value": 15.5,
    "timestamp": "2026-03-28T10:30:00Z"
}
```

**Resposta:**
```json
{ "ok": true }
```

### GET /rfid
Busca último código RFID

**Resposta:**
```json
{ "code": "ABC123XYZ" }
```

---

## 🛠️ Troubleshooting

### Erro: "Nenhum dado de vibração encontrado"
- Verifique se o backend está online
- Confirme se há dados registrados no banco de dados
- Use `test-api.html` para diagnosticar

### Erro: "CORS bloqueado"
- O backend já possui CORS habilitado
- Verifique a URL do API no `api-config.js`

### Dados não atualizam em tempo real
- Verifique se o intervalo de atualização está correto
- Abra o console (F12) e procure por erros
- Confirme que o backend está respondendo

---

## 📝 Como Adicionar Novos Dashboards

1. Crie seu arquivo HTML em `Frontend/pages/`
2. Adicione o script de configuração:
   ```html
   <script src="../api-config.js"></script>
   ```
3. Use a função `fetchAPI()` para buscar dados:
   ```javascript
   const dados = await fetchAPI('/vibration?limit=10');
   ```

---

## 🔐 Notas de Segurança

- A URL do backend está em `api-config.js` (fácil de mudar)
- As requisições usam `fetch()` nativo do navegador
- Sem autenticação requerida (aberto para leitura)
- Implementar autenticação se necessário no backend

---

## 📱 Suporte

Para questões sobre a integração, verifique:
1. Console do navegador (F12)
2. Arquivo `test-api.html`
3. Documentação do backend em `/backend/README.md`

---

**Última atualização:** 28/03/2026
