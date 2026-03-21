# 🌍 GEO-SCAN - Sistema de Monitoramento Geológico

Sistema moderno de monitoramento geológico com visualização 3D em tempo real, análise de dados de sensores e integração com tecnologias de satélite.

## 📋 Características

- ✅ Autenticação JWT segura
- ✅ Dashboard interativo com visualização de dados em tempo real
- ✅ Visualização 3D com Three.js
- ✅ API RESTful com Express.js
- ✅ Frontend moderno com React TypeScript
- ✅ Integração com sensores IoT (ESP32)
- ✅ Análise de dados geológicos
- ✅ Sistema responsivo e mobile-friendly

## 🏗️ Arquitetura do Projeto

```
geo-scan2/
├── src/
│   ├── server/                    # Backend Node.js + Express
│   │   ├── server.ts              # Arquivo principal do servidor
│   │   ├── routes/                # Rotas da API
│   │   │   ├── auth.ts            # Autenticação
│   │   │   └── sensor.ts          # Dados de sensores
│   │   └── middleware/            # Middlewares
│   │       └── auth.ts            # Middleware JWT
│   │
│   └── client/                    # Frontend React + TypeScript
│       ├── index.html             # HTML principal
│       └── src/
│           ├── main.tsx           # Entrypoint React
│           ├── App.tsx            # Componente raiz
│           ├── pages/             # Páginas (Login, Dashboards)
│           │   ├── Login.tsx
│           │   ├── Dashboard.tsx
│           │   └── Dashboard3D.tsx
│           ├── components/        # Componentes reutilizáveis
│           │   ├── ProtectedRoute.tsx
│           │   ├── Sidebar.tsx
│           │   └── Header.tsx
│           ├── contexts/          # Context API
│           │   └── AuthContext.tsx
│           ├── services/          # Serviços (API, etc)
│           │   └── api.ts
│           ├── types/             # Tipos TypeScript
│           │   ├── auth.ts
│           │   └── sensor.ts
│           ├── styles/            # Estilos CSS
│           └── index.css          # Estilos globais
│
├── package.json                   # Dependências do projeto
├── tsconfig.json                  # Config TypeScript (client)
├── tsconfig.server.json           # Config TypeScript (server)
├── vite.config.ts                 # Config Vite
├── .env                           # Variáveis de ambiente (frontend)
├── .env.backend                   # Variáveis de ambiente (backend)
└── .env.example                   # Template de variáveis
```

## 🚀 Instalação e Setup

### Pré-requisitos

- Node.js v16+ e npm v8+
- Git

### 1. Clone o repositório

```bash
git clone https://github.com/Mechack777/geo-scan.git
cd geo-scan2
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

**Para o frontend (.env):**
```bash
cp .env.example .env
# Editar conforme necessário
```

**Para o backend (.env.backend):**
```bash
# Já existe, mas você pode customizar
cat .env.backend
```

## 💻 Desenvolvimento

### Rodar em desenvolvimento (client + server juntos)

```bash
npm run dev
```

Isto vai iniciar:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

### Rodar apenas o servidor backend

```bash
npm run dev:server
```

### Rodar apenas o cliente frontend

```bash
npm run dev:client
```

## 🔐 Credenciais de Teste

Use as seguintes credenciais para fazer login durante o desenvolvimento:

**Admin:**
- Usuário: `admin`
- Senha: `geoscan2026`

**Analyst:**
- Usuário: `ambrosio`
- Senha: `zambote2026`

## 🏗️ Build e Deploy

### Build completo (client + server)

```bash
npm run build
```

### Iniciar em produção

```bash
npm start
```

## 📚 Endpoints da API

### Autenticação

**POST** `/api/auth/login`
```json
{
  "username": "admin",
  "password": "geoscan2026"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "1",
    "username": "admin",
    "name": "Administrador",
    "role": "admin",
    "createdAt": "2026-03-21T..."
  },
  "expiresIn": 86400
}
```

### Sensores

**POST** `/api/sensor/data` (Requer autenticação)
```json
{
  "deviceId": "esp32-001",
  "data": [
    { "elevation": 1245, "temperature": 24.5 }
  ]
}
```

**GET** `/api/sensor/data/latest` (Requer autenticação)

Retorna os 10 últimos registros de dados

### Health Check

**GET** `/api/health`

Verifica o status do servidor

## 🎨 Stack Tecnológico

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Roteamento
- **Axios** - HTTP client
- **Three.js** - 3D graphics
- **FontAwesome** - Ícones

### Backend
- **Express.js** - Framework web
- **TypeScript** - Type safety
- **JWT** - Autenticação
- **bcryptjs** - Hashing de senhas
- **CORS** - Cross-origin requests
- **Helmet** - Segurança HTTP

## 📖 Documentação Adicional

### Autenticação com JWT

O sistema usa JWT (JSON Web Tokens) para autenticação. Após login, o token é armazenado no localStorage e incluído automaticamente em todas as requisições API.

### Componentes Reutilizáveis

- `ProtectedRoute` - Protege rotas que requerem autenticação
- `Sidebar` - Navegação principal
- `Header` - Header com informações de tempo e localização

### Contextos

- `AuthContext` - Gerencia estado de autenticação e usuário

## 🐛 Troubleshooting

**Erro: "Cannot find module 'react'"**
```bash
npm install
npm install --save-dev @types/react @types/react-dom
```

**Erro de CORS**
Verifique se `CORS_ORIGIN` no `.env.backend` está correto

**Porta já em uso**
```bash
# Alterar PORT no .env.backend ou matar processo:
# Windows: netstat -ano | findstr :3000 && taskkill /PID <PID> /F
# Mac/Linux: lsof -i :3000 && kill -9 <PID>
```

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia frontend e backend em desenvolvimento |
| `npm run dev:server` | Inicia apenas o backend |
| `npm run dev:client` | Inicia apenas o frontend |
| `npm run build` | Build completo para produção |
| `npm run build:server` | Build do backend |
| `npm run build:client` | Build do frontend |
| `npm start` | Inicia em produção |
| `npm run lint` | Lint de TypeScript e código |
| `npm test` | Executa testes (em implementação) |

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💼 Autor

**Mechack777** - [GitHub](https://github.com/Mechack777)

## 📞 Suporte

Para suporte, abra uma issue no repositório do GitHub.

---

**Desenvolvido com ❤️ para o monitoramento geológico de Angola**