import React, { useState } from 'react';
import './Tabs.css';

const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(children[0].props.label);

    const handleClick = (e, newActiveTab) => {
        e.preventDefault();
        setActiveTab(newActiveTab);
    };

    return (
        <div className="tabs-container">
            <ul className="tabs-nav">
                {children.map((child) => (
                    <li
                        key={child.props.label}
                        className={activeTab === child.props.label ? 'active' : ''}
                        onClick={(e) => handleClick(e, child.props.label)}
                    >
                        {child.props.label}
                    </li>
                ))}
            </ul>
            <div className="tabs-content">
                {children.map((child) => {
                    if (child.props.label === activeTab) {
                        return <div key={child.props.label} className="tab-pane">{child.props.children}</div>;
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default Tabs;
