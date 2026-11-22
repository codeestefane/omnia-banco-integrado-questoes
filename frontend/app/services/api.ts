import { MaterialDidatico, QuestaoIA, Prova, ProvaResumo } from "../types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");

export class SessaoExpiradaErro extends Error {
  constructor() {
    super("Sua sessão expirou. Faça login novamente.");
  }
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function cadastrarUsuario(dados: {
  username: string;
  email: string;
  full_name: string;
  password: string;
}) {
  const response = await fetch(`${API_URL}/cadastrar/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.detail || "Erro ao cadastrar usuário");
  }

  return response.json();
}

export async function loginUsuario(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch(`${API_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!response.ok) {
    const erro = await response.json();
    throw new Error(erro.detail || "Usuário ou senha incorretos");
  }

  const data = await response.json();
  localStorage.setItem("access_token", data.access_token);
  return data;
}

export async function buscarUsuarioAtual() {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const response = await fetch(`${API_URL}/users/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    return null;
  }

  return response.json();
}

export async function listarMateriais(): Promise<MaterialDidatico[] | null> {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/materiais/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  })

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/pages/login"; 
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if(!response.ok){
    return null
  }

  return await response.json();;
}

export async function buscarMaterialID(id: number){
  const token = localStorage.getItem("access_token");

  console.log(token);

  const response = await fetch(`${API_URL}/materiais/${id}`, {
    method: "GET", 
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  })

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/pages/login"; 
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if(!response.ok){
    return null
  }

  return response.json();
}

export async function gerarQuestoes(
  material_id: number, 
  dificuldade: "Fácil" | "Médio" | "Difícil", 
  quantidade: number
) : Promise<QuestaoIA[]> {
  const response = await fetch(`${API_URL}/questoes?material_id=${material_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ dificuldade, quantidade}),
  });

  if(response.status === 401){
    localStorage.removeItem("access_token");
    throw new SessaoExpiradaErro();
  }

  if(!response.ok){
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.detail || "Erro ao gerar questões. Tente novamente!");
  }

  return response.json();
  
}

export async function listarProvasEnem(): Promise<ProvaResumo[]> {
  const response = await fetch(`${API_URL}/provas/enem`);

  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.detail || "Erro ao carregar provas do ENEM.");
  }

  return response.json();
}

export async function buscarProvaEnem(id: string): Promise<Prova | null> {
  const partes = id.match(/^enem-(\d{4})-(.+)$/);
  if (!partes) return null;

  const [, ano, area] = partes;
  const response = await fetch(`${API_URL}/provas/enem/${ano}/${area}`);

  if (response.status === 404) return null;
  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.detail || "Erro ao carregar a prova.");
  }

  return response.json();
}