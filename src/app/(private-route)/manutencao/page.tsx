
"use client";
import AtualizarStatusDialog from "@/components/AtualizarStatusDialog";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./styles.module.css";

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
const formatDate = (isoDate: Date) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR");
};

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
export default function Manutencao() {
  const [veiculos, setVeiculos] = useState<CarProduction[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [totalResolvidos, setTotalResolvidos] = useState<number>();
  const [open, setOpen] = useState(false);
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
    const responseManutencao = await axios.get(`${host}/manutencao/Producao`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        }
      }
    );
    setTotalResolvidos(responseManutencao.data.length);

    const ListCompleto = response.data

    const ListCompletoSort = ListCompleto?.sort((a: CarProduction, b: CarProduction) => (
      new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
    ));

    const updatedData = await Promise.all(
      ListCompletoSort.map(async (item: CarProduction) => ({
        ...item,
        createDate: formatDate(item.createDate),
        modelo: item.Modelos.modelo,
        status: await verificarStatus(item),
      }))
    );
    setVeiculos(
      updatedData.filter(car => car.status == "failed")
    );
    setCarregando(false)
  }

  useEffect(() => {
    loadList();
  }, []);

  async function listaOpcionais(Opcionais: ProducaoOpcionais[]) {
    const opcionaisHTML = Opcionais
      .map(
        (item: ProducaoOpcionais) => `
        <style>
        .opcional-card {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 10px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        .opcional-header h4 {
          margin: 0 0 8px;
          font-size: 1rem;
          color: #333;
        }

        .opcional-status {
          padding: 8px;
          border-radius: 4px;
          font-weight: bold;
          text-align: center;
        }

        .opcional-status.ativo {
          background-color: #d4edda;
          color: #2e7d32;
        }

        .opcional-status.inativo {
          background-color: #f8d7da;
          color: #c62828;
        }

        </style>
      <div class="opcional-card">
        <div class="opcional-header">
          <h4>${item.nome}</h4>
        </div>
        <div class="opcional-status ${item.Status ? 'ativo' : 'inativo'}">
          ${item.Status ? "✓ Aprovado" : "✗ Reprovado"}
        </div>
      </div>
    `
      )
      .join("");


    Swal.fire({
      title: 'Status Opcional',
      html: opcionaisHTML,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Voltar"
    })
  }

  const totalAguardando = veiculos.length;

  function handleClickOpen(id: string) {
    setCar(id)
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = async (id: string) => {
    try {
      await axios.patch(`${host}/production/${id}/patchManutencao`, {
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
    <div className={styles.container}>

      <h1>Manutenção</h1>

      <div className={styles.metrics}>
        <div className={styles.metricBox}><strong>{totalResolvidos}</strong><span>Resolvidos</span></div>
        <div className={styles.metricBox}><strong>{totalAguardando}</strong><span>Aguardando manutenção</span></div>
      </div>

      <div className={styles.filtros}>
        <select><option>Últimos 7 dias</option></select>
        <select><option>Todos</option></select>
        <input
          type="text"
          placeholder="Buscar modelo"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {carregando ? (
        <p>Carregando veículos reprovados...</p>
      ) : (
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Modelo</th>
              <th>Cor</th>
              <th>Quantidade</th>
              <th>Pneu</th>
              <th>Motor</th>
              <th>Chassi</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {veiculos.map((car: CarProduction) => (
                <motion.tr
                  key={car.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>{car.nome}</td>
                  <td>{car.Modelos.modelo}</td>
                  <td>{car.cor}</td>
                  <td>{car.quantidade}</td>
                  <td>{car.statusPneu ? "✓" : "✗"}</td>
                  <td>{car.statusMotor ? "✓" : "✗"}</td>
                  <td>{car.statusChassi ? "✓" : "✗"}</td>
                  <td>
                    <button
                      className={styles.btn2}
                      onClick={() => listaOpcionais(car.ProducaoOpcionais)}
                    >
                      Opcional
                    </button>

                    <button
                      className={styles.btn}
                      onClick={() => handleClickOpen(car.id)}
                    >
                      Resolver
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      )
      }
      <AtualizarStatusDialog
        open={open}
        onClose={handleClose}
        carId={car}
        formState={formState}
        setFormState={setFormState}
        handleSubmit={handleSubmit}
        labelC="Reparado"
        labelF="Reprovado"
      />
    </div >
  );
}
