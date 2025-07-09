import React from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import './RadialChart.css';

const RadialChart = ({ data }) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);

    const chartData = [
        { name: 'Verts', count: data.green || 0, fill: 'var(--color-green)' },
        { name: 'Jaunes', count: data.yellow || 0, fill: 'var(--color-yellow)' },
        { name: 'Rouges', count: data.red || 0, fill: 'var(--color-red)' },
        { name: 'Bleus', count: data.blue || 0, fill: 'var(--color-blue)' },
    ].sort((a, b) => b.count - a.count); // Sort descending for better visual stacking

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { name, count } = payload[0].payload;
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${name} : ${count}`}</p>
                    <p className="desc">{`Environ ${percentage}% du total`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="radial-chart-container">
            <h3 className="chart-title">Répartition des Déchets</h3>
            <div className="chart-wrapper">
                {total === 0 ? (
                    <div className="no-data-message">En attente de données...</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            cx="50%"
                            cy="45%" /* Décale légèrement le graphique vers le haut */
                            innerRadius="30%"
                            outerRadius="90%"
                            barSize={15}
                            data={chartData}
                            startAngle={90}
                            endAngle={-270}
                        >
                            <RadialBar
                                minAngle={2}
                                clockWise
                                dataKey="count"
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                            <Legend iconSize={10} iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
                        </RadialBarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default RadialChart;
