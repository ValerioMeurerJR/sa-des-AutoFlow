import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
    labels: string[];
    dataValues: number[];
    color: string
}

export const BarChart: React.FC<Props> = ({ labels, dataValues, color }) => {
    const data = {
        labels,
        datasets: [
            {
                label: 'Produção',
                data: dataValues,
                backgroundColor: color,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            title: { display: true, text: 'Produção por Modelo' }
        }
    };

    return <Bar data={data} options={options} />;
};
