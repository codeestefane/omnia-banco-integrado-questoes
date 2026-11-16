'use client'
import { useRouter } from 'next/navigation'

import Button from '../../components/Button/button'
import './index.css'

import { handleUsers } from '@/app/utils/storage'

import Input from '../../components/Forms/Input/input'

import Navbar from '@/app/components/Navbar/navbar';

import { useState } from 'react'

import { ToastContainer, toast } from 'react-toastify'

type Usuario = {
    nome: string;
    email: string;
    senha: string;
}

// const usuarios = usersList as Usuario[];

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [user, setUser] = useState < Usuario | null > (null);

    const router = useRouter()

    const handleLogin =  async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const usersList = handleUsers();

        if(email && password){
            const loggedUser = usersList.find(user => user.email == email && user.senha == password);
      
            if(loggedUser){
                localStorage.setItem('usuarioLogado', JSON.stringify(loggedUser))
                setUser(loggedUser);

                setEmail('');
                setPassword('');

                router.push("/pages/menu-materiais-didaticos");

            } else {
                toast.error("E-mail ou senha inválidos!");
            }
        } else {
            toast.warning("Preencha todos os campos!");

        }
    }    
    return(
        <>
        <Navbar exibirItens={false}/>   
        <div className='page'>
            <form className='login' onSubmit={(e) => handleLogin(e)}>
                <Input label="Digite seu e-mail:" type="email" name="email" onChange = {(e) => setEmail(e.target.value)} required value={email}></Input>
                <Input label="Digite sua senha:" type="password" name="password" onChange = {(e) => setPassword(e.target.value)} required value={password}></Input>
                <Button type="submit">Login</Button>
                <p>Não tem uma conta? <span onClick={(e) => router.push('/pages/cadastro')}>Cadastre-se!</span></p>
            </form>
        </div>
        <ToastContainer position="top-center"/>
    </>);
    
}