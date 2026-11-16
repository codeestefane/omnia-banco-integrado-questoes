"use client"

import {Suspense, useState} from "react";
import {Prova} from "../../types";

import Button from "../Button/button"
import BotaoFechar from "../ButtonFechar/botaoFechar"

import HeaderConteudo from "../HeaderConteudo/header";

import { capasBancas, capaPadrao } from '../../../app/utils/capasBancas'

import "./provaConteudo.css";

const LETRAS = ["A", "B", "C", "D", "E"];
type Props = {prova: Prova; onFechar?: () => void}

export default function ProvaConteudo ({prova, onFechar}: Props){
    const [mostrarGabarito, setMostrarGabarito] = useState(false);//definir se vai exibir prova ou gabarito

    return (
        <Suspense fallback={null}>
            <section className="painel">
                <HeaderConteudo imagem={(capasBancas.get(prova.banca) ?? capaPadrao)} titulo={`${prova.banca} ${prova.ano}`} subtitulo={prova.area} onFechar={onFechar}></HeaderConteudo>
                <div className="corpo">
                        
                        {!mostrarGabarito ? (
                            <>
                            {prova.questoes.map((q) => (
                                <div key={q.id} className="questao">
                                    <p><b>Questão {q.numero} - </b>{q.enunciado}</p>
                                    <ul className="alternativas">
                                        {q.alternativas.map((alt, i) => (
                                            <li key={i}>
                                                <b>{LETRAS[i]}.</b> {alt}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            <div className="acao">
                                <Button onClick={() => setMostrarGabarito(true)}>Verificar gabarito</Button>
                            </div>
                            </>
                        ) : (
                            <>
                            <div className="gabarito">
                                {prova.questoes.map((q) => (
                                    <p key={q.id}><b>Questão {q.numero} - </b>Resposta {LETRAS[q.correta]}</p>
                                ))}
                            </div>

                            <div className="acao">
                                <Button onClick={() => setMostrarGabarito(false)}>Voltar para a prova</Button>
                            </div>
                            </>
                        )}
                        <>
                        </>
                </div>
            </section>
        </Suspense>
    );
}