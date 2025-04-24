"use client"
import { SelectCustom } from "@/components/SelectCustom";
import "./styles.css"
import { ButtonCustom } from "@/components/ButtonCustom";
import { InputCustom } from "@/components/InputCustom";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { FormEvent, useEffect, useState } from "react";
import SkeletonTable from "@/components/SkeletonTable";
import DataTable from "@/components/DataTable";
import { GridColDef } from "@mui/x-data-grid";

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


    const columns: GridColDef[] = [
        { field: 'nome', headerName: 'Nome', width: 200 },
        { field: 'cpf', headerName: 'CPF', width: 200 },
        { field: 'cargo', headerName: 'Cargo', width: 200 },
        { field: 'login', headerName: 'Login', width: 200 }
    ];

export default function Rh() {
    const [nome, setNome] = useState<string>("");
    const [cpf, setCpf] = useState<string>("");
    const [cargo, setCargo] = useState<string>("");
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [listaUser, setlistaUser] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const paginationModel = { page: 0, pageSize: 6 };

    useEffect(() => {
        loadList();
    }, []);

    async function loadList() {
        const response = await axios.get(`${host}/ListaUsuario`);
        const ListCompletoSort = response.data?.sort((a: any, b: any) => (
            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        ));
        setlistaUser(ListCompletoSort);
        setLoading(false);
    }

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
        loadList()

    }


    return (
        <div className="body-rh">
            <h1>RH</h1>
            <main className="main-rh">
                <h2>Cadastro de Funcionarios</h2>
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
                {loading ? (
                    <SkeletonTable width={150} />
                ) : listaUser.length > 0 ? (
                    <DataTable columns={columns} dataLista={listaUser} paginationModel={paginationModel} />
                ) : (
                    <p>Nenhum dado encontrado.</p>
                )}
            </div>
        </div>
    );
}
