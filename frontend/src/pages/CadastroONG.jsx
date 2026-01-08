import React, { useState } from 'react';
import { Building2, ArrowLeft, ShieldCheck, FileText, UserCheck, MapPin, Search, CheckCircle2, ChevronRight, ChevronLeft, Fingerprint, Mail, Globe, Lock, Trophy, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/pages/styles.css';

export default function CadastroONG() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const totalSteps = 5;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const steps = [
    { id: 1, title: "Entidade", icon: <Building2 size={20} /> },
    { id: 2, title: "Responsável", icon: <UserCheck size={20} /> },
    { id: 3, title: "Localização", icon: <MapPin size={20} /> },
    { id: 4, title: "Documentos", icon: <FileText size={20} /> },
    { id: 5, title: "Segurança", icon: <ShieldCheck size={20} /> },
  ];

    if (isSubmitted) {
      return (
        <div className="cadastro-container">
          <div className="success-container">
            <div className="form-card-new animate-slide-up">
              <div className="success-grid" style={{ textAlign: 'center' }}>
                <div className="success-left" style={{ gridColumn: 'span 12' }}>
                  <div className="brand-icon animate-scale-in-bounce" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', marginBottom: '2.5rem', marginInline: 'auto' }}>
                    <Trophy size={40} color="white" />
                  </div>

                  <h1 className="success-title animate-slide-up stagger-1">
                    Solicitação <br/>
                    <span>Recebida!</span>
                  </h1>
                  
                  <p className="form-description animate-slide-up stagger-2" style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>
                    Sua organização está em processo de verificação. <br/>
                    Prepare-se para expandir seu impacto social!
                  </p>

                  <div className="xp-card animate-slide-up stagger-3">
                    <div className="xp-header">
                      <div style={{ textAlign: 'left' }}>
                        <p className="step-label">Progresso de Nível</p>
                        <h3 className="form-title" style={{ fontSize: '2rem', margin: 0 }}>Nível 01</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="form-title" style={{ fontSize: '1.5rem' }}>0 <span style={{ color: 'var(--text-gray-400)' }}>/ 100 XP</span></span>
                      </div>
                    </div>
                    
                    <div className="xp-bar">
                      <div className="xp-inner animate-grow-width" style={{ width: '5%' }} />
                    </div>
                    
                    <div className="animate-float" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: '#8b5cf6', fontWeight: '900', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      <Zap size={20} />
                      A aprovação documental garantirá +500 XP
                    </div>
                  </div>

                  <div className="button-row animate-slide-up stagger-5" style={{ marginTop: '4rem', borderTop: 'none', paddingTop: 0, justifyContent: 'center' }}>
                    <Link to="/cadastro" className="btn-base btn-primary" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
                      Voltar ao Painel
                    </Link>
                    <button className="btn-base btn-secondary">
                      <Award size={24} />
                      Status da Verificação
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }


  return (
    <div className="cadastro-container">
      <div className="header-nav">
        <Link to="/cadastro" className="back-button">
          <ArrowLeft size={24} />
        </Link>
        <div className="brand-wrapper">
          <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
            <Building2 size={28} color="white" />
          </div>
          <span className="brand-name">SolidarBairro</span>
        </div>
      </div>

      <div className="form-layout">
        <div className="sidebar-progress">
          <div className="steps-list">
            <h2 className="step-label">Fluxo de Verificação</h2>
            {steps.map((s) => (
              <div 
                key={s.id} 
                className={`step-item ${step === s.id ? "active" : step > s.id ? "completed" : ""}`}
              >
                <div className="step-icon-box">
                  {step > s.id ? <CheckCircle2 size={24} /> : s.icon}
                </div>
                <div className="step-info">
                  <p>Etapa 0{s.id}</p>
                  <p>{s.title}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mobile-progress-bar">
            <div 
              className="mobile-progress-inner" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="form-area">
          <div className="form-card-new animate-slide-up">
            <div className="form-header">
              <span className="step-label">
                {steps.find(s => s.id === step)?.title}
              </span>
              <h1 className="form-title">
                {step === 1 && <>Dados da <span>entidade</span></>}
                {step === 2 && <>Quem é o <span>responsável</span>?</>}
                {step === 3 && <>Onde fica a <span>sede</span>?</>}
                {step === 4 && <>Upload de <span>documentos</span></>}
                {step === 5 && <>Segurança & <span>Compliance</span></>}
              </h1>
              <p className="form-description">
                {step === 1 && "Inicie o cadastro institucional com os dados jurídicos da ONG."}
                {step === 2 && "Precisamos dos dados do responsável legal para validação de diretoria."}
                {step === 3 && "Informe o endereço físico para visitas e auditorias de campo."}
                {step === 4 && "Anexe os arquivos obrigatórios para o processo de KYC (Know Your Customer)."}
                {step === 5 && "Revise os termos de responsabilidade e finalize sua solicitação."}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="input-grid">
                  <div className="input-group col-span-2">
                    <label className="input-label">Nome da Entidade</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="Nome Fantasia" />
                      <Building2 className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">CNPJ</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="00.000.000/0000-00" />
                      <Search className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Área de Atuação</label>
                    <select className="input-field">
                      <option value="">Selecione</option>
                      <option value="alimento">Alimentação</option>
                      <option value="saude">Saúde</option>
                      <option value="educacao">Educação</option>
                    </select>
                  </div>
                  <div className="input-group col-span-2">
                    <label className="input-label">Descrição da Atuação</label>
                    <textarea className="input-field" style={{ minHeight: '120px' }} placeholder="Descreva as atividades da organização..."></textarea>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="input-grid">
                  <div className="input-group col-span-2">
                    <label className="input-label">Responsável Legal</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="Nome completo" />
                      <UserCheck className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">CPF</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="000.000.000-00" />
                      <Fingerprint className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">E-mail</label>
                    <div className="input-wrapper">
                      <input type="email" className="input-field pl-icon" placeholder="contato@ong.org" />
                      <Mail className="input-icon" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="input-grid">
                  <div className="input-group col-span-2">
                    <label className="input-label">Endereço da Sede</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="Rua, número, bairro..." />
                      <MapPin className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group col-span-2">
                    <label className="input-label">Website / Redes Sociais</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="www.ong.org.br" />
                      <Globe className="input-icon" />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="input-grid">
                  <div className="col-span-2 checkbox-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {[
                      { label: "Estatuto Social", icon: <FileText size={24} /> },
                      { label: "Ata de Diretoria", icon: <UserCheck size={24} /> },
                      { label: "Certidões", icon: <ShieldCheck size={24} /> }
                    ].map((doc) => (
                      <div key={doc.label} className="xp-card" style={{ margin: 0, textAlign: 'center', cursor: 'pointer' }}>
                        <div style={{ color: '#8b5cf6', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>{doc.icon}</div>
                        <p className="step-label" style={{ fontSize: '0.6rem' }}>{doc.label}</p>
                        <p style={{ fontSize: '0.6rem', opacity: 0.5 }}>Upload</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="input-grid">
                  <div className="col-span-2 xp-card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div className="brand-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', flexShrink: 0 }}>
                      <Lock size={32} color="#8b5cf6" />
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '900', color: '#8b5cf6' }}>Segurança de Dados</h3>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-gray-500)' }}>
                        Seus dados são protegidos por criptografia e usados apenas para fins de verificação.
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 checkbox-grid">
                    <label className="checkbox-item">
                      <input type="checkbox" />
                      <span className="checkbox-label">Concordo com os Termos de Compliance</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="button-row">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="btn-base btn-secondary">
                    <ChevronLeft size={20} />
                    Voltar
                  </button>
                )}
                
                {step < totalSteps ? (
                  <button type="button" onClick={nextStep} className="btn-base btn-primary" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}>
                    Continuar
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button type="submit" className="btn-base btn-primary" style={{ background: 'linear-gradient(to right, #7c3aed, #4f46e5)' }}>
                    Finalizar Solicitação
                  </button>
                )}
                
                {step === 1 && (
                  <Link to="/cadastro" className="btn-base btn-secondary">
                    Cancelar
                  </Link>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}