"use client"

import { useRouter } from "next/navigation"
import "./botaoFechar.css"

type Props = {
    onClick?: () => void
}

export default function BotaoFechar({onClick}: Props){
    const router = useRouter()

    return (
        <button
            type="button"
            className="botao-fechar"
            onClick={onClick ?? (() => router.back())}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
        </button>
    );
}