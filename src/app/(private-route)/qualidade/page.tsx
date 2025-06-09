"use client"
import AtualizarStatusDialog from "@/components/AtualizarStatusDialog";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from './styles.module.css';


const formatDate = (isoDate: Date) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR");
};

function verificarStatusOpcional(lista: { Status: boolean | null }[]): boolean | null {
    let encontrouTrue = false;

    for (const item of lista) {
        if (item.Status === false) {
            return false;
        }
        if (item.Status === true) {
            encontrouTrue = true;
        }
    }
    return encontrouTrue ? true : null;
}

const verificarStatus = async (veiculo: CarProduction) => {
    const statusOpcionais = verificarStatusOpcional(veiculo.ProducaoOpcionais);
    if ((veiculo.statusPneu == true && veiculo.statusMotor == true && veiculo.statusChassi == true && statusOpcionais)) {
        return "approved"
    } else if (veiculo.statusPneu == null && veiculo.statusMotor == null && veiculo.statusChassi == null) {
        return "pending"
    } else {
        return "failed"
    }
}

const host = "http://localhost:3333"
export default function Qualidade() {
    const [open, setOpen] = useState(false);
    const [listCar, setListCar] = useState<CarProduction[]>([]);
    const [tab, setTab] = useState<'all' | 'approved' | 'failed' | 'pending'>('all');
    const [car, setCar] = useState<string>("");
    const [formState, setFormState] = useState<StatusForm>({
        statusMotor: false,
        statusPneu: false,
        statusChassi: false,
        opcionais: [],
    });

    async function loadList() {
        const response = await axios.get(`${host}/production`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }
        );
        const ListCompletoSort = response.data?.sort((a: any, b: any) => (
            new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
        ));
        const updatedData = await Promise.all(
            ListCompletoSort.map(async (item: any) => ({
                ...item,
                createDate: formatDate(item.createDate),
                modelo: item.Modelos.modelo,
                status: await verificarStatus(item),
            }))
        );
        if (tab == "all") {
            setListCar(updatedData);
        } else {
            const updateFilter = updatedData.filter(veiculo => (veiculo.status == tab))
            setListCar(updateFilter);
        }
    }
    useEffect(() => {
        loadList();
    }, [tab]);

    function handleClickOpen(id: string) {
        setCar(id)
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false)
        loadList();
    }
    const handleSubmit = async (id: string) => {
        try {
            await axios.patch(`${host}/production/${id}/patchQualidade`, {
                id: id,
                ...formState
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                }
            });
            handleClose();
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
        loadList();
    };
    return (
        <main className={styles.main}>

            <h2>Lista de Produtos</h2>
            <div className={styles.filter}>
                <div onClick={() => setTab("all")} className={`${styles.filterOption} ${tab == 'all' && styles.select}`} >Todos</div>
                <div onClick={() => setTab("approved")} className={`${styles.filterOption} ${tab == 'approved' && styles.select}`}>Aprovados</div>
                <div onClick={() => setTab("failed")} className={`${styles.filterOption} ${tab == 'failed' && styles.select}`} >Reprovados</div>
                <div onClick={() => setTab("pending")} className={`${styles.filterOption} ${tab == 'pending' && styles.select}`} >Pendentes</div>
            </div>
            <div className={styles.listaItens}>
                {
                    listCar.map((value: any) => (
                        <div className={styles.itens} key={value.id}>
                            <h2>{value.modelo}</h2>
                            <span>Cor: {value.cor}</span>
                            <span>Quantidade: {value.quantidade}</span>
                            {
                                value.ProducaoOpcionais?.length > 0 && (
                                    <span>
                                        Itens de Série:&nbsp;
                                        {
                                            value.ProducaoOpcionais.map((opcional: any) => (
                                                <span key={opcional.nome} className={styles.opcionais}>
                                                    {opcional.nome}&nbsp;
                                                </span>
                                            ))
                                        }
                                    </span>
                                )
                            }
                            {value.status == 'pending' && <button onClick={() => handleClickOpen(value.id)}>Atualizar</button>}
                        </div>
                    ))
                }
                <AtualizarStatusDialog
                    open={open}
                    onClose={handleClose}
                    carId={car}
                    formState={formState}
                    setFormState={setFormState}
                    handleSubmit={handleSubmit}
                    labelC="Aprovado"
                    labelF="Reprovado"
                />
            </div >
        </main >
    );
}
