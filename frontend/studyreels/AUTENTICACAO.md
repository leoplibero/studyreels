# 🔐 Fluxo de Autenticação - StudyReels

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React Native)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Login.tsx / Cadastro.tsx                                    │
│  ├─ Coleta dados do usuário                                 │
│  └─ Chama funções de auth                                   │
│         ↓                                                     │
│  AuthContext.tsx (useAuth)                                   │
│  ├─ Gerencia estado (user, token)                           │
│  └─ Fornece funções (login, register, logout)              │
│         ↓                                                     │
│  services/api.ts                                             │
│  ├─ loginUser() - requisição POST /api/auth/login          │
│  └─ registerUser() - requisição POST /api/auth/register    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
           ↓ HTTP REQUEST ↓
           
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Routes (authRoutes.js)                                      │
│  ├─ POST /api/auth/login                                    │
│  └─ POST /api/auth/register                                 │
│         ↓                                                     │
│  Controllers (authController.js)                             │
│  ├─ loginController()                                       │
│  └─ registerController()                                    │
│         ↓                                                     │
│  Services (authService.js)                                   │
│  ├─ login() - lógica de autenticação                        │
│  └─ register() - lógica de registro                         │
│         ↓                                                     │
│  Models (User.js)                                            │
│  └─ Salva/busca dados no MongoDB                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
           ↓ HTTP RESPONSE ↓
           
┌─────────────────────────────────────────────────────────────┐
│                      RESPONSE (JSON)                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ {                                                             │
│   "success": true,                                           │
│   "data": {                                                  │
│     "id": "user_id",                                        │
│     "name": "João",                                          │
│     "email": "joao@email.com"                               │
│   },                                                         │
│   "token": "eyJhbGc..."  <- JWT Token                       │
│ }                                                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Fluxo Detalhado

### 1️⃣ CADASTRO

```
Usuário preenche:
  - Nome completo
  - Email
  - Senha
  - Confirmar senha
     ↓
Clica em "Cadastrar"
     ↓
handleRegister() valida campos
     ↓
register() chama registerUser()
     ↓
POST /api/auth/register com dados
     ↓
Backend retorna { success, data, token }
     ↓
Token é salvo no SecureStore (armazenamento seguro)
     ↓
User é salvo no context
     ↓
Redireciona para feed: router.replace("/feed")
```

### 2️⃣ LOGIN

```
Usuário preenche:
  - Email
  - Senha
     ↓
Clica em "Login"
     ↓
handleLogin() valida campos
     ↓
login() chama loginUser()
     ↓
POST /api/auth/login com email e senha
     ↓
Backend retorna { success, data, token }
     ↓
Token é salvo no SecureStore
     ↓
User é salvo no context
     ↓
Redireciona para feed: router.replace("/feed")
```

## Como Usar em Outras Telas

Para acessar dados do usuário autenticado em outras telas, use:

```tsx
import { useAuth } from "../context/AuthContext";

export default function FeedScreen() {
  const { user, token, logout, isAuthenticated } = useAuth();

  return (
    <View>
      <Text>Olá, {user?.name}!</Text>
      {isAuthenticated && <Button title="Logout" onPress={logout} />}
    </View>
  );
}
```

## Configuração Importante

⚠️ **Altere a URL da API:**

Se testar no celular/emulador, mude:

```tsx
// Em services/api.ts
const API_URL = "http://192.168.x.x:4000/api"; // Coloque seu IP local
```

Comando para ver seu IP:
```bash
ipconfig (Windows) ou ifconfig (Mac/Linux)
```

## Middleware Seguro

Para proteger rotas que precisam de autenticação, você pode usar:

```tsx
// Em uma tela protegida
export default function ProtectedScreen() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  return <View>Conteúdo protegido</View>;
}
```

## Package.json - Dependências Necessárias

```json
{
  "dependencies": {
    "expo-secure-store": "^13.0.0"  // Para guardar token de forma segura
  }
}
```

Se ainda não tem, instale:
```bash
npx expo install expo-secure-store
```

---

**Resumo:**
- 📱 Frontend coleta dados
- 🌐 Faz requisição HTTP para backend
- 🔐 Backend valida e retorna token
- 💾 Token é guardado de forma segura
- ✅ Usuário é redirecionado para tela principal (/feed)

---

## Estrutura de Pastas

```
app/
  ├─ _layout.tsx        (raiz com AuthProvider e Stack)
  ├─ login.tsx          → /login
  ├─ cadastro.tsx       → /cadastro
  └─ feed.tsx           → /feed

context/
  └─ AuthContext.tsx    (gerencia estado de autenticação)

services/
  └─ api.ts             (requisições HTTP para backend)
```
