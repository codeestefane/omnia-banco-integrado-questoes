"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar/navbar";
import Select from "../../components/Forms/Select/select";
import Button from "../../components/Button/button";
import provasJson from "../../data/provas.json";
import { Prova } from "../../types";
import ProvaConteudo from "../../components/ProvaConteudo/provaConteudo";

import "./index.css";

const provas = provasJson as Prova[];

const bancas = [...new Set(provas.map((p) => p.banca))];
const areas = [...new Set(provas.map((p) => p.area))];
const quantidades = ["2", "3", "5"];

function embaralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// 1. Componente interno onde useSearchParams() é chamado
function SimuladosConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [banca, setBanca] = useState("");
  const [area, setArea] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [simulado, setSimulado] = useState<Prova | null>(null);
  const [erro, setErro] = useState(false);

  function limpar() {
    setSimulado(null);
    setBanca("");
    setArea("");
    setQuantidade("");
    setErro(false);
  }

  useEffect(() => {
    if (!searchParams.get("gerado") && simulado !== null) {
      limpar();
    }
  }, [searchParams]);

  const preenchido = banca !== "" && area !== "" && quantidade !== "";

  function gerarSimulado() {
    const todasQuestoes = provas
      .filter((p) => p.banca === banca && p.area === area)
      .flatMap((p) => p.questoes);

    if (todasQuestoes.length === 0) {
      setErro(true);
      return;
    }

    const selecionadas = embaralhar(todasQuestoes).slice(0, Number(quantidade));

    setErro(false);
    setSimulado({
      id: "simulado",
      banca,
      ano: "- Simulado",
      area: area,
      questoes: selecionadas.map((q, i) => ({ ...q, numero: i + 1 })),
    });

    router.push("?gerado=1");
  }

  function fechar() {
    limpar();
    router.push(window.location.pathname);
  }

  if (simulado) {
    return (
      <>
        <Navbar exibirItens={true} />
        <ProvaConteudo prova={simulado} onFechar={fechar} />
      </>
    );
  }

  return (
    <>
      <Navbar exibirItens={true} />
      <div className="page">
        <form className="form-simulado" onSubmit={(e) => e.preventDefault()}>
          <Select
            nome="banca"
            conteudo="Selecione a banca"
            opcoes={bancas}
            value={banca}
            onChange={(v) => {
              setBanca(v);
              setErro(false);
            }}
          />
          <Select
            nome="area"
            conteudo="Selecione a area"
            opcoes={areas}
            value={area}
            onChange={(v) => {
              setArea(v);
              setErro(false);
            }}
          />
          <Select
            nome="quantidade"
            conteudo="Selecione a quantidade de questões"
            opcoes={quantidades}
            value={quantidade}
            onChange={(v) => {
              setQuantidade(v);
              setErro(false);
            }}
          />
          {erro && (
            <p className="simulado-erro">
              Não há questões para essa combinação!
            </p>
          )}
          <Button type="button" onClick={gerarSimulado} disabled={!preenchido}>
            Gerar simulado
          </Button>
        </form>
      </div>
    </>
  );
}

// 2. Componente da página que fornece a barreira <Suspense> por fora
export default function MenuSimulados() {
  return (
    <Suspense fallback={null}>
      <SimuladosConteudo />
    </Suspense>
  );
}