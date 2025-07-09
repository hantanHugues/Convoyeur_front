import React from 'react';
import StatCard from './StatCard';
import './MainContent.css';
import { FaBox, FaRecycle, FaBiohazard, FaQuestionCircle } from 'react-icons/fa';

const MainContent = ({ wasteCounts }) => {
    const cardData = [
        { color: 'var(--color-green)', title: 'Déchets Verts', value: wasteCounts.green || 0, icon: <FaRecycle /> },
        { color: 'var(--color-yellow)', title: 'Déchets Jaunes', value: wasteCounts.yellow || 0, icon: <FaBox /> },
        { color: 'var(--color-red)', title: 'Déchets Rouges', value: wasteCounts.red || 0, icon: <FaBiohazard /> },
        { color: 'var(--color-blue)', title: 'Déchets Bleus', value: wasteCounts.blue || 0, icon: <FaQuestionCircle /> },
    ];

    return (
        <div className="main-content-grid">
            {cardData.map(card => (
                <StatCard key={card.title} {...card} />
            ))}
        </div>
    );
};

export default MainContent;
