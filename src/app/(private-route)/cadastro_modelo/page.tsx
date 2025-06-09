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
const host = "http://localhost:3333"

const columns: GridColDef[] = [
    { field: 'modelo', headerName: 'Modelo', width: 125, align: "right" },
    { field: 'kitPneu', headerName: 'Kit Pneu', width: 200, align: "right" },
    { field: 'motor', headerName: 'Motor', width: 175, align: "right" },
    { field: 'chassi', headerName: 'Chassi', width: 175, align: "right" },
    { field: 'updatedAt', headerName: 'Ultima Atualização', width: 150, align: "center" },
    { field: 'createdAt', headerName: 'Data Fabricação', width: 150, align: "center" },

];
type Produto = {
    nome: string;
    tipo: string;
};

type ModelosProduto = {
    Produtos: Produto;
};

type ModelsTipe = {
    id: string;
    modelo: string;
    fabricante: string;
    updatedAt: Date;
    createdAt: Date;
    ModelosProdutos: ModelosProduto[];
};

const formatDate = (isoDate: Date) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR");
};

type newCar = {
    fabricante: string,
    modelo: string,
    kitPneuId: string,
    motorId: string,
    chassiId: string,
}

const paginationModel = { page: 0, pageSize: 4 };

export default function CadastroModelo() {
    const [fabricanteitem, setFabricanteitem] = useState<string>("");
    const [modeloitem, setModeloitem] = useState<string>("");
    const [kitPneuitem, setKitPneuitem] = useState<string>("");
    const [motoritem, setMotoritem] = useState<string>("");
    const [chassiitem, setChassiitem] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [listCar, setListCar] = useState<any[]>([]);
    const [listMotor, setListMotor] = useState<string[]>([]);
    const [listPneu, setListPneu] = useState<string[]>([]);
    const [listChassi, setListChassi] = useState<string[]>([]);


    useEffect(() => {
        loadSelection()
        loadList();
    }, []);


    async function handleRegister(event: FormEvent) {
        event.preventDefault();
        if (!fabricanteitem || !modeloitem || !kitPneuitem || !motoritem || !chassiitem) {
            alert("Preencha todos os campos!");
            return;
        } const newCar: newCar = {
            "fabricante": fabricanteitem,
            "modelo": modeloitem,
            "kitPneuId": kitPneuitem,
            "motorId": motoritem,
            "chassiId": chassiitem,
        }
        console.log(newCar)
        await axios.post(`${host}/modelCar`,
            newCar,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }
        );
        setChassiitem("")
        setMotoritem("")
        setKitPneuitem("")
        setModeloitem("")
        setFabricanteitem("")
        loadList();

    }

    async function loadSelection() {
        const ListMoto = await axios.get(`${host}/products/Motor`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        });
        setListMotor(ListMoto.data)
        const ListPne = await axios.get(`${host}/products/Pneu`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        });
        setListPneu(ListPne.data)
        const ListChass = await axios.get(`${host}/products/Chassi`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        });
        setListChassi(ListChass.data)

    }

    async function loadList() {
        const response = await axios.get(`${host}/modelCars`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        });
        const ListCompletoSort = response.data?.sort((a: any, b: any) => (
            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        ));
        const findProductName = (products: ModelosProduto[], type: string) =>
            products.find((value) => value.Produtos.tipo === type)?.Produtos.nome || ''

        const updatedData = await Promise.all(
            ListCompletoSort.map(async (item: ModelsTipe) => ({
                ...item,
                createdAt: formatDate(item.createdAt),
                updatedAt: formatDate(item.updatedAt),
                kitPneu: findProductName(item.ModelosProdutos, "Pneu"),
                chassi: findProductName(item.ModelosProdutos, "Chassi"),
                motor: findProductName(item.ModelosProdutos, "Motor")
            }))
        );
        console.log(updatedData)
        setListCar(updatedData);
        setLoading(false);
    }



    return (
        <div className={styles.bodyModelos}>
            <main className={styles.mainModelos}>
                <h2>Cadastro novo Modelo</h2>
                <form className={styles.formModelos}>
                    <InputCustom texto="Modelo" type="text" message={modeloitem} setMessage={setModeloitem} />
                    <InputCustom texto="Fabricante" type="text" message={fabricanteitem} setMessage={setFabricanteitem} />
                    <SelectCustom texto="Selecione o Motor" message={motoritem} setMessage={setMotoritem} option={listMotor} />
                    <SelectCustom texto="Selecione o KitPneu" message={kitPneuitem} setMessage={setKitPneuitem} option={listPneu} />
                    <SelectCustom texto="Selecione o Chassi" message={chassiitem} setMessage={setChassiitem} option={listChassi} />
                    <div className={styles.divButtonEstoque}>
                        <ButtonCustom onClick={handleRegister} texto="Registrar Produto" />
                    </div>
                </form>
            </main>
            <h1>Lista de modelos cadastrados</h1>
            <div className={styles.listaQuality}>
                {loading ? (
                    <SkeletonTable width={150} />
                ) : listCar.length > 0 ? (
                    <DataTable
                        columns={columns}
                        dataLista={listCar}
                        paginationModel={paginationModel}
                    />
                ) : (
                    <p>Nenhum dado encontrado.</p>
                )}
            </div>
        </div>
    );

}
