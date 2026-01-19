import React, { useState } from 'react';
import { 
  Building2, ArrowLeft, Globe, ShieldCheck, 
  MapPin, CheckCircle2, ChevronRight, 
  ChevronLeft, FileText, Mail, Phone, 
  Trophy, Zap, Heart, Award, Users,
  Calendar, Home, Compass, Sun, Sunrise, Warehouse, Map
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PasswordField from '../../../components/ui/PasswordField';
import Toast from '../../../components/ui/Toast';
import './CadastroONG.css';

export default function CadastroONGDesktop() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [formData, setFormData] = useState({
    cnpj: '',
    telefone: '',
    nomeFantasia: '',
    razaoSocial: '',
    dataFundacao: '',
    email: '',
    website: '',
    sede: '',
    numVoluntarios: '',
    colaboradoresFixos: '',
    causas: []
  });
  const totalSteps = 6;

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
  };

  const handleCNPJChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
      value = value.replace(/(\d{2})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1/$2');
      value = value.replace(/(\d{4})(\d)/, '$1-$2');
      setFormData(prev => ({ ...prev, cnpj: value }));
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
      setFormData(prev => ({ ...prev, telefone: value }));
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    showToast('ONG registrada com sucesso! Seu cadastro está sendo analisado por nossa equipe. Você receberá uma notificação em até 24 horas com o resultado. O administrador precisa liberar seu acesso.', 'success');
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
      <div className="ong-reg-container ong-reg-theme ong-reg-success-view">
        <div className="ong-reg-bg-blobs">
          <div className="ong-reg-blob ong-reg-blob-1" />
          <div className="ong-reg-blob ong-reg-blob-2" />
        </div>

        <nav className="ong-reg-navbar">
          <Link to="/" className="ong-reg-back-link">
            <div className="ong-reg-back-icon"><ArrowLeft size={20} /></div>
            <span>Voltar</span>
          </Link>
          <div className="ong-reg-brand">
            <div className="ong-reg-brand-logo">
              <Building2 size={24} />
            </div>
            <span className="ong-reg-brand-name">SolidarBairro <span className="ong-reg-brand-tag">ONG</span></span>
          </div>
        </nav>

        <div className="ong-reg-form-card ong-reg-success-card">
          <div className="ong-reg-success-grid">
            <div className="ong-reg-success-left">
              <div className="ong-reg-success-icon-bg">
                <Trophy size={48} color="white" />
              </div>
              <h1 className="ong-reg-success-title">
                ONG <br/>
                <span className="ong-reg-text-highlight">Registrada!</span>
              </h1>
              <p className="ong-reg-success-description">
                Sua organização agora faz parte da rede oficial. Prepare-se para ampliar seu impacto!
              </p>
              <div className="ong-reg-xp-card">
                <div className="ong-reg-xp-header">
                  <div>
                    <p className="ong-reg-xp-label">Impacto Institucional</p>
                    <h3 className="ong-reg-xp-value">+100 XP</h3>
                  </div>
                  <Zap size={32} color="#8b5cf6" />
                </div>
                <div className="ong-reg-xp-bar">
                  <div className="ong-reg-xp-inner" style={{ width: '25%' }} />
                </div>
                <p className="ong-reg-xp-footer">Complete a verificação para ganhar selo de confiança</p>
              </div>
            </div>
            <div className="ong-reg-success-right">
              <div>
                <h2 className="ong-reg-next-steps-title">Próximos Passos</h2>
                <div className="ong-reg-steps-mini-list">
                  {[
                    { title: "Verificação CNPJ", desc: "Validaremos os dados da sua instituição", icon: <ShieldCheck /> },
                    { title: "Painel de Gestão", desc: "Acesse ferramentas de mapeamento", icon: <Globe /> },
                    { title: "Rede de Apoio", desc: "Conecte-se com doadores e voluntários", icon: <Users /> }
                  ].map((item, i) => (
                    <div key={i} className="ong-reg-step-card-mini">
                      <div className="ong-reg-mini-icon">{item.icon}</div>
                      <div>
                        <h4 style={{ margin: 0, fontWeight: 800 }}>{item.title}</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ong-reg-success-actions">
                <Link to="/" className="ong-reg-btn-full ong-reg-btn-primary">Início</Link>
                <button className="ong-reg-btn-full ong-reg-btn-secondary">Acessar Painel</button>
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        <Toast 
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: 'info' })}
        />
      </div>
    );
  }

  return (
    <div className="ong-reg-container ong-reg-theme">
      <div className="ong-reg-bg-blobs">
        <div className="ong-reg-blob ong-reg-blob-1" />
        <div className="ong-reg-blob ong-reg-blob-2" />
      </div>

      <nav className="ong-reg-navbar">
        <Link to="/" className="ong-reg-back-link">
          <div className="ong-reg-back-icon"><ArrowLeft size={20} /></div>
          <span>Voltar</span>
        </Link>
        <div className="ong-reg-brand">
          <div className="ong-reg-brand-logo">
            <Building2 size={24} />
          </div>
          <span className="ong-reg-brand-name">SolidarBairro <span className="ong-reg-brand-tag">ONG</span></span>
        </div>
      </nav>

      <div className="ong-reg-main-grid">
        <aside className="ong-reg-sidebar">
          <div className="ong-reg-steps-card">
            <h2 className="ong-reg-steps-title">CADASTRO INSTITUCIONAL</h2>
            <div className="ong-reg-steps-list">
              {steps.map((s, i) => (
                <div key={s.id} className={`ong-reg-step-item ${step === s.id ? 'ong-reg-active' : step > s.id ? 'ong-reg-completed' : ''}`}>
                  <div className="ong-reg-step-icon-box">
                    {step > s.id ? <CheckCircle2 size={20} /> : s.icon}
                  </div>
                  <div className="ong-reg-step-info">
                    <span className="ong-reg-step-number">ETAPA 0{s.id}</span>
                    <span className="ong-reg-step-label">{s.title}</span>
                  </div>
                  {i < steps.length - 1 && <div className={`ong-reg-step-connector ${step > s.id ? 'ong-reg-completed' : ''}`} />}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="ong-reg-content-area">
          <div className="ong-reg-form-card ong-reg-animate-up">
            <div className="ong-reg-form-header">
              <div className="ong-reg-progress-container">
                <span className="ong-reg-step-badge">{steps.find(s => s.id === step)?.title}</span>
                <div className="ong-reg-progress-bar-bg">
                  <div className="ong-reg-progress-bar-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
                </div>
              </div>
              <h1 className="ong-reg-form-title">
                {step === 1 && <>Sua <span className="ong-reg-text-highlight">instituição</span></>}
                {step === 2 && <>Dados <span className="ong-reg-text-highlight">legais</span></>}
                {step === 3 && <>Como <span className="ong-reg-text-highlight">contatá-los</span>?</>}
                {step === 4 && <>Área de <span className="ong-reg-text-highlight">atuação</span></>}
                {step === 5 && <>Sua <span className="ong-reg-text-highlight">equipe</span></>}
                {step === 6 && <>Causas e <span className="ong-reg-text-highlight">missão</span></>}
              </h1>
              <p className="ong-reg-form-description">
                {step === 1 && "Comece informando o nome e a identidade visual da sua organização."}
                {step === 2 && "Precisamos do CNPJ e dados de registro para validação institucional."}
                {step === 3 && "Informe os canais oficiais para comunicação com a rede."}
                {step === 4 && "Em quais bairros ou regiões sua ONG atua prioritariamente?"}
                {step === 5 && "Conte-nos sobre os voluntários e profissionais que compõem sua base."}
                {step === 6 && "Selecione as causas que sua ONG abraça para conectarmos vocês."}
              </p>
            </div>

            <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
              {step === 1 && (
                <div className="ong-reg-form-grid ong-reg-form-grid-2">
                  <div className="ong-reg-input-group ong-reg-input-group-full">
                    <label className="ong-reg-input-label">Nome Fantasia da ONG <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="ong-reg-input-wrapper">
                      <Building2 className="ong-reg-input-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className="ong-reg-form-input" 
                        placeholder="Nome da organização"
                        value={formData.nomeFantasia}
                        onChange={(e) => setFormData(prev => ({ ...prev, nomeFantasia: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="ong-reg-input-group ong-reg-input-group-full">
                    <label className="ong-reg-input-label">Razão Social <span style={{ color: '#ef4444' }}>*</span></label>
                    <input 
                      required 
                      type="text" 
                      className="ong-reg-form-input" 
                      style={{ paddingLeft: '1rem' }}
                      placeholder="Razão social completa"
                      value={formData.razaoSocial}
                      onChange={(e) => setFormData(prev => ({ ...prev, razaoSocial: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="ong-reg-form-grid ong-reg-form-grid-2">
                  <div className="ong-reg-input-group">
                    <label className="ong-reg-input-label">CNPJ <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="ong-reg-input-wrapper">
                      <FileText className="ong-reg-input-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className="ong-reg-form-input" 
                        placeholder="00.000.000/0000-00"
                        value={formData.cnpj}
                        onChange={handleCNPJChange}
                        maxLength={18}
                      />
                    </div>
                  </div>
                  <div className="ong-reg-input-group">
                    <label className="ong-reg-input-label">Data de Fundação <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="ong-reg-input-wrapper">
                      <Calendar className="ong-reg-input-icon" size={20} />
                      <input 
                        required 
                        type="date" 
                        className="ong-reg-form-input"
                        value={formData.dataFundacao}
                        onChange={(e) => setFormData(prev => ({ ...prev, dataFundacao: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="ong-reg-info-box">
                    <div className="ong-reg-info-icon-box">
                      <ShieldCheck size={28} />
                    </div>
                    <div className="ong-reg-info-content">
                      <h4>Validação Necessária</h4>
                      <p>ONGs cadastradas passam por uma auditoria documental para garantir a segurança da plataforma.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="ong-reg-form-grid ong-reg-form-grid-2">
                  <div className="ong-reg-input-group">
                    <label className="ong-reg-input-label">Telefone Comercial <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="ong-reg-input-wrapper">
                      <Phone className="ong-reg-input-icon" size={20} />
                      <input 
                        required 
                        type="tel" 
                        className="ong-reg-form-input" 
                        placeholder="(00) 00000-0000"
                        value={formData.telefone}
                        onChange={handlePhoneChange}
                        maxLength={15}
                      />
                    </div>
                  </div>
                  <div className="ong-reg-input-group">
                    <label className="ong-reg-input-label">E-mail Institucional <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="ong-reg-input-wrapper">
                      <Mail className="ong-reg-input-icon" size={20} />
                      <input 
                        required 
                        type="email" 
                        className="ong-reg-form-input" 
                        placeholder="contato@ong.org"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="ong-reg-input-group ong-reg-input-group-full">
                    <label className="ong-reg-input-label">Website ou Rede Social</label>
                    <div className="ong-reg-input-wrapper">
                      <Globe className="ong-reg-input-icon" size={20} />
                      <input 
                        type="url" 
                        className="ong-reg-form-input" 
                        placeholder="https://www.suaong.org"
                        value={formData.website}
                        onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      />
                    </div>
                  </div>
                  <PasswordField 
                    label="Senha de Acesso"
                    placeholder="Crie uma senha segura"
                    required
                  />
                  <PasswordField 
                    label="Confirmar Senha"
                    placeholder="Digite a senha novamente"
                    required
                  />
                </div>
              )}

              {step === 4 && (
                <div className="ong-reg-form-grid">
                  <div className="ong-reg-input-group ong-reg-input-group-full">
                    <label className="ong-reg-input-label">Sede da ONG <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="ong-reg-input-wrapper">
                      <Home className="ong-reg-input-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className="ong-reg-form-input" 
                        placeholder="Endereço completo da sede"
                        value={formData.sede}
                        onChange={(e) => setFormData(prev => ({ ...prev, sede: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="ong-reg-input-group ong-reg-input-group-full">
                    <label className="ong-reg-input-label">Áreas de Cobertura (Selecione os bairros onde atuam)</label>
                    <div className="ong-reg-coverage-grid">
                      {[
                        { name: "Centro", icon: <Building2 size={20} />, desc: "Região central" },
                        { name: "Zona Norte", icon: <Compass size={20} />, desc: "Bairros norte" },
                        { name: "Zona Sul", icon: <Sun size={20} />, desc: "Bairros sul" },
                        { name: "Zona Leste", icon: <Sunrise size={20} />, desc: "Bairros leste" },
                        { name: "Periferia", icon: <Warehouse size={20} />, desc: "Áreas periféricas" },
                        { name: "Região Metropolitana", icon: <Map size={20} />, desc: "Cidades vizinhas" }
                      ].map((zona) => {
                        const isSelected = selectedAreas.includes(zona.name);
                        return (
                          <label key={zona.name} className="ong-reg-coverage-card">
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={() => {
                                setSelectedAreas(prev => 
                                  prev.includes(zona.name) 
                                    ? prev.filter(area => area !== zona.name)
                                    : [...prev, zona.name]
                                );
                              }} 
                            />
                            <div className="ong-reg-coverage-card-inner">
                              <div className="ong-reg-coverage-icon">
                                {zona.icon}
                              </div>
                              <h4 className="ong-reg-coverage-name">{zona.name}</h4>
                              <p className="ong-reg-coverage-desc">{zona.desc}</p>
                              {isSelected && (
                                <div style={{
                                  position: 'absolute',
                                  top: '0.5rem',
                                  right: '0.5rem',
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '50%',
                                  background: '#8b5cf6',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <CheckCircle2 size={12} />
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
                <div className="ong-reg-form-grid ong-reg-form-grid-2">
                  <div className="ong-reg-input-group">
                    <label className="ong-reg-input-label">Número de Voluntários</label>
                    <input 
                      type="number" 
                      className="ong-reg-form-input" 
                      style={{ paddingLeft: '1rem' }}
                      placeholder="Ex: 50"
                      value={formData.numVoluntarios}
                      onChange={(e) => setFormData(prev => ({ ...prev, numVoluntarios: e.target.value }))}
                    />
                  </div>
                  <div className="ong-reg-input-group">
                    <label className="ong-reg-input-label">Colaboradores Fixos</label>
                    <input 
                      type="number" 
                      className="ong-reg-form-input" 
                      style={{ paddingLeft: '1rem' }}
                      placeholder="Ex: 10"
                      value={formData.colaboradoresFixos}
                      onChange={(e) => setFormData(prev => ({ ...prev, colaboradoresFixos: e.target.value }))}
                    />
                  </div>
                  <div className="ong-reg-info-box" style={{ background: '#4c1d95' }}>
                    <div className="ong-reg-info-icon-box" style={{ color: '#ddd6fe' }}>
                      <Users size={28} />
                    </div>
                    <div className="ong-reg-info-content">
                      <h4>Gestão de Equipe</h4>
                      <p>Após o cadastro, você poderá convidar sua equipe para gerenciar as demandas no painel.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="ong-reg-form-grid">
                  <div className="ong-reg-input-group ong-reg-input-group-full">
                    <label className="ong-reg-input-label">Causas Principais</label>
                    <div className="ong-reg-checkbox-grid">
                      {[
                        "Segurança Alimentar",
                        "Educação e Cultura",
                        "Saúde e Bem-estar",
                        "Meio Ambiente",
                        "Direitos Humanos",
                        "Proteção Animal"
                      ].map((causa) => (
                        <label key={causa} className="ong-reg-checkbox-card">
                          <input 
                            type="checkbox" 
                            checked={formData.causas.includes(causa)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData(prev => ({
                                ...prev,
                                causas: checked 
                                  ? [...prev.causas, causa]
                                  : prev.causas.filter(c => c !== causa)
                              }));
                            }}
                          />
                          <span>{causa}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="ong-reg-final-box">
                    <Award size={48} />
                    <p>Ao se registrar, sua ONG ganha visibilidade para doadores e torna-se um ponto oficial de apoio no bairro.</p>
                  </div>
                </div>
              )}

              <div className="ong-reg-form-footer">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="ong-reg-btn ong-reg-btn-prev">
                    <ChevronLeft size={20} />
                    <span>Anterior</span>
                  </button>
                ) : (
                  <div />
                )}
                
                <div className="ong-reg-nav-actions">
                  {step === 1 && <Link to="/" className="ong-reg-btn ong-reg-btn-cancel">Cancelar</Link>}
                  
                  {step < totalSteps ? (
                    <button type="submit" className="ong-reg-btn ong-reg-btn-next">
                      <span>Continuar</span>
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button type="submit" className="ong-reg-btn ong-reg-btn-finish">
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

      {/* Toast */}
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'info' })}
      />
    </div>
  );
}
