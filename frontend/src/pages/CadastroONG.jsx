import React, { useState } from 'react';
import { 
  Building2, ArrowLeft, Globe, ShieldCheck, 
  MapPin, CheckCircle2, ChevronRight, 
  ChevronLeft, FileText, Mail, Phone, 
  Trophy, Zap, Heart, Award, Info, Users,
  Calendar, Home, Compass, Sun, Sunrise, Warehouse, Map
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/components/CadastroONG.css';

export default function CadastroONG() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAnalysisAlert, setShowAnalysisAlert] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const totalSteps = 6;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setShowAnalysisAlert(true), 2000);
  };

  const steps = [
    { id: 1, title: "Instituição", icon: <Building2 size={20} /> },
    { id: 2, title: "Legal", icon: <FileText size={20} /> },
    { id: 3, title: "Contato", icon: <Mail size={20} /> },
    { id: 4, title: "Atuação", icon: <MapPin size={20} /> },
    { id: 5, title: "Equipe", icon: <Users size={20} /> },
    { id: 6, title: "Causas", icon: <Heart size={20} /> },
  ];

  if (isSubmitted) {
    return (
      <div className="ong-cadastro-container ong-theme" style={{ height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="ong-form-card-new" style={{ width: '100%', maxWidth: '1200px', height: 'auto', maxHeight: '85vh', overflow: 'hidden' }}>
          <div className="ong-success-grid" style={{ display: 'flex', height: '100%' }}>
            <div className="ong-success-left" style={{ flex: '1', minWidth: '400px' }}>
              <div className="brand-icon ong-success-icon-bg">
                <Trophy size={48} color="white" />
              </div>
              <h1 className="ong-success-title">
                ONG <br/>
                <span className="ong-text-highlight">Registrada!</span>
              </h1>
              <p className="ong-success-description">
                Sua organização agora faz parte da rede oficial. Prepare-se para ampliar seu impacto!
              </p>
              <div className="ong-xp-card">
                <div className="ong-xp-header">
                  <div>
                    <p className="ong-xp-label">Impacto Institucional</p>
                    <h3 className="ong-xp-value">+100 XP</h3>
                  </div>
                  <Zap size={32} color="#8b5cf6" />
                </div>
                <div className="ong-xp-bar">
                  <div className="ong-xp-inner" style={{ width: '25%', background: '#8b5cf6' }} />
                </div>
                <p className="ong-xp-footer">Complete a verificação para ganhar selo de confiança</p>
              </div>
            </div>
            <div className="ong-success-right" style={{ flex: '1.2', minWidth: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h2 className="ong-success-steps-title">Próximos Passos</h2>
                <div className="ong-steps-cards-list">
                  {[
                    { title: "Verificação CNPJ", desc: "Validaremos os dados da sua instituição", icon: <ShieldCheck /> },
                    { title: "Painel de Gestão", desc: "Acesse ferramentas de mapeamento", icon: <Globe /> },
                    { title: "Rede de Apoio", desc: "Conecte-se com doadores e voluntários", icon: <Users /> }
                  ].map((item, i) => (
                    <div key={i} className="ong-step-card-mini">
                      <div className="ong-step-card-icon" style={{ color: '#8b5cf6' }}>{item.icon}</div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ong-success-actions">
                <Link to="/" className="ong-btn-base ong-btn-primary" style={{ background: '#8b5cf6' }}>Início</Link>
                <button className="ong-btn-base ong-btn-secondary">Acessar Painel</button>
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
    <div className="ong-cadastro-container ong-theme">
      <div className="ong-bg-blobs">
        <div className="ong-blob ong-blob-1" style={{ background: '#f5f3ff' }} />
        <div className="ong-blob ong-blob-2" style={{ background: '#ede9fe' }} />
      </div>

      <nav className="top-nav">
        <Link to="/" className="back-link">
          <div className="back-icon-box"><ArrowLeft size={20} /></div>
          <span>Voltar</span>
        </Link>
        <div className="nav-brand">
          <div className="brand-icon-box" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
            <Building2 size={24} />
          </div>
          <span className="brand-text">SolidarBairro <span style={{ color: '#8b5cf6', fontSize: '0.8rem' }}>ONG</span></span>
        </div>
      </nav>

      <div className="main-layout">
        <aside className="sidebar-stepper">
          <div className="stepper-card">
            <h2 className="stepper-title">CADASTRO INSTITUCIONAL</h2>
            <div className="stepper-list">
              {steps.map((s, i) => (
                <div key={s.id} className={`stepper-item ${step === s.id ? 'active' : step > s.id ? 'completed' : ''}`}>
                  <div className="stepper-icon" style={step === s.id ? { boxShadow: '0 8px 16px rgba(139, 92, 246, 0.2)' } : {}}>
                    {step > s.id ? <CheckCircle2 size={20} style={{ color: '#8b5cf6' }} /> : s.icon}
                  </div>
                  <div className="stepper-info">
                    <span className="stepper-step-num">ETAPA 0{s.id}</span>
                    <span className="stepper-step-name">{s.title}</span>
                  </div>
                  {i < steps.length - 1 && <div className="stepper-line" style={step > s.id ? { background: '#8b5cf6' } : {}} />}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="form-main">
          <div className="form-container-card animate-slide-up">
            <div className="form-header-section">
              <div className="header-top">
                <span className="ong-step-badge" style={{ color: '#8b5cf6' }}>{steps.find(s => s.id === step)?.title}</span>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${(step / totalSteps) * 100}%`, background: 'linear-gradient(to right, #8b5cf6, #a855f7)' }} />
                </div>
              </div>
              <h1 className="form-main-title">
                {step === 1 && <>Sua <span style={{ color: '#8b5cf6' }}>instituição</span></>}
                {step === 2 && <>Dados <span style={{ color: '#8b5cf6' }}>legais</span></>}
                {step === 3 && <>Como <span style={{ color: '#8b5cf6' }}>contatá-los</span>?</>}
                {step === 4 && <>Área de <span style={{ color: '#8b5cf6' }}>atuação</span></>}
                {step === 5 && <>Sua <span style={{ color: '#8b5cf6' }}>equipe</span></>}
                {step === 6 && <>Causas e <span style={{ color: '#8b5cf6' }}>missão</span></>}
              </h1>
              <p className="form-subtitle">
                {step === 1 && "Comece informando o nome e a identidade visual da sua organização."}
                {step === 2 && "Precisamos do CNPJ e dados de registro para validação institucional."}
                {step === 3 && "Informe os canais oficiais para comunicação com a rede."}
                {step === 4 && "Em quais bairros ou regiões sua ONG atua prioritariamente?"}
                {step === 5 && "Conte-nos sobre os voluntários e profissionais que compõem sua base."}
                {step === 6 && "Selecione as causas que sua ONG abraça para conectarmos vocês."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="form-content">
              {step === 1 && (
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label className="field-label">Nome Fantasia da ONG</label>
                    <div className="input-with-icon">
                      <Building2 className="field-icon" size={20} />
                      <input required type="text" className="form-input" placeholder="Nome da organização" />
                    </div>
                  </div>
                  <div className="form-group span-2">
                    <label className="field-label">Razão Social</label>
                    <input required type="text" className="form-input" placeholder="Razão social completa" />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-grid">
                  <div className="form-group">
                    <label className="field-label">CNPJ</label>
                    <div className="input-with-icon">
                      <FileText className="field-icon" size={20} />
                      <input required type="text" className="form-input" placeholder="00.000.000/0000-00" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="field-label">Data de Fundação</label>
                    <div className="input-with-icon">
                      <Calendar className="field-icon" size={20} />
                      <input required type="date" className="form-input" />
                    </div>
                  </div>
                  <div className="form-info-box span-2" style={{ background: '#1e1b4b' }}>
                    <ShieldCheck size={32} style={{ color: '#a78bfa' }} />
                    <div>
                      <h4 className="info-title">Validação Necessária</h4>
                      <p className="info-text">ONGs cadastradas passam por uma auditoria documental para garantir a segurança da plataforma.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="form-grid">
                  <div className="form-group">
                    <label className="field-label">Telefone Comercial</label>
                    <div className="input-with-icon">
                      <Phone className="field-icon" size={20} />
                      <input required type="tel" className="form-input" placeholder="(00) 0000-0000" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="field-label">E-mail Institucional</label>
                    <div className="input-with-icon">
                      <Mail className="field-icon" size={20} />
                      <input required type="email" className="form-input" placeholder="contato@ong.org" />
                    </div>
                  </div>
                  <div className="form-group span-2">
                    <label className="field-label">Website ou Rede Social</label>
                    <div className="input-with-icon">
                      <Globe className="field-icon" size={20} />
                      <input type="url" className="form-input" placeholder="https://www.suaong.org" />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label className="field-label">Sede da ONG</label>
                    <div className="input-with-icon">
                      <Home className="field-icon" size={20} />
                      <input required type="text" className="form-input" placeholder="Endereço completo da sede" />
                    </div>
                  </div>
                  <div className="form-group span-2">
                    <label className="field-label">Áreas de Cobertura (Selecione os bairros onde atuam)</label>
                    <div className="coverage-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                      {[
                        { name: "Centro", icon: <Building2 size={20} />, desc: "Região central da cidade" },
                        { name: "Zona Norte", icon: <Compass size={20} />, desc: "Bairros da zona norte" },
                        { name: "Zona Sul", icon: <Sun size={20} />, desc: "Bairros da zona sul" },
                        { name: "Zona Leste", icon: <Sunrise size={20} />, desc: "Bairros da zona leste" },
                        { name: "Periferia", icon: <Warehouse size={20} />, desc: "Áreas periféricas" },
                        { name: "Região Metropolitana", icon: <Map size={20} />, desc: "Cidades vizinhas" }
                      ].map((zona) => {
                        const isSelected = selectedAreas.includes(zona.name);
                        return (
                        <label key={zona.name} className="coverage-item">
                          <input type="checkbox" style={{ display: 'none' }} checked={isSelected} readOnly />
                          <div className="coverage-card" style={{ 
                            padding: '1.5rem', 
                            border: `2px solid ${isSelected ? '#8b5cf6' : '#e5e7eb'}`, 
                            borderRadius: '1rem', 
                            textAlign: 'center', 
                            cursor: 'pointer', 
                            transition: 'all 0.3s',
                            background: isSelected ? '#f5f3ff' : 'white',
                            position: 'relative'
                          }} 
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = '#8b5cf6';
                              e.currentTarget.style.background = '#f5f3ff';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = '#e5e7eb';
                              e.currentTarget.style.background = 'white';
                            }
                          }}
                          onClick={() => {
                            setSelectedAreas(prev => 
                              prev.includes(zona.name) 
                                ? prev.filter(area => area !== zona.name)
                                : [...prev, zona.name]
                            );
                          }}>
                            <div className="coverage-icon-box" style={{ 
                              width: '48px', 
                              height: '48px', 
                              background: isSelected ? '#8b5cf6' : '#f3f4f6', 
                              borderRadius: '0.75rem', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              margin: '0 auto 0.75rem',
                              color: isSelected ? 'white' : '#6b7280',
                              transition: 'all 0.3s'
                            }}>
                              {zona.icon}
                            </div>
                            <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#111827', margin: '0 0 0.25rem 0' }}>{zona.name}</h4>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0' }}>{zona.desc}</p>
                            {isSelected && (
                              <div style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#8b5cf6',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <CheckCircle2 size={16} />
                              </div>
                            )}
                          </div>
                        </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="form-grid">
                  <div className="form-group">
                    <label className="field-label">Número de Voluntários</label>
                    <input type="number" className="form-input" placeholder="Ex: 50" />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Colaboradores Fixos</label>
                    <input type="number" className="form-input" placeholder="Ex: 10" />
                  </div>
                  <div className="form-info-box span-2" style={{ background: '#4c1d95' }}>
                    <Users size={32} style={{ color: '#ddd6fe' }} />
                    <div>
                      <h4 className="info-title">Gestão de Equipe</h4>
                      <p className="info-text">Após o cadastro, você poderá convidar sua equipe para gerenciar as demandas no painel.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label className="field-label">Causas Principais</label>
                    <div className="checkbox-options grid-2">
                      {[
                        "Segurança Alimentar",
                        "Educação e Cultura",
                        "Saúde e Bem-estar",
                        "Meio Ambiente",
                        "Direitos Humanos",
                        "Proteção Animal"
                      ].map((causa) => (
                        <label key={causa} className="checkbox-card">
                          <input type="checkbox" />
                          <span>{causa}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-final-box span-2" style={{ background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
                    <Award size={48} className="final-icon" />
                    <p>Ao se registrar, sua ONG ganha visibilidade para doadores e torna-se um ponto oficial de apoio no bairro.</p>
                  </div>
                </div>
              )}

              <div className="form-navigation">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="nav-btn btn-prev">
                    <ChevronLeft size={20} />
                    <span>Anterior</span>
                  </button>
                ) : (
                  <div />
                )}
                
                <div className="nav-actions">
                  {step === 1 && <Link to="/" className="nav-btn btn-cancel">Cancelar</Link>}
                  
                  {step < totalSteps ? (
                    <button type="button" onClick={nextStep} className="nav-btn btn-next" style={{ background: '#1e1b4b' }}>
                      <span>Continuar</span>
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button type="submit" className="nav-btn btn-finish" style={{ background: 'linear-gradient(to right, #8b5cf6, #a855f7)', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)' }}>
                      <span>Finalizar Registro</span>
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