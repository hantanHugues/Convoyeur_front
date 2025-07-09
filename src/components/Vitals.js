import React, { useState, useEffect } from 'react';
import './Vitals.css';
import { FaHeartbeat, FaServer, FaMicrochip } from 'react-icons/fa';

const Vitals = ({ events }) => {
    const [rate, setRate] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const oneMinuteAgo = Date.now() - 60000;
            const currentRate = events.filter(e => new Date(e.timestamp).getTime() > oneMinuteAgo).length;
            setRate(currentRate);
        }, 2000); // Update rate every 2 seconds

        return () => clearInterval(interval);
    }, [events]);

    return (
        <div className="vitals-container">
            <h3 className="vitals-title">Statut Système</h3>
            <div className="vital-item">
                <div className="vital-icon rate">
                    <FaHeartbeat />
                </div>
                <div className="vital-info">
                    <span className="vital-value">{rate}</span>
                    <span className="vital-label">Déchets / min</span>
                </div>
            </div>
            <div className="vital-item">
                <div className="vital-icon db-ok">
                    <FaServer />
                </div>
                <div className="vital-info">
                    <span className="vital-value">En Ligne</span>
                    <span className="vital-label">Base de Données</span>
                </div>
            </div>
            <div className="vital-item">
                <div className="vital-icon arduino-ok">
                    <FaMicrochip />
                </div>
                <div className="vital-info">
                    <span className="vital-value">Connecté</span>
                    <span className="vital-label">Arduino</span>
                </div>
            </div>
        </div>
    );
};

export default Vitals;
