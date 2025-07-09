import React from 'react';
import './Conveyor.css';

// Ce composant est maintenant "bête". Il reçoit les orbes à afficher et se contente de le faire.
// Toute la logique est gérée par le composant parent App.js pour garantir la synchronisation.
const Conveyor = ({ orbs }) => {

    return (
        <div className="conveyor-wrapper">
            <h3 className="conveyor-title">Activité du Convoyeur</h3>
            <div className="conveyor-belt">
                <div className="detection-line"></div>
                {orbs.map(orb => (
                    <div
                        key={orb.key}
                        className={`waste-orb ${orb.scanned ? 'scanned' : ''}`}
                        style={{
                            '--orb-color': orb.color,
                            top: orb.topPosition,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Conveyor;
