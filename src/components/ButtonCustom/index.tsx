"use client"
import "./styles.css"

type ButtonProps = {
    texto: string
    disabled?: boolean,
    onClick: (event: any) => void,
}
 
export function ButtonCustom({ texto, disabled, onClick }: ButtonProps) {
    return (
        <button
            disabled={disabled}
            onClick={(event) => onClick(event)}
        >
            {texto}
        </button>
    )
}