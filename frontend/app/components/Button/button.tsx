import { ButtonHTMLAttributes } from "react";
import "./button.css"

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: Props){
    return <button {...props} className="button" />
}