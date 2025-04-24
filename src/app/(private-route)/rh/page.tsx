"use client"
import { SelectCustom } from "@/components/SelectCustom";
import "./styles.css"
import { ButtonCustom } from "@/components/ButtonCustom";
import { InputCustom } from "@/components/InputCustom";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { FormEvent, useState } from "react";

const host = 'http://localhost:63977';

const opcoes = [
    { nome: "Analista de Qualidade" },
    { nome: "Produção" },
    { nome: "Logistica" }
];
type User = {
    id: string;
    nome: string;
    cpf: string;
    cargo: string;
    password: string;
    login: string;
    createDate: string;
}

export default function Rh() {
    const [nome, setNome] = useState<string>("");
    const [cpf, setCpf] = useState<string>("");
    const [cargo, setCargo] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    async function handleRegister(event: FormEvent) {
        event.preventDefault();
        if (!nome || !cpf || !cargo || !login || !password) {
            alert("Preencha todos os campos!");
            return;
        }

        const user: User = {
            "id": uuid(),
            "nome": nome,
            "cpf": cpf,
            "cargo": cargo,
            "login": login,
            "password": password,
            "createDate": new Date().toISOString(),
        }
        await axios.post(`${host}/ListaUsuario`, user);
        console.log("Usuario registrado:", user);
        setNome("")
        setCpf("")
        setCargo("")
        setLogin("")
        setPassword("");


    }


    return (
        <div className="body-rh">
            <h1>Produção de Carro</h1>
            <main className="main-rh">
                <h2>Cadastro novo veiculo</h2>
                <form className="form-rh">
                    <InputCustom texto="Nome" type="text" message={nome} setMessage={setNome} />
                    <InputCustom texto="CPF" type="text" message={cpf} setMessage={setCpf} />
                    <InputCustom texto="Login" type="text" message={login} setMessage={setLogin} />
                    <InputCustom texto="Password" type="password" message={password} setMessage={setPassword} />
                    <SelectCustom texto="Selecione o Cargo" message={cargo} setMessage={setCargo} option={opcoes} />
                    <div className="div-button-rh">
                        <ButtonCustom onClick={handleRegister} texto="Registrar Funcionario" />
                    </div>
                </form>
            </main>
            <div className="lista-quality">
                {/* {loading ? (
                    <SkeletonTable width={150} />
                ) : listCarState.length > 0 ? (
                    <DataTable columns={columns} dataLista={listCarState} paginationModel={paginationModel} />
                ) : (
                    <p>Nenhum dado encontrado.</p>
                )} */}
            </div>
        </div>
    );
}
