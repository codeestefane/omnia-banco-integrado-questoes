from google import genai
from google.genai import types

from app.config import configuracao
from app.schemas.material import Material
from app.schemas.questao import Dificuldade, Questao, QuestaoGerada

class IAIndisponivel(Exception):
    pass

class IAErro(Exception):
    pass

class QuantidadeErro(Exception):
    pass

NIVEIS = {
    "Fácil": "perguntas diretas, que cobram a ideia central e definições do texto",
    "Médio": "perguntas que exigem relacionar conceitos ou interpretar o texto",
    "Difícil": "perguntas que exigem inferência, aplicação em situação nova e raciocínio em etapas",
}

def montar_prompt(material: Material, dificuldade: Dificuldade, quantidade: int) -> str:
    return f"""Você é um professor da educação básica brasileira.
                Crie {quantidade} questões de múltipla escolha para estudantes do {material.anoEscolar}, 
                baseadas EXCLUSIVAMENTE no material abaixo.

                Nível {dificuldade}: {NIVEIS[dificuldade]}.

                Regras:
                - Cada questão tem exatamente 4 alternativas, e apenas 1 está correta.
                - "correta" é o índice da alternativa correta (0 a 3).
                - Varie a posição da resposta correta entre as questões.
                - A justificativa explica em 1 ou 2 frases por que a alternativa está correta.
                - Não use informações que não estejam no material.
                - Escreva em português do Brasil.

                DISCIPLINA: {material.disciplina}
                TEMA: {material.tema}
                MATERIAL:
                {material.conteudo}"""

def gerar_questoes(material: Material, dificuldade: Dificuldade, quantidade: int):
    if not configuracao.gemini_api_key:
        raise IAIndisponivel("Chave da API não configurada!")
    if quantidade > 10 or quantidade < 1:
        raise QuantidadeErro("Quantidade de questões fora do range [1, 10].")
    try:
        print("Enviando pedido para o Gemini...")
        cliente = genai.Client(api_key=configuracao.gemini_api_key)
        resposta = cliente.models.generate_content(
            model=configuracao.gemini_model, # configuracao.gemini_model
            contents=montar_prompt(material, dificuldade, quantidade),
            config=types.GenerateContentConfig(
                response_mime_type="application/json", # tipo da saida
                response_schema=list[QuestaoGerada], # esquema de saida
                temperature=0.7, # criatividade
                thinking_config=types.ThinkingConfig(thinking_budget=0),
            )
        )
        print("Gemini respondeu com sucesso!")
    except Exception as e:
        raise IAErro(f"Falha ao chamar a IA: {e}")

    questoes_geradas = resposta.parsed or []
   
    return [
        Questao(
            id=i+1,
            enunciado=q.enunciado,
            alternativas=q.alternativas,
            correta=q.correta,
            justificativa=q.justificativa,
            dificuldade=dificuldade,
        )
        for i, q in enumerate(questoes_geradas)
    ]