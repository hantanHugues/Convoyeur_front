import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Vitals from './components/Vitals';
import RadialChart from './components/RadialChart';
import Conveyor from './components/Conveyor';
import EventTicker from './components/EventTicker';
import AIAssistant from './components/AIAssistant';
import Tabs from './components/Tabs'; // Importer le système d'onglets
import ProportionsChart from './components/ProportionsChart'; // Importer le nouveau graphique
import Settings from './components/Settings'; // Importer le composant des paramètres
import HistoryPage from './pages/HistoryPage'; // Importer la page d'historique
import Footer from './components/Footer/Footer'; // Importer le pied de page


function App() {
    // États pour les données et la connexion
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
    const [isConnected, setIsConnected] = useState(false);
    const [wasteCounts, setWasteCounts] = useState({});
    const [events, setEvents] = useState([]); // Pour le journal d'événements
    const [chatMessages, setChatMessages] = useState([
        { text: 'Bonjour ! Je suis CogniTri, votre assistant IA. Posez-moi une question sur les données de tri ou utilisez la commande vocale.', sender: 'ai' }
    ]);
    const [orbsOnConveyor, setOrbsOnConveyor] = useState([]);
    const [eventQueue, setEventQueue] = useState([]);
    const [isReadyForNextOrb, setIsReadyForNextOrb] = useState(true);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Effet pour appliquer le thème au body
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    // Effet principal pour la configuration initiale et les sockets
    useEffect(() => {
        const handleUpdateCounts = (updatedCountsArray) => {
            const countsByColor = updatedCountsArray.reduce((acc, item) => {
                acc[item.color] = item.count;
                return acc;
            }, {});
            setWasteCounts(countsByColor);
        };

        const handleNewEvent = (newEvent) => {
            setEvents(prevEvents => [newEvent, ...prevEvents].slice(0, 50));
            setEventQueue(prevQueue => [...prevQueue, newEvent]);
        };

        axios.get(`${process.env.REACT_APP_API_URL}/api/waste-counts`)
            .then(response => handleUpdateCounts(response.data))
            .catch(error => console.error("Erreur lors de la récupération des décomptes initiaux:", error));

        axios.get(`${process.env.REACT_APP_API_URL}/api/events`)
            .then(response => setEvents(response.data.reverse()))
            .catch(error => console.error("Erreur lors de la récupération des événements initiaux:", error));

        const socket = io(process.env.REACT_APP_API_URL);

        socket.on('connect', () => {
            setIsConnected(true);
            console.log('Connecté au serveur socket:', socket.id);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Déconnecté du serveur socket.');
        });

        socket.on('atomic_update', ({ newEvent, updatedCounts }) => {
            // console.log('Atomic update received:', { newEvent, updatedCounts });
            handleUpdateCounts(updatedCounts);
            handleNewEvent(newEvent);
        });

        return () => {
            console.log('Nettoyage de la connexion socket.');
            socket.disconnect();
        };
    }, []);

    // Effet pour la logique du convoyeur centralisée
    useEffect(() => {
        if (isReadyForNextOrb && eventQueue.length > 0) {
            const nextEvent = eventQueue[0];
            
            setEventQueue(prevQueue => prevQueue.slice(1));
            setIsReadyForNextOrb(false);

            const newOrb = {
                key: nextEvent._id,
                color: `var(--color-${nextEvent.color.toLowerCase()})`,
                topPosition: `${Math.random() * 40 + 30}%`,
                scanned: false,
            };

            setOrbsOnConveyor(prevOrbs => [...prevOrbs, newOrb]);

            setTimeout(() => {
                setOrbsOnConveyor(currentOrbs =>
                    currentOrbs.map(o => (o.key === newOrb.key ? { ...o, scanned: true } : o))
                );
                setIsReadyForNextOrb(true);
            }, 1500);

            setTimeout(() => {
                setOrbsOnConveyor(currentOrbs => currentOrbs.filter(o => o.key !== newOrb.key));
            }, 6000);
        }
    }, [eventQueue, isReadyForNextOrb]);

    return (
        <div className="app-container">
            <div className="header-area">
                <Header isConnected={isConnected} />
            </div>
            <div className="content-area">
                <Tabs>
                    <div label="Tableau de Bord">
                        <main className="main-grid">
                            <div className="vitals-area">
                                <Vitals events={events} />
                            </div>
                            <div className="main-area">
                                <MainContent wasteCounts={wasteCounts} />
                            </div>
                            <div className="chart-area">
                                <RadialChart data={wasteCounts} />
                            </div>
                            <div className="conveyor-area widget">
                                <Conveyor orbs={orbsOnConveyor} />
                            </div>
                            <div className="ticker-area widget">
                                <EventTicker events={events} />
                            </div>
                            <div className="proportions-area widget">
                                <ProportionsChart data={wasteCounts} />
                            </div>
                        </main>
                    </div>
                    <div label="Historique">
                        <HistoryPage />
                    </div>
                    <div label="Assistant IA">
                        <AIAssistant messages={chatMessages} setMessages={setChatMessages} />
                    </div>
                    <div label="Paramètres">
                        <Settings theme={theme} toggleTheme={toggleTheme} />
                    </div>
                </Tabs>
            </div>
            <Footer />
        </div>
    );
}

export default App;
