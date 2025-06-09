import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props {
    labels: string[];
    dataValues: number[];
}

export const LineChart: React.FC<Props> = ({ labels, dataValues }) => {
    const data = {
        labels,
        datasets: [
            {
                label: 'Produção Diária',
                data: dataValues,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.3
            }
        ]
    };

    return <Line data={data} />;
};
