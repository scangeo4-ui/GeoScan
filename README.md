# Frontend (GEO-SCAN)

Este diretório contém o frontend estático do GEO-SCAN.

Como rodar localmente (Windows PowerShell):

1. Abrir PowerShell e ir para o diretório `Frontend`:

   ```powershell
   cd C:\Users\Hércules\Downloads\geo-scan2\Frontend
   ```

2. Instalar dependências (se ainda não instaladas):

   ```powershell
   npm install
   ```

3. Rodar em modo desenvolvimento (usa `nodemon` e `server.js`):

   ```powershell
   npm run dev
   ```

   Ou iniciar diretamente:

   ```powershell
   npm start
   ```

4. Abrir navegador em `http://localhost:3000`.

Notas:
- O servidor serve os arquivos estáticos do diretório `Frontend`.
- A rota `/` serve `landage.html` (landing page). A página de login está em `index.html`.
- Os dashboards estão em `pages/` (por exemplo `pages/dashboard-inicio.html`).
