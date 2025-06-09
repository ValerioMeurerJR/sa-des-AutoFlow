"use client";
import { BarChart } from "@/components/BarChart";
import { DoughnutChart } from "@/components/DoughnutChart";
import { PieChart } from "@/components/PieChart";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

interface ProductChartData {
    labels: string[];
    values: number[];
}

const host = "http://localhost:3333";

export default function Dashboard() {
    const [products, setProducts] = useState<ProductChartData>({ labels: [], values: [] });
    const [producaoPorData, setProducaoPorData] = useState<ProductChartData>({ labels: [], values: [] });
    const [producaoPorModelo, setProducaoPorModelo] = useState<ProductChartData>({ labels: [], values: [] });
    const [modelos, setModelos] = useState<ProductChartData>({ labels: [], values: [] });
    const [qualidadePorUsuario, setQualidadePorUsuario] = useState<ProductChartData>({ labels: [], values: [] });
    const [qualidadePorProducao, setQualidadePorProducao] = useState<ProductChartData>({ labels: [], values: [] });


    useEffect(() => {
        loadProdutos();
        loadProducao();
        loadQualidade();
    }, []);

    async function loadProdutos() {
        try {
            const response = await axios.get(`${host}/products`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });
            const labels = response.data.map((item: any) => item.nome);
            const values = response.data.map((item: any) => item.quantidade);
            setProducts({ labels, values });
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
    }
    async function loadProducao() {
        try {
            const response = await axios.get(`${host}/production`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });

            const data = response.data;
            const modeloMap: Record<string, number> = {};
            const dataMap: Record<string, number> = {};
            data.forEach((item: any) => {
                const modelo = item.Modelos?.modelo ?? "Desconhecido";
                const quantidade = item.quantidade ?? 0;
                const dataFormatada = new Date(item.createDate).toISOString().split("T")[0];
                modeloMap[modelo] = (modeloMap[modelo] || 0) + quantidade;
                dataMap[dataFormatada] = (dataMap[dataFormatada] || 0) + quantidade;
            });
            const modeloLabels = Object.keys(modeloMap);
            const modeloValues = Object.values(modeloMap);

            const dataLabels = Object.keys(dataMap).sort();
            const dataValues = dataLabels.map(date => dataMap[date]);

            setProducaoPorModelo({ labels: modeloLabels, values: modeloValues });
            setProducaoPorData({ labels: dataLabels, values: dataValues });

        } catch (error) {
            console.error("Erro ao carregar produção:", error);
        }
    }
    async function loadQualidade() {
        try {
            const response = await axios.get(`${host}/qualidadeProducao`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });

            const data = response.data;
            const userMap: Record<string, number> = {};
            const producaoMap: Record<string, number> = {};

            data.forEach((item: any) => {
                const nomeUser = item.User?.name ?? 'Desconhecido';
                const nomeProducao = item.Producao?.nome ?? 'Desconhecido';

                userMap[nomeUser] = (userMap[nomeUser] || 0) + 1;
                producaoMap[nomeProducao] = (producaoMap[nomeProducao] || 0) + 1;
            })

            setQualidadePorUsuario({
                labels: Object.keys(userMap),
                values: Object.values(userMap),
            });

            setQualidadePorProducao({
                labels: Object.keys(producaoMap),
                values: Object.values(producaoMap),
            });

        } catch (error) {
            console.error("Erro ao carregar dados de qualidade:", error);
        }
    }


    return (
        <main className={styles.dashboard}>
            <h1>Dashboard de Produtos</h1>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <h2>Produtos</h2>
                    <DoughnutChart labels={products.labels} dataValues={products.values} />
                </div>
                <div className={styles.card}>
                    <h2>Produção por Modelo</h2>
                    <BarChart labels={producaoPorModelo.labels} dataValues={producaoPorModelo.values} color='rgba(75,192,192,0.6)' />
                </div>
                <div className={styles.card}>
                    <h2>Produção por Data</h2>
                    <BarChart labels={producaoPorData.labels} dataValues={producaoPorData.values} color='rgba(75, 192, 79, 0.6)' />
                </div>
                <div className={styles.card}>
                    <h2>Avaliação por Usuario</h2>
                    <PieChart
                        labels={qualidadePorUsuario.labels}
                        dataValues={qualidadePorUsuario.values}
                    />
                </div>
                <div className={styles.card}>
                    <h2>Avaliação por Produção</h2>
                    <PieChart
                        labels={qualidadePorProducao.labels}
                        dataValues={qualidadePorProducao.values}
                    />
                </div>





            </div>
        </main>

    );
}
