"use client"
import { InputCustom } from "@/components/InputCustom";
import "./styles.css";
import { FormEvent, useEffect, useState } from "react";
import { SelectCustom } from "@/components/SelectCustom";
import { ButtonCustom } from "@/components/ButtonCustom";
import DataTable from "@/components/DataTable";
import { GridColDef } from '@mui/x-data-grid';
import axios from "axios";
import { v4 as uuid } from "uuid";
import SkeletonTable from "@/components/SkeletonTable";

const host = "http://localhost:63977"
type DataLista = {
    id: string,
    nome: string,
    quantidade: number,
    fabricante: string,
    tipo: string,
    createDate: Date
};
const paginationModel = { page: 0, pageSize: 6 };
export default function Estoque() {
    const [nomeitem, setNomeitem] = useState<string>("");
    const [quantidadeitem, setQuantidadeitem] = useState<string>("");
    const [fabricanteitem, setFabricanteitem] = useState<string>("");
    const [tipoitem, setTipoitem] = useState<string>("");
    const [listaItem, setlistaItem] = useState<DataLista[]>([]);
    const [loading, setLoading] = useState<boolean>(true);



    useEffect(() => {
        loadList();
    }, []);

    async function loadList() {
        const response = await axios.get(`${host}/ListaProdutos`);
        const ListCompletoSort = response.data?.sort((a: any, b: any) => (
            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        ));
        setlistaItem(ListCompletoSort);
        setLoading(false);
    }

    const opcoes = [
        { item: "Motor" },
        { item: "Chassi" },
        { item: "Pneu" }
    ];

    const columns: GridColDef[] = [
        { field: 'nome', headerName: 'Nome', width: 300 },
        { field: 'quantidade', headerName: 'Quantidade', width: 100, align: "right" },
        { field: 'fabricante', headerName: 'Fabricante', width: 200, align: "right" },
        { field: 'tipo', headerName: 'Tipo', width: 70, align: "right" }
    ];

    async function handleRegister(event: FormEvent) {
        event.preventDefault();
        if (!nomeitem || !quantidadeitem || !fabricanteitem) {
            alert("Preencha todos os campos!");
            return;
        } 
        const newProduto = {
            "id": uuid(),
            "nome": nomeitem,
            "quantidade": quantidadeitem,
            "fabricante": fabricanteitem,
            "tipo": tipoitem,
            "createDate": new Date().toISOString()
        }
        await axios.post(`${host}/ListaProdutos`, newProduto);
        console.log("Produto registrado:", { nomeitem, quantidadeitem, fabricanteitem, tipoitem });
        setFabricanteitem("")
        setNomeitem("")
        setQuantidadeitem("")
        loadList();

    }

    return (
        <div className="body-estoque">
            <h1>Estoque</h1>
            <main className="main-estoque">
                <h2>Cadastro novo produto</h2>
                <form className="form-estoque">
                    <InputCustom texto="Nome" type="text" message={nomeitem} setMessage={setNomeitem} />
                    <InputCustom texto="Quantidade" type="text" message={quantidadeitem} setMessage={setQuantidadeitem} />
                    <InputCustom texto="Fabricante" type="text" message={fabricanteitem} setMessage={setFabricanteitem} />
                    <SelectCustom texto="Tipo de Produto" message={tipoitem} setMessage={setTipoitem} option={opcoes} />
                    <div className="div-button-estoque">
                        <ButtonCustom onClick={handleRegister} texto="Registrar Produto" />
                    </div>
                </form>
            </main>
            <div className="lista-estoque">
                {loading ? (
                    <SkeletonTable width={100} />
                ) : listaItem.length > 0 ? (
                    <DataTable columns={columns} dataLista={listaItem} paginationModel={paginationModel} />
                ) : (
                    <p>Nenhum dado encontrado.</p>
                )}
            </div>
        </div>
    );
}
