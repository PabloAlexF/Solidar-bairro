import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationDropdown } from '../NotificationDropdown';
import { SecurityUtils } from '../../utils/security';
import { 
  Menu, 
  X, 
  Heart, 
  ArrowRight, 
  User, 
  HandHelping, 
  MapPin,
  Home,
  MessageSquare,
  Settings
} from 'lucide-react';
import './MobileHeader.css';

const MobileHeader = ({ title = "SolidarBrasil", showBackButton = false, backPath = "/" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Verificar se é administrador
  const user = SecurityUtils.safeParseJSON(localStorage.getItem('solidar-user'));
  const isAdmin = user?.role === 'admin' || user?.isAdmin || user?.tipo === 'admin';

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className={`mob-header-overlay ${mobileMenuOpen ? "mob-active" : ""}`} onClick={() => setMobileMenuOpen(false)} />
      
      <aside className={`mob-sidebar ${mobileMenuOpen ? "mob-open" : ""}`}>
        <div className="mob-sidebar-header">
          <div className="mob-logo">
            <Heart size={24} />
            <span>SolidarBrasil</span>
          </div>
        </div>
        <nav className="mob-sidebar-nav">
          <button className="mob-nav-btn" onClick={() => handleNavigation('/')}>
            <Home size={20} />
            <span>Início</span>
          </button>
          {isAdmin && (
            <button className="mob-nav-btn" onClick={() => handleNavigation('/admin')}>
              <Settings size={20} />
              <span>Dashboard Admin</span>
            </button>
          )}
          <button className="mob-nav-btn" onClick={() => handleNavigation('/perfil')}>
            <User size={20} />
            <span>Meu Perfil</span>
          </button>
          <button className="mob-nav-btn" onClick={() => handleNavigation('/quero-ajudar')}>
            <HandHelping size={20} />
            <span>Quero Ajudar</span>
          </button>
          <button className="mob-nav-btn" onClick={() => handleNavigation('/preciso-de-ajuda')}>
            <Heart size={20} />
            <span>Preciso de Ajuda</span>
          </button>
          <button className="mob-nav-btn" onClick={() => handleNavigation('/achados-e-perdidos')}>
            <MapPin size={20} />
            <span>Achados e Perdidos</span>
          </button>
          <button className="mob-nav-btn" onClick={() => handleNavigation('/conversas')}>
            <MessageSquare size={20} />
            <span>Conversas</span>
          </button>
        </nav>
        <button className="mob-logout-btn" onClick={() => {
          SecurityUtils.clearUserSession();
          handleNavigation('/login');
        }}>
          <ArrowRight size={20} />
          <span>Sair</span>
        </button>
      </aside>

      <header className="mob-header">
        <button className="mob-menu-toggle" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="mob-header-title">
          <h1>{title}</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NotificationDropdown />
          {showBackButton && (
            <button className="mob-back-btn" onClick={() => navigate(backPath)}>
              <ArrowRight size={22} />
            </button>
          )}
        </div>
      </header>
    </>
  );
};

export default MobileHeader;