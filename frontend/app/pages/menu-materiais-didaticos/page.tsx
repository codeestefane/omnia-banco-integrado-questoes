'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify';

import Select from '../../components/Forms/Select/select'
import CardMenu from '../../components/CardMenu/cardMenu'

import imgPadrao from '../../img/disciplinas/ciencias.png'
import { capasDisciplinas } from '@/app/utils/capasDisciplinas'
import { MaterialDidatico } from '@/app/types'
import { buscarUsuarioAtual, listarMateriais } from '@/app/services/api';

export default function MenuMateriaisDidaticos(){ 
    const [materiais, setMateriais] = useState<MaterialDidatico[]>([]);
    const [carregando, setCarregando] = useState(true);
    
    const [anoEscolar, setAnoEscolar] = useState('');
    const [disciplina, setDisciplina] = useState('');
    const [tema, setTema] = useState('');
    
    const router = useRouter();

    useEffect(() => {
        
        async function carregarMateriais() {
            try {
                const dados = await listarMateriais();
                setMateriais(Array.isArray(dados) ? dados : []);
            } catch (error: unknown) {
                toast.error((error as Error).message || 'Erro ao carregar materiais didáticos.');
                setMateriais([]);
            } finally {
                setCarregando(false);
            }
        }

        carregarMateriais();
    }, []);

    const anosEscolares = [...new Set(materiais.map((m) => m.anoEscolar))];
    const disciplinas = [...new Set(materiais.map((m) => m.disciplina))];
    const temas = [...new Set(materiais.map((m) => m.tema))];
    const filtrados = materiais.filter((m) =>
        (!anoEscolar || anoEscolar === "Todos" || m.anoEscolar=== anoEscolar) && (!disciplina || disciplina === "Todos" || m.disciplina === disciplina) && (!tema || tema === "Todos" || m.tema === tema)
    )

    return(<>
        <div className="page">
            <form>
                <Select nome="anoEscolar" conteudo="Selecione o ano escolar" opcoes={["Todos", ...anosEscolares]} onChange = {setAnoEscolar} value={anoEscolar}></Select>
                <Select nome="disciplina" conteudo="Selecione a disciplina" opcoes={["Todos", ...disciplinas]} onChange = {setDisciplina} value={disciplina}></Select>
                <Select nome="tema" conteudo="Selecione o tema" opcoes={["Todos", ...temas]} onChange = {setTema} value={tema}></Select>
            </form>

            { carregando ? (
                <p className="vazio">Carregando materiais...</p>
            ) : filtrados.length === 0 ? (
                <p className="vazio">Nenhum material encontrado!</p>
            ) : (
            <section className='card-conteudo'>
                 {filtrados.map((m) => (
                        <CardMenu
                            key={m.id}
                            imagem={capasDisciplinas.get(m.disciplina) ?? imgPadrao} 
                            titulo={`${m.tema}`} 
                            descricao={`${m.disciplina} - ${m.anoEscolar}`}
                            onClick={() => router.push(`/pages/materiais/${m.id}`)}>
                        </CardMenu>
                    ))}
            </section>)}
        </div>
        <ToastContainer position="top-center"/>
    </>);
};