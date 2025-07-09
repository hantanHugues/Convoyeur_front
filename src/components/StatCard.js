import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import './StatCard.css';

const StatCard = ({ icon, title, value, color }) => {
    const { number } = useSpring({
        number: value,
        delay: 200,
        config: { mass: 1, tension: 20, friction: 10 },
    });

    return (
        <div className="stat-card" style={{ '--glow-color': color }}>
            <div className="card-icon">{icon}</div>
            <div className="card-content">
                <animated.h3>{number.to(n => n.toFixed(0))}</animated.h3>
                <p>{title}</p>
            </div>
        </div>
    );
};

export default StatCard;
