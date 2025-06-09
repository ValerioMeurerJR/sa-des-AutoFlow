"use client"
import { FormEvent, useRef, useState } from "react";
import "./styles.css"
import { useRouter } from "next/navigation";
import { ButtonCustom } from "@/components/ButtonCustom";
import axios from "axios";

const host = "http://localhost:3333"

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const disabledButton = (!email || !(password.length >= 8))
  const inputPassword = useRef<HTMLInputElement>(null);

  async function handleLogin() {
    try {
      const response = await axios.post<{ access_token: string }>(`${host}/user/login`, {
        email, password
      })

      localStorage.setItem('access_token', response.data.access_token)
      router.push('/dashboard')
    } catch {
      alert("Erro ao fazer login")
    }
  };

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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  inputPassword.current?.focus();
                }
              }}
            />
            <input
              type="password"
              placeholder="Password"
              id="password"
              className="input"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              ref={inputPassword}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLogin();
                }
              }}
            />
          </div>
          <label>
            <ButtonCustom
              onClick={handleLogin}
              disabled={disabledButton}
              texto="Entrar"
            />
          </label>
        </div>
      </main>
    </div>
  );
}
