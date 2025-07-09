import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-section">
        <span className="footer-label">Réalisé par :</span>
        <img src="/logos/IFRIlogo.png" alt="Logo IFRI" className="footer-logo" />
      </div>
      <div className="footer-section">
        <span className="footer-label">Dans le cadre de :</span>
        <img src="/logos/trc2k25logo.png" alt="Logo TRC2K25" className="footer-logo" />
      </div>
      <div className="footer-section">
        <span className="footer-label">Organisé par :</span>
        <img src="/logos/techbotlogo.png" alt="Logo Tech-Bot" className="footer-logo" />
      </div>
    </footer>
  );
};

export default Footer;
