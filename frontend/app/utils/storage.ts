import usersList from '../data/user.json' // Seu JSON com os usuários padrão

export type Usuario = {
  nome: string
  email: string
  senha: string
}

export function handleUsers(): Usuario[] {
  if (typeof window === 'undefined') return []

  const users = localStorage.getItem('listaUsuarios')

  if (users) {
    return JSON.parse(users)
  }

  localStorage.setItem('listaUsuarios', JSON.stringify(usersList))
  return usersList
}