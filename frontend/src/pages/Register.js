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
      description: 'Pessoa física que quer fazer parte de uma comunidade mais solidária e conectada',
      features: ['Pedir ajuda quando precisar', 'Oferecer ajuda aos vizinhos', 'Participar de ações solidárias', 'Conectar-se com a vizinhança'],
      recommended: false
    },
    {
      id: 'comercio',
      title: 'Comércio Local',
      description: 'Estabelecimento que quer fortalecer laços com a comunidade e gerar impacto social',
      features: ['Oferecer produtos solidários', 'Aceitar moeda social', 'Participar de campanhas', 'Aumentar visibilidade local'],
      recommended: true
    },
    {
      id: 'ong',
      title: 'Organização Social',
      description: 'ONG ou instituição sem fins lucrativos com acesso a ferramentas avançadas',
      features: ['Acesso a dados de vulnerabilidade', 'Relatórios detalhados', 'Coordenar ações sociais', 'Gestão de campanhas'],
      recommended: false
    },
    {
      id: 'familia',
      title: 'Família',
      description: 'Cadastro de família para mapeamento social e identificação de vulnerabilidades',
      features: ['Mapeamento de vulnerabilidade', 'Acesso a programas sociais', 'Priorização em campanhas', 'Acompanhamento personalizado'],
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
          <div className="register-header">
            <button 
              className="back-btn"
              onClick={() => navigate('/')}
            >
              ← Voltar
            </button>
            <h1>Transforme sua comunidade</h1>
            <p>Escolha como você quer fazer parte dessa rede de solidariedade</p>
          </div>

          <div className="user-types">
            {userTypes.map(type => (
              <div
                key={type.id}
                className={`user-type-card ${userType === type.id ? 'selected' : ''} ${type.recommended ? 'recommended' : ''}`}
                onClick={() => setUserType(type.id)}
              >
                {type.recommended && (
                  <div className="recommended-badge">
                    ✨ Mais escolhido
                  </div>
                )}
                <div className="card-header">
                  <h3>{type.title}</h3>
                  <div className="selection-indicator">
                    {userType === type.id ? '✓' : ''}
                  </div>
                </div>
                <p className="card-description">{type.description}</p>
                <ul className="features-list">
                  {type.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="register-actions">
            <button
              className={`btn btn-primary ${!userType ? 'disabled' : ''}`}
              onClick={handleContinue}
              disabled={!userType}
            >
              Começar jornada
            </button>
            <p className="help-text">
              Tem dúvidas sobre qual escolher? <button className="link-btn" onClick={() => navigate('/sobre-tipos')}>Conheça cada tipo em detalhes</button>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;