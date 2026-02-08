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
import PasswordField from '../../../components/ui/PasswordField';
import Toast from '../../../components/ui/Toast';
import TermsCheckbox from '../../../components/ui/TermsCheckbox';
import ApiService from '../../../services/apiService';
import './CadastroCidadao.css';
import '../../../styles/components/PasswordField.css';
import '../../../styles/components/Toast.css';
import { useCEP } from '../../AdminDashboard/useCEP';

export default function CadastroCidadao() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    ocupacao: '',
    cpf: '',
    rg: '',
    telefone: '',
    email: '',
    password: '',
    confirmPassword: '',
    endereco: '',
    cep: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    referencia: '',
    disponibilidade: [],
    interesses: [],
    proposito: '',
    termosAceitos: false
  });
  const totalSteps = 6;
  const { loadingCep, formatCEP, searchCEP } = useCEP();

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.nome.trim() && formData.dataNascimento && formData.ocupacao.trim();
      case 2:
        return formData.cpf.replace(/\D/g, '').length >= 11 && formData.rg.replace(/\D/g, '').length >= 7;
      case 3:
        return formData.telefone.replace(/\D/g, '').length >= 10 &&
               formData.email.trim() &&
               formData.password.length >= 6 &&
               formData.password === formData.confirmPassword;
      case 4:
        return formData.cep.replace(/\D/g, '').length === 8 &&
               formData.endereco.trim() !== '' &&
               formData.numero.trim() !== '' &&
               formData.bairro.trim() !== '' &&
               formData.cidade.trim() !== '' &&
               formData.estado.trim() !== '';
      case 5:
        return formData.interesses.length > 0;
      default:
        return true;
    }
  };

  const getStepValidationErrors = (stepNumber) => {
    const newErrors = {};
    switch (stepNumber) {
      case 1:
        if (!formData.nome.trim()) newErrors.nome = true;
        if (!formData.dataNascimento) newErrors.dataNascimento = true;
        if (!formData.ocupacao.trim()) newErrors.ocupacao = true;
        break;
      case 2:
        if (formData.cpf.replace(/\D/g, '').length < 11) newErrors.cpf = true;
        if (formData.rg.replace(/\D/g, '').length < 7) newErrors.rg = true;
        break;
      case 3:
        if (formData.telefone.replace(/\D/g, '').length < 10) newErrors.telefone = true;
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = true;
        if (formData.password.length < 6) newErrors.password = true;
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = true;
        break;
      case 4:
        if (formData.cep.replace(/\D/g, '').length !== 8) newErrors.cep = true;
        if (formData.endereco.trim() === '') newErrors.endereco = true;
        if (formData.numero.trim() === '') newErrors.numero = true;
        if (formData.bairro.trim() === '') newErrors.bairro = true;
        if (formData.cidade.trim() === '') newErrors.cidade = true;
        if (formData.estado.trim() === '') newErrors.estado = true;
        break;
      case 5:
        if (formData.interesses.length === 0) newErrors.interesses = true;
        break;
      default:
        break;
    }
    return newErrors;
  };

  const handleNextStep = () => {
    const validationErrors = getStepValidationErrors(step);
    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      nextStep();
    } else {
      setErrors(validationErrors);
      showToast('Por favor, preencha os campos destacados.', 'error');
    }
  };

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
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

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d+)/, '$1.$2');
    if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatRG = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return numbers.replace(/(\d{2})(\d+)/, '$1.$2');
    if (numbers.length <= 8) return numbers.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
    if (numbers.length <= 9) return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      updateFormData('cpf', formatCPF(value));
    }
  };

  const handleRGChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      updateFormData('rg', formatRG(value));
    }
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return numbers.replace(/(\d{2})(\d+)/, '($1) $2');
    if (numbers.length <= 10) return numbers.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      updateFormData('telefone', formatPhone(value));
    }
  };

  const handleCepBlur = async (e) => {
    const result = await searchCEP(e.target.value);
    if (result) {
      if (result.error) {
        showToast(result.error, 'error');
        setFormData(prev => ({
          ...prev, endereco: '', bairro: '', cidade: '', estado: '',
        }));
      } else {
        showToast('Endereço encontrado!', 'success');
        const { logradouro, bairro, localidade, uf } = result.data;
        setFormData(prev => ({
          ...prev,
          endereco: logradouro || '',
          bairro: bairro || '',
          cidade: localidade || '',
          estado: uf || '',
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar senhas
    if (formData.password !== formData.confirmPassword) {
      showToast('As senhas não coincidem', 'error');
      return;
    }
    
    if (formData.password.length < 6) {
      showToast('A senha deve ter pelo menos 6 caracteres', 'error');
      return;
    }

    if (!formData.termosAceitos) {
      showToast('Você deve aceitar os Termos de Uso e Política de Privacidade.', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Preparar dados para envio (remover confirmPassword e renomear password para senha)
      const { confirmPassword, password, ...dataToSend } = formData;
      const dataWithSenha = { ...dataToSend, senha: password };
      console.log('Dados sendo enviados para cidadão:', dataWithSenha);

      const response = await ApiService.createCidadao(dataWithSenha);
      console.log('Resposta da API:', response);
      
      setIsSubmitted(true);
      showToast('Cadastro realizado com sucesso! Você já pode acessar o sistema.', 'success');
    } catch (error) {
      console.error('Erro ao cadastrar cidadão:', error);
      showToast(`Erro ao realizar cadastro: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Perfil", icon: <User size={22} /> },
    { id: 2, title: "Identidade", icon: <Fingerprint size={22} /> },
    { id: 3, title: "Contato", icon: <Phone size={22} /> },
    { id: 4, title: "Local", icon: <MapPin size={22} /> },
    { id: 5, title: "Interesses", icon: <Target size={22} /> },
    { id: 6, title: "Impacto", icon: <Sparkles size={22} /> },
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
      <div className="cidadao-cadastro-container cidadao-theme animate-fadeIn">
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
      </div>
    );
  }

  return (
    <div className="cidadao-cadastro-container cidadao-theme">
      <div className="cidadao-bg-blobs">
        <div className="cidadao-blob cidadao-blob-1" />
        <div className="cidadao-blob cidadao-blob-2" />
      </div>

      <nav className="cidadao-top-nav">
        <Link to="/" className="cidadao-back-link">
          <div className="cidadao-back-icon-box"><ArrowLeft size={20} /></div>
          <span>Voltar</span>
        </Link>
        <div className="cidadao-nav-brand">
          <div className="cidadao-brand-icon-box">
            <Heart size={24} />
          </div>
          <span className="cidadao-brand-text">SolidarBairro <span className="brand-highlight">VOLUNTÁRIO</span></span>
        </div>
      </nav>

      <div className="cidadao-main-layout">
        <aside className="sidebar-stepper">
          <div className="stepper-card">
            <h2 className="stepper-title">CADASTRO DE VOLUNTÁRIO</h2>
            <div className="stepper-list">
              {steps.map((s, i) => (
                <div key={s.id} className={`stepper-item ${step === s.id ? 'active' : step > s.id ? 'completed' : ''}`}>
                  <div className="stepper-icon">
                    {step > s.id ? <CheckCircle2 size={22} /> : s.icon}
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

            <form onSubmit={step === totalSteps ? handleSubmit : (e) => e.preventDefault()} className="form-content">
              {step === 1 && (
                <div className="form-grid">
                  <div className="form-group col-span-12">
                    <label className="field-label">Nome Completo <span className="required-asterisk">*</span></label>
                    <div className="input-with-icon">
                      <User className="field-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className={`form-input ${errors.nome ? 'input-error' : ''}`}
                        placeholder="Seu nome completo"
                        value={formData.nome}
                        onChange={(e) => updateFormData('nome', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group col-span-6">
                    <label className="field-label">Data de Nascimento <span className="required-asterisk">*</span></label>
                    <div className="input-with-icon">
                      <Calendar className="field-icon" size={20} />
                      <input 
                        required 
                        type="date" 
                        className={`form-input ${errors.dataNascimento ? 'input-error' : ''}`}
                        value={formData.dataNascimento}
                        onChange={(e) => updateFormData('dataNascimento', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group col-span-6">
                    <label className="field-label">Ocupação / Habilidade <span className="required-asterisk">*</span></label>
                    <input 
                      required 
                      type="text" 
                      className={`form-input ${errors.ocupacao ? 'input-error' : ''}`}
                      placeholder="Ex: Professor, Médico, etc."
                      value={formData.ocupacao}
                      onChange={(e) => updateFormData('ocupacao', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-grid">
                  <div className="form-group col-span-6">
                    <label className="field-label">CPF <span className="required-asterisk">*</span></label>
                    <div className="input-with-icon">
                      <Fingerprint className="field-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className={`form-input ${errors.cpf ? 'input-error' : ''}`}
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={handleCPFChange}
                        maxLength={14}
                      />
                    </div>
                  </div>
                  <div className="form-group col-span-6">
                    <label className="field-label">RG <span className="required-asterisk">*</span></label>
                    <input 
                      required 
                      type="text" 
                      className={`form-input ${errors.rg ? 'input-error' : ''}`}
                      placeholder="00.000.000-0 ou 000.000.000-00"
                      value={formData.rg}
                      onChange={handleRGChange}
                      maxLength={14}
                    />
                  </div>
                  <div className="form-info-box col-span-12">
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
                  <div className="form-group col-span-6">
                    <label className="field-label">WhatsApp <span className="required-asterisk">*</span></label>
                    <div className="input-with-icon">
                      <Phone className="field-icon" size={20} />
                      <input 
                        required 
                        type="tel" 
                        className={`form-input ${errors.telefone ? 'input-error' : ''}`}
                        placeholder="(00) 00000-0000"
                        value={formData.telefone}
                        onChange={handlePhoneChange}
                        maxLength={15}
                      />
                    </div>
                  </div>
                  <div className="form-group col-span-6">
                    <label className="field-label">E-mail <span className="required-asterisk">*</span></label>
                    <div className="input-with-icon">
                      <Mail className="field-icon" size={20} />
                      <input 
                        required 
                        type="email" 
                        className={`form-input ${errors.email ? 'input-error' : ''}`}
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group col-span-6">
                  <PasswordField 
                    label="Senha de Acesso"
                    placeholder="Crie uma senha segura"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    required
                    error={errors.password}
                  />
                  </div>
                  <div className="form-group col-span-6">
                  <PasswordField 
                    label="Confirmar Senha"
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    required
                  />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="form-grid">
                  <div className="form-group col-span-3">
                    <label className="field-label">CEP <span className="required-asterisk">*</span></label>
                    <div className={`input-with-icon ${loadingCep ? 'searching' : ''}`}>
                      <MapPin className="field-icon" size={20} />
                      <input
                        required
                        type="text"
                        className={`form-input ${errors.cep ? 'input-error' : ''}`}
                        placeholder="00000-000"
                        value={formData.cep}
                        onChange={(e) => {
                          const value = formatCEP(e.target.value);
                          updateFormData('cep', value);
                          if (value.length === 9) {
                            handleCepBlur({ target: { value } });
                          }
                        }}
                        onBlur={handleCepBlur}
                        maxLength={9}
                      />
                      <div className="search-badge">Procurando...</div>
                    </div>
                  </div>
                  <div className="form-group col-span-6">
                    <label className="field-label">Endereço (Rua, Av.) <span className="required-asterisk">*</span></label>
                    <input
                      required
                      type="text"
                      className={`form-input ${errors.endereco ? 'input-error' : ''}`}
                      placeholder="Sua rua ou avenida"
                      value={formData.endereco}
                      onChange={(e) => updateFormData('endereco', e.target.value)}
                      disabled={loadingCep}
                    />
                  </div>
                  <div className="form-group col-span-3">
                    <label className="field-label">Número <span className="required-asterisk">*</span></label>
                    <input
                      required
                      type="text"
                      className={`form-input ${errors.numero ? 'input-error' : ''}`}
                      placeholder="Nº"
                      value={formData.numero}
                      onChange={(e) => updateFormData('numero', e.target.value)}
                    />
                  </div>
                  <div className="form-group col-span-4">
                    <label className="field-label">Bairro <span className="required-asterisk">*</span></label>
                    <input
                      required
                      type="text"
                      className={`form-input ${errors.bairro ? 'input-error' : ''}`}
                      placeholder="Seu bairro"
                      value={formData.bairro}
                      onChange={(e) => updateFormData('bairro', e.target.value)}
                      disabled={loadingCep}
                    />
                  </div>
                  <div className="form-group col-span-5">
                    <label className="field-label">Cidade <span className="required-asterisk">*</span></label>
                    <input
                      required
                      type="text"
                      className={`form-input ${errors.cidade ? 'input-error' : ''}`}
                      placeholder="Sua cidade"
                      value={formData.cidade}
                      onChange={(e) => updateFormData('cidade', e.target.value)}
                      disabled={loadingCep}
                    />
                  </div>
                  <div className="form-group col-span-3">
                    <label className="field-label">Estado <span className="required-asterisk">*</span></label>
                    <input
                      required
                      type="text"
                      className={`form-input ${errors.estado ? 'input-error' : ''}`}
                      placeholder="UF"
                      value={formData.estado}
                      onChange={(e) => updateFormData('estado', e.target.value)}
                      disabled={loadingCep}
                    />
                  </div>
                  <div className="form-group col-span-12">
                    <label className="field-label">Complemento / Ponto de Referência</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Apto, bloco, casa, etc."
                      value={formData.referencia}
                      onChange={(e) => updateFormData('referencia', e.target.value)}
                    />
                  </div>
                  <div className="form-group col-span-12">
                    <label className="field-label">Disponibilidade</label>
                    <div className="selectable-grid-container">
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
                  <div className="form-group col-span-12">
                    <label className={`field-label ${errors.interesses ? 'text-error' : ''}`}>Como você quer ajudar? <span className="required-asterisk">*</span></label>
                    <div className={`selectable-grid-container ${errors.interesses ? 'grid-error' : ''}`}>
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
                  <div className="form-group col-span-12">
                    <label className="field-label">Conte seu propósito (Opcional)</label>
                    <textarea 
                      className="form-input" 
                      placeholder="Por que você quer ser voluntário?" 
                      rows={4}
                      value={formData.proposito}
                      onChange={(e) => updateFormData('proposito', e.target.value)}
                    ></textarea>
                  </div>
                  <div className="form-group col-span-12">
                    <TermsCheckbox 
                      checked={formData.termosAceitos}
                      onChange={(checked) => updateFormData('termosAceitos', checked)}
                    />
                  </div>
                  <div className="form-final-box col-span-12">
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

                <div className="nav-actions">
                  {step === 1 && <Link to="/" className="btn-cancel">Cancelar</Link>}

                  {step < totalSteps ? (
                    <>
                      {!validateStep(step) && (
                        <div className="validation-message">
                          Preencha todos os campos obrigatórios para continuar
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className={`btn-next ${!validateStep(step) ? 'btn-disabled' : ''}`}
                        disabled={!validateStep(step)}
                      >
                        <span>Avançar</span>
                        <ChevronRight size={20} />
                      </button>
                    </>
                  ) : (
                    <button type="submit" className="btn-finish" disabled={isLoading || !formData.termosAceitos}>
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

      {/* Toast */}
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'error' })}
      />
      
      {/* Loading Modal */}
      {loadingCep && (
        <div className="modal-overlay-loading">
          <div className="modal-loading-content">
            <div className="spinner-large"></div>
            <h3>Buscando endereço...</h3>
            <p>Aguarde enquanto localizamos o CEP.</p>
          </div>
        </div>
      )}
    </div>
  );
}