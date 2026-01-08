import React, { useState } from 'react';
import { Store, ArrowLeft, Building, Phone, MapPin, Package, CheckCircle2, ChevronRight, ChevronLeft, Mail, ShieldCheck, Search, UserCheck, Trophy, Target, Zap, Award, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/pages/styles.css';

export default function CadastroComercio() {
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
    { id: 1, title: "Negócio", icon: <Building size={20} /> },
    { id: 2, title: "Responsável", icon: <UserCheck size={20} /> },
    { id: 3, title: "Localização", icon: <MapPin size={20} /> },
    { id: 4, title: "Parceria", icon: <Package size={20} /> },
    { id: 5, title: "Segurança", icon: <ShieldCheck size={20} /> },
  ];

    if (isSubmitted) {
      return (
        <div className="cadastro-container">
          <div className="success-container">
            <div className="form-card-new animate-slide-up">
              <div className="success-grid">
                <div className="success-left">
                  <div className="brand-icon animate-scale-in-bounce" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', marginBottom: '2.5rem' }}>
                    <Trophy size={40} color="white" />
                  </div>

                  <h1 className="success-title animate-slide-up stagger-1">
                    Parceria <br/>
                    <span>Confirmada!</span>
                  </h1>
                  
                  <p className="form-description animate-slide-up stagger-2" style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>
                    Seu comércio agora brilha no nosso mapa solidário. 
                    Juntos, transformamos o bairro em um lugar melhor para todos!
                  </p>

                  <div className="xp-card animate-slide-up stagger-3">
                    <div className="xp-header">
                      <div>
                        <p className="step-label">Nível de Parceiro</p>
                        <h3 className="form-title" style={{ fontSize: '2.5rem', margin: 0 }}>Selo Bronze</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="form-title" style={{ fontSize: '2rem' }}>0 <span style={{ color: 'var(--text-gray-400)' }}>/ 500 XP</span></span>
                      </div>
                    </div>
                    
                    <div className="xp-bar">
                      <div className="xp-inner animate-grow-width" style={{ width: '5%' }} />
                    </div>
                    
                    <div className="animate-float" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#3b82f6', fontWeight: '900' }}>
                      <Zap size={24} />
                      SUA PRIMEIRA DOAÇÃO VALE +200 XP
                    </div>
                  </div>
                </div>

                <div className="success-right">
                  <h2 className="step-label animate-slide-up stagger-2">Benefícios Ativados</h2>
                  <div className="achievement-list">
                    {[
                      { title: "Visibilidade", icon: <Target size={32} color="#f59e0b" />, desc: "Destaque no mapa local" },
                      { title: "Selo Social", icon: <Award size={32} color="#f43f5e" />, desc: "Reconhecimento oficial" },
                      { title: "Rede B2B", icon: <Star size={32} color="#3b82f6" />, desc: "Conexão com outros parceiros" }
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
                    <Link to="/cadastro" className="btn-base btn-primary" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                      Voltar ao Início
                    </Link>
                    <button className="btn-base btn-secondary">
                      <Store size={24} />
                      Ver Perfil do Negócio
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
          <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
            <Store size={28} color="white" />
          </div>
          <span className="brand-name">SolidarBairro</span>
        </div>
      </div>

      <div className="form-layout">
        <aside className="sidebar-progress">
          <div className="steps-list">
            <h2 className="step-label">Parceria</h2>
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
        </aside>

        <main className="form-area">
          <div className="form-card-new animate-slide-up">
            <div className="form-header">
              <span className="step-label">
                {steps.find(s => s.id === step)?.title}
              </span>
              <h1 className="form-title">
                {step === 1 && <>Dados do seu <span>negócio</span></>}
                {step === 2 && <>Quem é o <span>responsável</span>?</>}
                {step === 3 && <>Onde o <span>comércio</span> fica?</>}
                {step === 4 && <>Como deseja <span>colaborar</span>?</>}
                {step === 5 && <>Segurança & <span>Adesão</span></>}
              </h1>
              <p className="form-description">
                {step === 1 && "Conte-nos sobre sua empresa e o ramo de atuação comercial."}
                {step === 2 && "Precisamos dos dados do proprietário ou gerente para contato direto."}
                {step === 3 && "Informe a localização exata para destacarmos seu comércio no mapa."}
                {step === 4 && "Selecione as formas que seu comércio pode apoiar a comunidade local."}
                {step === 5 && "Revise as políticas de parceria e finalize sua adesão à rede."}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                  <div className="input-grid">
                    <div className="input-group col-span-2">
                      <label className="input-label">Nome Fantasia</label>
                      <div className="input-wrapper">
                        <input type="text" className="input-field pl-icon" placeholder="Ex: Mercado da Vila" />
                        <Store className="input-icon" />
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
                      <label className="input-label">Ramo de Atuação</label>
                      <select className="input-field">
                        <option value="">Selecione o ramo</option>
                        <option value="alimento">Mercado / Alimentos</option>
                        <option value="farmacia">Farmácia</option>
                        <option value="vestuario">Roupas / Calçados</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                  </div>
              )}

              {step === 2 && (
                <div className="input-grid">
                  <div className="input-group col-span-2">
                    <label className="input-label">Proprietário / Gerente</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="Nome completo" />
                      <UserCheck className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">WhatsApp</label>
                    <div className="input-wrapper">
                      <input type="tel" className="input-field pl-icon" placeholder="(00) 00000-0000" />
                      <Phone className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">E-mail Comercial</label>
                    <div className="input-wrapper">
                      <input type="email" className="input-field pl-icon" placeholder="contato@empresa.com" />
                      <Mail className="input-icon" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="input-grid">
                  <div className="input-group col-span-2">
                    <label className="input-label">Endereço do Estabelecimento</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="Rua, número, bairro..." />
                      <MapPin className="input-icon" />
                    </div>
                  </div>
                  <button type="button" className="col-span-2 btn-base btn-secondary" style={{ borderStyle: 'dashed', padding: '2rem' }}>
                    <MapPin size={28} />
                    CONFIRMAR LOCALIZAÇÃO NO MAPA
                  </button>
                </div>
              )}

              {step === 4 && (
                <div className="input-grid">
                  <div className="col-span-2 checkbox-grid">
                    {[
                      "Ponto de Coleta",
                      "Doação de Alimentos",
                      "Desconto Social",
                      "Patrocínio de Eventos",
                      "Divulgação de Demandas"
                    ].map((item) => (
                      <label key={item} className="checkbox-item">
                        <input type="checkbox" />
                        <span className="checkbox-label">{item}</span>
                      </label>
                    ))}
                  </div>
                  <div className="input-group col-span-2">
                    <label className="input-label">Como deseja ajudar?</label>
                    <textarea className="input-field" style={{ minHeight: '150px', paddingTop: '1.5rem' }} placeholder="Descreva brevemente sua intenção de colaboração..."></textarea>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="input-grid">
                  <div className="col-span-2 achievement-card" style={{ background: 'rgba(59, 130, 246, 0.05)', border: 'none', padding: '2rem' }}>
                    <ShieldCheck size={48} color="#3b82f6" style={{ flexShrink: 0 }} />
                    <div>
                      <h3 style={{ margin: '0 0 1rem 0', fontWeight: '900', color: '#3b82f6', fontSize: '1.5rem' }}>POLÍTICA DE PARCERIA</h3>
                      <p style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-gray-500)', lineHeight: '1.6' }}>
                        Ao se tornar parceiro, seu comércio concorda em cumprir com as diretrizes de ética e transparência da rede SolidarBairro.
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 checkbox-grid">
                    <label className="checkbox-item">
                      <input type="checkbox" />
                      <span className="checkbox-label">Aceito os Termos de Parceria e Uso</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="button-row">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="btn-base btn-secondary">
                    <ChevronLeft size={24} />
                    VOLTAR
                  </button>
                )}
                
                {step < totalSteps ? (
                  <button type="button" onClick={nextStep} className="btn-base btn-primary" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                    CONTINUAR
                    <ChevronRight size={24} />
                  </button>
                ) : (
                  <button type="submit" className="btn-base btn-primary" style={{ background: 'linear-gradient(to right, #3b82f6, #2563eb)' }}>
                    FINALIZAR ADESÃO
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