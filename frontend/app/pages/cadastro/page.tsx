'use client'

import Navbar from '../../components/Navbar/navbar'
import Input from '../../components/Forms/Input/input'
import Button from '../../components/Button/button'

import { useRouter } from 'next/navigation'

import '../login/index.css'

import { handleUsers } from '@/app/utils/storage'

import usersList from '../../data/user.json'

import { useState } from 'react'

import { ToastContainer, toast } from 'react-toastify'

import { Usuario } from '@/app/types'

export default function Cadastro(){
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [senha, setPassword] = useState('');
    const [nome, setNome] = useState('');

    const handleCadastro = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const usersList = handleUsers();

        if(email && senha && nome){
            const loggedUser = usersList.find(user => user.email == email);
      
            if(loggedUser){
                toast.error("E-mail já cadastrado no sistema!")
            } else {
                const newUser: Usuario = { nome, email, senha}
                const usersListUpdate = [...usersList, newUser]

                localStorage.setItem('listaUsuarios', JSON.stringify(usersListUpdate))

                setNome('');
                setEmail('');
                setPassword('');

                router.refresh();

                toast.success("Usuário cadastrado com sucesso!");
            }
        } else {
            toast.warning("Preencha todos os campos!");
        }


    }

    return(<>
    <Navbar exibirItens={false}/>   
        <div className='page'>
            <form className='cadastro' onSubmit={handleCadastro}>
                <Input label="Digite seu nome completo:" type="text" name="nome" onChange = {(e) => setNome(e.target.value)} required value={nome}></Input>
                <Input label="Digite seu e-mail:" type="email" name="email" onChange = {(e) => setEmail(e.target.value)} required value={email}></Input>
                <Input label="Digite sua senha:" type="password" name="password" onChange = {(e) => setPassword(e.target.value)} required value={senha}></Input>
                <Button type="submit">Cadastro</Button>
                <p>Já tem uma conta? <span onClick={(e) => router.push('/pages/login')}>Faça login!</span></p>
            </form>
        </div>
        <ToastContainer position="top-center"/>
    </>)
}