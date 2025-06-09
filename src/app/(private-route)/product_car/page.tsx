"use client"
import { ButtonCustom } from "@/components/ButtonCustom";
import DataTable from "@/components/DataTable";
import { InputCustom } from "@/components/InputCustom";
import SelectOptional from "@/components/SelectOptional";
import SkeletonTable from "@/components/SkeletonTable";
import { AddCircleOutline } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { redirect } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import styles from './styles.module.css';

const host = 'http://localhost:3333'

const columns: GridColDef[] = [
    { field: 'nome', headerName: 'Nome', width: 125 },
    { field: 'modelo', headerName: 'Modelo', width: 125 },
    { field: 'cor', headerName: 'Cor', width: 125 },
    { field: 'quantidade', headerName: 'QNT', width: 100 },
    { field: 'statusPneuLabel', headerName: 'Status Pneu', width: 120 },
    { field: 'statusMotorLabel', headerName: 'Status Motor', width: 120 },
    { field: 'statusChassiLabel', headerName: 'Status Chassi', width: 120 },
    {
        field: 'opcionaisStr',
        headerName: 'Opcionais',
        flex: 1,
        minWidth: 200,
    },
];
const formatStatus = (status: boolean) => {
    if (status === true) return "Aprovado";
    if (status === false) return "Reprovado";
    return "Não avaliado";
};

const formatDate = (isoDate: Date) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR");
};

type newCar = {
    nome: string,
    modeloId: string,
    cor: string,
    quantidade: number
    opcionais: string[]
}
type NewOpcionais = {
    nome: string
}


const paginationModel = { page: 0, pageSize: 4 };

