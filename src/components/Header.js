import React from 'react';
import './Header.css';
import { FaCircle } from 'react-icons/fa';

const Header = ({ isConnected }) => {
    return (
        <div className="app-header">
            <div className="logo-title">
                <h1>CONVOYEUR</h1>
                <h2>Tableau de Commande</h2>
            </div>
            <div className={`status ${isConnected ? 'connected' : ''}`}>
                <FaCircle />
                <span>{isConnected ? 'En Ligne' : 'Hors Ligne'}</span>
            </div>

        </div>
    );
};

export default Header;
