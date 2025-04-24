"use client"
import "./styles.css"
import { ButtonCustom } from "@/components/ButtonCustom";
import { FormEvent, useEffect, useState } from "react";
import SkeletonTable from "@/components/SkeletonTable";
import DataTable from "@/components/DataTable";
import { InputCustom } from "@/components/InputCustom";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import SelectOptional from "@/components/SelectOptional";
import { AddCircleOutline } from '@mui/icons-material';
import { redirect } from "next/navigation";

const host = 'http://localhost:63977';

const columns: GridColDef[] = [
    { field: 'modelo', headerName: 'Modelo', width: 125 },
    { field: 'cor', headerName: 'Cor', width: 125 },
    { field: 'quantidade', headerName: 'Quantidade', width: 100 },
    { field: 'statusPneu', headerName: 'Status Pneu', width: 120 },
    { field: 'statusMotor', headerName: 'Status Motor', width: 120 },
    { field: 'statusChassi', headerName: 'Status Chassi', width: 120 },
];
const formatStatus = (status: any) => {
    if (status === true) return "Aprovado";
    if (status === false) return "Reprovado";
    return "Não avaliado";
};

const buscarModelo = async (id: string) => {
    const response = await axios.get(`${host}/ListaModelos/${id}`);
    // console.log(response.data.modelo)
    return response.data.modelo
}

const formatDate = (isoDate: Date) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR");
};

type newCar = {
    id: string,
    modelo: string,
    statusPneu: string,
    statusMotor: string,
    statusChassi: string,
    createDate: string,
    conclusaoDate?: string,
    cor: string,
    quantidade: number
    opcionais: string[]
}

const paginationModel = { page: 0, pageSize: 4 };

export default function Product_Car() {
    const [modelo, setModelo] = useState<string>("");
    const [cor, setCor] = useState<string>("");
    const [quantidade, setQuantidade] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [listModelo, setlistModelo] = useState<any[]>([]);
    const [listProducao, setlistProducao] = useState<any[]>([]);
    const [opcionaisSelected, setOptionaisSelected] = useState<string[]>([]);

    useEffect(() => { 
        loadSelection()
        loadList();
    }, []);


    async function handleRegister(event: FormEvent) {
        event.preventDefault();
        if (!modelo || !cor || !quantidade) {
            alert("Preencha todos os campos!");
            return;
        }
        
        const newCar: newCar = {
            "id": uuid(),
            "modelo": modelo,
            "statusPneu": "undefined",
            "statusMotor": "undefined",
            "statusChassi": "undefined",
            "cor": cor,
            "quantidade": Number(quantidade),
            "createDate": new Date().toISOString(),
            "opcionais": opcionaisSelected
        }
        await axios.post(`${host}/ListaProducao`, newCar);
        console.log("Carro registrado:", newCar);
        setModelo("")
        setQuantidade("")
        setCor("")
        setOptionaisSelected([])
        loadList();

    }

    async function loadSelection() {
        const listModel = await axios.get(`${host}/ListaModelos`);
        setlistModelo(listModel.data)

    }

    async function loadList() {
        const response = await axios.get(`${host}/ListaProducao`);
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
                modelo: await buscarModelo(item.modelo)
            }))
        );
        setlistProducao(updatedData);
        setLoading(false);
    }

    function navCadastroModelo(){
        redirect(`/cadastro_modelo/`)
    }
    

    return (
        <div className="body-product_car">
            <h1>Produção de Carro</h1>
            <main className="main-product_car">
                <h2>Registrar nova Produção</h2>
                <form className="form-product_car">
                    <div className="div-top-car">
                        <FormControl sx={{ width: '30%' }}>
                            <InputLabel>Selecione o Modelo"</InputLabel>
                            <Select
                                id="input"
                                value={modelo}
                                onChange={(e) => { setModelo(e.target.value) }}
                            >
                                {
                                    listModelo.map(value => <MenuItem value={value.id ? value.id : value.modelo} key={value.modelo}>{value.modelo}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                        <div className="buttonAdd" onClick={() => navCadastroModelo()}>
                                <AddCircleOutline />
                            </div>
                        <InputCustom texto="Cor" type="text" message={cor} setMessage={setCor} />
                        <InputCustom texto="Quantidade" type="number" message={quantidade} setMessage={setQuantidade} />
                    </div>
                    <div>
                        <SelectOptional
                            optionais={["Ár-Condicionado", "Direção Elétrica", "Câmbio automático", "Roda Liga Leve", "Banco de Couro", "Câmeras traseiras"]}
                            selected={opcionaisSelected}
                            onSelect={setOptionaisSelected}
                        />
                    </div>
                    <div className="div-button-estoque">
                        <ButtonCustom onClick={handleRegister} texto="Registrar Produto" />
                    </div>
                </form>
            </main>
            <div className="lista-quality">
                {loading ? (
                    <SkeletonTable width={150} />
                ) : listProducao.length > 0 ? (
                    <DataTable columns={columns} dataLista={listProducao} paginationModel={paginationModel} />
                ) : (
                    <p>Nenhum dado encontrado.</p>
                )}
            </div>
        </div>
    );
}
