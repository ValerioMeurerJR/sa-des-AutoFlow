"use client"
import "./styles.css"

type ButtonProps = {
    texto: string
    disabled?: boolean,
    onClick: (event: any) => void,
    className: string
}

export function ButtonCustom({ texto, disabled, onClick, className }: ButtonProps) {
    return (
        <button
            disabled={disabled}
            onClick={(event) => onClick(event)}
            className={className}
        >
            {texto}
        </button>
    )
}