import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    Tooltip
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    labels: string[];
    dataValues: number[];
}

export const PieChart: React.FC<Props> = ({ labels, dataValues }) => {
    const data = {
        labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#8AFFC1', '#FFB347',
                    '#9966FF', '#FF9F40', '#4BC0C0', '#C9CBCF', '#F7464A',
                ],
            },
        ],
    };

    return <Pie data={data} />;
};
