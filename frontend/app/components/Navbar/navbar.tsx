'use client'
import './navbar.css'

import { usePathname, useRouter } from 'next/navigation'

import iconeMateriais from '../../img/navegacao/icone_materiais_didaticos.png';
import iconeQuestoes from '../../img/navegacao/icone_questoes.png';
import iconeProvasSimulados from '../../img/navegacao/icone_provas_simulados.png';
import iconeExit from '../../img/navegacao/exit.png';
import logoOmnia from '../../img/navegacao/logo_omnia.png';
import { useEffect } from 'react';
import { buscarUsuarioAtual } from '@/app/services/api';

const navItems = [
    {nome: 'Materiais didáticos', href: '/pages/menu-materiais-didaticos', img: iconeMateriais, page: 'materiais'},
    {nome: 'Provas', href: '/pages/menu-provas', img: iconeQuestoes, page: 'provas'},
    {nome: 'Simulados', href: '/pages/menu-simulados', img: iconeProvasSimulados, page:'simulados'},
]

type props = {exibirItens: boolean}

export default function Navbar({exibirItens} : props){
    const pathname = usePathname();
    const router = useRouter();

    function handleClick(rota: string){
        router.push(rota);
    }

    function handleLogout(){
        localStorage.removeItem("access_token");
        router.replace('/pages/login');
        router.refresh();
    }

    return(
        <nav>
            {exibirItens && (
                <>
                
                    <ul>
                            {
                                navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                    <li
                                    key={item.href}
                                    onClick={() => handleClick(item.href)}
                                    className={` ${
                                        isActive ? 'active' : 'none'
                                    }`}
                                    >
                                    <img src={item.img.src}></img>
                                        <p>{item.nome}</p> 
                                    </li>
                                    )
                    
                            })}
                            
                    </ul>

                    <img src={iconeExit.src} className='exit' onClick={() => handleLogout()}></img>
                
                </>

            )}
            <img src={logoOmnia.src} className='omnia'></img>
        </nav>
    );
}