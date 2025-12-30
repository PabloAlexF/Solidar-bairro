import React, { useState } from 'react';
const BottomNav = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  
  const navItems = [
    { id: 'inicio', icon: '⌂', label: 'Início' },
    { id: 'mapa', icon: '○', label: 'Mapa' },
    { id: 'acao', icon: '+', label: 'Ação', isMain: true },
    { id: 'comunidade', icon: '◐', label: 'Comunidade' },
    { id: 'perfil', icon: '○', label: 'Perfil' }
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''} ${item.isMain ? 'main-action' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;