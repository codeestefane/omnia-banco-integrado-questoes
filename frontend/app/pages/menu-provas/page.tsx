"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify';

// import Navbar from '../../components/Navbar/navbar'
import Select from '../../components/Forms/Select/select'
import CardMenu from '../../components/CardMenu/cardMenu'
import { ProvaResumo } from '../../types'
import { listarProvasEnem } from '@/app/services/api'   

import { capasBancas, capaPadrao } from '../../utils/capasBancas'

export default function MenuProvasAntigas(){
    const router = useRouter(); 
    const [provasEnem, setProvasEnem] = useState<ProvaResumo[]>([]);
    const [carregando, setCarregando] = useState(true);

    const [banca, setBanca] = useState("");
    const [ano, setAno] = useState("");
    const [area, setArea] = useState("");

    useEffect(() => {
        async function carregar() {
            try {
                setProvasEnem(await listarProvasEnem());
            } catch (error: unknown) {
                toast.error((error as Error).message || "Erro ao carregar provas do ENEM.");
            } finally {
                setCarregando(false);
            }
        }
        carregar();
    }, []);

    const provas: ProvaResumo[] = [...provasEnem];

    const bancas = [...new Set(provas.map((p) => p.banca))];
    const anos = [...new Set(provas.map((p) => p.ano))];
    const areas = [...new Set(provas.map((p) => p.area))];

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

            {carregando ? (
                <p className="vazio">Carregando provas...</p>
            ) : filtradas.length === 0 ? (
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
        <ToastContainer position="top-center"/>
    </>);
};