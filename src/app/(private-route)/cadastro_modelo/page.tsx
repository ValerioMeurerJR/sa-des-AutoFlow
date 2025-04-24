"use client"
import { SelectCustom } from "@/components/SelectCustom";
import "./styles.css"
import { ButtonCustom } from "@/components/ButtonCustom";
import { FormEvent, useEffect, useState } from "react";
import SkeletonTable from "@/components/SkeletonTable";
import DataTable from "@/components/DataTable";
import { InputCustom } from "@/components/InputCustom";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { v4 as uuid } from "uuid";

const host = "http://localhost:63977"

const columns: GridColDef[] = [
    { field: 'modelo', headerName: 'Modelo', width: 125, align: "right" },
    { field: 'kitPneu', headerName: 'Kit Pneu', width: 200, align: "right" },
    { field: 'motor', headerName: 'Motor', width: 175, align: "right" },
    { field: 'chassi', headerName: 'Chassi', width: 175, align: "right" },
    { field: 'createDate', headerName: 'Data Fabricação', width: 150, align: "center" },

];
const formatStatus = (status: any) => {
    if (status === true) return "Aprovado";
    if (status === false) return "Reprovado";
    return "Não avaliado";
};

const buscarProduto = async (id: number) => {
    const response = await axios.get(`${host}/ListaProdutos/${id}`);
    // console.log(response.data.nome)
    return response.data.nome
}

const formatDate = (isoDate: Date) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR");
};

type newCar = {
    id: string,
    fabricante: string,
    modelo: string,
    kitPneu: string,
    motor: string,
    chassi: string,
    createDate: string
}

const paginationModel = { page: 0, pageSize: 4 };

export default function cadastro_modelo() {
    const [fabricanteitem, setFabricanteitem] = useState<string>("");
    const [modeloitem, setModeloitem] = useState<string>("");
    const [kitPneuitem, setKitPneuitem] = useState<string>("");
    const [motoritem, setMotoritem] = useState<string>("");
    const [chassiitem, setChassiitem] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [listCarState, setListCar] = useState<any[]>([]);
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
        } 

        const newCar: newCar = {
            "id": uuid(),
            "fabricante": fabricanteitem,          
            "modelo": modeloitem,
            "kitPneu": kitPneuitem,
            "motor": motoritem,
            "chassi": chassiitem,
            "createDate": new Date().toISOString()
        }

        await axios.post(`${host}/ListaModelos`, newCar);
        console.log("Carro registrado:", newCar);
        setChassiitem("")
        setMotoritem("")
        setKitPneuitem("")
        setModeloitem("")
        setFabricanteitem("")
        loadList();

    }

    async function loadSelection() {
        const ListMoto = await axios.get(`${host}/ListaProdutos`, {
            params: {
                "tipo": 'Motor'
            }
        });
        setListMotor(ListMoto.data)
        const ListPne = await axios.get(`${host}/ListaProdutos`, {
            params: {
                "tipo": 'Pneu'
            }
        });
        setListPneu(ListPne.data)
        const ListChass = await axios.get(`${host}/ListaProdutos`, {
            params: {
                "tipo": 'Chassi'
            }
        });
        setListChassi(ListChass.data)
    }

    async function loadList() {
        const response = await axios.get(`${host}/ListaModelos`);

        const ListCompletoSort = response.data?.sort((a: any, b: any) => (
            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        ));
        const updatedData = await Promise.all(
            ListCompletoSort.map(async (item: any) => ({
                ...item,
                statusPneu: formatStatus(item.statusPneu),
                statusMotor: formatStatus(item.statusMotor),
                statusChassi: formatStatus(item.statusChassi),
                createDate: formatDate(item.createDate),
                kitPneu: await buscarProduto(item.kitPneu),
                motor: await buscarProduto(item.motor),
                chassi: await buscarProduto(item.chassi),
            }))
        );
        console.log(response.data)
        setListCar(updatedData);
        setLoading(false);
    }

    return (
        <div className="body-modelos">
            <main className="main-modelos">
                <h2>Cadastro novo Modelo</h2>
                <form className="form-modelos">
                    <InputCustom texto="Modelo" type="text" message={modeloitem} setMessage={setModeloitem} />
                    <InputCustom texto="Fabricante" type="text" message={fabricanteitem} setMessage={setFabricanteitem} />
                    <SelectCustom texto="Selecione o Motor" message={motoritem} setMessage={setMotoritem} option={listMotor} />
                    <SelectCustom texto="Selecione o KitPneu" message={kitPneuitem} setMessage={setKitPneuitem} option={listPneu} />
                    <SelectCustom texto="Selecione o Chassi" message={chassiitem} setMessage={setChassiitem} option={listChassi} />
                    <div className="div-button-estoque">
                        <ButtonCustom onClick={handleRegister} texto="Registrar Produto" />
                    </div>
                </form>
            </main>            
            <h1>Lista de modelos cadastrado</h1>
            <div className="lista-quality">
                {loading ? (
                    <SkeletonTable width={150} />
                ) : listCarState.length > 0 ? (
                    <DataTable columns={columns} dataLista={listCarState} paginationModel={paginationModel} />
                ) : (
                    <p>Nenhum dado encontrado.</p>
                )}
            </div>
        </div>
    );
}
