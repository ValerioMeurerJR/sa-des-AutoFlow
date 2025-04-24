"use client"
import "./styles.css"

type InputProps = {
    texto: string,
    type: string,
    message: string,
    setMessage: (value: string) => void
}

export function InputCustom({ texto, type, message, setMessage }: InputProps) {
    return (
        <div className="div-Input-Custom">
            <input
                type={type}
                id="input"
                value={message}
                onChange={(e) => { setMessage(e.target.value) }}
                placeholder={texto}
            />
        </div>
    )
}