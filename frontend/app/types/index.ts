export type Questao = {
    id: string;
    numero: number;
    enunciado: string;
    alternativas: string[];
    correta: number;
};

export type Prova = {
    id: string;
    banca: string;
    ano: string;
    area: string;
    questoes: Questao[];
};

export type Usuario = {
    nome: string;
    email: string;
    senha: string;
}

export type MaterialDidatico = {
    id: number,
    anoEscolar: string,
    disciplina: string,
    tema: string,
    conteudo: string,
    videoUrl: string
}

export type QuestaoIA = {
    enunciado: string,
    alternativas: string[],
    correta: number,
    justificativa: string
}

export type NiveisQuestionarioIA = {
    facil: QuestaoIA[],
    medio: QuestaoIA[],
    dificil: QuestaoIA[]
}

export type QuestionarioIA = {
    id: number,
    questoes: NiveisQuestionarioIA
}

export type ProvaResumo = {
    id: string;
    banca: string;
    ano: string;
    area: string;
}