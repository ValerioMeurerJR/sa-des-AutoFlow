"use client"
import { FormEvent, useState } from "react";
import "./styles.css"
import { useRouter } from "next/navigation";
import { ButtonCustom } from "@/components/ButtonCustom";

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const disabledButton = (!email || !(password.length >= 8))

  function handleCadastrar() {
    router.replace("/dashboard")
  }
  async function handleLogin() {
    console.log(email)
    console.log(password)
    router.replace("/dashboard")
  }

  return (
    <div className="containe-login">
    <main className="main-login">
      <div className="login">
        <h2>Faça Login</h2>
        <div className="form_inputs">
          <input
            type="text"
            placeholder="E-mail"
            id="user"
            className="input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <label>
          <ButtonCustom
            onClick={handleLogin}
            disabled={disabledButton}
            texto="Entrar"
          />
          <ButtonCustom
            onClick={handleCadastrar}
            texto="Cadastrar"
          />
        </label>
      </div>
    </main>
    </div>
  );
}
