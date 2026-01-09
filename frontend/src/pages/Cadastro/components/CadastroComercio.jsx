import React, { useState, useEffect } from 'react';
import { 
  Store, ArrowLeft, ShieldCheck, 
  MapPin, CheckCircle2, ChevronRight, 
  ChevronLeft, Phone, Mail, 
  Trophy, Zap, Heart, Award, Info, Users,
  ShoppingBag, CreditCard, Tag, Eye, EyeOff, AlertCircle, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../../../styles/pages/cadastro-comercio.css';

export default function CadastroComercio() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const totalSteps = 6;

  useEffect(() => {
    if (isSubmitted) {
      setShowAlert(true);
    }
  }, [isSubmitted]);

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const steps = [
    { id: 1, title: "Negócio", icon: <Store size={20} /> },
    { id: 2, title: "Registro", icon: <CreditCard size={20} /> },
    { id: 3, title: "Contato", icon: <Phone size={20} /> },
    { id: 4, title: "Unidade", icon: <MapPin size={20} /> },
    { id: 5, title: "Parceria", icon: <Tag size={20} /> },
    { id: 6, title: "Aliança", icon: <Heart size={20} /> },
  ];

  const contributionOptions = [
    { title: "Ponto de Coleta de Doações", icon: <MapPin />, desc: "Receba itens da comunidade" },
    { title: "Descontos para Famílias Cadastradas", icon: <Tag />, desc: "Ofereça preços especiais" },
    { title: "Doação de Excedentes (Alimentos)", icon: <ShoppingBag />, desc: "Evite desperdícios" },
    { title: "Apoio Financeiro a Projetos", icon: <CreditCard />, desc: "Patrocine causas locais" },
    { title: "Oferta de Vagas de Emprego", icon: <Users />, desc: "Contrate moradores do bairro" },
    { title: "Divulgação de Campanhas", icon: <Info />, desc: "Espalhe a solidariedade" }
  ];

  if (isSubmitted) {
    return (
      <div className="comercio-success-page-immersive comercio-theme comercio-unique-success-view">
        {showAlert && (
          <div className="comercio-alert-overlay">
            <div className="comercio-alert-modal comercio-animate-bounce-in">
              <div className="comercio-alert-header">
                <AlertCircle size={28} color="#3b82f6" />
                <h3>Aviso Importante</h3>
                <button onClick={() => setShowAlert(false)} className="comercio-close-alert-btn">
                  <X size={20} />
                </button>
              </div>
              <p>Sua parceria foi enviada com sucesso! O processo de análise pode demorar até <strong>24 horas</strong>.</p>
              <button onClick={() => setShowAlert(false)} className="comercio-alert-confirm-btn">Entendi</button>
            </div>
          </div>
        )}

        <div className="comercio-floating-elements">
          <div className="comercio-float-shape comercio-s1-blue" />
          <div className="comercio-float-shape comercio-s2-blue" />
          <div className="comercio-float-shape comercio-s3-blue" />
        </div>

        <div className="comercio-success-full-wrapper">
          <div className="comercio-success-hero-section">
            <div className="comercio-celebration-master-icon">
              <div className="comercio-icon-pulse-ring-blue" />
              <div className="comercio-icon-main-box-blue">
                <ShieldCheck size={80} />
              </div>
            </div>
            <h1 className="comercio-success-main-title">
              Parceria em <br/>
              <span className="comercio-text-gradient-blue">Análise</span>
            </h1>
            <p className="comercio-success-description">
              Sua solicitação está sendo processada. Em breve seu comércio será um ponto de apoio oficial!
            </p>
          </div>

          <div className="comercio-success-dashboard-grid">
            <div className="comercio-premium-status-banner-blue">
              <div className="comercio-status-info">
                <Award size={48} className="comercio-animate-bounce" />
                <div>
                  <h2>Impacto Econômico-Social</h2>
                  <p>Sua marca brilhará com o selo de responsabilidade social</p>
                </div>
              </div>
              <div className="comercio-status-stats">
                <div className="comercio-stat-pill-blue">Aguardando</div>
                <div className="comercio-stat-pill-blue">+150 XP Pendentes</div>
              </div>
            </div>

            <div className="comercio-dashboard-column comercio-animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="comercio-column-header-blue">
                <Zap size={24} />
                <h3>Sua Progressão</h3>
              </div>
              <div className="comercio-level-card-blue">
                <div className="comercio-level-circle-blue">
                  <span className="comercio-lvl-num">--</span>
                  <span className="comercio-lvl-label">LVL</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="comercio-xp-info-row">
                    <span>Progresso do Selo</span>
                    <strong>0%</strong>
                  </div>
                  <div className="comercio-xp-bar-full">
                    <div className="comercio-xp-progress-blue" style={{ width: '0%' }} />
                  </div>
                  <p className="comercio-xp-footer-text">O selo será liberado após a aprovação e primeira ação</p>
                </div>
              </div>
            </div>

            <div className="comercio-dashboard-column comercio-animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="comercio-column-header-blue">
                <Award size={24} />
                <h3>Próximas Etapas</h3>
              </div>
              <div className="comercio-achievements-grid">
                {[
                  { title: "Selo de Parceiro", desc: "Material visual para sua loja", icon: <Award /> },
                  { title: "Visibilidade no Mapa", desc: "Apareça como ponto de apoio", icon: <MapPin /> },
                  { title: "Gestão de Ofertas", desc: "Crie vouchers solidários", icon: <Tag /> }
                ].map((item, i) => (
                  <div key={i} className="comercio-achievement-badge-item">
                    <div className="comercio-achievement-icon">{item.icon}</div>
                    <div className="comercio-achievement-info">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="comercio-dashboard-column comercio-animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="comercio-column-header-blue">
                <Store size={24} />
                <h3>Painel da Loja</h3>
              </div>
              <p className="comercio-side-text">Aguarde a liberação do seu painel administrativo.</p>
              <div className="comercio-success-actions-vertical">
                <button className="comercio-btn-go-home-blue" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                  <span>Em Análise</span>
                  <ChevronRight size={24} />
                </button>
                <Link to="/" className="comercio-btn-secondary-link">Voltar ao Início</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="comercio-cadastro-container comercio-theme comercio-unique-root">
      <div className="comercio-bg-blobs">
        <div className="comercio-blob comercio-blob-1" style={{ background: '#eff6ff' }} />
        <div className="comercio-blob comercio-blob-2" style={{ background: '#f0f9ff' }} />
      </div>

      <nav className="comercio-top-nav">
        <Link to="/" className="comercio-back-link">
          <div className="comercio-back-icon-box"><ArrowLeft size={20} /></div>
          <span>Voltar</span>
        </Link>
        <div className="comercio-nav-brand">
          <div className="comercio-brand-icon-box" style={{ background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)' }}>
            <Store size={24} />
          </div>
          <span className="comercio-brand-text">SolidarBairro <span style={{ color: '#3b82f6', fontSize: '0.8rem' }}>COMÉRCIO</span></span>
        </div>
      </nav>

      <div className="comercio-main-layout">
        <aside className="comercio-sidebar-stepper">
          <div className="comercio-stepper-card">
            <h2 className="comercio-stepper-title">CADASTRO DE PARCEIRO</h2>
            <div className="comercio-stepper-list">
              {steps.map((s, i) => (
                <div key={s.id} className={`comercio-stepper-item ${step === s.id ? 'comercio-active' : step > s.id ? 'comercio-completed' : ''}`}>
                  <div className="comercio-stepper-icon" style={step === s.id ? { boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)' } : {}}>
                    {step > s.id ? <CheckCircle2 size={20} style={{ color: '#3b82f6' }} /> : s.icon}
                  </div>
                  <div className="comercio-stepper-info">
                    <span className="comercio-stepper-step-num">ETAPA 0{s.id}</span>
                    <span className="comercio-stepper-step-name">{s.title}</span>
                  </div>
                  {i < steps.length - 1 && <div className="comercio-stepper-line" style={step > s.id ? { background: '#3b82f6' } : {}} />}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="comercio-form-main">
          <div className="comercio-form-container-card comercio-animate-slide-up">
            <div className="comercio-form-header-section">
              <div className="comercio-header-top">
                <span className="comercio-step-badge" style={{ color: '#3b82f6' }}>{steps.find(s => s.id === step)?.title}</span>
                <div className="comercio-progress-bar-container">
                  <div className="comercio-progress-bar-fill" style={{ width: `${(step / totalSteps) * 100}%`, background: 'linear-gradient(to right, #3b82f6, #0ea5e9)' }} />
                </div>
              </div>
              <h1 className="comercio-form-main-title">
                {step === 1 && <>Dados do <span style={{ color: '#3b82f6' }}>negócio</span></>}
                {step === 2 && <>Registro <span style={{ color: '#3b82f6' }}>fiscal</span></>}
                {step === 3 && <>Contatos da <span style={{ color: '#3b82f6' }}>loja</span></>}
                {step === 4 && <>Sua <span style={{ color: '#3b82f6' }}>localização</span></>}
                {step === 5 && <>Tipo de <span style={{ color: '#3b82f6' }}>parceria</span></>}
                {step === 6 && <>Termos de <span style={{ color: '#3b82f6' }}>aliança</span></>}
              </h1>
              <p className="comercio-form-subtitle">
                {step === 1 && "Identifique sua empresa para que a comunidade possa reconhecer sua marca."}
                {step === 2 && "Dados fiscais garantem a transparência das doações e incentivos."}
                {step === 3 && "Como os coordenadores do SolidarBairro podem falar com você?"}
                {step === 4 && "Informe o endereço da unidade que será ponto de apoio."}
                {step === 5 && "Defina como seu comércio pretende contribuir com a comunidade."}
                {step === 6 && "Finalize aceitando os termos da nossa aliança solidária."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="comercio-form-content">
              {step === 1 && (
                <div className="comercio-form-grid">
                  <div className="comercio-form-group comercio-span-2">
                    <label className="comercio-field-label">Nome Fantasia do Comércio</label>
                    <div className="comercio-input-with-icon">
                      <Store className="comercio-field-icon" size={20} />
                      <input required type="text" className="comercio-form-input" placeholder="Ex: Padaria do Bairro" />
                    </div>
                  </div>
                  <div className="comercio-form-group">
                    <label className="comercio-field-label">Segmento</label>
                    <select required className="comercio-form-input">
                      <option value="">Selecione</option>
                      <option value="alimentacao">Alimentação</option>
                      <option value="vestuario">Vestuário</option>
                      <option value="servicos">Serviços</option>
                      <option value="saude">Saúde / Farmácia</option>
                    </select>
                  </div>
                  <div className="comercio-form-group">
                    <label className="comercio-field-label">Responsável Legal</label>
                    <input required type="text" className="comercio-form-input" placeholder="Nome completo" />
                  </div>
                  <div className="comercio-form-group">
                    <label className="comercio-field-label">Senha de Acesso</label>
                    <div className="comercio-input-with-icon">
                      <CreditCard className="comercio-field-icon" size={20} />
                      <input 
                        required 
                        type={showPassword ? "text" : "password"} 
                        className="comercio-form-input" 
                        placeholder="••••••••" 
                      />
                      <button 
                        type="button" 
                        className="comercio-password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="comercio-form-group">
                    <label className="comercio-field-label">Confirmar Senha</label>
                    <div className="comercio-input-with-icon">
                      <ShieldCheck className="comercio-field-icon" size={20} />
                      <input 
                        required 
                        type={showConfirmPassword ? "text" : "password"} 
                        className="comercio-form-input" 
                        placeholder="••••••••" 
                      />
                      <button 
                        type="button" 
                        className="comercio-password-toggle-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="comercio-form-grid">
                  <div className="comercio-form-group">
                    <label className="comercio-field-label">CNPJ</label>
                    <div className="comercio-input-with-icon">
                      <CreditCard className="comercio-field-icon" size={20} />
                      <input required type="text" className="comercio-form-input" placeholder="00.000.000/0000-00" />
                    </div>
                  </div>
                  <div className="comercio-form-info-box comercio-span-2" style={{ background: '#082f49' }}>
                    <ShieldCheck size={32} style={{ color: '#7dd3fc' }} />
                    <div>
                      <h4 className="comercio-info-title">Parceria Segura</h4>
                      <p className="comercio-info-text">Seu CNPJ é validado para emissão de certificados de responsabilidade social.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="comercio-form-grid">
                  <div className="comercio-form-group">
                    <label className="comercio-field-label">Telefone de Contato</label>
                    <div className="comercio-input-with-icon">
                      <Phone className="comercio-field-icon" size={20} />
                      <input required type="tel" className="comercio-form-input" placeholder="(00) 0000-0000" />
                    </div>
                  </div>
                  <div className="comercio-form-group">
                    <label className="comercio-field-label">E-mail Comercial</label>
                    <div className="comercio-input-with-icon">
                      <Mail className="comercio-field-icon" size={20} />
                      <input required type="email" className="comercio-form-input" placeholder="loja@exemplo.com" />
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="comercio-form-grid">
                  <div className="comercio-form-group comercio-span-2">
                    <label className="comercio-field-label">Endereço da Loja</label>
                    <div className="comercio-input-with-icon">
                      <MapPin className="comercio-field-icon" size={20} />
                      <input required type="text" className="comercio-form-input" placeholder="Rua, Número, Bairro" />
                    </div>
                  </div>
                  <div className="comercio-form-group comercio-span-2">
                    <label className="comercio-field-label">Horário de Funcionamento</label>
                    <input required type="text" className="comercio-form-input" placeholder="Ex: Seg a Sex das 08h às 18h" />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="comercio-form-grid">
                  <div className="comercio-form-group comercio-span-2">
                    <label className="comercio-field-label">Como deseja contribuir?</label>
                    <div className="comercio-selectable-grid">
                      {contributionOptions.map((opt) => (
                        <label key={opt.title} className="comercio-selectable-item">
                          <input type="checkbox" />
                          <div className="comercio-selectable-card">
                            <div className="comercio-selectable-card-icon">
                              {opt.icon}
                            </div>
                            <div className="comercio-selectable-card-content-text">
                              <span className="comercio-selectable-card-text">{opt.title}</span>
                              <p className="comercio-selectable-card-desc">{opt.desc}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="comercio-form-grid">
                  <div className="comercio-form-group comercio-span-2">
                    <label className="comercio-field-label">Observações Adicionais</label>
                    <textarea className="comercio-form-input" placeholder="Conte algo mais sobre seu interesse na rede" rows="4" style={{ paddingLeft: '24px' }}></textarea>
                  </div>
                  <div className="comercio-form-final-box comercio-span-2" style={{ background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)' }}>
                    <Award size={48} className="comercio-final-icon" />
                    <p>Ao se tornar um comércio parceiro, você fortalece a economia local e ganha destaque como empresa socialmente responsável.</p>
                  </div>
                </div>
              )}

              <div className="comercio-form-navigation">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="comercio-nav-btn comercio-btn-prev">
                    <ChevronLeft size={20} />
                    <span>Anterior</span>
                  </button>
                ) : (
                  <Link to="/" className="comercio-nav-btn comercio-btn-cancel comercio-cancel-left">Cancelar</Link>
                )}
                
                <div className="comercio-nav-actions">
                  {step < totalSteps ? (
                    <button type="button" onClick={nextStep} className="comercio-nav-btn comercio-btn-next" style={{ background: '#082f49' }}>
                      <span>Avançar</span>
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button type="submit" className="comercio-nav-btn comercio-btn-finish" style={{ background: 'linear-gradient(to right, #3b82f6, #0ea5e9)', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}>
                      <span>Enviar para Análise</span>
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