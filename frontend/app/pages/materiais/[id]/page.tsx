'use client'

import { notFound } from "next/navigation";
import Navbar from "../../../components/Navbar/navbar"
import HeaderConteudo from "@/app/components/HeaderConteudo/header";
import materiaisDidaticos from "../../../data/materiaisDidaticos.json";
import { MaterialDidatico } from "../../../types";
import { capasDisciplinas } from "@/app/utils/capasDisciplinas";
import imgPadrao from '../../../img/disciplinas/ciencias.png'
import { Suspense } from "react";
import { use, useState} from "react";

import { QuestaoIA, QuestionarioIA, NiveisQuestionarioIA } from "../../../types";

import questoesMateriaisDidaticos from "../../../data/questoesMateriaisDidaticos.json"

import Select from '../../../components/Forms/Select/select'
import Input from "@/app/components/Forms/Input/input";

import { useRouter } from "next/navigation";

import Button from '../../../components/Button/button'

import Questionario from "@/app/components/Questionario/questionario";

import '../index.css'

const materiais = materiaisDidaticos as MaterialDidatico[];

const questoesMateriais = questoesMateriaisDidaticos as QuestionarioIA[];

export default function MaterialPage({params} : {params: Promise<{id: string}>}){
    const {id} = use(params);
    const material = materiais.find((m) => String(m.id) === id);
    const [conteudo, setConteudo] = useState(0);
    const [nivel, setNivel] = useState('');
    const [qtdQuestoes, setQtdQuestoes] = useState('');
    const [questoes, setQuestoes] = useState<QuestaoIA[]>([])

    const router = useRouter();

    const handleGerarQuestoes = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setConteudo(conteudo + 1);

        const questionario = questoesMateriais.find((q) => String(q.id) === id);

        if (!questionario) notFound();

        setQuestoes(questionario.questoes[nivel as keyof NiveisQuestionarioIA].slice(0, Number(qtdQuestoes)));

        setNivel('');
        setQtdQuestoes('');
    }

    const handleConteudo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setConteudo(conteudo + 1);
    }

    const onFechar = () => {
        router.back();
        setConteudo(0);
    }

    if (!material) notFound();

    return (
        <Suspense fallback={null}>
            <div className="painel materiais">
                <HeaderConteudo imagem = {capasDisciplinas.get(material.disciplina) ?? imgPadrao} titulo={material.tema} subtitulo={`${material.disciplina} - ${material.anoEscolar}`} onFechar = {onFechar}/>
               
                <section className="corpo">
                    {conteudo == 0 && (
                        <>
                            <p>{material.conteudo}</p>
        
                            <div className="video">
                                <h2>Material complementar:</h2>
                                <iframe
                                    width="100%"
                                    height="400"
                                    src={material.videoUrl.replace('watch?v=', 'embed/')}
                                    title={material.tema}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
        
                            <Button type="submit" onClick = {(e) => handleConteudo(e)}>Testar aprendizado</Button>
                        </>

                    )}

                    {conteudo == 1 && (<>
                        <form onSubmit={(e) => handleGerarQuestoes(e)}>
                            <Select nome="nivel" conteudo="Selecione nível de dificuldade" opcoes={['facil', 'medio', 'dificil']} onChange={setNivel} value={nivel}></Select>
                            <Input type="number" min="1" max="3" label="Selecione a quantidade de questões:" onChange = {(e) => setQtdQuestoes(e.target.value)} value={qtdQuestoes} placeholder='Digite...'></Input>
                            <Button type="submit">Gerar questões</Button>
                        </form>
                    </>)}

                    {conteudo == 2 && (<>
                        <Questionario questoes={questoes} onFechar={() => setConteudo(0)}></Questionario>
                    </>)}
                   
                </section>

            </div>
        </Suspense>
    );
}