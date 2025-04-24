"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import styles from './styles.module.css';

const host = "http://localhost:63977"

const formatStatus = (status: any) => {
    if (status === true) return "Aprovado";
    if (status === false) return "Reprovado";
    return "Não avaliado";
};

const buscarModelo = async (id: number) => {
    const response = await axios.get(`${host}/ListaModelos/${id}`);
    return response.data.modelo
}

const formatDate = (isoDate: Date) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("pt-BR");
};

const verificarStatus = async (statusPneu: any, statusMotor: any, statusChassi: any ) => {
    // await updatedData.filter(veiculo => (veiculo.statusPneu == true && veiculo.statusMotor == true && veiculo.statusChassi == true))
    if( (statusPneu == true && statusMotor == true && statusChassi == true)){
        return "approved"
    } else if(statusPneu == 'undefined' && statusMotor == 'undefined' && statusChassi == 'undefined'){        
        return "pending"
    } else {        
        return "failed"
    }

}


export default function Qualidade() {
    const [listCarState, setListCar] = useState<any[]>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    const [tab, setTab] = useState<'all' | 'approved' | 'failed' | 'pending'>('all');

    useEffect(() => {
        loadList();
    }, [tab as any]);

    async function AtualizarStatus(id: number) {
        Swal.fire({
            title: 'Definir Status',
            html: `                  
                <form id="statusForm">
                    <div class="status-section">
                        <h3>Status Motor</h3>
                        <div class="input-popup-group">
                            <label><input type="radio" name="statusMotor" value="false"> Reprovado</label>
                            <label><input type="radio" name="statusMotor" value="true"> Aprovado</label>
                        </div>
                    </div>
        
                    <div class="status-section">
                        <h3>Status Pneu</h3>
                        <div class="input-popup-group">
                            <label><input type="radio" name="statusPneu" value="false"> Reprovado</label>
                            <label><input type="radio" name="statusPneu" value="true"> Aprovado</label>
                        </div>
                    </div>
        
                    <div class="status-section">
                        <h3>Status Chassi</h3>
                        <div class="input-popup-group">
                            <label><input type="radio" name="statusChassi" value="false"> Reprovado</label>
                            <label><input type="radio" name="statusChassi" value="true"> Aprovado</label>
                        </div>
                    </div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Salvar',
            preConfirm: async () => {
                const form = document.getElementById("statusForm") as any;
                return {
                    statusMotor: form.querySelector('input[name="statusMotor"]:checked')?.value === "true",
                    statusPneu: form.querySelector('input[name="statusPneu"]:checked')?.value === "true",
                    statusChassi: form.querySelector('input[name="statusChassi"]:checked')?.value === "true",
                };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log("Atualizando status do carro ID:", id);
                await axios.patch(`${host}/ListaProducao/${id}`, {
                    "statusPneu": result.value.statusPneu,
                    "statusMotor": result.value.statusMotor,
                    "statusChassi": result.value.statusChassi,
                });
                loadList();
            }
        });

    }

    async function loadList() {
        const response = await axios.get(`${host}/ListaProducao`);
        const ListCompleto = response.data.map((carro: any) => ({
            ...carro,
            action: (id: number) => AtualizarStatus(id),
        }));
        const ListCompletoSort = ListCompleto?.sort((a: any, b: any) => (
            new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
        ));
        const updatedData = await Promise.all(
            ListCompletoSort.map(async (item: any) => ({
                ...item,
                createDate: formatDate(item.createDate),
                modelo: await buscarModelo(item.modelo),
                status: await verificarStatus(item.statusPneu, item.statusMotor, item.statusChassi)
            }))
        );
        console.log(tab)
        if(tab == "all"){
            setListCar(updatedData);
        } else {
            const updateFilter = await updatedData.filter(veiculo => (veiculo.status == tab))
            setListCar(updateFilter);
        }
    }

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
                    listCarState.map((value: any) => (
                        <div className={styles.itens} key={value.id}>
                            <h2>{value.modelo}</h2>
                            <span>Cor: {value.cor}</span>
                            <span>Quantidade: {value.quantidade}</span>
                            <span>Itens de Série:
                                {
                                    value.opcionais?.length && (
                                        value.opcionais.map((opcionais: any) => (
                                            <span className={styles.opcionais} key={opcionais}>
                                                {opcionais}
                                            </span>
                                        ))
                                    )
                                }
                            </span>
                            {value.status == 'pending' && <button onClick={(event) => AtualizarStatus(value.id)}>Atualizar</button>}
                        </div>
                    ))
                }
            </div >
        </main >
    );
}
