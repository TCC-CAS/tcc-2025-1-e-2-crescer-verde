# CrescerVerde API

API REST da plataforma CrescerVerde. Node.js + Express + MongoDB.

**Base URL (produção):** `https://crescerverde.vercel.app/api`

---

## Instalação

```bash
npm install
# criar .env com as variáveis abaixo
npm start          # produção
npm run dev        # desenvolvimento (nodemon)
```

### Variáveis de ambiente (`.env`)

```
MONGO_URI=mongodb+srv://...
JWT_SECRET=sua_chave_secreta
PORT=3000
NODE_ENV=development
```

---

## Autenticação

Todas as rotas protegidas exigem o header:

```
Authorization: Bearer <token>
```

O token é obtido via `POST /api/auth/login`.

---

## Endpoints

### Auth — `/api/auth`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/register` | Cadastro de novo usuário |
| POST | `/login` | Login — retorna JWT |

### Cursos — `/api/courses`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/` | — | Lista todos os cursos (ordenados por `order`) |
| POST | `/` | Admin | Cria curso |
| PUT | `/:id` | Admin | Atualiza curso |
| DELETE | `/:id` | Admin | Remove curso |

### Conteúdos — `/api/courseContents`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/create` | Admin | Cria conteúdo |
| POST | `/listByCourseId/:id` | User | Lista conteúdos do curso |
| POST | `/update/:id` | Admin | Atualiza conteúdo |
| POST | `/delete/:id` | Admin | Remove conteúdo |

### Progresso — `/api/courseProgress`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/addContent` | User | Marca conteúdo como concluído |
| POST | `/removeContent` | User | Desmarca conteúdo |
| POST | `/update` | User | Atualiza status de conclusão do curso |
| POST | `/get` | User | Consulta progresso de um curso |

### Certificados — `/api/certificates`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/` | User | Emite certificado (requer curso concluído) |
| GET | `/user/:userId` | User | Lista certificados do usuário (com nome do curso) |
| GET | `/:certificateId` | User | Busca certificado por ID (com populate) |

### Usuários — `/api/users`

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/` | Admin | Cria usuário |
| GET | `/` | Admin | Lista todos os usuários |
| GET | `/:id` | User | Busca usuário por ID |
| PUT | `/:id` | Admin | Atualiza dados do usuário |
| PUT | `/:id/password` | Admin | Altera senha |
| DELETE | `/:id` | Admin | Remove usuário |
| GET | `/:id/guardian-view` | Guardian/Admin | Lista menores vinculados ao responsável |
| PUT | `/:id/time-limit` | Guardian/Admin | Define limite de tempo de sessão (ECA) |

---

## Planos e Controle de Acesso

O campo `minPlan` em cada curso controla quem pode acessá-lo:

| `minPlan` | Plano na UI | Quem acessa |
|---|---|---|
| `free` | Gratuito | Qualquer usuário |
| `basic` / `premium` | Família | Plano Família ou superior |
| `institutional` | Escola | Plano Escola |

---

## Rate Limiting

| Escopo | Limite |
|---|---|
| Global (`/api`) | 200 requisições / 15 min por IP |
| Auth (`/api/auth`) | 10 tentativas / 15 min por IP |

---

## Roles de Usuário

| Role | Permissões |
|---|---|
| `student` | Acesso aos conteúdos do seu plano, progresso e certificados próprios |
| `guardian` | Painel parental — vincula alunos, define limite de sessão |
| `admin` | CRUD completo em cursos, conteúdos e usuários |
