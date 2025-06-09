import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    labels: string[];
    dataValues: number[];
}

export const DoughnutChart: React.FC<Props> = ({ labels, dataValues }) => {
    const data = {
        labels,
        datasets: [
            {
                label: 'Estoque',
                data: dataValues,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            }
        ]
    };

    return <Doughnut data={data} />;
};
