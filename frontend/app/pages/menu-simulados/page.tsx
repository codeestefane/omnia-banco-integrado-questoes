"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar/navbar";
import Select from "../../components/Forms/Select/select";
import Button from "../../components/Button/button";
import { Prova } from "../../types";
import ProvaConteudo from "../../components/ProvaConteudo/provaConteudo";
import { listarProvasEnem, gerarSimuladoEnem } from "../../services/api";

import "./index.css";

const quantidades = ["2", "3", "5"];

type AreaOpcao = {slug: string, nome: string};

function SimuladosConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [areasDisponiveis, setAreasDisponiveis] = useState<AreaOpcao[]>([]);
  const [area, setArea] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [simulado, setSimulado] = useState<Prova | null>(null);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarAreas() {
      try {
        const provas = await listarProvasEnem();
        const mapa = new Map<string, string>();
          provas.forEach((p) => mapa.set(p.id.replace(/^enem-\d{4}-/, ""), p.area));
          setAreasDisponiveis([...mapa].map(([slug, nome]) => ({ slug, nome })));
      } catch (error: unknown) {
        setErro((error as Error).message || "Erro ao carregar áreas disponíveis.");
      }
    }
    carregarAreas();
  }, []);

  function limpar() {
    setSimulado(null);
    setArea("");
    setQuantidade("");
    setErro("");
  }

  const preenchido = area !== "" && quantidade !== "";

  async function gerarSimulado() {
    const escolhida = areasDisponiveis.find((a) => a.nome === area);
    if (!escolhida) return;

    setGerando(true);
    setErro("");
    try {
      const prova = await gerarSimuladoEnem(escolhida.slug, Number(quantidade));
      setSimulado(prova);
      router.push("?gerado=1");
    } catch (error: unknown) {
      setErro("Erro ao gerar o simulado.");
    } finally {
      setGerando(false);
    }
  }

  function fechar() {
    limpar();
    router.push(window.location.pathname);
  }

  if (simulado && searchParams.get("gerado") === "1") {
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
            conteudo="Selecione a área"
            opcoes={areasDisponiveis.map((a) => a.nome)}
            value={area}
            onChange={(v) => {
              setArea(v);
              setErro("");
            }}
          />
          <Select
            nome="quantidade"
            conteudo="Selecione a quantidade de questões"
            opcoes={quantidades}
            value={quantidade}
            onChange={(v) => {
              setQuantidade(v);
              setErro("");
            }}
          />
          {gerando && (
            <p><b>Gerando simulado...</b></p>
          )}
          {erro && (
            <p className="simulado-erro">
              {erro}
            </p>
          )}
          <Button type="button" onClick={gerarSimulado} disabled={!preenchido || gerando}>
            {gerando ? "Gerando..." : "Gerar simulado"}
          </Button>
        </form>
      </div>
    </>
  );
}

export default function MenuSimulados() {
  return (
    <Suspense fallback={null}>
      <SimuladosConteudo />
    </Suspense>
  );
}