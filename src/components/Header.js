import React from 'react';
import '../styles/components/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">SolidarBairro</span>
          </div>
          <div className="location">
            <span>Lagoa Santa, MG</span>
            <span>⌄</span>
          </div>
          <div className="welcome">
            <h2>Olá, Renato</h2>
            <p>Espalhe solidariedade no seu bairro</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;