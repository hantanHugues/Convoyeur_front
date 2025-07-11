import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

// Composant pour la modale de confirmation, réutilisable et propre.
const ConfirmationModal = ({ show, onClose, onConfirm, title, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h4>{title}</h4>
                <p>{children}</p>
                <div className="modal-actions">
                    <button onClick={onClose} className="btn btn-secondary">Annuler</button>
                    <button onClick={onConfirm} className="btn btn-danger">Confirmer</button>
                </div>
            </div>
        </div>
    );
};

const Settings = ({ theme, toggleTheme, activeTab }) => {
    // --- États ---
    const [status, setStatus] = useState({ message: '', type: '' });
    const [adminPassword, setAdminPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [adminToken, setAdminToken] = useState(sessionStorage.getItem('adminToken') || null);
    const [adminConfig, setAdminConfig] = useState({ geminiApiKey: '' });
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleAdminLogout = () => {
        sessionStorage.removeItem('adminToken');
        setAdminToken(null);
        setIsAdminAuthenticated(false);
        setAdminPassword('');
        setStatus({ message: '', type: '' });
    };

    // --- Effets ---
    // Vérifier si un token existe déjà au chargement
    useEffect(() => {
        if (adminToken) {
            setIsAdminAuthenticated(true);
            fetchAdminConfig(adminToken);
        }
    }, [adminToken]);

    // Effet pour la déconnexion automatique au changement d'onglet
    useEffect(() => {
        if (activeTab !== 'Paramètres' && isAdminAuthenticated) {
            handleAdminLogout();
        }
    }, [activeTab, isAdminAuthenticated]);

    // --- Fonctions Admin ---
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setStatus({ message: '', type: '' });
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/login`, { password: adminPassword });
            const { token } = response.data;
            sessionStorage.setItem('adminToken', token); // Stocker le token dans la session
            setAdminToken(token);
        } catch (error) {
            setStatus({ message: 'Mot de passe administrateur incorrect.', type: 'error' });
        }
    };

    const fetchAdminConfig = async (token) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/config`, { headers: { Authorization: `Bearer ${token}` } });
            setAdminConfig(response.data);
        } catch (error) {
            setStatus({ message: 'Session admin expirée ou invalide. Veuillez vous reconnecter.', type: 'error' });
            setIsAdminAuthenticated(false);
            sessionStorage.removeItem('adminToken');
            setAdminToken(null);
        }
    };

    const handleAdminConfigChange = (e) => {
        setAdminConfig({ ...adminConfig, [e.target.name]: e.target.value });
    };

    const handleAdminConfigSave = async () => {
        setStatus({ message: 'Sauvegarde...', type: 'info' });
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/config`, adminConfig, { headers: { Authorization: `Bearer ${adminToken}` } });
            setStatus({ message: response.data.message, type: 'success' });
        } catch (error) {
            setStatus({ message: 'Erreur de sauvegarde.', type: 'error' });
        }
    };

    const handleResetDatabase = async () => {
        setShowResetConfirm(false);
        setStatus({ message: 'Réinitialisation...', type: 'info' });
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/reset-database`, {}, { headers: { Authorization: `Bearer ${adminToken}` } });
            setStatus({ message: response.data.message, type: 'success' });
        } catch (error) {
            setStatus({ message: 'Erreur lors de la réinitialisation.', type: 'error' });
        }
    };

    return (
        <div className="settings-container">
            <h2 className="settings-title">Paramètres</h2>
            {status.message && <div className={`status-message ${status.type}`}>{status.message}</div>}

            <div className="settings-section">
                <h2 className="settings-section-title">Apparence</h2>
                <div className="setting-item-horizontal">
                    <span>Thème Clair / Sombre</span>
                    <div className="toggle-switch">
                        <input type="checkbox" id="theme-toggle" checked={theme === 'light'} onChange={toggleTheme} />
                        <label htmlFor="theme-toggle" className="slider"></label>
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h2 className="settings-section-title">Administration</h2>
                {!isAdminAuthenticated ? (
                    <form onSubmit={handleAdminLogin} className="admin-login-form">
                        <p className="setting-description text-center">Entrez le mot de passe pour accéder aux paramètres avancés.</p>
                        <div className="password-input-container">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                value={adminPassword} 
                                onChange={(e) => setAdminPassword(e.target.value)} 
                                placeholder="Mot de passe administrateur"
                                className="settings-input"
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="password-toggle-icon">
                                {showPassword ? '🙈' : '👁️'}
                            </span>
                        </div>
                        <button type="submit" className="btn btn-primary">Déverrouiller</button>
                    </form>
                ) : (
                    <div className="admin-section-content">
                        <h4 className="settings-subsection-title">Configuration des Services Externes</h4>
                        <div className="setting-item">
                            <label htmlFor="geminiApiKey">Clé API Google Gemini</label>
                            <input type="text" id="geminiApiKey" name="geminiApiKey" value={adminConfig.geminiApiKey} onChange={handleAdminConfigChange} className="settings-input" />
                        </div>

                        <div className="admin-actions">
                            <button onClick={handleAdminConfigSave} className="btn btn-primary">Sauvegarder</button>
                            <button onClick={handleAdminLogout} className="btn btn-secondary">Verrouiller</button>
                        </div>
                        
                        <hr className="section-divider"/>

                        <h4 className="settings-subsection-title">Actions Sensibles</h4>
                        <div className="setting-item">
                            <label>Réinitialiser la base de données</label>
                            <p className="setting-description">Supprime tout l'historique des événements. Cette action est irréversible.</p>
                            <button onClick={() => setShowResetConfirm(true)} className="btn btn-danger">Réinitialiser la base de données</button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationModal
                show={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={handleResetDatabase}
                title="Confirmation de la réinitialisation"
            >
                Êtes-vous absolument certain de vouloir supprimer toutes les données ? Cette action est définitive et ne peut pas être annulée.
            </ConfirmationModal>
        </div>
    );
};

export default Settings;
