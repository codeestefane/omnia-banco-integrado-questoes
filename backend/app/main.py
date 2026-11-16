from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import configuracao
from app.routers import materiais
from app.routers import questoes

app = FastAPI(
    title="Omnia API",
    description="API de apoio à educação básica com geração de questões por IA",
)

# configurações do servidor
app.add_middleware(
    CORSMiddleware,
    allow_origins=configuracao.origens_permitidas,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(materiais.router_materiais)
app.include_router(questoes.router_questoes)

@app.get("/")
def status():
    return {"status": "ok"}