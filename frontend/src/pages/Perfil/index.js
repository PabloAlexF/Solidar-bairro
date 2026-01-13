import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  ShieldCheck, 
  Pencil, 
  Lock, 
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Heart,
  Settings,
  Shield,
  History,
  Camera,
  X,
  Zap,
  Star,
  Trophy,
  Coffee,
  Globe,
  HandHelping,
  Palette,
  Bell,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../../hooks/useIsMobile';
import apiService from '../../services/apiService';
import ProfileMobile from './ProfileMobile';
import '../../styles/pages/profile.css';

const ProfileComponent = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(user?.bio || user?.proposito || "Sou um cidadão engajado em ajudar minha comunidade local. Acredito que pequenas ações podem gerar grandes mudanças e fortalecer os laços entre vizinhos.");
  const [isPhoneVerified, setIsPhoneVerified] = useState(user?.phoneVerified || false);
  const [email, setEmail] = useState(user?.email || "Email não informado");
  
  // Atualizar bio quando dados do usuário mudarem
  useEffect(() => {
    setBio(user?.bio || user?.proposito || "Sou um cidadão engajado em ajudar minha comunidade local. Acredito que pequenas ações podem gerar grandes mudanças e fortalecer os laços entre vizinhos.");
    setEmail(user?.email || "Email não informado");
    setAjudasConcluidas(user?.ajudasConcluidas || 0);
  }, [user]);
  
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300");
  const [bannerConfig, setBannerConfig] = useState({
    type: 'gradient',
    value: 'linear-gradient(135deg, #065f46 0%, #10b981 50%, #34d399 100%)',
    overlay: true
  });
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasHistory] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [accentColor, setAccentColor] = useState("#10b981");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mood, setMood] = useState("Empolgado");
  const [zenMode, setZenMode] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ajudasConcluidas, setAjudasConcluidas] = useState(0);
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
    } else {
      loadUserData();
    }
  }, [isAuthenticated, navigate]);

  const loadUserData = async () => {
    try {
      if (!user?.uid && !user?.id) return;
      
      const endpoint = user.tipo === 'comercio' ? '/comercios' : 
                      user.tipo === 'ong' ? '/ongs' : 
                      user.tipo === 'familia' ? '/familias' : '/cidadaos';
      
      const response = await apiService.request(`${endpoint}/${user.uid || user.id}`);
      
      if (response.success && response.data) {
        updateUser(response.data);
        setAjudasConcluidas(response.data.ajudasConcluidas || 0);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  useEffect(() => {
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer) {
      profileContainer.style.setProperty('--primary', accentColor);
      const r = parseInt(accentColor.slice(1, 3), 16);
      const g = parseInt(accentColor.slice(3, 5), 16);
      const b = parseInt(accentColor.slice(5, 7), 16);
      profileContainer.style.setProperty('--primary-dark', `rgb(${Math.max(0, r-30)}, ${Math.max(0, g-30)}, ${Math.max(0, b-30)})`);
      profileContainer.style.setProperty('--primary-light', `rgba(${r}, ${g}, ${b}, 0.15)`);
    }
  }, [accentColor]);

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  const bannerPresets = [
    { name: 'Esmeralda', value: 'linear-gradient(135deg, #065f46 0%, #10b981 50%, #34d399 100%)', type: 'gradient' },
    { name: 'Oceano', value: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', type: 'gradient' },
    { name: 'Pôr do Sol', value: 'linear-gradient(135deg, #7c2d12 0%, #f97316 100%)', type: 'gradient' },
    { name: 'Noite', value: '#0f172a', type: 'color' },
    { name: 'Natureza', value: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80', type: 'image' },
    { name: 'Arquitetura', value: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80', type: 'image' }
  ];

  const handleSaveBio = async () => {
    try {
      const endpoint = user.tipo === 'comercio' ? '/comercios' : 
                      user.tipo === 'ong' ? '/ongs' : 
                      user.tipo === 'familia' ? '/familias' : '/cidadaos';
      
      const response = await apiService.request(`${endpoint}/${user.uid || user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ bio })
      });
      
      if (response.success) {
        // Atualizar dados locais
        updateUser({ ...user, bio });
        setIsEditingBio(false);
      }
    } catch (error) {
      console.error('Erro ao salvar bio:', error);
      alert('Erro ao salvar. Tente novamente.');
    }
  };

  const handleSecurityAction = (action) => {
    if (!isPhoneVerified) return;
    alert(`${action} solicitado com sucesso!`);
  };

  const handleAvatarChange = () => {
    document.getElementById('avatar-upload')?.click();
  };

  const updateBanner = (preset) => {
    setBannerConfig({
      type: preset.type,
      value: preset.value,
      overlay: preset.type === 'gradient'
    });
  };

  // Render mobile version if on mobile device
  if (isMobile) {
    return <ProfileMobile />;
  }

  return (
    <div className={`profile-container animate-fade-in ${isDarkMode ? 'dark-mode' : ''}`}>
      <header 
        className="profile-header-bg" 
        style={{ 
          background: bannerConfig.type === 'image' ? `url(${bannerConfig.value}) center/cover no-repeat` : bannerConfig.value 
        }}
      >
        {bannerConfig.overlay && (
          <div style={{ position: 'absolute', inset: 0, background: 'url("https://www.transparenttextures.com/patterns/cubes.png")', opacity: 0.3 }} />
        )}
        <div className="banner-edit-overlay top-right">
          <button className="btn-banner-edit glass-button" onClick={() => setIsEditingBanner(true)}>
            <Palette size={20} />
            Customizar Fundo
          </button>
        </div>
      </header>

      {isSettingsOpen && (
        <div className="modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Configurações do Perfil</h3>
              <button className="close-btn" onClick={() => setIsSettingsOpen(false)}><X size={24} /></button>
            </div>
            <div className="settings-body">
              <div className="settings-section">
                <h4><Palette size={18} /> Personalização</h4>
                <div className="setting-control" style={{ marginBottom: '12px' }}>
                  <div className="setting-info">
                    <span>Modo Noturno</span>
                    <p>Alternar entre tema claro e escuro</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
                    <span className="slider round"></span>
                  </label>
                </div>
                
                <div className="setting-control">
                  <div className="setting-info">
                    <span>Cor de Destaque</span>
                    <p>Mude a cor principal do seu perfil</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['#10b981', '#6366f1', '#f97316', '#ef4444', '#ec4899'].map(color => (
                      <button 
                        key={color} 
                        onClick={() => setAccentColor(color)}
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          background: color, 
                          border: accentColor === color ? '2px solid white' : 'none',
                          boxShadow: '0 0 0 2px rgba(0,0,0,0.1)',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                    <input 
                      type="color" 
                      value={accentColor} 
                      onChange={(e) => setAccentColor(e.target.value)}
                      style={{ width: '24px', height: '24px', border: 'none', background: 'none', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              <div className="settings-section">
                <h4><Sparkles size={18} /> Mood & Experiência</h4>
                <div className="setting-control" style={{ marginBottom: '12px' }}>
                  <div className="setting-info">
                    <span>Seu Mood</span>
                    <p>Como você está se sentindo hoje?</p>
                  </div>
                  <select 
                    value={mood} 
                    onChange={(e) => setMood(e.target.value)}
                    className="input-field"
                    style={{ width: 'auto', padding: '8px 12px' }}
                  >
                    <option value="Empolgado">🚀 Empolgado</option>
                    <option value="Zen">🧘 Zen</option>
                    <option value="Focado">🎯 Focado</option>
                    <option value="Criativo">🎨 Criativo</option>
                    <option value="Grato">🙏 Grato</option>
                  </select>
                </div>
                
                <div className="setting-control">
                  <div className="setting-info">
                    <span>Modo Minimalista</span>
                    <p>Foque apenas no essencial</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={zenMode} onChange={() => setZenMode(!zenMode)} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <h4><Bell size={18} /> Notificações</h4>
                <div className="setting-control" style={{ marginBottom: '12px' }}>
                  <div className="setting-info">
                    <span>Alertas de Ajuda</span>
                    <p>Receba avisos de novas oportunidades</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="setting-control">
                  <div className="setting-info">
                    <span>Efeitos Sonoros</span>
                    <p>Sons ao interagir com a plataforma</p>
                  </div>
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <h4><Shield size={18} /> Privacidade</h4>
                <div className="setting-control">
                  <div className="setting-info">
                    <span>Perfil Privado</span>
                    <p>Apenas amigos podem ver seu impacto</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>

              <div className="settings-footer">
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setIsSettingsOpen(false)}>
                  Salvar Preferências
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isViewingHistory && (
        <div className="modal-overlay" onClick={() => setIsViewingHistory(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Histórico de Atividades</h3>
              <button className="close-btn" onClick={() => setIsViewingHistory(false)}><X size={24} /></button>
            </div>
            <div className="card-padding" style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ background: 'var(--background)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--text-muted)' }}>
                <History size={40} />
              </div>
              <h4 style={{ fontSize: '20px', marginBottom: '12px', fontFamily: 'var(--font-header)' }}>
                {hasHistory ? "Você possui um histórico real" : "Nenhum histórico real encontrado"}
              </h4>
              <p style={{ color: 'var(--text-muted)', maxWidth: '300px', margin: '0 auto', lineHeight: '1.6' }}>
                {hasHistory 
                  ? "Suas atividades estão registradas e vinculadas à sua conta de forma permanente." 
                  : "Atualmente não existem registros de atividades passadas vinculados ao seu perfil."}
              </p>
              <button className="btn btn-primary" style={{ marginTop: '32px', width: '100%', justifyContent: 'center' }} onClick={() => setIsViewingHistory(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingBanner && (
        <div className="modal-overlay" onClick={() => setIsEditingBanner(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Design do Perfil</h3>
              <button className="close-btn" onClick={() => setIsEditingBanner(false)}><X size={24} /></button>
            </div>
            <div className="banner-options">
              <div className="options-grid">
                {bannerPresets.map((preset, idx) => (
                  <button 
                    key={idx} 
                    className={`banner-preset ${bannerConfig.value === preset.value ? 'active' : ''}`}
                    onClick={() => updateBanner(preset)}
                    style={{ 
                      background: preset.type === 'image' ? `url(${preset.value}) center/cover` : preset.value 
                    }}
                  >
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
              <div className="custom-url-section">
                <p>Importar da Galeria:</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="file" 
                    id="banner-upload"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          updateBanner({ type: 'image', value: event.target?.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => document.getElementById('banner-upload')?.click()}
                  >
                    <Camera size={18} />
                    Escolher Foto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="profile-main">
        <aside className="sidebar-sticky">
          <section className="card identity-card">
            <div className="avatar-container" onClick={handleAvatarChange}>
              <img src={avatarUrl} alt="Profile" className="avatar-image" />
              <input 
                type="file" 
                id="avatar-upload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setAvatarUrl(event.target?.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <div className="avatar-edit-hint">
                <Camera size={28} />
                <span>Importar Galeria</span>
              </div>
              <div className="avatar-status">
                {mood === 'Empolgado' && <Zap size={20} />}
                {mood === 'Zen' && <CheckCircle2 size={20} />}
                {mood === 'Focado' && <ArrowRight size={20} />}
                {mood === 'Criativo' && <Palette size={20} />}
                {mood === 'Grato' && <Heart size={20} />}
              </div>
            </div>
            
            <h1 className="name-title">{user?.nome || user?.nomeCompleto || user?.nomeEstabelecimento || user?.nomeEntidade || 'Usuário'} <span style={{ fontSize: '18px', verticalAlign: 'middle', opacity: 0.8 }}>{mood === 'Empolgado' ? '🚀' : mood === 'Zen' ? '🧘' : mood === 'Focado' ? '🎯' : mood === 'Criativo' ? '🎨' : '🙏'}</span></h1>
            <div className="badge">{user?.tipo === 'comercio' ? 'Comércio Local' : user?.tipo === 'ong' ? 'ONG Parceira' : user?.tipo === 'familia' ? 'Família Cadastrada' : 'Nível 1 • Iniciante'}</div>

            <div className="level-container">
              <div className="level-header">
                <span>Progresso de Nível</span>
                <span>0 / 100 XP</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div className="card-padding" style={{ paddingTop: '24px', textAlign: 'left' }}>
              <div className="meta-item" style={{ marginBottom: '16px' }}>
                <MapPin size={18} color="var(--primary)" />
                {(() => {
                  if (typeof user?.endereco === 'object' && user.endereco) {
                    const { rua, numero, bairro, cidade, estado } = user.endereco;
                    const parts = [];
                    if (rua) parts.push(rua);
                    if (numero) parts.push(numero);
                    if (bairro) parts.push(bairro);
                    if (cidade) parts.push(cidade);
                    if (estado) parts.push(estado);
                    return parts.length > 0 ? parts.join(', ') : 'Endereço não informado';
                  }
                  if (typeof user?.endereco === 'string' && user.endereco) {
                    return user.endereco;
                  }
                  if (user?.cidade && user?.estado) {
                    return `${user.cidade}, ${user.estado}`;
                  }
                  return 'Endereço não informado';
                })()
                }
              </div>
              <div className="meta-item">
                <Calendar size={18} color="var(--primary)" />
                Desde {user?.criadoEm ? (() => {
                  let date;
                  if (user.criadoEm.seconds) {
                    date = new Date(user.criadoEm.seconds * 1000);
                  } else if (user.criadoEm._seconds) {
                    date = new Date(user.criadoEm._seconds * 1000);
                  } else {
                    date = new Date(user.criadoEm);
                  }
                  return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
                })() : 'Jan 2024'}
              </div>
              
              {user?.telefone && (
                <div className="meta-item" style={{ marginTop: '16px' }}>
                  <Smartphone size={18} color="var(--primary)" />
                  {user.telefone}
                </div>
              )}
              
              <button className="btn btn-outline" style={{ width: '100%', marginTop: '32px' }} onClick={() => setIsSettingsOpen(true)}>
                <Settings size={18} />
                Configurações
              </button>
            </div>
          </section>

          <section className="card card-padding">
            <h3 className="section-title" style={{ fontSize: '18px', marginBottom: '20px' }}>
              <Trophy size={20} color="var(--primary)" />
              Conquistas
            </h3>
            <div className="achievements-grid">
              <div className="achievement-badge unlocked">
                <div className="badge-icon"><Zap size={24} /></div>
                <span className="badge-name">Pioneiro</span>
              </div>
              <div className="achievement-badge">
                <div className="badge-icon"><Star size={24} /></div>
                <span className="badge-name">Ajudante</span>
              </div>
              <div className="achievement-badge">
                <div className="badge-icon"><Coffee size={24} /></div>
                <span className="badge-name">Amigável</span>
              </div>
            </div>
          </section>
        </aside>

        <div className="content-area">
          <section className={`card impact-card-v2 ${zenMode ? 'zen-simple' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 className="section-title" style={{ color: 'white', marginBottom: '8px' }}>
                  {zenMode ? "Sua Presença" : "Impacto Social"}
                </h2>
                <p style={{ opacity: 0.7, maxWidth: '400px' }}>
                  {zenMode ? "Focando na jornada, não nos números." : "Seu rastro de bondade na comunidade local."}
                </p>
              </div>
              <Award size={40} color="var(--primary)" />
            </div>

            {!zenMode && (
              <div className="impact-stats-grid">
                <div className="impact-stat-item">
                  <span className="value">{ajudasConcluidas}</span>
                  <span className="label">Ajudas Concluídas</span>
                </div>
                <div className="impact-stat-item">
                  <span className="value">0</span>
                  <span className="label">Pontos</span>
                </div>
                <div className="impact-stat-item">
                  <span className="value">0</span>
                  <span className="label">Pedidos</span>
                </div>
              </div>
            )}

            <div style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
              <button className="btn btn-primary">
                Começar agora
                <ArrowRight size={18} />
              </button>
              {!zenMode && (
                <button className="btn glass-button" style={{ color: 'white' }} onClick={() => setIsViewingHistory(true)}>
                  <History size={18} />
                  Histórico
                </button>
              )}
            </div>
          </section>

          {!zenMode && (
            <section className="card card-padding">
              <div className="section-header">
                <h3 className="section-title">
                  <User size={24} color="var(--primary)" />
                  Sobre
                </h3>
                <button className="btn btn-outline" onClick={() => {
                  if (isEditingBio) {
                    handleSaveBio();
                  } else {
                    setIsEditingBio(true);
                  }
                }} style={{ padding: '8px 16px' }}>
                  {isEditingBio ? "Salvar" : <><Pencil size={14} /> Editar</>}
                </button>
              </div>
              
              {isEditingBio ? (
                <textarea 
                  className="input-field"
                  style={{ minHeight: '120px' }}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  autoFocus
                />
              ) : (
                <p className="bio-text">{bio}</p>
              )}

              <div style={{ marginTop: '32px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} color="var(--primary)" />
                  Posso ajudar com:
                </h4>
                <div className="skills-container">
                  {skills.map((skill, index) => (
                    <div key={index} className="skill-tag">
                      <HandHelping size={16} /> 
                      {skill}
                      <button 
                        onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '2px', borderRadius: '50%' }}
                        className="skill-remove-btn"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {isAddingSkill ? (
                    <div className="skill-tag" style={{ padding: '4px 8px' }}>
                      <input 
                        type="text" 
                        value={newSkill} 
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newSkill.trim()) {
                            setSkills([...skills, newSkill.trim()]);
                            setNewSkill("");
                            setIsAddingSkill(false);
                          } else if (e.key === 'Escape') {
                            setIsAddingSkill(false);
                          }
                        }}
                        autoFocus
                        placeholder="Ex: Pintura"
                        style={{ border: 'none', background: 'none', outline: 'none', fontSize: '14px', width: '100px' }}
                      />
                    </div>
                  ) : (
                    <button 
                      className="skill-tag" 
                      style={{ borderStyle: 'dashed', color: 'var(--primary)', cursor: 'pointer' }}
                      onClick={() => setIsAddingSkill(true)}
                    >
                      + Adicionar
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          <section className="card card-padding">
            <div className="section-header">
              <h3 className="section-title">
                <Shield size={24} color="var(--primary)" />
                Segurança
              </h3>
            </div>

            <div className="security-list">
              <div className="security-item">
                <div className="security-info">
                  <h4>E-mail Principal</h4>
                  <p>{email}</p>
                </div>
                <button 
                  className={isPhoneVerified ? "btn btn-outline" : "btn btn-disabled"}
                  onClick={() => handleSecurityAction("Alterar E-mail")}
                >
                  Alterar
                </button>
              </div>

              <div className="security-item">
                <div className="security-info">
                  <h4>Autenticação</h4>
                  <p>Senha de acesso à conta</p>
                </div>
                <button 
                  className={isPhoneVerified ? "btn btn-outline" : "btn btn-disabled"}
                  onClick={() => handleSecurityAction("Redefinir Senha")}
                >
                  <Lock size={14} />
                  Redefinir
                </button>
              </div>
            </div>

            {!isPhoneVerified ? (
              <div className="verification-banner banner-warning" style={{ marginTop: '32px' }}>
                <div className="banner-title"><ShieldCheck size={20} /> Verificação Necessária</div>
                <p className="banner-desc">Confirme sua identidade via SMS para habilitar alterações críticas de segurança.</p>
                <button className="btn btn-primary" onClick={() => setIsPhoneModalOpen(true)}>
                  <Smartphone size={18} />
                  Verificar Telefone
                </button>
              </div>
            ) : (
              <div className="verification-banner banner-success" style={{ marginTop: '32px' }}>
                <div className="banner-title"><CheckCircle2 size={20} /> Identidade Confirmada</div>
                <p className="banner-desc">Sua conta está totalmente protegida e verificada.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      {isPhoneModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPhoneModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Verificação de Identidade</h3>
              <button className="close-btn" onClick={() => setIsPhoneModalOpen(false)}><X size={24} /></button>
            </div>
            <div className="settings-body">
              <div className="verification-alert">
                <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                <h4>Sua segurança em primeiro lugar</h4>
                <p>
                  Usuários não verificados possuem <strong>menos permissões</strong> e <strong>menos credibilidade</strong> na comunidade. 
                  A verificação via SMS garante que você é uma pessoa real.
                </p>
              </div>

              <div className="settings-section" style={{ marginTop: '24px' }}>
                <div className="setting-control" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                  <div className="setting-info">
                    <span>Número de Telefone</span>
                    <p>Enviaremos um código de 6 dígitos via SMS</p>
                  </div>
                  <input 
                    type="tel" 
                    placeholder="(11) 99999-9999" 
                    className="input-field"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="settings-footer">
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }} 
                  onClick={() => {
                    if (phoneNumber.length > 8) {
                      setIsPhoneVerified(true);
                      setIsPhoneModalOpen(false);
                    }
                  }}
                >
                  Receber Código SMS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;