export default function Product_Car() {
    const [modelo, setModelo] = useState<string>("");
    const [cor, setCor] = useState<string>("");
    const [nome, setNome] = useState<string>("");
    const [quantidade, setQuantidade] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [open, setOpen] = useState<boolean>(false);
    const [isInvalidMensagem, setIsInvalidMensagem] = useState<boolean>(false);
    const [listModelo, setlistModelo] = useState<CarProduction[]>([]);
    const [listOpcionais, setListOpcionais] = useState<Opcionais[]>([]);
    const [listProducao, setlistProducao] = useState<CarProduction[]>([]);
    const [opcionaisSelected, setOptionaisSelected] = useState<string[]>([]);
    const [nomeOpcional, setNomeOpcional] = useState("");

    useEffect(() => {
        loadSelection();
        loadList();
    }, []);

    useEffect(() => {
        async function valid() {
            const listModel = await axios.get(`${host}/modelCars/${modelo}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    }
                }
            );

            const modelosProdutos = listModel.data.ModelosProdutos;
            let isInvalid = false;

            for (const value of modelosProdutos) {
                console.log("Produto:", value.idProdutos);

                const produtoQnt = await axios.get(`${host}/product/${value.idProdutos}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    }
                });

                const quantidadeDisponivel = produtoQnt.data.quantidade;

                if (quantidadeDisponivel < quantidade) {
                    isInvalid = true;
                    break;
                }
            }
            if (isInvalid) {
                setIsInvalidMensagem(true)
                return;
            }
            setIsInvalidMensagem(false)
            isInvalid = false
        }

        if (quantidade && modelo) {
            valid();
        }
    }, [modelo, quantidade]);

    async function handleRegister(event: FormEvent) {
        event.preventDefault();
        if (!nome || !modelo || !cor || !quantidade) {
            alert("Preencha todos os campos!");
            return;
        }
        const newCar: newCar = {
            "nome": nome,
            "modeloId": modelo,
            "cor": cor,
            "quantidade": Number(quantidade),
            "opcionais": opcionaisSelected
        }
        await axios.post(`${host}/production`,
            newCar,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }
        );
        setModelo("")
        setQuantidade("")
        setCor("")
        setNome("")
        setOptionaisSelected([])
        loadList();
    }

    async function loadSelection() {
        const listModel = await axios.get(`${host}/modelCars`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }
        );
        const listOpciona = await axios.get(`${host}/opcionais`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }
        );
        setListOpcionais(listOpciona.data)
        setlistModelo(listModel.data)


    }

    async function loadList() {
        const response = await axios.get(`${host}/production`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            });
        const ListCompletoSort = response.data?.sort((a: CarProduction, b: CarProduction) => (
            new Date(b.createDate).getTime() - new Date(a.createDate).getTime()
        ));

        const updatedData = await Promise.all(
            ListCompletoSort.map(async (item: CarProduction) => ({
                ...item,
                statusPneuLabel: formatStatus(item.statusPneu),
                statusMotorLabel: formatStatus(item.statusMotor),
                statusChassiLabel: formatStatus(item.statusChassi),
                createDate: formatDate(item.createDate),
                modelo: item.Modelos.modelo,
                opcionaisStr: item.ProducaoOpcionais
                    .map((opcional: ProducaoOpcionais) => opcional.nome)
                    .join(', ')

            }))
        );
        setlistProducao(updatedData);
        setLoading(false);
    }

    function navCadastroModelo() {
        redirect(`/cadastro_modelo/`)
    }
    async function navCadastroOpcional() {
        setOpen(false);
        const newOpcionais: NewOpcionais = {
            "nome": nomeOpcional
        }
        setNomeOpcional("");
        await axios.post(`${host}/opcionais/register`,
            newOpcionais,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }
        );
        loadSelection()
    }

    function handleClickOpen() {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div className={styles.bodyProductCar}>
            <h1>Produção de Carro</h1>
            <main className={styles.mainProductCar}>
                <h2>Registrar nova Produção</h2>
                <form className={styles.formProductCar}>
                    <div className={styles.divTopCar}>
                        <InputCustom texto="Nome" type="text" message={nome} setMessage={setNome} />
                        <FormControl sx={{ width: '30%' }}>
                            <InputLabel>Selecione o Modelo</InputLabel>
                            <Select
                                id="input"
                                value={modelo}
                                onChange={(e) => setModelo(e.target.value)}
                            >
                                {listModelo.map(value => (
                                    <MenuItem value={value.id || value.modelo} key={value.modelo}>
                                        {value.modelo}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className={styles.buttonAdd} onClick={navCadastroModelo}>
                            <AddCircleOutline />
                        </div>
                        <InputCustom texto="Cor" type="text" message={cor} setMessage={setCor} />
                        <InputCustom texto="Quantidade" type="number" message={quantidade} setMessage={setQuantidade} />
                    </div>
                    <span className={`${styles.mensagem} ${isInvalidMensagem ? styles.erro : ''}`}>
                        Estoque insuficiente para algum produto selecionado.
                    </span>
                    <div className={styles.divTopCar}>
                        <SelectOptional
                            optionais={listOpcionais}
                            selected={opcionaisSelected}
                            onSelect={setOptionaisSelected}
                        />
                        <div className={styles.buttonAdd} onClick={handleClickOpen}>
                            <AddCircleOutline />
                        </div>
                    </div>
                    <div className={styles.divButtonEstoque}>
                        <ButtonCustom onClick={handleRegister} disabled={isInvalidMensagem} className={isInvalidMensagem ? "btn-disabled" : "btn-active"} texto="Registrar Produto" />
                    </div>
                </form>
            </main>

            <div className={styles.listaQuality}>
                {loading ? (
                    <SkeletonTable width={150} />
                ) : listProducao.length > 0 ? (
                    <DataTable columns={columns} dataLista={listProducao} paginationModel={paginationModel} />
                ) : (
                    <p>Nenhum dado encontrado.</p>
                )}
            </div>

            <Dialog
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            console.log(formJson.email);
                            handleClose();
                        },
                    },
                }}
            >
                <DialogTitle>Cadastro de Opcional</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="opc"
                        name="opc"
                        label="Digite aqui o nome"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={nomeOpcional}
                        onChange={(e) => setNomeOpcional(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={navCadastroOpcional}>Registrar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}
