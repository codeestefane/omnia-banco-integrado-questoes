'use client'

import Navbar from '../../components/Navbar/navbar'
import Input from '../../components/Forms/Input/input'
import Button from '../../components/Button/button'

import { useRouter } from 'next/navigation'

import '../login/index.css'

import { useState } from 'react'

import { ToastContainer, toast } from 'react-toastify'

import { Usuario } from '@/app/types'

import { cadastrarUsuario } from '@/app/services/api'

export default function Cadastro(){
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [senha, setPassword] = useState('');
    const [nome, setNome] = useState('');
    const [username, setUserName] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(email && senha && nome){
            setCarregando(true);

            try {
                await cadastrarUsuario({username: username, email: email, full_name: nome, password: senha})
                toast.success("Usuário cadastrado com sucesso!");
    
                setUserName('');
                setEmail('');
                setNome('');
                setPassword('');
            } catch(error: any){
                toast.error(error.message);
            } finally {
                setCarregando(false);
            }

        } else {
            toast.warning("Preencha todos os campos!");
        }

    }

    return(<>
    <Navbar exibirItens={false}/>   
        <div className='page page-cadastro'>
            <form className='cadastro' onSubmit={handleCadastro}>
                <Input label="Digite seu nome completo:" type="text" name="nome" onChange = {(e) => setNome(e.target.value)} required value={nome}></Input>
                <Input label="Digite seu nome de usuário:" type="text" name="username" onChange = {(e) => setUserName(e.target.value)} required value={username}></Input>
                <Input label="Digite seu e-mail:" type="email" name="email" onChange = {(e) => setEmail(e.target.value)} required value={email}></Input>
                <Input label="Digite sua senha:" type="password" name="password" onChange = {(e) => setPassword(e.target.value)} required value={senha}></Input>
                {carregando ? <p className='carregando'><b>Cadastrando...</b></p> : null}
                <Button type="submit">Cadastro</Button>
                <p>Já tem uma conta? <span onClick={(e) => router.push('/pages/login')}>Faça login!</span></p>
            </form>
        </div>
        <ToastContainer position="top-center"/>
    </>)
}