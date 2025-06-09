"use client"
import { ButtonCustom } from "@/components/ButtonCustom";
import DataTable from "@/components/DataTable";
import { InputCustom } from "@/components/InputCustom";
import { SelectCustom } from "@/components/SelectCustom";
import SkeletonTable from "@/components/SkeletonTable";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import styles from './styles.module.css';

const host = 'http://localhost:3333';

const opcoes = [
    { item: "Analista de Qualidade" },
    { item: "Produção" },
    { item: "Logistica" }
];
type User = {
    name: string;
    email: string;
    cargo: string;
    password: string;
}


const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', width: 300 },
    { field: 'cargo', headerName: 'Cargo', width: 300 },
    { field: 'email', headerName: 'Email', width: 500 }
];

export default function Rh() {
    const [nome, setNome] = useState<string>("");
    const [cargo, setCargo] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [listaUser, setlistaUser] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const paginationModel = { page: 0, pageSize: 6 };

    useEffect(() => {
        loadList();
    }, []);

    async function loadList() {

        const response = await axios.get(`${host}/users`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        });

        const ListCompletoSort = response.data?.sort((a: any, b: any) => (
            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        ));
        setlistaUser(ListCompletoSort);
        setLoading(false);
    }

    async function handleRegister(event: FormEvent) {
        event.preventDefault();
        if (!nome || !cargo || !email || !password) {
            alert("Preencha todos os campos!");
            return;
        }

        const user: User = {
            "name": nome,
            "email": email,
            "cargo": cargo,
            "password": password
        }
        console.log("Usuario registrado:", user);

        await axios.post(`${host}/user/register`, user);
        setNome("");
        setCargo("");
        setEmail("");
        setPassword("");
        loadList();
    }

    return (
        <div className={`${styles.body}`}>
            <h1>RH</h1>
            <main className={`${styles.main}`}>
                <h2>Cadastro de Funcionarios</h2>
                <form className={`${styles.form}`}>
                    <InputCustom texto="Nome" type="text" message={nome} setMessage={setNome} />
                    <InputCustom texto="Email" type="text" message={email} setMessage={setEmail} />
                    <InputCustom texto="Password" type="password" message={password} setMessage={setPassword} />
                    <SelectCustom texto="Selecione o Cargo" message={cargo} setMessage={setCargo} option={opcoes} />
                    <div className={`${styles.divButton}`}>
                        <ButtonCustom onClick={handleRegister} texto="Registrar Funcionario" />
                    </div>
                </form>
            </main>
            <div className={`${styles.listaQuality}`}>
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
