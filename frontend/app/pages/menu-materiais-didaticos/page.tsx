'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation'

import Navbar from '../../components/Navbar/navbar'
import Select from '../../components/Forms/Select/select'
import CardMenu from '../../components/CardMenu/cardMenu'

import imgPadrao from '../../img/disciplinas/ciencias.png'
import { capasDisciplinas } from '@/app/utils/capasDisciplinas'
import materiaisDidaticosJson from '../../data/materiaisDidaticos.json'

import { MaterialDidatico } from '@/app/types'

const materiais = materiaisDidaticosJson as MaterialDidatico[];

const anosEscolares = [...new Set(materiais.map((m) => m.anoEscolar))];
const disciplinas = [...new Set(materiais.map((m) => m.disciplina))];
const temas = [...new Set(materiais.map((m) => m.tema))];

export default function MenuMateriaisDidaticos(){
    const router = useRouter();
    const [anoEscolar, setAnoEscolar] = useState('');
    const [disciplina, setDisciplina] = useState('');
    const [tema, setTema] = useState('');

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

            {filtrados.length === 0 ? (
                <p className="vazio">Nenhum material encontrado para esses filtros!</p>
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
    </>);
};