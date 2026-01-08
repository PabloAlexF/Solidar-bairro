import React, { useState } from 'react';
import { User, ArrowLeft, Mail, Phone, Heart, MapPin, Calendar, ShieldCheck, Fingerprint, IdCard, CheckCircle2, ChevronRight, ChevronLeft, Home, Trophy, Star, Target, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/pages/styles.css';

export default function CadastroCidadao() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const totalSteps = 4;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const steps = [
    { id: 1, title: "Identidade", icon: <Fingerprint size={20} /> },
    { id: 2, title: "Localização", icon: <MapPin size={20} /> },
    { id: 3, title: "Habilidades", icon: <Heart size={20} /> },
    { id: 4, title: "Segurança", icon: <ShieldCheck size={20} /> },
  ];

    if (isSubmitted) {
      return (
        <div className="cadastro-container">
          <div className="success-container">
            <div className="form-card-new animate-slide-up">
              <div className="success-grid">
                <div className="success-left">
                  <div className="brand-icon animate-scale-in-bounce" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', marginBottom: '2.5rem' }}>
                    <Trophy size={40} color="white" />
                  </div>

                  <h1 className="success-title animate-slide-up stagger-1">
                    Voluntário <br/>
                    <span>Cadastrado!</span>
                  </h1>
                  
                  <p className="form-description animate-slide-up stagger-2" style={{ fontSize: '1.5rem', marginBottom: '3rem' }}>
                    Sua jornada como voluntário começa agora. 
                    Obrigado por fortalecer nossa comunidade com seu tempo e talento!
                  </p>

                  <div className="xp-card animate-slide-up stagger-3">
                    <div className="xp-header">
                      <div>
                        <p className="step-label">Nível Atual</p>
                        <h3 className="form-title" style={{ fontSize: '2.5rem', margin: 0 }}>Nível 01</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="form-title" style={{ fontSize: '2rem' }}>0 <span style={{ color: 'var(--text-gray-400)' }}>/ 100 XP</span></span>
                      </div>
                    </div>
                    
                    <div className="xp-bar">
                      <div className="xp-inner animate-grow-width" style={{ width: '5%' }} />
                    </div>
                    
                    <div className="animate-float" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#10b981', fontWeight: '900' }}>
                      <Zap size={24} />
                      SUA PRIMEIRA AJUDA VALE +150 XP
                    </div>
                  </div>
                </div>

                <div className="success-right">
                  <h2 className="step-label animate-slide-up stagger-2">Conquistas Desbloqueadas</h2>
                  <div className="achievement-list">
                    {[
                      { title: "Pioneiro", icon: <Star size={32} color="#f59e0b" />, desc: "Iniciou a jornada" },
                      { title: "Doador", icon: <Heart size={32} color="#f43f5e" />, desc: "Pronto para cooperar" },
                      { title: "Ativo", icon: <Target size={32} color="#3b82f6" />, desc: "Membro da rede" }
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
                    <Link to="/cadastro" className="btn-base btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
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
          <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <User size={28} color="white" />
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
                {step === 1 && <>Conte-nos quem <span>você é</span></>}
                {step === 2 && <>Onde você <span>atua</span></>}
                {step === 3 && <>Suas <span>habilidades</span></>}
                {step === 4 && <>Sua <span>segurança</span></>}
              </h1>
              <p className="form-description">
                {step === 1 && "Precisamos de seus documentos básicos para validar sua identidade na rede."}
                {step === 2 && "Ajude-nos a entender em quais bairros você pode levar esperança."}
                {step === 3 && "Quais talentos você deseja compartilhar com quem mais precisa?"}
                {step === 4 && "Finalize seu cadastro aceitando nossos termos de segurança e privacidade."}
              </p>
            </div>

              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="input-grid grid-cols-3">
                    <div className="input-group col-span-3">
                      <label className="input-label">Nome Completo</label>
                      <div className="input-wrapper">
                        <input type="text" className="input-field pl-icon" placeholder="Nome como no documento" />
                        <User className="input-icon" />
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
                      <label className="input-label">RG</label>
                      <div className="input-wrapper">
                        <input type="text" className="input-field pl-icon" placeholder="00.000.000-0" />
                        <IdCard className="input-icon" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Nascimento</label>
                      <div className="input-wrapper">
                        <input type="date" className="input-field pl-icon" />
                        <Calendar className="input-icon" />
                      </div>
                    </div>
                    <div className="input-group col-span-2">
                      <label className="input-label">Gênero</label>
                      <select className="input-field">
                        <option value="">Selecione</option>
                        <option value="m">Masculino</option>
                        <option value="f">Feminino</option>
                        <option value="o">Outro</option>
                        <option value="p">Prefiro não dizer</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="input-grid grid-cols-3">
                    <div className="input-group">
                      <label className="input-label">E-mail</label>
                      <div className="input-wrapper">
                        <input type="email" className="input-field pl-icon" placeholder="seu@email.com" />
                        <Mail className="input-icon" />
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
                      <label className="input-label">Cidade / UF</label>
                      <input type="text" className="input-field" placeholder="Sua Cidade - UF" />
                    </div>
                    <div className="input-group col-span-3">
                      <label className="input-label">Endereço Residencial</label>
                      <div className="input-wrapper">
                        <input type="text" className="input-field pl-icon" placeholder="Rua, número, complemento" />
                        <Home className="input-icon" />
                      </div>
                    </div>
                    <div className="input-group col-span-3">
                      <label className="input-label">Bairros de Atuação</label>
                      <div className="input-wrapper">
                        <input type="text" className="input-field pl-icon" placeholder="Ex: Centro, Vila Nova..." />
                        <MapPin className="input-icon" />
                      </div>
                    </div>
                  </div>
                )}

              {step === 3 && (
                <div className="input-grid">
                  <div className="input-group">
                    <label className="input-label">Habilidade Principal</label>
                    <input type="text" className="input-field" placeholder="Ex: Cozinha, Aulas, Logística..." />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Disponibilidade</label>
                    <div className="input-wrapper">
                      <input type="text" className="input-field pl-icon" placeholder="Ex: Sábados de manhã" />
                      <Calendar className="input-icon" />
                    </div>
                  </div>

                  <div className="input-group col-span-2">
                    <label className="input-label">Breve Bio / Experiência</label>
                    <textarea className="input-field" style={{ minHeight: '200px', paddingTop: '1.5rem' }} placeholder="Conte um pouco sobre suas experiências e como gostaria de ajudar..."></textarea>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="input-grid">
                  <div className="col-span-2 achievement-card" style={{ background: 'rgba(16, 185, 129, 0.05)', border: 'none', padding: '2rem' }}>
                    <ShieldCheck size={48} color="#10b981" style={{ flexShrink: 0 }} />
                    <div>
                      <h3 style={{ margin: '0 0 1rem 0', fontWeight: '900', color: '#10b981', fontSize: '1.5rem' }}>VERIFICAÇÃO DE SEGURANÇA</h3>
                      <p style={{ margin: 0, fontSize: '1.125rem', color: 'var(--text-gray-500)', lineHeight: '1.6' }}>
                        Para garantir a segurança de todos na plataforma, seus dados passarão por uma análise rápida antes da ativação completa do perfil.
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2 checkbox-grid">
                    <label className="checkbox-item">
                      <input type="checkbox" />
                      <span className="checkbox-label">Aceito os Termos de Uso e Privacidade</span>
                    </label>
                    <label className="checkbox-item">
                      <input type="checkbox" />
                      <span className="checkbox-label">Declaro que todas as informações são verídicas</span>
                    </label>
                  </div>

                  <button type="button" className="col-span-2 btn-base btn-secondary" style={{ borderStyle: 'dashed', padding: '2rem' }}>
                    <IdCard size={28} />
                    FAZER UPLOAD DO DOCUMENTO (OPCIONAL)
                  </button>
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
                  <button type="button" onClick={nextStep} className="btn-base btn-primary" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    CONTINUAR
                    <ChevronRight size={24} />
                  </button>
                ) : (
                  <button type="submit" className="btn-base btn-primary" style={{ background: 'linear-gradient(to right, #10b981, #0d9488)' }}>
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