import {
    ArcElement,
    Chart as ChartJS,
    Legend,
    RadialLinearScale,
    Tooltip
} from 'chart.js';
import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

interface Props {
    labels: string[];
    dataValues: number[];
}

export const PolarAreaChart: React.FC<Props> = ({ labels, dataValues }) => {
    const data = {
        labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#8AFFC1', '#FFB347',
                    '#9966FF', '#FF9F40',
                ],
            },
        ],
    };

    return <PolarArea data={data} />;
};
