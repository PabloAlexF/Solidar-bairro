import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/pages/Perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const savedUser = localStorage.getItem('solidar-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setEditData(userData);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleSave = () => {
    setUser(editData);
    localStorage.setItem('solidar-user', JSON.stringify(editData));
    window.dispatchEvent(new CustomEvent('userUpdated'));
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="perfil-page">
      <Header />
      
      <main className="perfil-content">
        <div className="container">
          <div className="perfil-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Voltar
            </button>
            <h1>Meu Perfil</h1>
          </div>

          <div className="perfil-container">
            <div className="perfil-card">
              <div className="perfil-avatar-section">
                <div className="perfil-avatar">
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="perfil-basic-info">
                  <h2>{user.name}</h2>
                  {user.isVerified && (
                    <span className="verified-badge">
                      ✓ Verificado
                    </span>
                  )}
                  <p className="perfil-phone">{user.phone}</p>
                  <p className="perfil-member-since">
                    Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="perfil-stats">
                <div className="stat-card">
                  <div className="stat-number">{user.helpedCount}</div>
                  <div className="stat-label">Pessoas ajudadas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{user.receivedHelpCount}</div>
                  <div className="stat-label">Ajudas recebidas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{user.badges?.length || 0}</div>
                  <div className="stat-label">Conquistas</div>
                </div>
              </div>

              <div className="perfil-details">
                <div className="detail-section">
                  <h3>Informações Pessoais</h3>
                  {isEditing ? (
                    <div className="edit-form">
                      <div className="form-group">
                        <label>Nome completo</label>
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({...editData, name: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Telefone</label>
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="detail-info">
                      <div className="info-item">
                        <span className="info-label">Nome:</span>
                        <span className="info-value">{user.name}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Telefone:</span>
                        <span className="info-value">{user.phone}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Tipo de usuário:</span>
                        <span className="info-value">{user.userType}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Status:</span>
                        <span className={`info-value ${user.isVerified ? 'verified' : 'unverified'}`}>
                          {user.isVerified ? 'Verificado' : 'Não verificado'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {user.badges && user.badges.length > 0 && (
                  <div className="detail-section">
                    <h3>Conquistas</h3>
                    <div className="badges-grid">
                      {user.badges.map((badge, index) => (
                        <div key={index} className="badge-item">
                          <span className="badge-icon">{badge.icon}</span>
                          <span className="badge-name">{badge.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="detail-section">
                  <h3>Atividade Recente</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">🎉</span>
                      <div className="activity-content">
                        <p>Conta criada com sucesso</p>
                        <span className="activity-date">
                          {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    {user.isVerified && (
                      <div className="activity-item">
                        <span className="activity-icon">✅</span>
                        <div className="activity-content">
                          <p>Telefone verificado</p>
                          <span className="activity-date">Recente</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="perfil-actions">
                {isEditing ? (
                  <div className="edit-actions">
                    <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                      Salvar alterações
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                    Editar perfil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Perfil;