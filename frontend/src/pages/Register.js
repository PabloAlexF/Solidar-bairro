import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import '../styles/pages/Register.css';

const Register = () => {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'cidadao',
      title: 'Cidadão',
      icon: 'fi fi-rr-user',
      description: 'Pessoa física que quer fazer parte de uma comunidade mais solidária e conectada',
      features: ['Pedir ajuda quando precisar', 'Oferecer ajuda aos vizinhos', 'Participar de ações solidárias', 'Conectar-se com a vizinhança'],
      color: 'primary',
      recommended: false
    },
    {
      id: 'comercio',
      title: 'Comércio Local',
      icon: 'fi fi-rr-shop',
      description: 'Estabelecimento que quer fortalecer laços com a comunidade e gerar impacto social',
      features: ['Oferecer produtos solidários', 'Aceitar moeda social', 'Participar de campanhas', 'Aumentar visibilidade local'],
      color: 'secondary',
      recommended: true
    },
    {
      id: 'ong',
      title: 'Organização Social',
      icon: 'fi fi-rr-handshake',
      description: 'ONG ou instituição sem fins lucrativos com acesso a ferramentas avançadas',
      features: ['Acesso a dados de vulnerabilidade', 'Relatórios detalhados', 'Coordenar ações sociais', 'Gestão de campanhas'],
      color: 'tertiary',
      recommended: false
    },
    {
      id: 'familia',
      title: 'Família',
      icon: 'fi fi-rr-users',
      description: 'Cadastro de família para mapeamento social e identificação de vulnerabilidades',
      features: ['Mapeamento de vulnerabilidade', 'Acesso a programas sociais', 'Priorização em campanhas', 'Acompanhamento personalizado'],
      color: 'quaternary',
      recommended: false
    }
  ];

  const handleContinue = () => {
    if (userType) {
      if (userType === 'familia') {
        navigate('/cadastro-familia');
      } else {
        navigate(`/cadastro/${userType}`);
      }
    }
  };

  return (
    <>
      <Header showLoginButton={false} />
      <div className="register">
        <div className="container">
          <div className="register-content">
            {/* Header com badge e título */}
            <div className="register-header">
             
              
              <div className="register-brand">
                <span className="brand-name">SolidarBairro</span>
                <h1 className="register-title">Transforme sua <span className="text-primary">comunidade</span></h1>
                <p className="register-subtitle">
                  Escolha como você quer fazer parte dessa rede de solidariedade e começar a fazer a diferença
                </p>
              </div>
            </div>

            {/* Cards de tipos de usuário */}
            <div className="user-types-grid">
              {userTypes.map(type => (
                <div
                  key={type.id}
                  className={`user-type-card ${userType === type.id ? 'selected' : ''} ${type.color}`}
                  onClick={() => setUserType(type.id)}
                >
                  {type.recommended && (
                    <div className="recommended-badge">
                      <i className="fi fi-rr-star"></i>
                      <span>Mais escolhido</span>
                    </div>
                  )}
                  
                  <div className="card-icon">
                    <i className={type.icon}></i>
                  </div>
                  
                  <div className="card-header">
                    <h3>{type.title}</h3>
                    <div className="selection-indicator">
                      {userType === type.id && <i className="fi fi-rr-check"></i>}
                    </div>
                  </div>
                  
                  <p className="card-description">{type.description}</p>
                  
                  <ul className="features-list">
                    {type.features.map((feature, index) => (
                      <li key={index}>
                        <i className="fi fi-rr-check"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Ações */}
            <div className="register-actions">
              <button
                className={`continue-button ${!userType ? 'disabled' : ''}`}
                onClick={handleContinue}
                disabled={!userType}
              >
                <span>Começar jornada</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              
              <div className="help-section">
                <p className="help-text">
                  Tem dúvidas sobre qual escolher?
                </p>
                <button 
                  className="help-button"
                  onClick={() => navigate('/sobre-tipos')}
                >
                  <i className="fi fi-rr-info"></i>
                  <span>Conheça cada tipo em detalhes</span>
                </button>
              </div>
            </div>

            {/* Botão voltar */}
            <div className="register-back">
              <button 
                className="back-button"
                onClick={() => navigate('/')}
              >
                <i className="fi fi-rr-arrow-left"></i>
                <span>Voltar ao início</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorações de fundo */}
        <div className="register-decorations">
          <div className="decoration decoration-1"></div>
          <div className="decoration decoration-2"></div>
          <div className="decoration decoration-3"></div>
          <div className="decoration decoration-4"></div>
        </div>
      </div>
    </>
  );
};

export default Register;