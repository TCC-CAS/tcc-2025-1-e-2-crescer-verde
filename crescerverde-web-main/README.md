# Crescer Verde — Plataforma de Jogos de Sustentabilidade

Plataforma web educativa com jogos interativos voltados para crianças e jovens aprenderem sobre sustentabilidade, reciclagem e meio ambiente.

**Acesso:** [crescer-verde-app.vercel.app](https://crescer-verde-app.vercel.app)

---

## Funcionalidades

- **Jogos** — Cidade Verde (eco city) e Cidade Coleta Seletiva (coleta de lixo top-down)
- **Quiz interativo** — perguntas sobre sustentabilidade com timer e feedback
- **Trilhas de cursos** — conteúdo educativo sobre ESG e meio ambiente
- **Certificados** — emissão de certificado ao concluir trilhas
- **Autenticação** — login/cadastro com JWT, recuperação de senha
- **Acessibilidade** — VLibras (Libras) integrado em todas as páginas
- **Painel admin** — gerenciamento de usuários (somente administradores)

## Tecnologias

| Camada | Stack |
|---|---|
| Frontend | HTML5, CSS3, Bootstrap 5, JavaScript |
| Backend | Node.js, Express 5, MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| Deploy | Vercel (frontend + API serverless) |

## Estrutura

```
crescerverde-web-main/   # Frontend estático
crescerverde-api-main/   # API REST (Node/Express)
```

## Como rodar localmente

```bash
# API
cd crescerverde-api-main
npm install
# crie .env com MONGO_URI e JWT_SECRET
npm start

# Frontend — abra index.html no navegador ou use Live Server
```
