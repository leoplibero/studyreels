# 📚 StudyReels

StudyReels é uma aplicação fullstack para aprendizado através de vídeos curtos estilo TikTok/Reels, combinado com quizzes interativos e rankings de pontuação.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com **Express** - Framework web
- **MongoDB** com **Mongoose** - Banco de dados NoSQL
- **JWT (jsonwebtoken)** - Autenticação e autorização
- **bcryptjs** - Criptografia de senhas
- **CORS** - Controle de acesso entre origens
- **Morgan** - Logger de requisições HTTP
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Superset JavaScript tipado
- **Expo Router** - Navegação file-based
- **AsyncStorage** - Armazenamento local
- **Axios** - Cliente HTTP (via services/api.ts)

## 📁 Estrutura do Projeto

```
studyreels/
├── backend/                    # API REST
│   ├── src/
│   │   ├── controllers/       # Controladores de requisições
│   │   │   ├── authController.js
│   │   │   ├── quizController.js
│   │   │   ├── rankingController.js
│   │   │   └── videoController.js
│   │   ├── middlewares/       # Middlewares de autenticação
│   │   │   └── authMiddleware.js
│   │   ├── models/            # Modelos do MongoDB
│   │   │   ├── User.js
│   │   │   ├── Video.js
│   │   │   ├── Quiz.js
│   │   │   └── QuizResult.js
│   │   ├── routes/            # Rotas da API
│   │   │   ├── authRoutes.js
│   │   │   ├── videoRoutes.js
│   │   │   ├── quizRoutes.js
│   │   │   ├── rankingRoutes.js
│   │   │   └── index.js
│   │   ├── services/          # Lógica de negócio
│   │   │   ├── authService.js
│   │   │   ├── videoService.js
│   │   │   ├── quizService.js
│   │   │   └── rankingService.js
│   │   └── server.js          # Arquivo principal do servidor
│   ├── .env                   # Variáveis de ambiente
│   └── package.json
│
└── frontend/                  # Aplicativo mobile
    ├── app/                   # Telas e navegação (Expo Router)
    │   ├── _layout.tsx        # Layout raiz
    │   ├── index.tsx          # Tela inicial
    │   ├── login.tsx          # Tela de login
    │   ├── cadastro.tsx       # Tela de cadastro
    │   ├── (tabs)/            # Navegação por abas
    │   │   ├── feed.tsx       # Feed de vídeos
    │   │   ├── ranking.tsx    # Ranking de usuários
    │   │   ├── manage.tsx     # Gerenciamento
    │   │   └── profile.tsx    # Perfil do usuário
    │   └── quiz/
    │       └── [id].tsx       # Tela de quiz dinâmica
    ├── assets/                # Imagens e recursos
    ├── services/
    │   └── api.ts             # Configuração do cliente HTTP
    ├── .env                   # Variáveis de ambiente
    └── package.json
```

## ⚙️ Funcionalidades

### Autenticação
-  Cadastro de usuários
-  Login com JWT
-  Autenticação protegida por middleware

### Vídeos
-  Feed de vídeos educacionais estilo Reels
-  Upload e gerenciamento de vídeos
-  Sistema de curtidas e visualizações

### Quizzes
-  Quizzes interativos relacionados aos vídeos
-  Respostas de múltipla escolha
-  Registro de resultados
-  Sistema de pontuação

### Ranking
- 🏆 Ranking global de usuários
- 📊 Pontuação baseada em desempenho nos quizzes
- 🥇 Sistema de conquistas

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (v16 ou superior)
- MongoDB (local ou Atlas)
- Expo CLI (`npm install -g expo-cli`)
- Git

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd studyreels
```

### 2. Configuração do Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
PORT=4000
STRING_CONNECTION_DB=mongodb://localhost:27017/studyreels
JWT_SECRET=sua_chave_secreta_aqui
```

Inicie o servidor:
```bash
npm start
```

O servidor estará rodando em `http://localhost:4000`

### 3. Configuração do Frontend

```bash
cd frontend
npm install
```

Crie um arquivo `.env` na pasta `frontend/` com:

```env
EXPO_PUBLIC_API_URL=http://localhost:4000/api
```

⚠️ **Nota**: Para testar em dispositivo físico, substitua `localhost` pelo IP da sua máquina na rede local.

Inicie o aplicativo:
```bash
npm start
# ou
npx expo start
```

Escaneie o QR Code com o app Expo Go (Android/iOS) ou pressione:
- `a` - Abrir no emulador Android
- `i` - Abrir no simulador iOS
- `w` - Abrir no navegador web

## 🔗 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Dados do usuário autenticado

### Vídeos
- `GET /api/videos` - Listar vídeos
- `POST /api/videos` - Criar vídeo (autenticado)
- `GET /api/videos/:id` - Detalhes de um vídeo
- `PUT /api/videos/:id` - Atualizar vídeo
- `DELETE /api/videos/:id` - Deletar vídeo

### Quizzes
- `GET /api/quizzes` - Listar quizzes
- `POST /api/quizzes` - Criar quiz (autenticado)
- `GET /api/quizzes/:id` - Detalhes de um quiz
- `POST /api/quizzes/:id/submit` - Enviar resposta do quiz

### Ranking
- `GET /api/ranking` - Obter ranking de usuários
- `GET /api/ranking/me` - Posição do usuário no ranking

## 🧪 Scripts Disponíveis

### Backend
```bash
npm start        # Inicia o servidor
npm run debug    # Inicia em modo debug (porta 9229)
```

### Frontend
```bash
npm start        # Inicia o servidor Expo
npm run android  # Abre no emulador Android
npm run ios      # Abre no simulador iOS
npm run web      # Abre no navegador
npm run lint     # Executa o linter
```

## 🔐 Autenticação

A aplicação utiliza JWT (JSON Web Tokens) para autenticação:

1. O usuário faz login com email e senha
2. O backend retorna um token JWT
3. O token é armazenado no AsyncStorage (frontend)
4. Requisições subsequentes incluem o token no header `Authorization: Bearer <token>`
5. O middleware `authMiddleware.js` valida o token em rotas protegidas

## 📱 Navegação do App

A estrutura de navegação utiliza o Expo Router (file-based routing):

- `/` - Tela inicial/splash
- `/login` - Tela de login
- `/cadastro` - Tela de cadastro
- `/(tabs)/feed` - Feed principal de vídeos
- `/(tabs)/ranking` - Ranking de usuários
- `/(tabs)/manage` - Gerenciamento de conteúdo
- `/(tabs)/profile` - Perfil do usuário
- `/quiz/[id]` - Tela de quiz (rota dinâmica)

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC.

## 👥 Autores

Desenvolvido com Leonardo Paciencia para revolucionar a forma de aprender através de vídeos curtos. :D

---

**StudyReels** - Aprenda de forma rápida e divertida! 🎓✨
