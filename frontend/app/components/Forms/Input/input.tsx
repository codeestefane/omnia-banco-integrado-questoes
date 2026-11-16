import { InputHTMLAttributes } from "react";
import './input.css'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

export default function Input({label, ...rest}: Props){
    return(
        <div>
            <label htmlFor={rest.name}>
                {label}
            </label>
            <input {...rest} className="input" required></input>
        </div>
    )
}