import BotaoFechar from "../ButtonFechar/botaoFechar";
import Image, { StaticImageData } from 'next/image'

import './header.css'

type props = {imagem: StaticImageData, titulo: string, subtitulo: string, onFechar?: () => void}

export default function HeaderConteudo({imagem, titulo, subtitulo, onFechar} : props){
    return(<div className="cabecalho">
                <div className="logo"> 
                    <img className="imagem" src={imagem.src}></img>
                </div>
                <div className="textos">
                    <h1 className="titulo">{titulo}</h1>
                    <p className="subtitulo">{subtitulo}</p>
                </div>
                <BotaoFechar onClick={onFechar} />
            </div>);
}