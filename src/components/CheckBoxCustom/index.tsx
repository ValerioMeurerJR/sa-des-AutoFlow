import { useState } from "react";

export default function CheckBoxCustom() {
    const [statusMotor, setStatusMotor] = useState<boolean | null>(null);

    return (
        <form>
            <h1>Status Motor</h1>

            <label>
                <input 
                    type="checkbox" 
                    checked={statusMotor === false} 
                    onChange={() => setStatusMotor(false)} 
                />
                Reprovado
            </label>

            <label>
                <input 
                    type="checkbox" 
                    checked={statusMotor === true} 
                    onChange={() => setStatusMotor(true)} 
                />
                Aprovado
            </label>

            <p>Status atual: {statusMotor === null ? "Não definido" : statusMotor ? "Aprovado" : "Reprovado"}</p>
        </form>
    );
}
