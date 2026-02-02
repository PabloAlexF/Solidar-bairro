import React, { useState, useEffect } from 'react';
import {
  Store, ArrowLeft, ShieldCheck,
  MapPin, CheckCircle2, ChevronRight,
  ChevronLeft, Phone, Mail,
  Trophy, Zap, Heart, Award, Info, Users,
  ShoppingBag, CreditCard, Tag, Eye, EyeOff, AlertCircle, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiService from '../../../services/apiService';
import './CadastroComercioMobile.css';
import { useCEP } from '../../AdminDashboard/useCEP';

export default function CadastroComercioMobile() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [formData, setFormData] = useState({
    nomeFantasia: '',
    segmento: '',
    responsavel: '',
    senha: '',
    confirmarSenha: '',
    cnpj: '',
    telefone: '',
    email: '',
    cep: '',
    endereco: '',
    bairro: '',
    cidade: '',
    estado: '',
    numero: '',
    horarioFuncionamento: '',
    contribuicoes: [],
    observacoes: ''
  });
  const totalSteps = 6;
  const { formatCEP, searchCEP } = useCEP();

  useEffect(() => {
    if (isSubmitted) {
      setShowAlert(true);
    }
  }, [isSubmitted]);

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCepBlur = async (e) => {
    const result = await searchCEP(e.target.value);
    if (result) {
      if (result.error) {
        showToast(result.error, 'error');
        setFormData(prev => ({
          ...prev,
          endereco: '',
          bairro: '',
          cidade: '',
          estado: ''
        }));
      } else {
        showToast('Endereço encontrado!', 'success');
        const { logradouro, bairro, localidade, uf } = result.data;
        setFormData(prev => ({
          ...prev,
          endereco: logradouro || '',
          bairro: bairro || '',
          cidade: localidade || '',
          estado: uf || ''
        }));
      }
    }
  };

  const handleCheckboxChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        if (!formData.nomeFantasia.trim() || !formData.segmento || !formData.responsavel.trim()) return false;
        if (!formData.senha || formData.senha.length < 6) {
          showToast('A senha deve ter no mínimo 6 caracteres', 'error');
          return false;
        }
        if (formData.senha !== formData.confirmarSenha) {
          showToast('As senhas não coincidem', 'error');
          return false;
        }
        return true;
      case 2:
        return formData.cnpj.replace(/\D/g, '').length === 14;
      case 3:
        return formData.telefone.replace(/\D/g, '').length >= 10 && formData.email.trim();
      case 4:
        return formData.endereco.trim() && formData.horarioFuncionamento.trim();
      case 5:
        return formData.contribuicoes.length > 0;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      nextStep();
    } else {
      showToast('Por favor, preencha todos os campos obrigatórios', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== totalSteps) return;

    setIsLoading(true);
    try {
      const payload = {
        nomeFantasia: formData.nomeFantasia,
        segmento: formData.segmento,
        responsavel: formData.responsavel,
        senha: formData.senha,
        cnpj: formData.cnpj,
        telefone: formData.telefone,
        email: formData.email,
        endereco: formData.endereco,
        horarioFuncionamento: formData.horarioFuncionamento,
        tiposContribuicao: formData.contribuicoes,
        observacoes: formData.observacoes
      };
      
      await ApiService.createComercio(payload);
      setIsSubmitted(true);
      setTimeout(() => setShowAlert(true), 2000);
    } catch (error) {
      console.error('Erro ao cadastrar comércio:', error);
      showToast('Erro ao realizar cadastro. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
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
      <div className="cmr-prm-success-page-immersive cmr-prm-theme cmr-prm-unique-success-view" id="cmr-prm-success-root">
        {showAlert && (
          <div className="cmr-prm-alert-overlay" id="cmr-prm-alert-overlay">
            <div className="cmr-prm-alert-modal cmr-prm-animate-bounce-in">
              <div className="cmr-prm-alert-header">
                <AlertCircle size={28} color="#3b82f6" />
                <h3>Aviso Importante</h3>
                <button onClick={() => setShowAlert(false)} className="cmr-prm-close-alert-btn">
                  <X size={20} />
                </button>
              </div>
              <p>Sua parceria foi enviada com sucesso! O processo de análise pode demorar até <strong>24 horas</strong>.</p>
              <button onClick={() => setShowAlert(false)} className="cmr-prm-alert-confirm-btn">Entendi</button>
            </div>
          </div>
        )}

        <div className="cmr-prm-floating-elements">
          <div className="cmr-prm-float-shape cmr-prm-s1-blue" />
          <div className="cmr-prm-float-shape cmr-prm-s2-blue" />
          <div className="cmr-prm-float-shape cmr-prm-s3-blue" />
        </div>

        <div className="cmr-prm-success-full-wrapper">
          <div className="cmr-prm-success-hero-section">
            <div className="cmr-prm-celebration-master-icon">
              <div className="cmr-prm-icon-pulse-ring-blue" />
              <div className="cmr-prm-icon-main-box-blue">
                <ShieldCheck size={80} />
              </div>
            </div>
            <h1 className="cmr-prm-success-main-title">
              Parceria <br/>
              <span className="cmr-prm-text-gradient-blue">Aprovada!</span>
            </h1>
            <p className="cmr-prm-success-description">
              Seu comércio agora é um ponto de apoio oficial da rede SolidarBairro!
            </p>
          </div>

          <div className="cmr-prm-success-dashboard-grid">
            <div className="cmr-prm-premium-status-banner-blue">
              <div className="cmr-prm-status-info">
                <Award size={48} className="cmr-prm-animate-bounce" />
                <div>
                  <h2>Impacto Econômico-Social</h2>
                  <p>Sua marca brilhará com o selo de responsabilidade social</p>
                </div>
              </div>
              <div className="cmr-prm-status-stats">
                <div className="cmr-prm-stat-pill-blue">Aguardando</div>
                <div className="cmr-prm-stat-pill-blue">+150 XP Pendentes</div>
              </div>
            </div>

            <div className="cmr-prm-dashboard-column cmr-prm-animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="cmr-prm-column-header-blue">
                <Zap size={24} />
                <h3>Sua Progressão</h3>
              </div>
              <div className="cmr-prm-level-card-blue">
                <div className="cmr-prm-level-circle-blue">
                  <span className="cmr-prm-lvl-num">--</span>
                  <span className="cmr-prm-lvl-label">LVL</span>
                </div>
                <div className="cmr-prm-xp-content">
                  <div className="cmr-prm-xp-info-row">
                    <span>Progresso do Selo</span>
                    <strong>0%</strong>
                  </div>
                  <div className="cmr-prm-xp-bar-full">
                    <div className="cmr-prm-xp-progress-blue" style={{ width: '0%' }} />
                  </div>
                  <p className="cmr-prm-xp-footer-text">O selo será liberado após a aprovação e primeira ação</p>
                </div>
              </div>
            </div>

            <div className="cmr-prm-dashboard-column cmr-prm-animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="cmr-prm-column-header-blue">
                <Award size={24} />
                <h3>Próximas Etapas</h3>
              </div>
              <div className="cmr-prm-achievements-grid">
                {[
                  { title: "Selo de Parceiro", desc: "Material visual para sua loja", icon: <Award /> },
                  { title: "Visibilidade no Mapa", desc: "Apareça como ponto de apoio", icon: <MapPin /> },
                  { title: "Gestão de Ofertas", desc: "Crie vouchers solidários", icon: <Tag /> }
                ].map((item, i) => (
                  <div key={i} className="cmr-prm-achievement-badge-item">
                    <div className="cmr-prm-achievement-icon">{item.icon}</div>
                    <div className="cmr-prm-achievement-info">
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cmr-prm-dashboard-column cmr-prm-animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="cmr-prm-column-header-blue">
                <Store size={24} />
                <h3>Painel da Loja</h3>
              </div>
              <p className="cmr-prm-side-text">Aguarde a liberação do seu painel administrativo.</p>
              <div className="cmr-prm-success-actions-vertical">
                <button className="cmr-prm-btn-go-home-blue" disabled style={{ opacity: 0.7, cursor: 'not-allowed' }}>
                  <span>Em Análise</span>
                  <ChevronRight size={24} />
                </button>
                <Link to="/" className="cmr-prm-btn-secondary-link">Voltar ao Início</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cmr-prm-mobile-container cmr-prm-theme cmr-prm-unique-root" id="cmr-prm-form-root">
      <div className="cmr-prm-bg-blobs">
        <div className="cmr-prm-blob cmr-prm-blob-1" style={{ background: '#eff6ff' }} />
        <div className="cmr-prm-blob cmr-prm-blob-2" style={{ background: '#f0f9ff' }} />
      </div>

      <nav className="cmr-prm-mobile-top-nav">
        <Link to="/cadastro" className="cmr-prm-back-link">
          <div className="cmr-prm-back-icon-box"><ArrowLeft size={20} /></div>
          <span>Voltar</span>
        </Link>
        <div className="cmr-prm-nav-brand">
          <div className="cmr-prm-brand-icon-box" style={{ background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)' }}>
            <Store size={24} />
          </div>
          <span className="cmr-prm-brand-text">SolidarBairro <span style={{ color: '#3b82f6', fontSize: '0.8rem' }}>COMÉRCIO</span></span>
        </div>
      </nav>

      <div className="cmr-prm-mobile-stepper">
        <div className="cmr-prm-stepper-steps-horizontal">
          {steps.map((s) => (
            <div
              key={s.id}
              className={`cmr-prm-step-dot ${step === s.id ? 'cmr-prm-active' : step > s.id ? 'cmr-prm-completed' : ''}`}
            >
              {step > s.id ? <CheckCircle2 size={16} /> : <span>{s.id}</span>}
            </div>
          ))}
        </div>
        <div className="cmr-prm-progress-bar-container">
          <div className="cmr-prm-progress-bar-fill" style={{ width: `${(step / totalSteps) * 100}%`, background: 'linear-gradient(to right, #3b82f6, #0ea5e9)' }} />
        </div>
      </div>

      <main className="cmr-prm-mobile-form-main">
        <div className="cmr-prm-form-container-card cmr-prm-animate-slide-up">
          <div className="cmr-prm-form-header-section">
            <span className="cmr-prm-step-badge" style={{ color: '#3b82f6' }}>
              {steps.find(s => s.id === step)?.title}
            </span>
            <h1 className="cmr-prm-form-main-title">
              {step === 1 && <>Dados do <span style={{ color: '#3b82f6' }}>negócio</span></>}
              {step === 2 && <>Registro <span style={{ color: '#3b82f6' }}>fiscal</span></>}
              {step === 3 && <>Contatos da <span style={{ color: '#3b82f6' }}>loja</span></>}
              {step === 4 && <>Sua <span style={{ color: '#3b82f6' }}>localização</span></>}
              {step === 5 && <>Tipo de <span style={{ color: '#3b82f6' }}>parceria</span></>}
              {step === 6 && <>Termos de <span style={{ color: '#3b82f6' }}>aliança</span></>}
            </h1>
            <p className="cmr-prm-form-subtitle">
              {step === 1 && "Identifique sua empresa para que a comunidade possa reconhecer sua marca."}
              {step === 2 && "Dados fiscais garantem a transparência das doações e incentivos."}
              {step === 3 && "Como os coordenadores do SolidarBairro podem falar com você?"}
              {step === 4 && "Informe o endereço da unidade que será ponto de apoio."}
              {step === 5 && "Defina como seu comércio pretende contribuir com a comunidade."}
              {step === 6 && "Finalize aceitando os termos da nossa aliança solidária."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="cmr-prm-form-content">
            {step === 1 && (
              <div className="cmr-prm-form-grid">
                <div className="cmr-prm-form-group cmr-prm-span-2">
                  <label className="cmr-prm-field-label">Nome Fantasia do Comércio</label>
                  <div className="cmr-prm-input-with-icon">
                    <Store className="cmr-prm-field-icon" size={20} />
                    <input required type="text" className="cmr-prm-form-input" placeholder="Ex: Padaria do Bairro" value={formData.nomeFantasia} onChange={(e) => updateFormData('nomeFantasia', e.target.value)} />
                  </div>
                </div>
                <div className="cmr-prm-form-group">
                  <label className="cmr-prm-field-label">Segmento</label>
                  <select required className="cmr-prm-form-input" value={formData.segmento} onChange={(e) => updateFormData('segmento', e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="alimentacao">Alimentação</option>
                    <option value="vestuario">Vestuário</option>
                    <option value="servicos">Serviços</option>
                    <option value="saude">Saúde / Farmácia</option>
                  </select>
                </div>
                <div className="cmr-prm-form-group">
                  <label className="cmr-prm-field-label">Responsável Legal</label>
                  <input required type="text" className="cmr-prm-form-input" placeholder="Nome completo" value={formData.responsavel} onChange={(e) => updateFormData('responsavel', e.target.value)} />
                </div>
                <div className="cmr-prm-form-group">
                  <label className="cmr-prm-field-label">Senha de Acesso</label>
                  <div className="cmr-prm-input-with-icon">
                    <CreditCard className="cmr-prm-field-icon" size={20} />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      className="cmr-prm-form-input"
                      placeholder="••••••••"
                      value={formData.senha}
                      onChange={(e) => updateFormData('senha', e.target.value)}
                    />
                    <button
                      type="button"
                      className="cmr-prm-password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="cmr-prm-form-group">
                  <label className="cmr-prm-field-label">Confirmar Senha</label>
                  <div className="cmr-prm-input-with-icon">
                    <ShieldCheck className="cmr-prm-field-icon" size={20} />
                    <input
                      required
                      type={showConfirmPassword ? "text" : "password"}
                      className="cmr-prm-form-input"
                      placeholder="••••••••"
                      value={formData.confirmarSenha}
                      onChange={(e) => updateFormData('confirmarSenha', e.target.value)}
                    />
                    <button
                      type="button"
                      className="cmr-prm-password-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="cmr-prm-form-grid">
                <div className="cmr-prm-form-group">
                  <label className="cmr-prm-field-label">CNPJ</label>
                  <div className="cmr-prm-input-with-icon">
                    <CreditCard className="cmr-prm-field-icon" size={20} />
                    <input required type="text" className="cmr-prm-form-input" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={(e) => updateFormData('cnpj', e.target.value)} />
                  </div>
                </div>
                <div className="cmr-prm-form-info-box cmr-prm-span-2" style={{ background: '#082f49' }}>
                  <ShieldCheck size={32} style={{ color: '#7dd3fc' }} />
                  <div>
                    <h4 className="cmr-prm-info-title">Parceria Segura</h4>
                    <p className="cmr-prm-info-text">Seu CNPJ é validado para emissão de certificados de responsabilidade social.</p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="cmr-prm-form-grid">
                <div className="cmr-prm-form-group">
                  <label className="cmr-prm-field-label">Telefone de Contato</label>
                  <div className="cmr-prm-input-with-icon">
                    <Phone className="cmr-prm-field-icon" size={20} />
                    <input required type="tel" className="cmr-prm-form-input" placeholder="(00) 0000-0000" value={formData.telefone} onChange={(e) => updateFormData('telefone', e.target.value)} />
                  </div>
                </div>
                <div className="cmr-prm-form-group">
                  <label className="cmr-prm-field-label">E-mail Comercial</label>
                  <div className="cmr-prm-input-with-icon">
                    <Mail className="cmr-prm-field-icon" size={20} />
                    <input required type="email" className="cmr-prm-form-input" placeholder="loja@exemplo.com" value={formData.email} onChange={(e) => updateFormData('email', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="cmr-prm-form-grid">
                <div className="cmr-prm-form-group">
                  <label className="cmr-prm-field-label">CEP</label>
                  <div className="cmr-prm-input-with-icon">
                    <MapPin className="cmr-prm-field-icon" size={20} />
                    <input required type="text" className="cmr-prm-form-input" placeholder="00000-000" value={formData.cep} onChange={(e) => updateFormData('cep', formatCEP(e.target.value))} onBlur={handleCepBlur} maxLength={9} />
                  </div>
                </div>
                <div className="cmr-prm-form-group">
                  <label className="cmr-prm-field-label">Número</label>
                  <input type="text" className="cmr-prm-form-input" placeholder="123" value={formData.numero} onChange={(e) => updateFormData('numero', e.target.value)} />
                </div>
                <div className="cmr-prm-form-group cmr-prm-span-2">
                  <label className="cmr-prm-field-label">Endereço da Loja</label>
                  <div className="cmr-prm-input-with-icon">
                    <MapPin className="cmr-prm-field-icon" size={20} />
                    <input required type="text" className="cmr-prm-form-input" placeholder="Rua, Avenida, etc." value={formData.endereco} onChange={(e) => updateFormData('endereco', e.target.value)} />
                  </div>
                </div>
                <div className="cmr-prm-form-group">
                  <label className="cmr-prm-field-label">Bairro</label>
                  <input type="text" className="cmr-prm-form-input" placeholder="Nome do bairro" value={formData.bairro} onChange={(e) => updateFormData('bairro', e.target.value)} />
                </div>
                <div className="cmr-prm-form-group">
                  <label className="cmr-prm-field-label">Cidade</label>
                  <input type="text" className="cmr-prm-form-input" placeholder="Nome da cidade" value={formData.cidade} onChange={(e) => updateFormData('cidade', e.target.value)} />
                </div>
                <div className="cmr-prm-form-group">
                  <label className="cmr-prm-field-label">Estado</label>
                  <select className="cmr-prm-form-input" value={formData.estado} onChange={(e) => updateFormData('estado', e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="PR">Paraná</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="BA">Bahia</option>
                    <option value="GO">Goiás</option>
                    <option value="PE">Pernambuco</option>
                    <option value="CE">Ceará</option>
                  </select>
                </div>
                <div className="cmr-prm-form-group cmr-prm-span-2">
                  <label className="cmr-prm-field-label">Horário de Funcionamento</label>
                  <input required type="text" className="cmr-prm-form-input" placeholder="Ex: Seg a Sex das 08h às 18h" value={formData.horarioFuncionamento} onChange={(e) => updateFormData('horarioFuncionamento', e.target.value)} />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="cmr-prm-form-grid">
                <div className="cmr-prm-form-group cmr-prm-span-2">
                  <label className="cmr-prm-field-label">Como deseja contribuir?</label>
                  <div className="cmr-prm-selectable-grid">
                    {contributionOptions.map((opt) => (
                      <label key={opt.title} className="cmr-prm-selectable-item">
                        <input type="checkbox" checked={formData.contribuicoes.includes(opt.title)} onChange={(e) => handleCheckboxChange('contribuicoes', opt.title, e.target.checked)} />
                        <div className="cmr-prm-selectable-card">
                          <div className="cmr-prm-selectable-card-icon">
                            {opt.icon}
                          </div>
                          <div className="cmr-prm-selectable-card-content-text">
                            <span className="cmr-prm-selectable-card-text">{opt.title}</span>
                            <p className="cmr-prm-selectable-card-desc">{opt.desc}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="cmr-prm-form-grid">
                <div className="cmr-prm-form-group cmr-prm-span-2">
                  <label className="cmr-prm-field-label">Observações Adicionais</label>
                  <textarea className="cmr-prm-form-input" placeholder="Conte algo mais sobre seu interesse na rede" rows={4} style={{ paddingLeft: '24px' }} value={formData.observacoes} onChange={(e) => updateFormData('observacoes', e.target.value)}></textarea>
                </div>
                <div className="cmr-prm-form-final-box cmr-prm-span-2" style={{ background: 'linear-gradient(135deg, #3b82f6, #0ea5e9)' }}>
                  <Award size={48} className="cmr-prm-final-icon" />
                  <p>Ao se tornar um comércio parceiro, você fortalece a economia local e ganha destaque como empresa socialmente responsável.</p>
                </div>
              </div>
            )}

            <div className="cmr-prm-form-navigation">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="cmr-prm-nav-btn cmr-prm-btn-prev">
                  <ChevronLeft size={20} />
                  <span>Anterior</span>
                </button>
              ) : (
                <Link to="/cadastro" className="cmr-prm-nav-btn cmr-prm-btn-cancel cmr-prm-cancel-left">Cancelar</Link>
              )}

              <div className="cmr-prm-nav-actions">
                {step < totalSteps ? (
                  <button type="button" onClick={handleNextStep} className="cmr-prm-nav-btn cmr-prm-btn-next">
                    <span>Avançar</span>
                    <ChevronRight size={24} />
                  </button>
                ) : (
                  <button type="submit" className="cmr-prm-nav-btn cmr-prm-btn-finish" disabled={isLoading}>
                    <span>{isLoading ? 'Enviando...' : 'Enviar para Análise'}</span>
                    <CheckCircle2 size={20} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>

      {toast.show && (
        <div className={`toast toast-${toast.type}`} style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: toast.type === 'error' ? '#ef4444' : '#10b981', color: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast({ show: false, message: '', type: 'error' })} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}
