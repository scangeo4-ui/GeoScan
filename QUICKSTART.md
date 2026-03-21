# 🚀 Quick Start - GEO-SCAN

Guia rápido para começar a desenvolver com GEO-SCAN.

## ⚡ 5 Minutos para Rodar

### 1. Clonar e instalar

```bash
# Clone o repositório
git clone https://github.com/Mechack777/geo-scan.git
cd geo-scan2

# Instale as dependências
npm install
```

### 2. Configurar ambiente

```bash
# As variáveis já estão configuradas em .env e .env.backend
# Apenas verifique se está tudo certo
cat .env
cat .env.backend
```

### 3. Rodar desenvolvimento

```bash
# Inicia frontend (5173) + backend (3000)
npm run dev

# Ou separadamente:
npm run dev:server    # Backend apenas
npm run dev:client    # Frontend apenas
```

### 4. Acessar

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/health

### 5. Login

Use as credenciais de teste:
```
Usuário: admin
Senha: geoscan2026
```

---

## 📁 Estrutura de Pastas (Resumida)

```
src/
├── server/          # Backend Express
│   ├── routes/      # API endpoints
│   └── middleware/  # JWT auth, etc
└── client/          # Frontend React
    └── src/
        ├── pages/   # Login, Dashboard, etc
        ├── components/  # Sidebar, Header, etc
        ├── services/    # API calls
        └── types/       # TypeScript interfaces
```

## 🔧 Comandos Importantes

```bash
# Desenvolvimento
npm run dev              # Front + Back
npm run dev:server       # Apenas backend
npm run dev:client       # Apenas frontend

# Build
npm run build            # Build completo
npm run build:server     # Build backend
npm run build:client     # Build frontend

# Produção
npm start                # Rodar em produção (após build)

# Linting
npm run lint             # Verificar código
npm run lint --fix       # Corrigir automaticamente

# Testes (em breve)
npm test                 # Rodar testes
```

## 🔐 JWT & Autenticação

O sistema usa JWT. Após fazer login:

1. Backend gera um token válido por 24h
2. Token é armazenado no `localStorage`
3. Token é automaticamente incluído nas requisições (header Authorization)
4. Se token expirar, usuário é redirecionado para login

Middleware de autenticação protege rotas sensíveis.

## 📡 Testando API

### Com curl

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"geoscan2026"}'

# 2. Use o token retornado
TOKEN="seu_token_aqui"

# 3. Enviar dados de sensor
curl -X POST http://localhost:3000/api/sensor/data \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"esp32-001","data":[{"elevation":1245}]}'

# 4. Obter últimos dados
curl -X GET http://localhost:3000/api/sensor/data/latest \
  -H "Authorization: Bearer $TOKEN"
```

### Com Postman

1. Importe as requests da coleção (em `docs/` - em breve)
2. Configure a variável `{{token}}` após login
3. Use em outras requests automaticamente

## 🎯 Próximos Passos

- [ ] Implementar Dashboard3D completo
- [ ] Adicionar persistência com MongoDB
- [ ] WebSockets para atualizações em tempo real
- [ ] Testes unitários e E2E
- [ ] Autenticação com OAuth2
- [ ] Deploy no Heroku/AWS
- [ ] Mobile app com React Native
- [ ] Integração com Sentinel API

## 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| "Cannot find module" | `npm install` novamente |
| Porta 3000 em uso | Mude PORT no `.env.backend` |
| Porta 5173 em uso | Vite escolhe outra automaticamente |
| CORS error | Verifique `CORS_ORIGIN` em `.env.backend` |
| Token inválido | Faça login novamente |

## 💡 Dicas de Desenvolvimento

### Hot Reload
- Frontend: Salve arquivos e vê mudanças em tempo real
- Backend: Use `npm run dev:server` que reinicia automaticamente

### Debugging
```javascript
// No backend
console.log('Debug:', variavel)

// No frontend (DevTools)
console.log('State:', authState)
localStorage.getItem('geoscan_token')
```

### Type Safety
```typescript
// Sempre use tipos do TypeScript
import { User } from '../types/auth'
const user: User = { ... }
```

## 📚 Recursos Adicionais

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Vite Docs](https://vitejs.dev/)
- [JWT.io](https://jwt.io/)

---

**Dúvidas?** Abra uma issue no repositório!

**Feliz desenvolvimento! 🎉**