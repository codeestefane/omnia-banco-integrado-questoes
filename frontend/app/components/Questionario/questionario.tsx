'use client'

import { QuestaoIA } from "@/app/types";
import { useState } from "react";

import Button from "../Button/button";

import './questionario.css'
import { ToastContainer, toast } from "react-toastify";

type props = {questoes: QuestaoIA[], onFechar?: () => void};

export default function Questionario({questoes, onFechar} : props){
    const [respostas, setRespostas] = useState<Record<number, number>>({});  
    const [verificado, setVerificado] = useState(false);

    const escolher = (indiceQuestao: number, indiceAlternativa: number) => {
        if (verificado) return;
        setRespostas((prev) => ({
        ...prev,
        [indiceQuestao]: indiceAlternativa,
        }));
    }

    const verificar = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (Object.keys(respostas).length < questoes.length) {
            toast.warning("Responda todas as questões antes de verificar!");
            return;
        }
        setVerificado(true);
    }

    const refazer = () => {
        setRespostas({});
        setVerificado(false);
    }

    return (
    <div className="questionario">
        {questoes.map((q, i) => {
            const acertou = respostas[i] === q.correta;
            return (
                <div key={i} className="bloco-questao">
                    <div className="questao">
                        <p>{i + 1}. {q.enunciado}</p>

                        <div className="alternativas">
                            {q.alternativas.map((alt, j) => {
                                let classe = 'alternativa';
                                if (verificado) {
                                    if (j === q.correta) classe += ' correta';
                                    else if (j === respostas[i]) classe += ' errada';
                                }
                                return (
                                    <label key={j} className={classe}>
                                        <input
                                            type="radio"
                                            name={`questao-${i}`}
                                            checked={respostas[i] === j}
                                            onChange={() => escolher(i, j)}
                                            disabled={verificado}
                                        />
                                        {alt}
                                    </label>
                                )
                            })}
                        </div>
                    <ToastContainer position="top-center"/>
                    </div>

                    {verificado && (
                        <div className={acertou ? 'feedback acerto' : 'feedback erro'}>
                            <p>{acertou ? 'Parabéns, você acertou!' : 'Ops, vamos revisar esse conteúdo!'}</p>
                            <p><strong>Resposta correta:</strong> Item {String.fromCharCode(65 + q.correta)}.</p>
                            <p><strong>Justificativa:</strong> {q.justificativa}</p>
                        </div>
                    )}
                </div>
            )
        })}

        <div className="acoes">
            {
                verificado ? <Button type="submit" onClick={refazer}>Refazer questionário</Button>
                : <Button type="submit" onClick={(e) => verificar(e)}>Verificar respostas</Button>
            }
            <Button type="submit" onClick={onFechar} className="secundario">Fechar questionário</Button>
        </div>
    </div>
    ) 
}