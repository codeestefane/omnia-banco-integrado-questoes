import Image, { StaticImageData } from 'next/image'
import './cardMenu.css'

type props = {imagem: StaticImageData, titulo: string, descricao: string, onClick?: () => void}

export default function CardMenu({imagem, titulo, descricao, onClick} : props){
    return(
        <div className="card-material" onClick={onClick}>
            <img src={imagem.src}></img>
            <div className="material-descricao">
                <h2>{titulo}</h2>
                <p>{descricao}</p>
            </div>
        </div>
    );
}