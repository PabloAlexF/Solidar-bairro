import React, { useState } from 'react';
import { Users, ArrowLeft, User, Home, Users2, DollarSign, ListChecks, MapPin, CheckCircle2, ChevronRight, ChevronLeft, Fingerprint, IdCard, Calendar, Phone, Mail, ShieldCheck, Trophy, Star, Target, Zap, Award, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/pages/styles.css';

export default function CadastroFamilia() {
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
    { id: 1, title: "Responsável", icon: <User size={20} /> },
    { id: 2, title: "Endereço", icon: <MapPin size={20} /> },
    { id: 3, title: "Composição", icon: <Users2 size={20} /> },
    { id: 4, title: "Situação", icon: <DollarSign size={20} /> },
    { id: 5, title: "Necessidades", icon: <ListChecks size={20} /> },
  ];

  if (isSubmitted) {
    return (
      <div className="cadastro-container">
        <div className="success-container">
          <div className="form-card-new animate-slide-up">
            <div className="success-grid">
              <div className="success-left">
                <div className="brand-icon animate-scale-in-bounce" style={{ background: 'linear-gradient(135deg, #f97316 0%, #e11d48 100%)', marginBottom: '2.5rem' }}>
                  <Trophy size={40} color="white" />
                </div>

                <h1 className="success-title animate-slide-up stagger-1">
                  Cadastro <br/>
                  <span>Concluído!</span>
                </h1>
                
                <p className="form-description animate-slide-up stagger-2" style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>
                  Sua família agora faz parte da nossa rede. 
                  Você acaba de ganhar seus primeiros pontos de impacto social!
                </p>

                <div className="xp-card animate-slide-up stagger-3">
                  <div className="xp-header">
                    <div>
                      <p className="step-label">Nível Atual</p>
                      <h3 className="form-title" style={{ fontSize: '2.5rem', margin: 0 }}>Nível 01</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="form-title" style={{ fontSize: '2rem' }}>5 <span style={{ color: 'var(--text-gray-400)' }}>/ 100 XP</span></span>
                    </div>
                  </div>
                  
                  <div className="xp-bar">
                    <div className="xp-inner animate-grow-width" style={{ width: '5%' }} />
                  </div>
                  
                  <div className="animate-float" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#f97316', fontWeight: '900' }}>
                    <Zap size={24} />
                    GANHE +50 XP COMPLETANDO SEU PERFIL
                  </div>
                </div>
              </div>

              <div className="success-right">
                <h2 className="step-label animate-slide-up stagger-2">Conquistas Desbloqueadas</h2>
                <div className="achievement-list">
                  {[
                    { title: "Pioneiro", icon: <Star size={32} color="#f59e0b" />, desc: "Iniciou a jornada" },
                    { title: "Ajudante", icon: <Heart size={32} color="#f43f5e" />, desc: "Pronto para cooperar" },
                    { title: "Amigável", icon: <Target size={32} color="#3b82f6" />, desc: "Comunidade ativa" }
                  ].map((achievement, i) => (
                    <div key={i} className={`achievement-card animate-slide-in-right stagger-${i + 3}`}>
                      <div className="brand-icon" style={{ background: 'var(--bg-gray-100)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontWeight: '900', fontSize: '1.25rem', color: 'var(--text-gray-900)' }}>{achievement.title}</h4>
                        <p style={{ margin: 0, color: 'var(--text-gray-500)', fontWeight: '600' }}>{achievement.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="button-row animate-slide-up stagger-5" style={{ marginTop: '3rem', borderTop: 'none', paddingTop: 0 }}>
                  <Link to="/cadastro" className="btn-base btn-primary" style={{ background: 'linear-gradient(135deg, #f97316 0%, #e11d48 100%)' }}>
                    Voltar ao Início
                  </Link>
                  <button className="btn-base btn-secondary">
                    <Award size={24} />
                    Ver Perfil
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
          <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #f97316 0%, #e11d48 100%)' }}>
            <Users size={28} color="white" />
          </div>
          <span className="brand-name">SolidarBairro</span>
        </div>
      </div>

      <div className="form-layout">
        <aside className="sidebar-progress">
          <div className="steps-list">
            <h2 className="step-label">Progresso</h2>
            {steps.map((s) => (
              <div 
                key={s.id} 
                className={`step-item ${step === s.id ? "active" : step > s.id ? "completed" : ""}`}
              >
                <div className="step-icon-box">
                  {step > s.id ? <CheckCircle2 size={24} /> : s.icon}
                </div>
                <div className="step-info">
                  <p>Passo 0{s.id}</p>
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
        </aside>

        <main className="form-area">
          <div className="form-card-new animate-slide-up">
            <div className="form-header">
              <span className="step-label">
                {steps.find(s => s.id === step)?.title}
              </span>
              <h1 className="form-title">
                {step === 1 && <>Quem é o <span>responsável</span>?</>}
                {step === 2 && <>Onde a família <span>reside</span>?</>}
                {step === 3 && <>Composição <span>familiar</span></>}
                {step === 4 && <>Situação <span>socioeconômica</span></>}
                {step === 5 && <>Quais são as <span>necessidades</span>?</>}
              </h1>
              <p className="form-description">
                {step === 1 && "Inicie o cadastro com os dados básicos de quem representa a família."}
                {step === 2 && "Precisamos saber a localização exata para oferecer suporte logístico."}
                {step === 3 && "Conte-nos quantas pessoas vivem na casa e se há grupos prioritários."}
                {step === 4 && "Essas informações nos ajudam a classificar o nível de urgência."}
                {step === 5 && "Selecione o que é mais urgente para a família neste momento."}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="input-grid grid-cols-4">
                  <div className="input-group col-span-4 lg:col-span-3">
                    <label className="input-label">Nome Completo</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="Nome completo do responsável" />
                      <User className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group col-span-4 lg:col-span-1">
                    <label className="input-label">Nascimento</label>
                    <div className="input-wrapper">
                      <input type="date" className="input-field pl-icon" />
                      <Calendar className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group col-span-4 lg:col-span-1">
                    <label className="input-label">CPF</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="000.000.000-00" />
                      <Fingerprint className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group col-span-4 lg:col-span-1">
                    <label className="input-label">RG</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="00.000.000-0" />
                      <IdCard className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group col-span-4 lg:col-span-1">
                    <label className="input-label">WhatsApp</label>
                    <div className="input-wrapper">
                      <input type="tel" className="input-field pl-icon" placeholder="(00) 00000-0000" />
                      <Phone className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group col-span-4 lg:col-span-1">
                    <label className="input-label">E-mail (Opcional)</label>
                    <div className="input-wrapper">
                      <input type="email" className="input-field pl-icon" placeholder="seu@email.com" />
                      <Mail className="input-icon" />
                    </div>
                  </div>

                  <div className="input-group col-span-4">
                    <label className="input-label">Tipo de Cadastro</label>
                    <div className="checkbox-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                      {["Família", "Pessoa sozinha", "Instituição"].map((tipo) => (
                        <label key={tipo} className="checkbox-item" style={{ padding: '0.75rem 1rem' }}>
                          <input type="radio" name="tipo_cadastro" />
                          <span className="checkbox-label" style={{ fontSize: '0.85rem' }}>{tipo}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="input-grid grid-cols-4">
                  <div className="input-group col-span-4 lg:col-span-3">
                    <label className="input-label">Endereço Residencial</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="Rua, número, complemento" />
                      <Home className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group col-span-4 lg:col-span-1">
                    <label className="input-label">Bairro</label>
                    <select className="input-field">
                      <option value="">Selecione o bairro</option>
                      <option value="centro">Centro</option>
                      <option value="vila_nova">Vila Nova</option>
                      <option value="jardim_america">Jardim América</option>
                    </select>
                  </div>
                  <div className="input-group col-span-4 lg:col-span-1">
                    <label className="input-label">Cidade / UF</label>
                    <input type="text" className="input-field" placeholder="Sua Cidade - UF" />
                  </div>
                  <div className="input-group col-span-4 lg:col-span-2">
                    <label className="input-label">Referência</label>
                    <input type="text" className="input-field" placeholder="Ponto de referência" />
                  </div>
                  <button type="button" className="col-span-4 lg:col-span-1 btn-base btn-secondary" style={{ borderStyle: 'dashed', padding: '1rem' }}>
                    <MapPin size={24} />
                    MARCAR NO MAPA
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="input-grid grid-cols-2">
                  <div className="col-span-2 checkbox-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
                    {[
                      { label: 'Total Pessoas', key: 'total' },
                      { label: '0-12 anos', key: 'criancas' },
                      { label: '13-17 anos', key: 'adolescentes' },
                      { label: '18-59 anos', key: 'adultos' },
                      { label: '60+ anos', key: 'idosos' }
                    ].map((item) => (
                      <div key={item.key} className="input-group">
                        <span className="input-label" style={{ textAlign: 'center', fontSize: '0.6rem' }}>{item.label}</span>
                        <input type="number" className="input-field" style={{ textAlign: 'center', fontSize: '1.15rem', padding: '0.5rem' }} defaultValue="0" />
                      </div>
                    ))}
                  </div>

                  <div className="col-span-2 checkbox-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                    {[
                      "Há gestantes",
                      "Há pessoa(s) com deficiência",
                      "Família chefiada por mulher",
                      "Risco de despejo / rua"
                    ].map((item) => (
                      <label key={item} className="checkbox-item" style={{ padding: '0.75rem 1rem' }}>
                        <input type="checkbox" />
                        <span className="checkbox-label" style={{ fontSize: '0.8rem' }}>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="input-grid grid-cols-2">
                  <div className="col-span-2">
                    <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Renda Mensal Estimada</label>
                    <div className="checkbox-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                      {["Sem renda", "Até 1 sal.", "1 a 2 sal.", "Acima 2 sal."].map((item) => (
                        <label key={item} className="checkbox-item" style={{ padding: '0.75rem 1rem' }}>
                          <input type="radio" name="renda" />
                          <span className="checkbox-label" style={{ fontSize: '0.8rem' }}>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="input-group col-span-2">
                    <label className="input-label">Resumo da Situação Atual</label>
                    <textarea className="input-field" style={{ minHeight: '100px', paddingTop: '0.75rem' }} placeholder="Descreva brevemente a realidade atual da família..."></textarea>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="input-grid grid-cols-2">
                  <div className="col-span-2 checkbox-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                    {[
                      "Alimentos", "Roupas", "Higiene", "Remédios",
                      "Emprego / Renda", "Apoio Psico", "Reforma Casa", "Material Escolar"
                    ].map((item) => (
                      <label key={item} className="checkbox-item" style={{ padding: '0.75rem 1rem' }}>
                        <input type="checkbox" />
                        <span className="checkbox-label" style={{ fontSize: '0.8rem' }}>{item}</span>
                      </label>
                    ))}
                  </div>

                  <div className="col-span-2 achievement-card" style={{ background: 'rgba(249, 115, 22, 0.05)', border: 'none', padding: '1.25rem', marginBottom: 0 }}>
                    <ShieldCheck size={28} color="#f97316" style={{ flexShrink: 0 }} />
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', fontWeight: '900', color: '#f97316', fontSize: '1.1rem' }}>PRIVACIDADE DOS DADOS</h3>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-gray-500)', lineHeight: '1.3' }}>
                        Suas informações são tratadas com sigilo absoluto e utilizadas apenas para fins de assistência social e segurança alimentar.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="button-row" style={{ marginTop: '1.5rem' }}>
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="btn-base btn-secondary">
                    <ChevronLeft size={24} />
                    VOLTAR
                  </button>
                )}
                
                {step < totalSteps ? (
                  <button type="button" onClick={nextStep} className="btn-base btn-primary" style={{ background: 'linear-gradient(135deg, #f97316 0%, #e11d48 100%)' }}>
                    PRÓXIMO PASSO
                    <ChevronRight size={24} />
                  </button>
                ) : (
                  <button type="submit" className="btn-base btn-primary" style={{ background: 'linear-gradient(to right, #f97316, #e11d48)' }}>
                    FINALIZAR CADASTRO
                  </button>
                )}
                
                {step === 1 && (
                  <Link to="/cadastro" className="btn-base btn-secondary">
                    CANCELAR
                  </Link>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}