import { MaterialDidatico } from "../types";

const API_URL = "https://omnia-api-2ihz.onrender.com";

let cacheMateriais: MaterialDidatico[] | null = null;

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

export async function listarMateriais(forcarAtualizacao = false): Promise<MaterialDidatico[] | null> {
  if (cacheMateriais && !forcarAtualizacao) {
    return cacheMateriais;
  }

  const response = await fetch(`${API_URL}/materiais`, {
    method: "GET"
  })

  if(!response.ok){
    return null
  }

  const dados = await response.json();
  cacheMateriais = Array.isArray(dados) ? dados : [];

  return cacheMateriais;
}

export async function buscarMaterialID(id: number){
  const response = await fetch(`${API_URL}/materiais/${id}`, {
    method: "GET"
  })

  if(!response.ok){
    return null
  }

  return response.json();
}