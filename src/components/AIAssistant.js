import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaPaperPlane } from 'react-icons/fa'; // FaMicrophone retiré
import io from 'socket.io-client';
import './AIAssistant.css';

const socket = io('http://localhost:5000');

const AIAssistant = ({ messages, setMessages }) => {
    const [alerts, setAlerts] = useState([]);
    const [input, setInput] = useState('');
    const messageListRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    // Socket.IO listener for alerts
    useEffect(() => {
        socket.on('new_alert', (alert) => {
            setAlerts(prevAlerts => {
                // Eviter les doublons d'alertes
                if (prevAlerts.find(a => a.id === alert.id)) {
                    return prevAlerts;
                }
                // Ajouter la nouvelle alerte en haut de la liste
                return [alert, ...prevAlerts];
            });
        });

        // Cleanup on component unmount
        return () => {
            socket.off('new_alert');
        };
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');

        try {
            const response = await fetch('http://localhost:5000/api/ask-gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: currentInput }),
            });

            if (!response.ok) {
                throw new Error('La réponse du serveur n\'était pas OK');
            }

            const data = await response.json();
            const assistantResponse = { sender: 'ai', text: data.response };
            setMessages(prev => [...prev, assistantResponse]);

        } catch (error) {
            console.error("Erreur lors de l'appel à l'API Gemini:", error);
            const errorMessage = { sender: 'ai', text: "Désolé, je n'ai pas pu obtenir de réponse. Veuillez réessayer." };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (
        <div className="ai-assistant-container">
            <div className="ai-assistant-content">
                <div className="alerts-container">
                    {alerts.map((alert) => (
                        <div key={alert.id} className={`alert alert-${alert.type}`}>
                            <ReactMarkdown>{alert.message}</ReactMarkdown>
                        </div>
                    ))}
                </div>
                <div className="message-list" ref={messageListRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === 'ai' ? 'assistant' : msg.sender}`}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                    ))}
                </div>
                <form className="message-form" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Posez votre question..."
                    />
                    {/* Le bouton micro est retiré pour l'instant */}
                    <button type="submit" className="icon-button send-button">
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AIAssistant;
