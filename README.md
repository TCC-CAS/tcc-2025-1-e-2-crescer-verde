# CrescerVerde — Plataforma de Educação Ambiental Gamificada

Plataforma web educativa com jogos interativos voltados a crianças e jovens, focada em escolas e famílias. Responsáveis e escolas gerenciam o acesso; alunos aprendem de forma lúdica sobre sustentabilidade, reciclagem e meio ambiente.

**🌐 Acesso:** [crescerverde.vercel.app](https://crescerverde.vercel.app/)

---

## Modelo de Negócio

> **Quem paga × quem usa:** o responsável legal (pai/mãe ou escola) assina e gerencia o acesso. O aluno utiliza a plataforma sem precisar de cartão ou conta própria de pagamento.

| Plano | Preço | Público-alvo | Diferencial |
|---|---|---|---|
| **Gratuito** | R$ 0 | Qualquer usuário | 3 trilhas introdutórias para experimentar |
| **Família** | R$ 29,90/mês | Pais e responsáveis | Controle parental ECA, até 5 alunos vinculados |
| **Escola** | R$ 299/mês | Direção / secretaria | Até 100 alunos, dashboard admin, relatórios por turma |

### Funil de conversão

```
Gratuito → desperta interesse
  └─► Família → uso doméstico com controle parental
        └─► Escola → adoção institucional em escala de turma
```

---

## Funcionalidades

### Para Alunos
- **10 trilhas temáticas** com jogos interativos, textos educativos e quizzes
- **Certificados digitais** ao concluir cada trilha
- Controle de progresso por conteúdo
- **Acessibilidade** — VLibras (Libras) integrado em todas as páginas

### Para Responsáveis (Plano Família)
- **Painel parental** — vincula até 5 alunos à conta
- **Controle de tempo de sessão** em conformidade com o ECA Digital (Lei 8.069/90)
- Aviso de limite de sessão com opção de continuar ou encerrar

### Para Escolas (Plano Escola)
- Dashboard administrativo completo
- Gestão de usuários, turmas e professores
- Relatórios de desempenho por aluno/turma
- Customização de conteúdo e onboarding dedicado

### Plataforma
- Autenticação JWT + bcrypt
- Rate limiting global (200 req / 15 min por IP)
- Responsivo para mobile (iOS e Android)
- Conformidade com LGPD — aceite de termos no cadastro

---

## Tecnologias

| Camada | Stack |
|---|---|
| Frontend | HTML5, CSS3, Bootstrap 5, Vanilla JS |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| Deploy | Vercel (frontend estático + API serverless) |
| Acessibilidade | VLibras |

---

## Estrutura do Projeto (Monorepo)

```
CrescerVerde/
├── api/                  # API REST — Node.js / Express / MongoDB
│   ├── src/
│   │   ├── controllers/  # Lógica de negócio
│   │   ├── models/       # Schemas Mongoose
│   │   ├── routes/       # Definição de rotas
│   │   └── middlewares/  # Auth, logger, rate limit
│   └── seed.js           # Seed inicial de trilhas e conteúdos
├── web/                  # Frontend estático
│   ├── HTML/             # Páginas da aplicação
│   ├── CSS/              # Estilos por página + design system
│   ├── JS/               # Scripts por página + globais
│   └── Imagens/          # Assets visuais
└── package.json          # Workspaces npm
```

---

## Como Rodar Localmente

```bash
# 1. Instalar dependências (monorepo)
npm install

# 2. Configurar variáveis de ambiente
# criar arquivo api/.env com o conteúdo abaixo:
MONGO_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/<db>
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
NODE_ENV=development

# 3. Iniciar a API
cd api && npm start

# 4. Frontend — abrir web/index.html com Live Server (VS Code)
#    ou acessar http://localhost:5500 após iniciar o Live Server
```

---

## Seed de Dados

Para popular o banco com trilhas e conteúdos iniciais:

```bash
cd api
node seed.js
```

---

## Deploy

O projeto é deployado automaticamente na Vercel a cada push na branch `master`.

- **Frontend:** servido como site estático
- **API:** funções serverless via `vercel.json`
- **Banco:** MongoDB Atlas (permitir IPs: `0.0.0.0/0` em Network Access)
