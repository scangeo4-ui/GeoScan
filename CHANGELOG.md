# 📝 CHANGELOG

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-21

### Adicionado

#### Arquitetura Geral
- Reestruturação completa do projeto com separação client/server
- Setup de React 18 + TypeScript com Vite
- Setup de Express.js + TypeScript no backend
- Documentação completa (README, ARCHITECTURE, QUICKSTART)

#### Frontend (React + TypeScript)
- Página de Login com validações e UI moderna
- Dashboard principal com statísticas
- Componente Sidebar com navegação
- Componente Header com informações de tempo e localização
- ProtectedRoute para autenticação
- Context API (AuthContext) para gerenciamento de estado global
- Serviço de API com Axios
- TypeScript types/interfaces para type safety
- CSS modularizado e responsivo

#### Backend (Express + TypeScript)
- Servidor Express configurado
- Rota de autenticação POST `/api/auth/login`
- Rota de sensores POST `/api/sensor/data`
- Rota de sensores GET `/api/sensor/data/latest`
- Health check endpoint GET `/api/health`
- Middleware de autenticação JWT
- Middleware CORS e Helmet para segurança
- Validação de inputs e error handling

#### Autenticação e Segurança
- Sistema JWT completo com 24h expiração
- Hash de senhas com bcryptjs
- Middleware de autenticação
- CORS whitelist
- Headers HTTP seguros com Helmet

#### Configurações e DevOps
- Arquivo `.env` para variáveis de frontend
- Arquivo `.env.backend` para variáveis de backend
- Arquivo `package.json` com scripts de dev/build
- Configuração TypeScript para client e server
- Configuração Vite para build otimizado
- ESLint configuration
- `.gitignore` completo
- Dockerfile multi-stage
- docker-compose.yml com health checks

#### Documentação
- `README.md` - Guia completo
- `ARCHITECTURE.md` - Diagramas e explicação técnica
- `QUICKSTART.md` - Guia de 5 minutos
- `RESTRUCTURING_SUMMARY.md` - Sumário de mudanças
- `CHANGELOG.md` - Este arquivo

### Removido

- Estrutura antiga com HTML/CSS/JS soltos
- Scripts PHP/Node antigos
- Configurações misturadas de client/server
- Falta de type safety (JavaScript puro)

### Alterado

- Movido de HTML simples para React components
- Substituído localStorage direto por Context API
- Movido de scripts globais para modular services
- Novo sistema de rotas com React Router
- Novo sistema de estilos (CSS modules + CSS files)

### Corrigido

- Case-insensitive login now properly implemented
- Erro handling melhorado
- CORS configurado corretamente
- Token refresh automático em interceptadores

---

## [Unreleased]

### Planejado

#### Feature: Dashboard 3D Completo
- Integração completa com Three.js
- Visualização de terreno 3D
- Marcadores de kimberlito com animações
- Controles de câmera (rotação, zoom, movimento)
- Toggle de camadas geológicas

#### Feature: Dashboard de Análise
- Gráficos com Chart.js ou Recharts
- Análise de dados de sensores
- Exportação de relatórios (PDF, CSV)
- Filtros avançados

#### Feature: Integração Sentinel
- Dados de satélite Sentinel-2
- Visualização de mapas
- Análise de imagens

#### Feature: Gerenciamento de Áreas
- CRUD de áreas prospectadas
- Mapa interativo com leaflet
- Histórico de áreas

#### Feature: WebSockets
- Socket.io para atualizações em tempo real
- Live streaming de dados de sensores
- Notificações em tempo real

#### Feature: Persistência de Dados
- Integração com MongoDB
- Schemas com Mongoose
- Migrações automáticas

#### Feature: Autenticação Avançada
- OAuth2 / Google Sign-in
- Two-Factor Authentication
- Refresh tokens

#### Feature: Testes
- Jest para unit tests
- Cypress para E2E tests
- Coverage > 80%

#### Feature: CI/CD
- GitHub Actions
- Automated testing
- Automated deployment

#### Feature: Mobile App
- React Native
- Sincronização offline
- Notificações push

### Mudanças de Backend
- Rate limiting
- Request validation
- Logging system
- Error tracking (Sentry)

### Mudanças de DevOps
- Kubernetes manifests
- GitHub Actions workflows
- Terraform infrastructure-as-code
- Multiple environment configs (dev/staging/prod)

---

## Convenção de Commits

Este projeto segue [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): descrição breve
fix(scope): descrição breve
docs(scope): descrição breve
style(scope): descrição breve
refactor(scope): descrição breve
test(scope): descrição breve
chore(scope): descrição breve
```

### Exemplos

```bash
git commit -m "feat(auth): add JWT token refresh"
git commit -m "fix(api): handle CORS errors properly"
git commit -m "docs(readme): update installation steps"
git commit -m "refactor(components): extract common styles"
```

---

## Versionamento

Este projeto segue [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0) - Breaking changes
- **MINOR** (1.1.0) - New features (backward compatible)
- **PATCH** (1.0.1) - Bug fixes (backward compatible)

---

## Contribuindo

Veja [Contributing Guide](CONTRIBUTING.md) (em breve)

Para reportar bugs ou sugerir features, abra uma issue no GitHub.

---

## Licença

MIT - Veja [LICENSE](LICENSE) para detalhes.

---

## Autores

- **Mechack777** - Initial work and architecture
- **Contributors** - (em breve)

---

## Reconhecimentos

- React Team - Framework excelente
- Express Team - Web server robusto
- TypeScript Team - Type safety
- Vite Team - Build tool rápido
- Three.js Community - 3D graphics

---

## Suporte

- 📧 Email: support@geoscan.ao
- 🐛 Issues: https://github.com/Mechack777/geo-scan/issues
- 💬 Discussions: https://github.com/Mechack777/geo-scan/discussions
- 🌐 Website: https://geoscan.ao (em breve)

---

**Último atualizado**: 2026-03-21