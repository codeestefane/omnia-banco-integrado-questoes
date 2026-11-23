'use client'

import { notFound, useRouter } from "next/navigation";
import { Suspense } from "react";
import { use, useState, useEffect} from "react";

import HeaderConteudo from "@/app/components/HeaderConteudo/header";
import { MaterialDidatico, QuestaoIA } from "../../../types";
import Select from '../../../components/Forms/Select/select'
import Input from "@/app/components/Forms/Input/input";
import Button from '../../../components/Button/button'
import Questionario from "@/app/components/Questionario/questionario";

import { capasDisciplinas } from "@/app/utils/capasDisciplinas";
import imgPadrao from "@/app/img/disciplinas/ciencias.png";

import { buscarMaterialID, gerarQuestoes, SessaoExpiradaErro } from "@/app/services/api";

import '../index.css'
import { toast, ToastContainer } from "react-toastify";

const NIVEIS = { facil: "Fácil", medio: "Médio", dificil: "Difícil" } as const;
type Nivel = keyof typeof NIVEIS;

export default function MaterialPage({params} : {params: Promise<{id: string}>}){
    const [material, setMaterial] = useState<MaterialDidatico | null>();
    const [carregando, setCarregando] = useState(true);
    const [gerando, setGerando] = useState(false);

    const {id} = use(params);
    const [conteudo, setConteudo] = useState(0);
    const [nivel, setNivel] = useState('');
    const [qtdQuestoes, setQtdQuestoes] = useState('');
    const [questoes, setQuestoes] = useState<QuestaoIA[]>([])

    const router = useRouter();

    useEffect(() => {
            async function carregarMaterial() {

                try {
                    const dado = await buscarMaterialID(Number(id));
                    setMaterial(dado ? dado : null);
                } catch (error: unknown) {
                    toast.error((error as Error).message || `Erro ao carregar material com identificador ${id}!`);
                    setMaterial(null);
                } finally {
                    setCarregando(false);
                }
            }
    
            carregarMaterial();
        }, []);

    const handleGerarQuestoes = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!nivel){
            toast.warning("Selecione o nível da dificuldade");
            return;
        }

        setGerando(true);

        try{
            const resultado = await gerarQuestoes(
                Number(id),
                NIVEIS[nivel as Nivel],
                Number(qtdQuestoes)
            );
            setQuestoes(resultado);
            setNivel('');
            setQtdQuestoes('');
            setConteudo(2);
        } catch (error: unknown){
            if (error instanceof SessaoExpiradaErro) {
                router.push('/pages/login');
                return;
            }
            toast.error((error as Error).message || "Erro ao gerar questões!");
        } finally {
            setGerando(false);
        }
    }

    const handleConteudo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setConteudo(conteudo + 1);
    }

    const onFechar = () => {
        router.back();
        setConteudo(0);
    }

    if (carregando) {

        return(
        <div className="page">
            <p className="vazio">Material carregando...</p>
        </div>
        )
        
    }

    if (!material) {
        notFound();
    }

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
                                <Button type="submit" disabled={gerando}>
                                    {gerando ? 'Gerando questões...' : 'Gerar questões'}
                                </Button>
                                {gerando && (
                                    <p><b>A IA está gerando suas questões, isso pode levar alguns segundos...</b></p>
                                )}
                            </form>
                        </>)}

                        {conteudo == 2 && (<>
                            <Questionario questoes={questoes} onFechar={() => setConteudo(0)}></Questionario>
                        </>)}
            
                    </section>
                </div>
            <ToastContainer position="top-center"/>
        </Suspense>
    );
}