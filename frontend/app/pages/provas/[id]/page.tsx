'use client'

import { notFound } from "next/navigation";
import { Suspense, use, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import ProvaConteudo from "@/app/components/ProvaConteudo/provaConteudo";
// import provasJson from "../../../data/provas.json";
import { Prova } from "../../../types";
import { buscarMaterialID, buscarProvaEnem } from "@/app/services/api";

// const provas = provasJson as Prova[];

export default function ProvaPage({params} : {params: Promise<{id: string}>}){
    const {id} = use(params);
    const [prova, setProva] = useState<Prova | null>(null);
    const [carregando, setCarregando] = useState(true);
    
    useEffect(() => {
        async function carregarProva() {
            try {
                // if(id.startsWith("enem-")){
                //     setProva(await buscarProvaEnem(id));
                // } else {
                //     setProva(provasJson.find((p) => String(p.id) === id) || null);
                // }
                setProva(await buscarProvaEnem(id));
            } catch (error: unknown) {
                toast.error((error as Error).message || `Erro ao carregar a prova!`);
                setProva(null);
            } finally {
                setCarregando(false);
            }
        }

        carregarProva();
    }, [id]);
    // const prova = provas.find((p) => String(p.id) === id);

    if (carregando) {
        return (
            <div className="page">
                <p className="vazio">Carregando prova...</p>
            </div>
        );
    }

    if (!prova) notFound();

    return (
        <Suspense fallback={null}>
            <ProvaConteudo prova={prova} />
            <ToastContainer position="top-center"/>
        </Suspense>
    );
}