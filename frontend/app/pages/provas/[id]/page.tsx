'use client'

import { notFound } from "next/navigation";
import ProvaConteudo from "@/app/components/ProvaConteudo/provaConteudo";
import provasJson from "../../../data/provas.json";
import { Prova } from "../../../types";
import { Suspense, use } from "react";

const provas = provasJson as Prova[];

export default function ProvaPage({params} : {params: Promise<{id: string}>}){
    const {id} = use(params);
    const prova = provas.find((p) => String(p.id) === id);

    if (!prova) notFound();

    return (
        <Suspense fallback={null}>
            <ProvaConteudo prova={prova} />
        </Suspense>
    );
}