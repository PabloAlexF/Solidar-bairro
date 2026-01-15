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
  HandHelping,
  Palette,
  Bell,
  Volume2,
  VolumeX,
  Sparkles,
  Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import apiService from '../../services/apiService';
import MobileHeader from '../../components/layout/MobileHeader';
import './ProfileMobile.css';

const ProfileMobile = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(user?.bio || user?.proposito || "Sou um cidadão engajado em ajudar minha comunidade local. Acredito que pequenas ações podem gerar grandes mudanças e fortalecer os laços entre vizinhos.");
  const [isPhoneVerified, setIsPhoneVerified] = useState(user?.phoneVerified || false);
  const [email, setEmail] = useState(user?.email || "Email não informado");
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pontos, setPontos] = useState(0);
  const [pedidosCriados, setPedidosCriados] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(user?.fotoPerfil || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300");
  
  useEffect(() => {
    if (user) {
      setBio(user.bio || user.proposito || "Sou um cidadão engajado em ajudar minha comunidade local. Acredito que pequenas ações podem gerar grandes mudanças e fortalecer os laços entre vizinhos.");
      setEmail(user.email || "Email não informado");
      setPontos(user.pontos || 0);
      setPedidosCriados(user.pedidosCriados || 0);
      setAvatarUrl(user.fotoPerfil || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300");
    }
  }, [user]);
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserData = async () => {
    try {
      if (!user?.uid && !user?.id) return;
      
      const endpoint = user.tipo === 'comercio' ? '/comercios' : 
                      user.tipo === 'ong' ? '/ongs' : 
                      user.tipo === 'familia' ? '/familias' : '/cidadaos';
      
      const response = await apiService.request(`${endpoint}/${user.uid || user.id}`);
      
      if (response.success && response.data) {
        updateUser(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  useEffect(() => {
    const profileContainer = document.querySelector('.prf-mobile-container');
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
      <div className="prf-loading">
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
        updateUser({ ...user, bio });
        setIsEditingBio(false);
        toast.success('Bio atualizada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar bio:', error);
      toast.error('Erro ao salvar. Tente novamente.');
    }
  };

  const handleSecurityAction = (action) => {
    toast.success(`${action} solicitado com sucesso!`);
  };

  const handleAvatarChange = () => {
    document.getElementById('avatar-upload')?.click();
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target?.result;
      setAvatarUrl(base64Image);

      try {
        const endpoint = user.tipo === 'comercio' ? '/comercios' : 
                        user.tipo === 'ong' ? '/ongs' : 
                        user.tipo === 'familia' ? '/familias' : '/cidadaos';
        
        const response = await apiService.request(`${endpoint}/${user.uid || user.id}`, {
          method: 'PUT',
          body: JSON.stringify({ fotoPerfil: base64Image })
        });
        
        if (response.success) {
          updateUser({ ...user, fotoPerfil: base64Image });
          toast.success('Foto atualizada com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao salvar foto:', error);
        toast.error('Erro ao salvar foto.');
      }
    };
    reader.readAsDataURL(file);
  };

  const updateBanner = (preset) => {
    setBannerConfig({
      type: preset.type,
      value: preset.value,
      overlay: preset.type === 'gradient'
    });
  };

  return (
    <div className={`prf-mobile-container ${isDarkMode ? 'prf-dark-mode' : ''}`}>
      <MobileHeader title="Meu Perfil" />
      
      <div className="prf-settings-floating-btn">
        <button className="prf-settings-btn" onClick={() => setIsSettingsOpen(true)}>
          <Settings size={22} />
        </button>
      </div>

      <div 
        className="prf-banner-bg" 
        style={{ 
          background: bannerConfig.type === 'image' ? `url(${bannerConfig.value}) center/cover no-repeat` : bannerConfig.value 
        }}
      >
        {bannerConfig.overlay && (
          <div className="prf-banner-overlay" />
        )}
        <button className="prf-banner-edit-btn" onClick={() => setIsEditingBanner(true)}>
          <Palette size={18} />
        </button>
      </div>

      <div className="prf-content">
        <div className="prf-profile-card">
          <div className="prf-avatar-section" onClick={handleAvatarChange}>
            <img src={avatarUrl} alt="Profile" className="prf-avatar" />
            <input 
              type="file" 
              id="avatar-upload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarUpload}
            />
            <div className="prf-avatar-edit">
              <Camera size={20} />
            </div>
            <div className="prf-mood-indicator">
              {mood === 'Empolgado' && <Zap size={16} />}
              {mood === 'Zen' && <CheckCircle2 size={16} />}
              {mood === 'Focado' && <ArrowRight size={16} />}
              {mood === 'Criativo' && <Palette size={16} />}
              {mood === 'Grato' && <Heart size={16} />}
            </div>
          </div>
          
          <h1 className="prf-name">
            {user?.nome || user?.nomeCompleto || user?.nomeEstabelecimento || user?.nomeEntidade || 'Usuário'}
            <span className="prf-mood-emoji">
              {mood === 'Empolgado' ? '🚀' : mood === 'Zen' ? '🧘' : mood === 'Focado' ? '🎯' : mood === 'Criativo' ? '🎨' : '🙏'}
            </span>
          </h1>
          
          <div className="prf-badge">
            {user?.tipo === 'comercio' ? 'Comércio Local' : user?.tipo === 'ong' ? 'ONG Parceira' : user?.tipo === 'familia' ? 'Família Cadastrada' : 'Nível 1 • Iniciante'}
          </div>

          <div className="prf-level-progress">
            <div className="prf-level-header">
              <span>Progresso de Nível</span>
              <span>0 / 100 XP</span>
            </div>
            <div className="prf-progress-bar">
              <div className="prf-progress-fill" style={{ width: '15%' }}></div>
            </div>
          </div>

          <div className="prf-meta-info">
            <div className="prf-meta-item">
              <MapPin size={16} />
              <span>
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
                })()}
              </span>
            </div>
            <div className="prf-meta-item">
              <Calendar size={16} />
              <span>
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
              </span>
            </div>
            {user?.telefone && (
              <div className="prf-meta-item">
                <Smartphone size={16} />
                <span>{user.telefone}</span>
              </div>
            )}
          </div>
        </div>

        <div className={`prf-impact-card ${zenMode ? 'prf-zen' : ''}`}>
          <div className="prf-impact-header">
            <div>
              <h2>{zenMode ? "Sua Presença" : "Impacto Social"}</h2>
              <p>{zenMode ? "Focando na jornada, não nos números." : "Seu rastro de bondade na comunidade local."}</p>
            </div>
            <Award size={32} />
          </div>

          {!zenMode && (
            <div className="prf-stats-grid">
              <div className="prf-stat-item">
                <span className="prf-stat-value">{pontos}</span>
                <span className="prf-stat-label">Pontos</span>
              </div>
              <div className="prf-stat-item">
                <span className="prf-stat-value">0</span>
                <span className="prf-stat-label">Ajudas</span>
              </div>
              <div className="prf-stat-item">
                <span className="prf-stat-value">{pedidosCriados}</span>
                <span className="prf-stat-label">Pedidos</span>
              </div>
            </div>
          )}

          <div className="prf-action-buttons">
            <button className="prf-btn prf-btn-primary">
              Começar agora
              <ArrowRight size={16} />
            </button>
            {!zenMode && (
              <button className="prf-btn prf-btn-ghost" onClick={() => setIsViewingHistory(true)}>
                <History size={16} />
                Histórico
              </button>
            )}
          </div>
        </div>

        {!zenMode && (
          <div className="prf-about-card">
            <div className="prf-section-header">
              <h3>
                <User size={20} />
                Sobre
              </h3>
              <button className="prf-btn prf-btn-outline" onClick={() => {
                if (isEditingBio) {
                  handleSaveBio();
                } else {
                  setIsEditingBio(true);
                }
              }}>
                {isEditingBio ? "Salvar" : <><Pencil size={14} /> Editar</>}
              </button>
            </div>
            
            {isEditingBio ? (
              <textarea 
                className="prf-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                autoFocus
              />
            ) : (
              <p className="prf-bio-text">{bio}</p>
            )}

            <div className="prf-skills-section">
              <h4>
                <Zap size={16} />
                Posso ajudar com:
              </h4>
              <div className="prf-skills-list">
                {skills.map((skill, index) => (
                  <div key={index} className="prf-skill-tag">
                    <HandHelping size={14} /> 
                    {skill}
                    <button 
                      onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                      className="prf-skill-remove"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                {isAddingSkill ? (
                  <div className="prf-skill-tag prf-skill-input">
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
                    />
                  </div>
                ) : (
                  <button 
                    className="prf-skill-tag prf-skill-add"
                    onClick={() => setIsAddingSkill(true)}
                  >
                    + Adicionar
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="prf-achievements-card">
          <h3>
            <Trophy size={20} />
            Conquistas
          </h3>
          <div className="prf-achievements-grid">
            <div className="prf-achievement prf-unlocked">
              <Zap size={20} />
              <span>Pioneiro</span>
            </div>
            <div className="prf-achievement">
              <Star size={20} />
              <span>Ajudante</span>
            </div>
            <div className="prf-achievement">
              <Coffee size={20} />
              <span>Amigável</span>
            </div>
          </div>
        </div>

        <div className="prf-security-card">
          <h3>
            <Shield size={20} />
            Segurança
          </h3>

          <div className="prf-security-items">
            <div className="prf-security-item">
              <div>
                <h4>E-mail Principal</h4>
                <p>{email}</p>
              </div>
              <button 
                className="prf-btn prf-btn-outline"
                onClick={() => handleSecurityAction("Alterar E-mail")}
              >
                Alterar
              </button>
            </div>

            <div className="prf-security-item">
              <div>
                <h4>Autenticação</h4>
                <p>Senha de acesso à conta</p>
              </div>
              <button 
                className="prf-btn prf-btn-outline"
                onClick={() => handleSecurityAction("Redefinir Senha")}
              >
                <Lock size={14} />
                Redefinir
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isSettingsOpen && (
        <div className="prf-modal-overlay" onClick={() => setIsSettingsOpen(false)}>
          <div className="prf-modal-content" onClick={e => e.stopPropagation()}>
            <div className="prf-modal-header">
              <h3>Configurações do Perfil</h3>
              <button className="prf-close-btn" onClick={() => setIsSettingsOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="prf-modal-body">
              <div className="prf-settings-section">
                <h4><Palette size={18} /> Personalização</h4>
                <div className="prf-setting-item">
                  <div>
                    <span>Modo Noturno</span>
                    <p>Alternar entre tema claro e escuro</p>
                  </div>
                  <label className="prf-switch">
                    <input type="checkbox" checked={isDarkMode} onChange={() => setIsDarkMode(!isDarkMode)} />
                    <span className="prf-slider"></span>
                  </label>
                </div>
                
                <div className="prf-setting-item">
                  <div>
                    <span>Cor de Destaque</span>
                    <p>Mude a cor principal do seu perfil</p>
                  </div>
                  <div className="prf-color-picker">
                    {['#10b981', '#6366f1', '#f97316', '#ef4444', '#ec4899'].map(color => (
                      <button 
                        key={color} 
                        onClick={() => setAccentColor(color)}
                        className={`prf-color-btn ${accentColor === color ? 'prf-active' : ''}`}
                        style={{ background: color }}
                      />
                    ))}
                    <input 
                      type="color" 
                      value={accentColor} 
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="prf-color-input"
                    />
                  </div>
                </div>
              </div>

              <div className="prf-settings-section">
                <h4><Sparkles size={18} /> Mood & Experiência</h4>
                <div className="prf-setting-item">
                  <div>
                    <span>Seu Mood</span>
                    <p>Como você está se sentindo hoje?</p>
                  </div>
                  <select 
                    value={mood} 
                    onChange={(e) => setMood(e.target.value)}
                    className="prf-select"
                  >
                    <option value="Empolgado">🚀 Empolgado</option>
                    <option value="Zen">🧘 Zen</option>
                    <option value="Focado">🎯 Focado</option>
                    <option value="Criativo">🎨 Criativo</option>
                    <option value="Grato">🙏 Grato</option>
                  </select>
                </div>
                
                <div className="prf-setting-item">
                  <div>
                    <span>Modo Minimalista</span>
                    <p>Foque apenas no essencial</p>
                  </div>
                  <label className="prf-switch">
                    <input type="checkbox" checked={zenMode} onChange={() => setZenMode(!zenMode)} />
                    <span className="prf-slider"></span>
                  </label>
                </div>
              </div>

              <div className="prf-settings-section">
                <h4><Bell size={18} /> Notificações</h4>
                <div className="prf-setting-item">
                  <div>
                    <span>Alertas de Ajuda</span>
                    <p>Receba avisos de novas oportunidades</p>
                  </div>
                  <label className="prf-switch">
                    <input type="checkbox" checked={notificationsEnabled} onChange={() => setNotificationsEnabled(!notificationsEnabled)} />
                    <span className="prf-slider"></span>
                  </label>
                </div>
                <div className="prf-setting-item">
                  <div>
                    <span>Efeitos Sonoros</span>
                    <p>Sons ao interagir com a plataforma</p>
                  </div>
                  <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="prf-sound-btn"
                  >
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </button>
                </div>
              </div>

              <div className="prf-settings-section">
                <h4><Shield size={18} /> Privacidade</h4>
                <div className="prf-setting-item">
                  <div>
                    <span>Perfil Privado</span>
                    <p>Apenas amigos podem ver seu impacto</p>
                  </div>
                  <label className="prf-switch">
                    <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
                    <span className="prf-slider"></span>
                  </label>
                </div>
              </div>

              <button className="prf-btn prf-btn-primary prf-full-width" onClick={() => setIsSettingsOpen(false)}>
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingBanner && (
        <div className="prf-modal-overlay" onClick={() => setIsEditingBanner(false)}>
          <div className="prf-modal-content" onClick={e => e.stopPropagation()}>
            <div className="prf-modal-header">
              <h3>Design do Perfil</h3>
              <button className="prf-close-btn" onClick={() => setIsEditingBanner(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="prf-modal-body">
              <div className="prf-banner-presets">
                {bannerPresets.map((preset, idx) => (
                  <button 
                    key={idx} 
                    className={`prf-banner-preset ${bannerConfig.value === preset.value ? 'prf-active' : ''}`}
                    onClick={() => updateBanner(preset)}
                    style={{ 
                      background: preset.type === 'image' ? `url(${preset.value}) center/cover` : preset.value 
                    }}
                  >
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
              <div className="prf-custom-upload">
                <p>Importar da Galeria:</p>
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
                  className="prf-btn prf-btn-primary prf-full-width"
                  onClick={() => document.getElementById('banner-upload')?.click()}
                >
                  <Camera size={16} />
                  Escolher Foto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isViewingHistory && (
        <div className="prf-modal-overlay" onClick={() => setIsViewingHistory(false)}>
          <div className="prf-modal-content" onClick={e => e.stopPropagation()}>
            <div className="prf-modal-header">
              <h3>Histórico de Atividades</h3>
              <button className="prf-close-btn" onClick={() => setIsViewingHistory(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="prf-modal-body prf-text-center">
              <div className="prf-empty-state">
                <History size={48} />
                <h4>{hasHistory ? "Você possui um histórico real" : "Nenhum histórico real encontrado"}</h4>
                <p>
                  {hasHistory 
                    ? "Suas atividades estão registradas e vinculadas à sua conta de forma permanente." 
                    : "Atualmente não existem registros de atividades passadas vinculados ao seu perfil."}
                </p>
                <button className="prf-btn prf-btn-primary prf-full-width" onClick={() => setIsViewingHistory(false)}>
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPhoneModalOpen && (
        <div className="prf-modal-overlay" onClick={() => setIsPhoneModalOpen(false)}>
          <div className="prf-modal-content" onClick={e => e.stopPropagation()}>
            <div className="prf-modal-header">
              <h3>Verificação de Identidade</h3>
              <button className="prf-close-btn" onClick={() => setIsPhoneModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="prf-modal-body">
              <div className="prf-verification-info">
                <ShieldCheck size={40} />
                <h4>Sua segurança em primeiro lugar</h4>
                <p>
                  Usuários não verificados possuem <strong>menos permissões</strong> e <strong>menos credibilidade</strong> na comunidade. 
                  A verificação via SMS garante que você é uma pessoa real.
                </p>
              </div>

              <div className="prf-phone-input-section">
                <label>Número de Telefone</label>
                <p>Enviaremos um código de 6 dígitos via SMS</p>
                <input 
                  type="tel" 
                  placeholder="(11) 99999-9999" 
                  className="prf-input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <button 
                className="prf-btn prf-btn-primary prf-full-width"
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
      )}
    </div>
  );
};

export default ProfileMobile;