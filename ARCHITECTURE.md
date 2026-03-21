# Arquitetura do Projeto GEO-SCAN

## 🏛️ Estrutura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                     GEO-SCAN SYSTEM                         │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐         ┌────────┐        ┌────────┐
    │ Browser│         │ Mobile │        │ ESP32  │
    │ Client │         │ Client │        │ Sensor │
    └────────┘         └────────┘        └────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    (HTTP/HTTPS)
                           │
        ┌──────────────────▼──────────────────┐
        │  API Gateway (CORS + Helmet)        │
        └──────────────────┬──────────────────┘
                           │
        ┌──────────────────▼──────────────────┐
        │   Express.js Backend (Node.js)      │
        │   Port: 3000                        │
        └──────────────────┬──────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                      │
        ▼                                      ▼
    ┌──────────────┐                    ┌──────────────┐
    │  Auth Routes │                    │ Sensor Routes│
    │  (/api/auth) │                    │(/api/sensor) │
    └──────┬───────┘                    └──────┬───────┘
           │                                    │
           ▼                                    ▼
    ┌──────────────┐                    ┌──────────────┐
    │ JWT Tokens   │                    │ Data Logger  │
    │ & Sessions   │                    │ & Storage    │
    └──────────────┘                    └──────────────┘
```

## 📱 Frontend Architecture (React + TypeScript)

```
┌───────────────────────────────────────┐
│        React Application              │
│  Vite + TypeScript + React Router     │
└──────────────┬────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌──────────────┐   ┌──────────────────┐
│   Pages/     │   │   Components/    │
│   Layouts    │   │   Shared         │
├──────────────┤   ├──────────────────┤
│ Login        │   │ ProtectedRoute   │
│ Dashboard    │   │ Sidebar          │
│ Dashboard3D  │   │ Header           │
│ Analysis     │   │ StatCard         │
│ Sentinel     │   │ Map              │
│ Areas        │   │ 3DViewer         │
└──────────────┘   └──────────────────┘
       │                    │
       └────────┬───────────┘
                │
    ┌───────────┴────────────┐
    │                        │
    ▼                        ▼
┌───────────────┐    ┌───────────────────┐
│  Services/    │    │  Context API      │
│  API Calls    │    │  State Management │
├───────────────┤    ├───────────────────┤
│ api.ts        │    │ AuthContext       │
│ - login()     │    │ - user state      │
│ - getSensor() │    │ - auth status     │
│ - postData()  │    │ - logout()        │
└───────────────┘    └───────────────────┘
       │                    │
       └────────┬───────────┘
                │
    ┌───────────▼────────────┐
    │   Axios HTTP Client    │
    │   - Auto JWT Token     │
    │   - Error Handling     │
    │   - Request/Response   │
    └───────────┬────────────┘
                │
                ▼
         (HTTP Requests)
         (to API Server)
```

## 🖥️ Backend Architecture (Express + TypeScript)

```
┌────────────────────────────────────────┐
│    Express.js API Server (Node.js)     │
│    Port: 3000                          │
└──────────────┬─────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌──────────────┐   ┌──────────────┐
│   Routes     │   │ Middlewares  │
├──────────────┤   ├──────────────┤
│ /auth        │   │ CORS         │
│ /sensor      │   │ Helmet       │
│ /health      │   │ JWT Auth     │
│ /static      │   │ JSON Parser  │
└──────────────┘   └──────────────┘
       │
       └─────────────────┐
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
    ┌──────────────┐            ┌──────────────────┐
    │ Auth Routes  │            │ Sensor Routes    │
    ├──────────────┤            ├──────────────────┤
    │ POST /login  │            │ POST /data       │
    │   - Validate │            │   - Store data   │
    │   - Hash pwd │            │   - Log reading  │
    │   - JWT sign │            │                  │
    │   - Return   │            │ GET /data/latest │
    │     token    │            │   - Get last 10  │
    └──────────────┘            └──────────────────┘
```

## 🔄 Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│             User Login Flow                             │
└─────────────────────────────────────────────────────────┘

1. User enters credentials
   │
   ▼
2. LoginComponent.handleSubmit()
   │
   ▼
3. apiService.login(credentials)
   │ (Axios POST to /api/auth/login)
   ▼
4. Backend validates:
   ├─ Check username exists
   ├─ Compare hashed password
   └─ If valid → Generate JWT
   │
   ▼
5. Backend returns: {token, user, expiresIn}
   │
   ▼
6. Frontend:
   ├─ Store token in localStorage
   ├─ Store user info
   ├─ Update AuthContext
   └─ Redirect to /dashboard
   │
   ▼
7. Subsequent requests:
   └─ Include token in Authorization header
      "Authorization: Bearer <token>"
```

## 📊 Data Flow

```
┌────────────────────────────────────────────────────────┐
│           Sensor Data Flow                             │
└────────────────────────────────────────────────────────┘

ESP32 Device          Express Backend       React Frontend
    │                      │                      │
    │─── POST /data ──────▶│                      │
    │   {deviceId,        │                      │
    │    readings}        │                      │
    │                     │ (Validate JWT)       │
    │                     │ (Store in memory)    │
    │                     │ (Log to console)     │
    │                     │                      │
    │                     │◀─ GET /latest ──────│
    │                     │  (w/ JWT token)     │
    │                     │                      │
    │                     │──[data] ────────────▶│
    │                     │                      │ (Update UI)
    │                     │                      │ (Render charts)
    │                     │                      │ (3D viz)
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────┐
│         Security Implementation                     │
└─────────────────────────────────────────────────────┘

1. Transport Security (HTTPS in production)
   └─ TLS/SSL encryption

2. API Security
   ├─ Helmet.js
   ├─ CORS whitelist
   └─ Rate limiting (future)

3. Authentication
   ├─ bcryptjs (password hashing)
   ├─ JWT (stateless auth)
   └─ 24h token expiration

4. Data Validation
   ├─ TypeScript type checking
   ├─ Request validation
   └─ Error handling

5. Frontend Security
   ├─ HTTPOnly cookies (future)
   ├─ CSRF protection (future)
   └─ XSS prevention
```

## 📦 Deployment Structure

```
┌─────────────────────────────────────────────┐
│         Production Build                    │
└─────────────────────────────────────────────┘

dist/
├── server.js              # Compiled backend
├── routes/
│   ├── auth.js
│   └── sensor.js
├── middleware/
│   └── auth.js
└── public/                # Built React app
    ├── index.html
    ├── assets/
    └── ...js files

Running: npm start
├─ Loads .env
├─ Starts Express server on PORT
└─ Serves static React files
```

## 🔌 API Endpoints Summary

```
┌────────────────────────────────────────────────────────┐
│              API Endpoints                            │
└────────────────────────────────────────────────────────┘

PUBLIC:
  GET  /api/health                    - Server status

AUTHENTICATION:
  POST /api/auth/login                - User login
       {username, password}
       ↓
       {token, user, expiresIn}

PROTECTED (Require JWT):
  POST /api/sensor/data               - Send sensor data
       {deviceId, data}
       ↓
       {status, count, message}

  GET  /api/sensor/data/latest        - Get latest data
       ↓
       [{id, deviceId, data, timestamp}, ...]
```

---

**Esta arquitetura foi projetada para:**
- ✅ Escalabilidade (microserviços futuros)
- ✅ Segurança (JWT, HTTPS, validação)
- ✅ Mantenibilidade (TypeScript, separação de concerns)
- ✅ Performance (Vite, lazy loading, caching)
- ✅ DevOps (Docker-ready, CI/CD)
