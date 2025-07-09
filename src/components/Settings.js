import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = ({ theme, toggleTheme }) => {
    const [settings, setSettings] = useState({ stoppageThreshold: 2 });

    const [status, setStatus] = useState({ message: '', type: '' });

    useEffect(() => {
        axios.get('http://localhost:5000/api/settings')
            .then(response => {
                const fetchedSettings = {
                    stoppageThreshold: response.data.stoppageThreshold / 60000 // Convert ms to minutes
                };
                setSettings(fetchedSettings);

            })
            .catch(error => {
                console.error("Erreur lors de la récupération des paramètres", error);
                setStatus({ message: 'Impossible de charger les paramètres.', type: 'error' });
            });
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setSettings(prev => ({ ...prev, [id]: Number(value) }));
    };

    const handleSave = () => {
        setStatus({ message: 'Sauvegarde...', type: 'info' });
        axios.post('http://localhost:5000/api/settings', {
            stoppageThreshold: settings.stoppageThreshold
        })
        .then(response => {
            setStatus({ message: 'Paramètres enregistrés avec succès !', type: 'success' });
        })
        .catch(error => {
            console.error("Erreur lors de la sauvegarde des paramètres", error);
            setStatus({ message: 'Échec de la sauvegarde.', type: 'error' });
        });
    };

    const handleResetDatabase = () => {
        if (window.confirm("Êtes-vous absolument certain de vouloir réinitialiser la base de données ? Toutes les données seront perdues.")) {
            setStatus({ message: 'Réinitialisation...', type: 'info' });
            axios.get('http://localhost:5000/api/reset-database')
                .then(response => {
                    setStatus({ message: 'Base de données réinitialisée avec succès.', type: 'success' });
                })
                .catch(error => {
                    console.error("Erreur lors de la réinitialisation de la base de données", error);
                    setStatus({ message: 'Échec de la réinitialisation.', type: 'error' });
                });
        }
    };

    return (
        <div className="settings-container">
            <h2 className="settings-title">Paramètres Généraux</h2>

            {status.message && <div className={`status-message ${status.type}`}>{status.message}</div>}

            <div className="settings-section">
                <h3 className="settings-section-title">Apparence</h3>
                <div className="setting-item-horizontal">
                    <label htmlFor="theme-toggle">Thème Clair / Sombre</label>
                    <div className="toggle-switch">
                        <input 
                            type="checkbox" 
                            id="theme-toggle" 
                            checked={theme === 'light'}
                            onChange={toggleTheme}
                        />
                        <label htmlFor="theme-toggle" className="slider"></label>
                    </div>
                </div>
            </div>
            
            <div className="settings-section">
                <h3 className="settings-section-title">Configuration des Alertes</h3>
                <div className="setting-item">
                    <label htmlFor="stoppageThreshold">Délai de détection d'arrêt (minutes)</label>
                    <input 
                        type="number" 
                        id="stoppageThreshold" 
                        min="1" 
                        value={settings.stoppageThreshold}
                        onChange={handleInputChange}
                    />
                    <p className="setting-description">Temps d'inactivité du convoyeur avant le déclenchement d'une alerte.</p>
                </div>
            </div>

            <div className="settings-section">
                <h3 className="settings-section-title">Actions sur la Base de Données</h3>
                <div className="setting-item">
                    <label>Exporter les données</label>
                    <p className="setting-description">Téléchargez l'historique complet des événements de tri au format JSON ou CSV.</p>
                    <div className="export-buttons">
                        <a href="http://localhost:5000/api/export/events?format=json" className="btn btn-secondary" download>Télécharger en JSON</a>
                        <a href="http://localhost:5000/api/export/events?format=csv" className="btn btn-secondary" download>Télécharger en CSV</a>
                    </div>
                </div>
                <div className="setting-item">
                    <label>Réinitialiser les données</label>
                    <button className="button-danger" onClick={handleResetDatabase}>Réinitialiser la Base de Données</button>
                    <p className="setting-description">Attention : Cette action supprimera tous les décomptes et événements enregistrés. Irréversible.</p>
                </div>
            </div>

            <div className="settings-actions">
                <button className="button-primary" onClick={handleSave}>Enregistrer les modifications</button>
            </div>
        </div>
    );
};

export default Settings;
