// components/RadarChart.tsx
import {
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    PointElement,
    RadialLinearScale,
    Tooltip
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
    labels: string[];
    dataValues: number[];
    label: string;
}

export const RadarChart: React.FC<Props> = ({ labels, dataValues, label }) => {
    const data = {
        labels,
        datasets: [
            {
                label,
                data: dataValues,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    return <Radar data={data} />;
};
