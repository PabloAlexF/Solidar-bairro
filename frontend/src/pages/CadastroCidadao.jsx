import React, { useState } from 'react';
import { 
  User, ArrowLeft, Heart, Zap, 
  MapPin, CheckCircle2, ChevronRight, 
  ChevronLeft, Fingerprint, Calendar, 
  Phone, Mail, ShieldCheck, Trophy, 
  Award, Info, Sparkles, Target, Home,
  Sun, Moon, CloudSun, AlertTriangle, Coffee,
  Apple, BookOpen, Stethoscope, Hammer, Smile, Truck,
  Share2, Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiService from '../services/apiService';
import '../styles/components/CadastroCidadao.css';

export default function CadastroCidadao() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAnalysisAlert, setShowAnalysisAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    ocupacao: '',
    cpf: '',
    rg: '',
    telefone: '',
    email: '',
    endereco: '',
    disponibilidade: [],
    interesses: [],
    proposito: ''
  });
  const totalSteps = 6;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await ApiService.createCidadao(formData);
      setIsSubmitted(true);
      setTimeout(() => setShowAnalysisAlert(true), 2000);
    } catch (error) {
      console.error('Erro ao cadastrar cidadão:', error);
      alert('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Perfil", icon: <User size={20} /> },
    { id: 2, title: "Identidade", icon: <Fingerprint size={20} /> },
    { id: 3, title: "Contato", icon: <Phone size={20} /> },
    { id: 4, title: "Local", icon: <MapPin size={20} /> },
    { id: 5, title: "Interesses", icon: <Target size={20} /> },
    { id: 6, title: "Impacto", icon: <Sparkles size={20} /> },
  ];

  const availabilityOptions = [
    { label: "Dias úteis", icon: <Calendar size={24} /> },
    { label: "Finais de semana", icon: <Coffee size={24} /> },
    { label: "Período da manhã", icon: <Sun size={24} /> },
    { label: "Período da tarde", icon: <CloudSun size={24} /> },
    { label: "Período da noite", icon: <Moon size={24} /> },
    { label: "Apenas emergências", icon: <AlertTriangle size={24} /> },
  ];

  const helpOptions = [
    { label: "Doação de Alimentos", icon: <Apple size={24} /> },
    { label: "Aulas e Tutorias", icon: <BookOpen size={24} /> },
    { label: "Serviços de Saúde", icon: <Stethoscope size={24} /> },
    { label: "Reparos e Reformas", icon: <Hammer size={24} /> },
    { label: "Apoio Psicológico", icon: <Smile size={24} /> },
    { label: "Logística e Transporte", icon: <Truck size={24} /> },
  ];

  if (isSubmitted) {
    return (
      <div className="cadastro-container success-page-immersive cidadao-theme animate-fadeIn">
        <div className="floating-elements">
          <div className="float-shape s1-green"></div>
          <div className="float-shape s2-green"></div>
        </div>

        <div className="success-full-wrapper">
          <div className="success-hero-section">
            <div className="celebration-master-icon">
              <div className="icon-pulse-ring-green"></div>
              <div className="icon-main-box-green">
                <CheckCircle2 size={60} strokeWidth={2.5} />
              </div>
              <Sparkles className="sparkle-icon" size={24} style={{ color: '#10b981', position: 'absolute', top: '-5px', right: '-5px' }} />
            </div>
            
            <h1 className="success-main-title">
              Missão <span className="text-gradient-green">Confirmada!</span>
            </h1>
            <p className="success-description">
              Sua jornada começou. O SolidarBairro conta com você para transformar nossa comunidade.
            </p>
          </div>

          <div className="success-simple-card animate-slide-up">
            <div className="premium-status-banner-green">
              <div className="status-info" style={{ flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
                <Rocket size={32} style={{ color: '#34d399', margin: '0 auto' }} />
                <div>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Status: <span style={{ color: '#34d399' }}>Recruta Ativo</span></h2>
                  <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>Seu perfil está visível para ONGs locais.</p>
                </div>
              </div>
              <Link to="/" className="btn-go-home-green" style={{ padding: '1rem 2rem', fontSize: '1rem', width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}>
                Acessar Painel
              </Link>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="stat-card-mini" style={{ padding: '1rem' }}>
                <Heart size={20} />
                <span style={{ fontSize: '0.7rem' }}>Impacto Local</span>
                <strong style={{ fontSize: '1rem' }}>+100 XP</strong>
              </div>
              <div className="stat-card-mini" style={{ padding: '1rem' }}>
                <Share2 size={20} />
                <span style={{ fontSize: '0.7rem' }}>Comunidade</span>
                <strong style={{ fontSize: '1rem' }}>Compartilhar</strong>
              </div>
            </div>
          </div>
        </div>

        {showAnalysisAlert && (
          <div className="alert-overlay">
            <div className="analysis-alert">
              <div className="alert-icon">
                <ShieldCheck size={48} />
              </div>
              <h3>Cadastro em Análise</h3>
              <p>Seu cadastro está sendo analisado por nossa equipe. Você receberá uma notificação em até 24 horas com o resultado.</p>
              <button 
                className="alert-btn" 
                onClick={() => setShowAnalysisAlert(false)}
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="cadastro-container cidadao-theme">
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <nav className="top-nav">
        <Link to="/" className="back-link">
          <div className="back-icon-box"><ArrowLeft size={20} /></div>
          <span>Voltar</span>
        </Link>
        <div className="nav-brand">
          <div className="brand-icon-box">
            <Heart size={24} />
          </div>
          <span className="brand-text">SolidarBairro <span style={{ color: '#10b981', fontSize: '0.8rem' }}>VOLUNTÁRIO</span></span>
        </div>
      </nav>

      <div className="main-layout">
        <aside className="sidebar-stepper">
          <div className="stepper-card">
            <h2 className="stepper-title">CADASTRO DE VOLUNTÁRIO</h2>
            <div className="stepper-list">
              {steps.map((s, i) => (
                <div key={s.id} className={`stepper-item ${step === s.id ? 'active' : step > s.id ? 'completed' : ''}`}>
                  <div className="stepper-icon">
                    {step > s.id ? <CheckCircle2 size={20} /> : s.icon}
                  </div>
                  <div className="stepper-info">
                    <span className="stepper-step-num">PASSO 0{s.id}</span>
                    <span className="stepper-step-name">{s.title}</span>
                  </div>
                  {i < steps.length - 1 && <div className="stepper-line" />}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="form-main">
          <div className="form-container-card animate-slide-up">
            <div className="form-header-section">
              <div className="header-top">
                <span className="step-badge">{steps.find(s => s.id === step)?.title}</span>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
                </div>
              </div>
              <h1 className="form-main-title">
                {step === 1 && <>Qual o seu <span className="text-highlight">perfil</span>?</>}
                {step === 2 && <>Sua <span className="text-highlight">identidade</span></>}
                {step === 3 && <>Canais de <span className="text-highlight">contato</span></>}
                {step === 4 && <>Onde você <span className="text-highlight">atua</span>?</>}
                {step === 5 && <>Seus <span className="text-highlight">interesses</span></>}
                {step === 6 && <>Seu <span className="text-highlight">propósito</span></>}
              </h1>
              <p className="form-subtitle">
                {step === 1 && "Conte-nos quem você é para começarmos sua jornada voluntária."}
                {step === 2 && "A segurança é prioridade. Validamos todos os voluntários da nossa rede."}
                {step === 3 && "Como podemos falar com você sobre oportunidades de ajuda?"}
                {step === 4 && "Informe seu endereço ou região onde prefere realizar as ações."}
                {step === 5 && "Selecione as áreas onde suas habilidades podem ser mais úteis."}
                {step === 6 && "Defina como você pretende impactar o seu bairro hoje."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="form-content">
              {step === 1 && (
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label className="field-label">Nome Completo</label>
                    <div className="input-with-icon">
                      <User className="field-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className="form-input" 
                        placeholder="Seu nome completo"
                        value={formData.nome}
                        onChange={(e) => updateFormData('nome', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="field-label">Data de Nascimento</label>
                    <div className="input-with-icon">
                      <Calendar className="field-icon" size={20} />
                      <input 
                        required 
                        type="date" 
                        className="form-input"
                        value={formData.dataNascimento}
                        onChange={(e) => updateFormData('dataNascimento', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="field-label">Ocupação / Habilidade</label>
                    <input 
                      required 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Professor, Médico, etc."
                      value={formData.ocupacao}
                      onChange={(e) => updateFormData('ocupacao', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-grid">
                  <div className="form-group">
                    <label className="field-label">CPF</label>
                    <div className="input-with-icon">
                      <Fingerprint className="field-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className="form-input" 
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => updateFormData('cpf', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="field-label">RG</label>
                    <input 
                      required 
                      type="text" 
                      className="form-input" 
                      placeholder="Número do documento"
                      value={formData.rg}
                      onChange={(e) => updateFormData('rg', e.target.value)}
                    />
                  </div>
                  <div className="form-info-box span-2">
                    <div className="info-icon-box">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h4 className="info-title">Rede Segura</h4>
                      <p className="info-text">Sua identidade é mantida em sigilo e serve apenas para garantir a idoneidade das ações.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="form-grid">
                  <div className="form-group">
                    <label className="field-label">WhatsApp</label>
                    <div className="input-with-icon">
                      <Phone className="field-icon" size={20} />
                      <input 
                        required 
                        type="tel" 
                        className="form-input" 
                        placeholder="(00) 00000-0000"
                        value={formData.telefone}
                        onChange={(e) => updateFormData('telefone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="field-label">E-mail</label>
                    <div className="input-with-icon">
                      <Mail className="field-icon" size={20} />
                      <input 
                        required 
                        type="email" 
                        className="form-input" 
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label className="field-label">Endereço de Referência</label>
                    <div className="input-with-icon">
                      <Home className="field-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className="form-input" 
                        placeholder="Rua, Bairro, Cidade"
                        value={formData.endereco}
                        onChange={(e) => updateFormData('endereco', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group span-2">
                    <label className="field-label">Disponibilidade</label>
                    <div className="selectable-grid" id="availability-grid">
                      {availabilityOptions.map((opt) => (
                        <label key={opt.label} className="selectable-item">
                          <input 
                            type="checkbox" 
                            name="disponibilidade" 
                            value={opt.label}
                            checked={formData.disponibilidade.includes(opt.label)}
                            onChange={(e) => handleCheckboxChange('disponibilidade', opt.label, e.target.checked)}
                          />
                          <div className="selectable-card">
                            <div className="selectable-card-icon">{opt.icon}</div>
                            <span className="selectable-card-text">{opt.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label className="field-label">Como você quer ajudar?</label>
                    <div className="selectable-grid">
                      {helpOptions.map((opt) => (
                        <label key={opt.label} className="selectable-item">
                          <input 
                            type="checkbox" 
                            name="interesses" 
                            value={opt.label}
                            checked={formData.interesses.includes(opt.label)}
                            onChange={(e) => handleCheckboxChange('interesses', opt.label, e.target.checked)}
                          />
                          <div className="selectable-card">
                            <div className="selectable-card-icon">{opt.icon}</div>
                            <span className="selectable-card-text">{opt.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label className="field-label">Conte seu propósito (Opcional)</label>
                    <textarea 
                      className="form-input" 
                      placeholder="Por que você quer ser voluntário?" 
                      rows={4}
                      value={formData.proposito}
                      onChange={(e) => updateFormData('proposito', e.target.value)}
                    ></textarea>
                  </div>
                  <div className="form-final-box span-2">
                    <Award size={48} className="final-icon" />
                    <p>Ao se tornar um voluntário, você ganha acesso a missões exclusivas e badges de reconhecimento na comunidade.</p>
                  </div>
                </div>
              )}

              <div className="form-navigation">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="btn-prev">
                    <ChevronLeft size={20} />
                    <span>Anterior</span>
                  </button>
                ) : (
                  <div />
                )}
                
                <div className="nav-actions" style={{ display: 'flex', gap: '1rem' }}>
                  {step === 1 && <Link to="/" className="btn-cancel">Cancelar</Link>}
                  
                  {step < totalSteps ? (
                    <button type="button" onClick={nextStep} className="btn-next">
                      <span>Avançar</span>
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button type="submit" className="btn-finish" disabled={isLoading}>
                      <span>{isLoading ? 'Cadastrando...' : 'Confirmar Compromisso'}</span>
                      <CheckCircle2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}