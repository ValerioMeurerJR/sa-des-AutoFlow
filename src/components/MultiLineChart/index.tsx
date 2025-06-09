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
    datasets: {
        label: string;
        data: number[];
        borderColor?: string;
    }[];
}

export const MultiLineChart: React.FC<Props> = ({ labels, datasets }) => {
    return (
        <Line
            data={{
                labels,
                datasets,
            }}
            options={{
                responsive: true,
                plugins: {
                    title: { display: true, text: 'Comparativo de Produção' },
                },
            }}
        />
    );
};
