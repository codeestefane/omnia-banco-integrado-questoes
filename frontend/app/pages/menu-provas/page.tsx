//renomear para menu-provas

"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import Navbar from '../../components/Navbar/navbar'
import Select from '../../components/Forms/Select/select'
import CardMenu from '../../components/CardMenu/cardMenu'
import provasJson from '../../data/provas.json'
import { Prova } from '../../types'

import { capasBancas, capaPadrao } from '../../utils/capasBancas'

const provas = provasJson as Prova[];

const bancas = [...new Set(provas.map((p) => p.banca))];
const anos = [...new Set(provas.map((p) => p.ano))];
const areas = [...new Set(provas.map((p) => p.area))];

export default function MenuProvasAntigas(){
    const router = useRouter(); 
    const [banca, setBanca] = useState("");
    const [ano, setAno] = useState("");
    const [area, setArea] = useState("");

    const filtradas = provas.filter((p) =>
        (!banca || banca === "Todos" || p.banca === banca) && (!ano || ano === "Todos" || p.ano === ano) && (!area || area === "Todos" || p.area === area)
    )

    return(<>
        <div className="page">
            <form>
                <Select nome="anoEscolar" conteudo="Selecione a banca" opcoes={["Todos", ...bancas]} onChange={setBanca} value={banca}></Select>
                <Select nome="disciplina" conteudo="Selecione o ano" opcoes={["Todos", ...anos]} onChange={setAno} value={ano}></Select>
                <Select nome="tema" conteudo="Selecione a area" opcoes={["Todos", ...areas]} onChange={setArea} value={area}></Select>
            </form>

            {filtradas.length === 0 ? (
                <p className="vazio">Nenhuma prova encontrada para esses filtros!</p>
            ) : (
                <section className="card-provas">
                    {filtradas.map((p) => (
                        <CardMenu
                            key={p.id}
                            imagem={capasBancas.get(p.banca) ?? capaPadrao} 
                            titulo={`${p.banca} - ${p.ano}`} 
                            descricao={p.area}
                            onClick={() => router.push(`/pages/provas/${p.id}`)}>
                        </CardMenu>
                    ))}
                </section>
            )}
        </div>
    </>);
};