# Banco Integrado de Materiais Pedagógicos

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-orange)
![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?logo=nextdotjs)
![FastAPI](https://img.shields.io/badge/FastAPI-0.162.5-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python)

Plataforma educacional que reúne materiais didáticos, provas e simulados para estudantes do ensino fundamental e médio, com geração automática de questões por IA com base em conteúdos pedagógicos.

## O que o projeto faz

Este projeto combina um frontend em Next.js com uma API em FastAPI para oferecer:

- catálogo de materiais didáticos organizados por ano escolar, disciplina e tema;
- acesso a conteúdos pedagógicos com resumo e links de vídeo;
- navegação por provas por banca, ano e área;
- geração de simulados a partir do banco de questões disponível;
- criação de questões de múltipla escolha com o Gemini, adaptadas ao nível de dificuldade informado;
- autenticação simples em front-end, usando dados persistidos localmente no navegador.

O conteúdo principal está em [backend/app/data/materiais.json](backend/app/data/materiais.json) e em [frontend/app/data](frontend/app/data), com a lógica de negócio distribuída entre a API e a interface web.

## Por que o projeto é útil

- centraliza recursos de estudo em um único ambiente;
- facilita a revisão de conteúdos por disciplina e etapa escolar;
- reduz o esforço manual na criação de exercícios e simulados;
- ajuda alunos e professores a praticar com materiais reais e organização por filtros;
- permite expandir o banco de materiais com novos conteúdos sem quebrar a estrutura atual.

## Estrutura do projeto

```text
.
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── data/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── .env.example
│   ├── requirements.txt
│   └── .venv/
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

O backend foi construído em FastAPI e expõe endpoints para:

- listar materiais didáticos;
- buscar um material por ID;
- gerar questões por IA com base em um tema específico.

Principais arquivos:

- [backend/app/main.py](backend/app/main.py)
- [backend/app/routers/materiais.py](backend/app/routers/materiais.py)
- [backend/app/routers/questoes.py](backend/app/routers/questoes.py)
- [backend/app/services/gemini.py](backend/app/services/gemini.py)
- [backend/app/services/materiais.py](backend/app/services/materiais.py)

### Frontend

O frontend foi construído com Next.js e oferece páginas de login, cadastro, seleção de materiais, provas e simulados. A navegação principal é organizada em páginas como:

- [frontend/app/page.tsx](frontend/app/page.tsx)
- [frontend/app/pages/login/page.tsx](frontend/app/pages/login/page.tsx)
- [frontend/app/pages/menu-materiais-didaticos/page.tsx](frontend/app/pages/menu-materiais-didaticos/page.tsx)
- [frontend/app/pages/menu-provas/page.tsx](frontend/app/pages/menu-provas/page.tsx)
- [frontend/app/pages/menu-simulados/page.tsx](frontend/app/pages/menu-simulados/page.tsx)

## Como começar

### Requisitos

- Python 3.10+
- Node.js 20+
- npm
- Chave da API do Google Gemini para geração de questões por IA

### 1) Configure o backend

No diretório [backend](backend):

```bash
cd backend
python -m venv .venv
```

Windows (PowerShell):

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Crie o arquivo de ambiente a partir de [backend/.env.example](backend/.env.example):

```bash
copy .env.example .env
```

Edite o arquivo `.env` e informe sua chave da API:

```env
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-3.8-flash
CORS_ORIGINS=http://localhost:3000
```

Inicie a API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

A documentação interativa da API ficará disponível em:

- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

### 2) Configure o frontend

No diretório [frontend](frontend):

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em:

- `http://localhost:3000`

## Exemplos de uso

### Listar materiais

```bash
curl http://localhost:8000/materiais
```

### Buscar um material específico

```bash
curl http://localhost:8000/materiais/1
```

### Gerar questões de IA

```bash
curl -X POST "http://localhost:8000/questoes?material_id=1" \
  -H "Content-Type: application/json" \
  -d '{
    "dificuldade": "Médio",
    "quantidade": 5
  }'
```

A API aceita as dificuldades `Fácil`, `Médio` e `Difícil` e gera listas de questões com 4 alternativas e 1 resposta correta.

## Observações importantes

- As respostas geradas pela IA dependem da chave `GEMINI_API_KEY` configurada no ambiente do backend.
- O frontend usa armazenamento local do navegador para persistir cadastro e sessão do usuário.
- O banco de materiais pode ser ampliado editando [backend/app/data/materiais.json](backend/app/data/materiais.json) e o conjunto de dados do frontend em [frontend/app/data](frontend/app/data).

## Contribuição

Para contribuir com o projeto, fique atento ao fluxo de desenvolvimento de cada parte:

- ajuste o backend em [backend/app](backend/app);
- ajuste a interface em [frontend/app](frontend/app);
- mantenha os dados pedagógicos consistentes entre as estruturas de JSON do frontend e do backend.

Se quiser evoluir a plataforma, os pontos mais naturais são a criação de autenticação real no backend, armazenamento persistente em banco de dados e expansão do catálogo de conteúdos e avaliações.
