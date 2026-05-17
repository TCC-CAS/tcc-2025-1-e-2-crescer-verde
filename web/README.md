# CrescerVerde — Frontend

Frontend estático da plataforma CrescerVerde.

**🌐 Acesso:** [crescerverde.vercel.app](https://crescerverde.vercel.app/)

Documentação completa do projeto: [README principal](../README.md)

---

## Páginas

| Arquivo | Descrição |
|---|---|
| `index.html` | Home — carrossel, quiz interativo de sustentabilidade |
| `HTML/jogos.html` | Catálogo de trilhas com filtro por dificuldade |
| `HTML/jogo-detalhes.html` | Player de conteúdo — jogos, vídeos e textos |
| `HTML/certificados.html` | Certificados conquistados pelo usuário |
| `HTML/planos.html` | Planos: Gratuito / Família / Escola |
| `HTML/login.html` | Login e cadastro |
| `HTML/usuarios.html` | Admin — gestão de usuários |
| `HTML/painel-parental.html` | Responsável — vincula alunos e define limite de sessão |

---

## Estrutura de Scripts

| Arquivo | Responsabilidade |
|---|---|
| `JS/config.js` | Define `API_BASE` (URL da API) |
| `JS/global.js` | Navbar scroll, hamburger, ECA session timer, fetch interceptor (401) |
| `JS/auth-sync.js` | Exibe nome do usuário logado, oculta certificados para admin |
| `JS/terms-modal.js` | Modal de Termos de Uso / Privacidade / Acessibilidade |
| `JS/jogos.js` | Carrega e renderiza trilhas, lógica de plano (lock/unlock) |
| `JS/jogo-detalhes.js` | Player de conteúdo, progresso, emissão de certificado |
| `JS/certificados.js` | Lista e impressão de certificados |

---

## Estrutura de Estilos

| Arquivo | Responsabilidade |
|---|---|
| `CSS/design-system.css` | Variáveis globais, navbar, page-header, footer |
| `CSS/styles.css` | Home (hero, carrossel, quiz) |
| `CSS/jogos.css` | Cards de trilhas, filtros, lock overlay |
| `CSS/planos.css` | Cards de planos (Gratuito / Família / Escola) |
| `CSS/login.css` | Formulário de login/cadastro |
| `CSS/usuarios.css` | Tabela de gestão de usuários |

---

## Fluxo de Autenticação

```
localStorage.token  →  enviado como Bearer em todo fetch autenticado
localStorage.user   →  objeto { id, name, role, plan, ... }
```

`global.js` intercepta respostas 401 e redireciona para `/HTML/login.html` automaticamente.
