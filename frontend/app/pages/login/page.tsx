'use client'
import { useRouter } from 'next/navigation'

import Button from '../../components/Button/button'
import './index.css'

import Input from '../../components/Forms/Input/input'

import Navbar from '@/app/components/Navbar/navbar';

import { useState } from 'react'

import { ToastContainer, toast } from 'react-toastify'

import { loginUsuario, buscarUsuarioAtual } from '@/app/services/api'

import { Usuario } from '@/app/types'

export default function Login(){
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const [user, setUser] = useState < Usuario | null > (null);

    const router = useRouter()

    const handleLogin =  async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(username && password){
            try {
                await loginUsuario(username, password);
                const user = await buscarUsuarioAtual();

                if(user){
                    localStorage.setItem("user", JSON.stringify(user));

                    setUserName('');
                    setPassword('');

                    router.push("/pages/menu-materiais-didaticos");

                } 

            } catch (error: any) {
                toast.error(error.message);
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
                <Input label="Digite seu nome de usuário:" type="text" name="username" onChange = {(e) => setUserName(e.target.value)} required value={username}></Input>
                <Input label="Digite sua senha:" type="password" name="password" onChange = {(e) => setPassword(e.target.value)} required value={password}></Input>
                <Button type="submit">Login</Button>
                <p>Não tem uma conta? <span onClick={(e) => router.push('/pages/cadastro')}>Cadastre-se!</span></p>
            </form>
        </div>
        <ToastContainer position="top-center"/>
    </>);
    
}