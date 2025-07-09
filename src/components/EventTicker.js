import React from 'react';
import { FaRecycle, FaBox, FaBiohazard, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import './EventTicker.css';

const EventTicker = ({ events }) => {

    const getIcon = (color) => {
        switch (color) {
            case 'green': return <FaRecycle style={{ color: 'var(--color-green)' }} />;
            case 'yellow': return <FaBox style={{ color: 'var(--color-yellow)' }} />;
            case 'red': return <FaBiohazard style={{ color: 'var(--color-red)' }} />;
            case 'blue': return <FaQuestionCircle style={{ color: 'var(--color-blue)' }} />;
            default: return <FaInfoCircle style={{ color: 'var(--secondary-color)' }} />;
        }
    };

    return (
        <div className="ticker-wrapper">
            <h3 className="ticker-title">Journal d'Événements</h3>
            <div className="ticker-content">
                <ul>
                    {events.map(event => (
                        <li key={event.id}>
                            <span className="event-icon">{getIcon(event.color)}</span>
                            <span className="event-message">{event.message}</span>
                            <span className="event-time">
                                {new Date(event.timestamp).toLocaleTimeString('fr-FR')}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default EventTicker;
