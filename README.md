# Omnia - Banco Integrado de Questões

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)
![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-0.165.0-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python)

O Omnia é uma plataforma educacional para consulta de materiais didáticos, provas, simulados e questões organizadas para a educação básica. O projeto combina uma interface web em Next.js com uma API em FastAPI e pode gerar questões de múltipla escolha com o Google Gemini.

## O que o projeto faz

- organiza materiais didáticos por ano escolar, disciplina e tema;
- apresenta resumos de conteúdos e links de vídeo;
- disponibiliza provas e simulados em dados locais do frontend;
- gera questões de múltipla escolha a partir de um material escolhido;
- oferece cadastro, autenticação por token JWT e consulta do usuário autenticado;
- mantém os dados persistidos no backend em arquivos JSON.

## Por que o projeto é útil

- reúne recursos de estudo em um único ambiente;
- permite revisar conteúdos por disciplina, tema e etapa escolar;
- reduz o trabalho manual de criação de exercícios;
- oferece níveis de dificuldade diferentes para a geração de questões;
- separa a interface web da API, facilitando a manutenção e a evolução do projeto.

## Estrutura do projeto

```text
.
├── backend/
│   ├── app/
│   │   ├── data/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── config.py
│   │   └── main.py
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
├── .github/
├── .gitignore
└── README.md
```

### Backend

A API foi construída com FastAPI e expõe os seguintes recursos:

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/` | verifica o estado da API |
| `GET` | `/materiais` | lista os materiais didáticos |
| `GET` | `/materiais/{material_id}` | obtém um material pelo ID |
| `POST` | `/questoes?material_id={id}` | gera questões com IA |
| `POST` | `/cadastrar/` | cadastra um usuário |
| `POST` | `/token` | autentica e devolve um token JWT |
| `GET` | `/users/me/` | retorna o usuário autenticado |
| `GET` | `/users` | lista os usuários |
| `GET` | `/users/{username}` | busca um usuário pelo nome |

Arquivos principais:

- [backend/app/main.py](backend/app/main.py)
- [backend/app/routers](backend/app/routers)
- [backend/app/services](backend/app/services)
- [backend/app/data/materiais.json](backend/app/data/materiais.json)
- [backend/app/data/users.json](backend/app/data/users.json)

### Frontend

A interface foi construída com Next.js, React e TypeScript. Os conteúdos de provas e simulados estão em arquivos locais dentro de [frontend/app/data](frontend/app/data).

Páginas principais:

- [frontend/app/page.tsx](frontend/app/page.tsx)
- [frontend/app/pages/login/page.tsx](frontend/app/pages/login/page.tsx)
- [frontend/app/pages/cadastro/page.tsx](frontend/app/pages/cadastro/page.tsx)
- [frontend/app/pages/menu-materiais-didaticos/page.tsx](frontend/app/pages/menu-materiais-didaticos/page.tsx)
- [frontend/app/pages/menu-provas/page.tsx](frontend/app/pages/menu-provas/page.tsx)
- [frontend/app/pages/menu-simulados/page.tsx](frontend/app/pages/menu-simulados/page.tsx)

## Como começar

### Requisitos

- Python 3.10 ou superior;
- Node.js 20 ou superior;
- npm;
- chave da API do Google Gemini para usar a geração de questões.

### 1. Configure o backend

No diretório raiz do projeto:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Crie o arquivo de ambiente:

```powershell
copy .env.example .env
```

Edite `backend/.env` e defina pelo menos:

```env
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-3.8-flash
CORS_ORIGINS=http://localhost:3000
SECRET_KEY=uma_chave_longa_e_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Inicie a API:

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

A documentação será disponibilizada em:

- Swagger: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 2. Configure o frontend

Em outro terminal, no diretório raiz:

```powershell
cd frontend
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

Por padrão, [frontend/app/services/api.ts](frontend/app/services/api.ts) aponta para a API hospedada no Render. Para usar a API local durante o desenvolvimento, altere o valor de `API_URL` para:

```typescript
const API_URL = "http://localhost:8000";
```

## Exemplos de uso

### Verificar o estado da API

```powershell
curl http://localhost:8000/
```

### Listar materiais

```powershell
curl http://localhost:8000/materiais
```

### Gerar questões

Envie uma quantidade entre 1 e 10 e uma dificuldade permitida:

```powershell
curl -X POST "http://localhost:8000/questoes?material_id=1" `
  -H "Content-Type: application/json" `
  -d '{\"dificuldade\":\"Médio\",\"quantidade\":5}'
```

Valores aceitos para `dificuldade`:

- `Fácil`
- `Médio`
- `Difícil`

Cada questão gerada contém enunciado, exatamente quatro alternativas, índice da resposta correta e justificativa.

### Cadastrar e autenticar usuário

```powershell
curl -X POST "http://localhost:8000/cadastrar/" `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"aluno\",\"email\":\"aluno@example.com\",\"full_name\":\"Aluno\",\"password\":\"senha123\"}'
```

```powershell
curl -X POST "http://localhost:8000/token" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "username=aluno&password=senha123"
```

Use o `access_token` devolvido pelo endpoint `/token` no header `Authorization: Bearer <token>` para acessar `/users/me/`.

## Observações

- a geração de questões exige `GEMINI_API_KEY`;
- sem essa chave, o endpoint `/questoes` retorna erro HTTP 503;
- os materiais usados pela API ficam em [backend/app/data/materiais.json](backend/app/data/materiais.json);
- os usuários cadastrados são armazenados em [backend/app/data/users.json](backend/app/data/users.json);
- os dados exibidos pelo frontend estão em [frontend/app/data](frontend/app/data);
- o projeto usa arquivos JSON como armazenamento; não há integração com banco de dados configurada atualmente.
