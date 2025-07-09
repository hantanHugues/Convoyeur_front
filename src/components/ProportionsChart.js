import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './ProportionsChart.css';

const COLORS = {
    verts: 'var(--color-green)',
    jaunes: 'var(--color-yellow)',
    rouges: 'var(--color-red)',
    bleus: 'var(--color-blue)',
};

const ProportionsChart = ({ data }) => {
    if (!data || Object.keys(data).length === 0) {
        return <div className="proportions-container">En attente de données...</div>;
    }

    const total = Object.values(data).reduce((sum, count) => sum + count, 0);

    const chartData = Object.entries(data).map(([color, count]) => ({
        name: color.charAt(0).toUpperCase() + color.slice(1),
        value: total > 0 ? ((count / total) * 100) : 0,
        color: COLORS[color.toLowerCase()] || '#ccc',
    }));

    return (
        <div className="proportions-container">
            <h3 className="proportions-title">Répartition en Pourcentage</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} stroke="var(--secondary-color)" />
                    <YAxis type="category" dataKey="name" stroke="var(--secondary-color)" />
                    <Tooltip 
                        cursor={{fill: 'rgba(255, 255, 255, 0.1)'}}
                        contentStyle={{ 
                            background: 'rgba(30, 30, 42, 0.8)', 
                            borderColor: 'var(--border-color)',
                            color: '#fff'
                        }}
                        formatter={(value) => `${value.toFixed(2)}%`}
                    />
                    <Bar dataKey="value" fill="#8884d8" barSize={20}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProportionsChart;
