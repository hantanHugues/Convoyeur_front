import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoryPage.css';

const HistoryPage = () => {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchEvents = async (pageNum) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/api/events?page=${pageNum}&limit=50`);
            setEvents(prevEvents => [...prevEvents, ...response.data.events]);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'historique:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Charge la première page lors du montage du composant
        fetchEvents(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Ce crochet ne doit s'exécuter qu'une seule fois.

    const handleLoadMore = () => {
        const nextPage = page + 1;
        if (nextPage <= totalPages) {
            setPage(nextPage);
            fetchEvents(nextPage);
        }
    };

    const handleDownloadPDF = () => {
        window.open('http://localhost:5000/api/export/events?format=pdf', '_blank');
    };

    return (
        <div className="history-page">
            <div className="history-container">
                <div className="header">
                    <h1>Journal des Événements</h1>
                    <button onClick={handleDownloadPDF} className="download-btn">
                        Exporter en PDF
                    </button>
                </div>

                <div className="table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date et Heure</th>
                                <th>Couleur Détectée</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => (
                                <tr key={event._id || index}>
                                    <td>{new Date(event.timestamp).toLocaleString('fr-FR')}</td>
                                    <td className="color-cell">
                                        <span className={`color-dot ${event.color}`}></span>
                                        <span>{event.color.charAt(0).toUpperCase() + event.color.slice(1)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {loading && <p className="loading-text">Chargement...</p>}

                    {page < totalPages && !loading && (
                        <div className="load-more-container">
                            <button onClick={handleLoadMore} className="load-more-btn">
                                Voir plus
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
