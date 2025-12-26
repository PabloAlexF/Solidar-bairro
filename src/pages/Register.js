import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Register.css';

const Register = () => {
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'cidadao',
      title: 'Cidadão',
      description: 'Pessoa física que quer ajudar ou receber ajuda da comunidade',
      features: ['Pedir ajuda quando precisar', 'Oferecer ajuda aos vizinhos', 'Participar de ações solidárias'],
      recommended: false
    },
    {
      id: 'comercio',
      title: 'Comércio Local',
      description: 'Estabelecimento comercial que quer apoiar a comunidade',
      features: ['Oferecer produtos solidários', 'Aceitar moeda social', 'Participar de campanhas'],
      recommended: true
    },
    {
      id: 'ong',
      title: 'ONG',
      description: 'Organização sem fins lucrativos com verificação rigorosa',
      features: ['Acesso a dados de vulnerabilidade', 'Relatórios detalhados', 'Coordenar ações sociais'],
      recommended: false
    }
  ];

  const handleContinue = () => {
    if (userType) {
      navigate(`/cadastro/${userType}`);
    }
  };

  return (
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
            <h1>Junte-se ao SolidarBairro</h1>
            <p>Escolha o tipo de cadastro que melhor representa você</p>
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
                    Mais popular
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
              Continuar cadastro
            </button>
            <p className="help-text">
              Não sabe qual escolher? <button className="link-btn" onClick={() => navigate('/sobre-tipos')}>Saiba mais sobre cada tipo</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;