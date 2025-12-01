import {Chart, type ChartConfiguration, registerables} from 'chart.js';
import {Radar} from "react-chartjs-2"

type RadarChartProps = {
    exerciseTypes:string[];
    scores:number[];
}

export default function RadarChart({exerciseTypes,scores}:RadarChartProps) {
    const data: ChartConfiguration<"radar">["data"] = {
        labels: exerciseTypes,
        datasets: [{
            data: scores,
            backgroundColor: '#95b954bf',
            borderColor: '#75926b',
            pointBackgroundColor: '#75926b',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#75926b'
        }]
    };

    // Remove labels
    const config: ChartConfiguration<"radar">={
        type: 'radar',
        data: data,
        options: {
            elements: {
                line: {
                    borderWidth: 2,
                }
            },
            plugins: {
                legend:{
                    display:false
                }
            },
            scales: {
                r: {
                    ticks: {
                        stepSize: 10,
                        maxTicksLimit: 10
                    },
                    suggestedMax:100,
                    suggestedMin:0,
                    pointLabels: {
                        display:false
                    },
                    grid: {
                        color: '#95b954bf'
                    }
                }
            }
        }
    };

    Chart.register(...registerables);

    return (
        <div className="p-2">
            <Radar data={data} options={config.options} />
        </div>
    );

}