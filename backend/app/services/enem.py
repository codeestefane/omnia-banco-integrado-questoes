import re
from functools import lru_cache

import httpx

ENEM_URL = "https://api.enem.dev/v1"
POR_PAGINA = 50      

AREAS = {
    "linguagens": "Linguagens, Códigos e suas Tecnologias",
    "ciencias-humanas": "Ciências Humanas e suas Tecnologias",
    "ciencias-natureza": "Ciências da Natureza e suas Tecnologias",
    "matematica": "Matemática e suas Tecnologias",
}

class EnemErro(Exception):
    pass

class ProvaNaoEncontrada(Exception):
    pass

def _get(caminho: str, params: dict | None = None):
    try:
        resposta = httpx.get(f"{ENEM_URL}{caminho}", params=params, timeout=20)
        resposta.raise_for_status()
        return resposta.json()
    except httpx.TimeoutException:
        raise EnemErro("A API do ENEM demorou demais para responder. Tente novamente em instantes.")
    except httpx.HTTPStatusError as e:
        raise EnemErro(f"A API do ENEM respondeu com erro ({e.response.status_code}).")
    except httpx.HTTPError:
        raise EnemErro("Não foi possível conectar à API do ENEM.")

@lru_cache(maxsize=1)
def _exames() -> tuple[dict, ...]:
    dados = _get("/exams")
    exames = dados if isinstance(dados, list) else dados.get("exams", [])
    return tuple(exames)

def listar_anos() -> list[int]:
    return sorted({int(e["year"]) for e in _exames() if "year" in e}, reverse=True)

def _idioma(ano: int) -> str | None:
    # prefere inglês; senão o primeiro idioma disponível; senão nenhum
    for exame in _exames():
        if exame.get("year") == ano:
            idiomas = [i["value"] for i in exame.get("languages", [])]
            if "ingles" in idiomas:
                return "ingles"
            return idiomas[0] if idiomas else None
    return None

# guarda o resultado em memória
@lru_cache(maxsize=16)
def _baixar_questoes(ano: int) -> tuple[dict, ...]:
    idioma = _idioma(ano)
    todas: list[dict] = []
    offset = 0
    while offset < 400:  # trava de segurança contra loop infinito
        params = {"limit": POR_PAGINA, "offset": offset}
        if idioma:
            params["language"] = idioma
        dados = _get(f"/exams/{ano}/questions", params)
        lote = dados.get("questions", [])
        todas.extend(lote)
        tem_mais = dados.get("metadata", {}).get("hasMore", True)
        if len(lote) < POR_PAGINA or not tem_mais:
            break
        offset += POR_PAGINA
    return tuple(todas)

# tudo que será ignorado das questões no momento de renderizar
def _limpar(texto: str | None) -> str:
    texto = texto or ""
    texto = re.sub(r"!\[.*?\]\(.*?\)", "", texto) # imagens: ![](url)
    texto = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", texto) # links: fica só o texto
    texto = texto.replace("**", "") # negrito
    texto = re.sub(r"\n{3,}", "\n\n", texto) # linhas em branco demais
    return texto.strip()

def _converter(q: dict, ano: int, slug: str) -> dict | None:
    # ignora questões que dependem de imagem (o site exibe só texto)
    if q.get("files"):
        return None

    alternativas = q.get("alternatives") or []
    textos = [(a.get("text") or "").strip() for a in alternativas]
    if len(textos) < 2 or any(not t for t in textos):
        return None

    correta = next((i for i, a in enumerate(alternativas) if a.get("isCorrect")), None)
    if correta is None:
        return None

    partes = [_limpar(q.get("context")), _limpar(q.get("alternativesIntroduction"))]
    enunciado = "\n\n".join(p for p in partes if p)
    if not enunciado:
        return None

    numero = int(q.get("index", 0))
    return {
        "id": f"enem-{ano}-{slug}-{numero}",
        "numero": numero,
        "enunciado": enunciado,
        "alternativas": textos,
        "correta": correta,
        "area": AREAS[slug],
    }

def listar_provas_enem() -> list[dict]:
    return [
        {"id": f"enem-{ano}-{slug}", "banca": "ENEM", "ano": str(ano), "area": nome}
        for ano in listar_anos()[:]
        for slug, nome in AREAS.items()
    ]

def buscar_prova_enem(ano: int, slug: str) -> dict:
    if slug not in AREAS or ano not in listar_anos():
        raise ProvaNaoEncontrada("Esta prova não existe no ENEM.")

    questoes = []
    numeros_vistos = set()
    for q in _baixar_questoes(ano):
        if q.get("discipline") != slug:
            continue
        convertida = _converter(q, ano, slug)
        if convertida and convertida["numero"] not in numeros_vistos:
            numeros_vistos.add(convertida["numero"])
            questoes.append(convertida)

    if not questoes:
        raise ProvaNaoEncontrada(f"Nenhuma questão disponível para {AREAS[slug]} ({ano}).")

    questoes.sort(key=lambda x: x["numero"])
    return {
        "id": f"enem-{ano}-{slug}",
        "banca": "ENEM",
        "ano": str(ano),
        "area": AREAS[slug],
        "questoes": questoes,
    }