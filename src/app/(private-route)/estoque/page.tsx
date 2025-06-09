"use client"
import { ButtonCustom } from "@/components/ButtonCustom";
import DataTable from "@/components/DataTable";
import { InputCustom } from "@/components/InputCustom";
import { SelectCustom } from "@/components/SelectCustom";
import SkeletonTable from "@/components/SkeletonTable";
import { GridColDef } from '@mui/x-data-grid';
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import styles from './styles.module.css';

const host = "http://localhost:3333"
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
        const response = await axios.get(`${host}/products`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        });
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
        if (!nomeitem || !quantidadeitem || !fabricanteitem || tipoitem == "") {
            alert("Preencha todos os campos!");
            return;
        }
        const newProduto = {
            "nome": nomeitem,
            "quantidade": Number(quantidadeitem),
            "fabricante": fabricanteitem,
            "tipo": tipoitem
        }
        console.log(newProduto)
        await axios.post(`${host}/product`,
            newProduto, // esse é o corpo da requisição
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }
        );



        console.log("Produto registrado:", { nomeitem, quantidadeitem, fabricanteitem, tipoitem });
        setFabricanteitem("")
        setNomeitem("")
        setQuantidadeitem("")
        loadList();

    }


    return (
        <div className={styles.bodyEstoque}>
            <h1>Estoque</h1>
            <main className={styles.mainEstoque}>
                <h2>Cadastro novo produto</h2>
                <form className={styles.formEstoque}>
                    <InputCustom texto="Nome" type="text" message={nomeitem} setMessage={setNomeitem} />
                    <InputCustom texto="Quantidade" type="number" message={quantidadeitem} setMessage={setQuantidadeitem} />
                    <InputCustom texto="Fabricante" type="text" message={fabricanteitem} setMessage={setFabricanteitem} />
                    <SelectCustom texto="Tipo de Produto" message={tipoitem} setMessage={setTipoitem} option={opcoes} />
                    <div className={styles.divButtonEstoque}>
                        <ButtonCustom onClick={handleRegister} texto="Registrar Produto" />
                    </div>
                </form>
            </main>
            <AnimatePresence>
                <div className={styles.listaEstoque}>
                    <motion.div>
                        {loading ? (
                            <SkeletonTable width={100} />
                        ) : listaItem.length > 0 ? (
                            <DataTable columns={columns} dataLista={listaItem} paginationModel={paginationModel} />
                        ) : (
                            <p>Nenhum dado encontrado.</p>
                        )}
                    </motion.div>
                </div>
            </AnimatePresence>
        </div>
    );

}
