import React, { useState, useEffect } from 'react';
import { 
  Users, ArrowLeft, User, Home, Users2, DollarSign, 
  ListChecks, MapPin, CheckCircle2, ChevronRight, 
  ChevronLeft, Fingerprint, IdCard, Calendar, 
  Phone, Mail, ShieldCheck, Trophy, 
  Zap, Info, Heart, Sparkles, Target, Sun, Moon, CloudSun, AlertTriangle, Coffee, X,
  Apple, BookOpen, Stethoscope, Hammer, Smile, Truck, Share2, Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PasswordField from '../../../components/ui/PasswordField';
import Toast from '../../../components/ui/Toast';
import ApiService from '../../../services/apiService';
import './CadastroFamiliaDesktop.css';
import '../../../styles/components/PasswordField.css';
import '../../../styles/components/Toast.css';
import { useCEP } from '../../AdminDashboard/useCEP';

export default function CadastroFamiliaDesktop() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [errors, setErrors] = useState({});
  const [familyCount, setFamilyCount] = useState({ criancas: 0, jovens: 0, adultos: 1, idosos: 0 });
  const [showNeedModal, setShowNeedModal] = useState(false);
  const [currentNeed, setCurrentNeed] = useState(null);
  const [tempDetail, setTempDetail] = useState('');
  const [needDetails, setNeedDetails] = useState({});
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    estadoCivil: '',
    profissao: '',
    cpf: '',
    rg: '',
    nis: '',
    rendaFamiliar: '',
    telefone: '',
    whatsapp: '',
    email: '',
    password: '',
    confirmPassword: '',
    horarioContato: '',
    endereco: '',
    bairro: '',
    pontoReferencia: '',
    cep: '',
    numero: '',
    cidade: '',
    estado: '',
    referencia: '',
    tipoMoradia: '',
    criancas: 0,
    jovens: 0,
    adultos: 1,
    idosos: 0,
    necessidades: []
  });

  const totalSteps = 6;
  const { loadingCep, formatCEP, searchCEP } = useCEP();
  
  const steps = [
    { id: 1, title: "Responsável", icon: <User size={22} /> },
    { id: 2, title: "Documentos", icon: <Fingerprint size={22} /> },
    { id: 3, title: "Contato", icon: <Phone size={22} /> },
    { id: 4, title: "Residência", icon: <MapPin size={22} /> },
    { id: 5, title: "Família", icon: <Users2 size={22} /> },
    { id: 6, title: "Necessidades", icon: <ListChecks size={22} /> },
  ];
  
  const familyTypes = [
    { label: 'Crianças (0-12)', icon: '👶', key: 'criancas' },
    { label: 'Jovens (13-17)', icon: '👦', key: 'jovens' },
    { label: 'Adultos (18-59)', icon: '👨', key: 'adultos' },
    { label: 'Idosos (60+)', icon: '👴', key: 'idosos' }
  ];

  const necessidadesOptions = [
    { label: "Alimentação Básica", icon: <Apple size={24} /> },
    { label: "Medicamentos", icon: <Stethoscope size={24} /> },
    { label: "Material Escolar", icon: <BookOpen size={24} /> },
    { label: "Roupas e Calçados", icon: <Smile size={24} /> },
    { label: "Móveis e Eletrodomésticos", icon: <Home size={24} /> },
    { label: "Transporte", icon: <Truck size={24} /> },
  ];

  const isValidCPF = (cpf) => {
    if (typeof cpf !== 'string') return false;
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
    const cpfDigits = cpf.split('').map(el => +el);
    const rest = (count) => (cpfDigits.slice(0, count - 12).reduce((soma, el, index) => soma + el * (count - index), 0) * 10) % 11 % 10;
    return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', color: '#e2e8f0', width: '0%' };
    const isValid = pass.length >= 6 && /[a-zA-Z]/.test(pass) && /\d/.test(pass);
    if (!isValid) return { label: 'Fraca', color: '#ef4444', width: '33%' };
    if (pass.length >= 8) return { label: 'Forte', color: '#10b981', width: '100%' };
    return { label: 'Média', color: '#f59e0b', width: '66%' };
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  
  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.nomeCompleto.trim() && formData.dataNascimento && formData.estadoCivil && formData.profissao.trim();
      case 2:
        return isValidCPF(formData.cpf) && formData.rg.trim() && formData.rendaFamiliar;
      case 3:
        return formData.telefone.replace(/\D/g, '').length >= 10 && formData.email.trim() && formData.password.length >= 6 && /[a-zA-Z]/.test(formData.password) && /\d/.test(formData.password) && formData.password === formData.confirmPassword;
      case 4:
        return formData.cep.replace(/\D/g, '').length === 8 &&
               formData.endereco.trim() !== '' &&
               formData.numero.trim() !== '' &&
               formData.bairro.trim() !== '' &&
               formData.cidade.trim() !== '' &&
               formData.estado.trim() !== '' &&
               formData.tipoMoradia !== '';
      default:
        return true;
    }
  };

  const getStepValidationErrors = (stepNumber) => {
    const newErrors = {};
    switch (stepNumber) {
      case 1:
        if (!formData.nomeCompleto.trim()) newErrors.nomeCompleto = true;
        if (!formData.dataNascimento) newErrors.dataNascimento = true;
        if (!formData.estadoCivil) newErrors.estadoCivil = true;
        if (!formData.profissao.trim()) newErrors.profissao = true;
        break;
      case 2:
        if (!isValidCPF(formData.cpf)) newErrors.cpf = true;
        if (!formData.rg.trim()) newErrors.rg = true;
        if (!formData.rendaFamiliar) newErrors.rendaFamiliar = true;
        break;
      case 3:
        if (!formData.telefone.trim() || formData.telefone.replace(/\D/g, '').length < 10) newErrors.telefone = true;
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = true;
        if (formData.password.length < 6 || !/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) newErrors.password = true;
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = true;
        break;
      case 4:
        if (formData.cep.replace(/\D/g, '').length !== 8) newErrors.cep = true;
        if (formData.endereco.trim() === '') newErrors.endereco = true;
        if (formData.numero.trim() === '') newErrors.numero = true;
        if (formData.bairro.trim() === '') newErrors.bairro = true;
        if (formData.cidade.trim() === '') newErrors.cidade = true;
        if (formData.estado.trim() === '') newErrors.estado = true;
        if (formData.tipoMoradia === '') newErrors.tipoMoradia = true;
        break;
      case 6:
        if (formData.necessidades.length === 0) newErrors.necessidades = true;
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

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return numbers.replace(/(\d{2})(\d+)/, '($1) $2');
    if (numbers.length <= 10) return numbers.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
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
        updateFormData('endereco', '');
        updateFormData('bairro', '');
        updateFormData('cidade', '');
        updateFormData('estado', '');
      } else {
        showToast('Endereço encontrado!', 'success');
        const { logradouro, bairro, localidade, uf } = result.data;
        updateFormData('endereco', logradouro || '');
        updateFormData('bairro', bairro || '');
        updateFormData('cidade', localidade || '');
        updateFormData('estado', uf || '');
      }
    }
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
    if (field === 'necessidades') {
      if (checked) {
        setCurrentNeed(value);
        setTempDetail(needDetails[value] || '');
        setShowNeedModal(true);
      }
      setFormData(prev => ({
        ...prev,
        [field]: checked 
          ? [...prev[field], value]
          : prev[field].filter(item => item !== value)
      }));
      if (!checked) {
        const newDetails = { ...needDetails };
        delete newDetails[value];
        setNeedDetails(newDetails);
      }
    }
  };
  
  const updateFamilyCount = (key, increment) => {
    const newCount = Math.max(0, familyCount[key] + increment);
    setFamilyCount(prev => ({ ...prev, [key]: newCount }));
    setFormData(prev => ({ ...prev, [key]: newCount }));
  };

  const saveNeedDetail = () => {
    setNeedDetails(prev => ({ ...prev, [currentNeed]: tempDetail }));
    setShowNeedModal(false);
    setCurrentNeed(null);
    setTempDetail('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = getStepValidationErrors(step);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Por favor, selecione pelo menos uma necessidade.', 'error');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      showToast('As senhas não coincidem', 'error');
      return;
    }
    
    if (formData.password.length < 6 || !/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      showToast('A senha deve ter pelo menos 6 caracteres, letras e números', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...dataToSend } = formData;
      dataToSend.subQuestionAnswers = needDetails;
      console.log('Dados sendo enviados para família:', dataToSend);
      
      const response = await ApiService.createFamilia(dataToSend);
      console.log('Resposta da API:', response);
      
      setIsSubmitted(true);
      showToast('Família cadastrada com sucesso! O administrador precisa liberar seu acesso.', 'success');
    } catch (error) {
      console.error('Erro ao cadastrar família:', error);
      showToast(`Erro ao realizar cadastro: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);

  if (isSubmitted) {
    return (
      <div className="fam-reg-container fam-reg-theme animate-fadeIn">
        <div className="floating-elements">
          <div className="float-shape s1-orange"></div>
          <div className="float-shape s2-orange"></div>
        </div>

        <div className="success-full-wrapper">
          <div className="success-hero-section">
            <div className="celebration-master-icon">
              <div className="icon-pulse-ring-orange"></div>
              <div className="icon-main-box-orange">
                <CheckCircle2 size={60} strokeWidth={2.5} />
              </div>
              <Sparkles className="sparkle-icon" size={24} style={{ color: '#f97316', position: 'absolute', top: '-5px', right: '-5px' }} />
            </div>
            
            <h1 className="success-main-title">
              Família <span className="text-gradient-orange">Registrada!</span>
            </h1>
            <p className="success-description">
              Sua família agora faz parte da rede de apoio. Prepare-se para receber ajuda!
            </p>
          </div>

          <div className="success-simple-card animate-slide-up">
            <div className="premium-status-banner-orange">
              <div className="status-info" style={{ flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}>
                <Rocket size={32} style={{ color: '#fb923c', margin: '0 auto' }} />
                <div>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Status: <span style={{ color: '#fb923c' }}>Família Ativa</span></h2>
                  <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>Seu perfil está visível para ONGs locais.</p>
                </div>
              </div>
              <Link to="/login" className="btn-go-home-orange" style={{ padding: '1rem 2rem', fontSize: '1rem', width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}>
                Acessar Painel
              </Link>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="stat-card-mini" style={{ padding: '1rem' }}>
                <Heart size={20} />
                <span style={{ fontSize: '0.7rem' }}>Apoio Local</span>
                <strong style={{ fontSize: '1rem' }}>+75 XP</strong>
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
    <div className="fam-reg-container fam-reg-theme">
      <div className="fam-reg-bg-blobs">
        <div className="fam-reg-blob-1" />
        <div className="fam-reg-blob-2" />
      </div>

      <nav className="fam-reg-navbar">
        <Link to="/" className="fam-reg-back-link">
          <div className="fam-reg-back-icon"><ArrowLeft size={20} /></div>
          <span>Voltar</span>
        </Link>
        <div className="fam-reg-brand">
          <div className="fam-reg-brand-logo">
            <Users size={24} />
          </div>
          <span className="fam-reg-brand-name">SolidarBairro <span style={{ color: '#f97316', fontSize: '0.8rem' }}>FAMÍLIA</span></span>
        </div>
      </nav>

      <div className="fam-reg-main-grid" style={{ marginTop: '3rem', maxWidth: '1280px', marginInline: 'auto' }}>
        <aside className="fam-reg-sidebar">
          <div className="fam-reg-steps-card" style={{ padding: '2rem' }}>
            <h2 className="fam-reg-steps-title" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>CADASTRO DE FAMÍLIA</h2>
            <div className="fam-reg-steps-list">
              {steps.map((s, i) => (
                <div key={s.id} className={`fam-reg-step-item ${step === s.id ? 'fam-reg-active' : step > s.id ? 'fam-reg-completed' : ''}`}>
                  <div className="fam-reg-step-icon-box">
                    {step > s.id ? <CheckCircle2 size={22} /> : s.icon}
                  </div>
                  <div className="fam-reg-step-info">
                    <span className="fam-reg-step-number" style={{ fontSize: '0.75rem' }}>PASSO 0{s.id}</span>
                    <span className="fam-reg-step-label" style={{ fontSize: '1rem' }}>{s.title}</span>
                  </div>
                  {i < steps.length - 1 && <div className="fam-reg-step-line" />}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="fam-reg-content-area">
          <div className="fam-reg-form-card animate-slide-up" style={{ padding: '2.5rem' }}>
            <div className="fam-reg-form-header" style={{ marginBottom: '2rem' }}>
              <div className="header-top">
                <span className="step-badge" style={{ fontSize: '0.85rem', padding: '0.35rem 1rem' }}>{steps.find(s => s.id === step)?.title}</span>
                <div className="fam-reg-progress-bar-bg">
                  <div className="fam-reg-progress-bar-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
                </div>
              </div>
              <h1 className="fam-reg-form-title" style={{ fontSize: '2rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
                {step === 1 && <>Dados do <span className="fam-reg-text-highlight">responsável</span></>}
                {step === 2 && <>Seus <span className="fam-reg-text-highlight">documentos</span></>}
                {step === 3 && <>Informações de <span className="fam-reg-text-highlight">contato</span></>}
                {step === 4 && <>Endereço da <span className="fam-reg-text-highlight">residência</span></>}
                {step === 5 && <>Composição <span className="fam-reg-text-highlight">familiar</span></>}
                {step === 6 && <>Suas <span className="fam-reg-text-highlight">necessidades</span></>}
              </h1>
              <p className="fam-reg-form-description" style={{ fontSize: '1.1rem' }}>
                {step === 1 && "Vamos começar com os dados básicos do responsável pela família."}
                {step === 2 && "Agora precisamos dos documentos para validação das informações."}
                {step === 3 && "Como podemos entrar em contato com vocês quando necessário?"}
                {step === 4 && "Onde sua família reside? Isso nos ajuda a encontrar ONGs próximas."}
                {step === 5 && "Conte-nos sobre a composição da sua família para melhor atendimento."}
                {step === 6 && "Quais são as principais necessidades da sua família no momento?"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="fam-reg-form-content">
              {step === 1 && (
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label className="field-label">Nome Completo <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="input-with-icon">
                      <User className="field-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className="form-input" 
                        placeholder="Seu nome completo"
                        style={errors.nomeCompleto ? { borderColor: '#ef4444' } : {}}
                        value={formData.nomeCompleto}
                        onChange={(e) => updateFormData('nomeCompleto', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="field-label">Data de Nascimento <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="input-with-icon">
                      <Calendar className="field-icon" size={20} />
                      <input 
                        required 
                        type="date" 
                        className="form-input"
                        style={errors.dataNascimento ? { borderColor: '#ef4444' } : {}}
                        value={formData.dataNascimento}
                        onChange={(e) => updateFormData('dataNascimento', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="field-label">Estado Civil <span style={{ color: '#ef4444' }}>*</span></label>
                    <select 
                      required 
                      className="form-input" 
                      style={{ paddingLeft: '1rem', ...(errors.estadoCivil && { borderColor: '#ef4444' }) }}
                      value={formData.estadoCivil}
                      onChange={(e) => updateFormData('estadoCivil', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="solteiro">Solteiro(a)</option>
                      <option value="casado">Casado(a)</option>
                      <option value="divorciado">Divorciado(a)</option>
                      <option value="viuvo">Viúvo(a)</option>
                    </select>
                  </div>
                  <div className="form-group span-2">
                    <label className="field-label">Profissão / Ocupação <span style={{ color: '#ef4444' }}>*</span></label>
                    <input 
                      required 
                      type="text" 
                      className="form-input" 
                      style={{ paddingLeft: '1rem', ...(errors.profissao && { borderColor: '#ef4444' }) }}
                      placeholder="Ex: Diarista, Vendedor, Desempregado, etc."
                      value={formData.profissao}
                      onChange={(e) => updateFormData('profissao', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-grid">
                  <div className="form-group">
                    <label className="field-label">CPF <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="input-with-icon">
                      <Fingerprint className="field-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className="form-input" 
                        style={errors.cpf ? { borderColor: '#ef4444' } : {}}
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={handleCPFChange}
                        maxLength={14}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="field-label">RG <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="input-with-icon">
                      <IdCard className="field-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className="form-input" 
                        style={errors.rg ? { borderColor: '#ef4444' } : {}}
                        placeholder="00.000.000-0"
                        value={formData.rg}
                        onChange={handleRGChange}
                        maxLength={14}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="field-label">NIS (Opcional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="00000000000"
                      value={formData.nis}
                      onChange={(e) => updateFormData('nis', e.target.value)}
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Renda Familiar <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="input-with-icon">
                      <DollarSign className="field-icon" size={20} />
                      <select 
                        required 
                        className="form-input"
                        style={errors.rendaFamiliar ? { borderColor: '#ef4444' } : {}}
                        value={formData.rendaFamiliar}
                        onChange={(e) => updateFormData('rendaFamiliar', e.target.value)}
                      >
                        <option value="">Selecione</option>
                        <option value="sem-renda">Sem renda</option>
                        <option value="ate-1-salario">Até 1 salário mínimo</option>
                        <option value="1-a-2-salarios">1 a 2 salários mínimos</option>
                        <option value="2-a-3-salarios">2 a 3 salários mínimos</option>
                        <option value="acima-3-salarios">Acima de 3 salários</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-info-box span-2">
                    <div className="info-icon-box">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h4 className="info-title">Dados Protegidos</h4>
                      <p className="info-text">Suas informações são mantidas em sigilo e usadas apenas para conectar sua família com ONGs adequadas.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="form-grid">
                  <div className="form-group">
                    <label className="field-label">Telefone <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="input-with-icon">
                      <Phone className="field-icon" size={20} />
                      <input 
                        required 
                        type="tel" 
                        className="form-input" 
                        style={errors.telefone ? { borderColor: '#ef4444' } : {}}
                        placeholder="(00) 00000-0000"
                        value={formData.telefone}
                        onChange={handlePhoneChange}
                        maxLength={15}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="field-label">E-mail <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="input-with-icon">
                      <Mail className="field-icon" size={20} />
                      <input 
                        required 
                        type="email" 
                        className="form-input" 
                        style={errors.email ? { borderColor: '#ef4444' } : {}}
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                      />
                    </div>
                  </div>
                  <PasswordField 
                    label="Senha de Acesso"
                    placeholder="Crie uma senha segura"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    required
                    error={errors.password}
                  />
                  {formData.password && (
                    <div style={{ marginTop: '-10px', marginBottom: '15px', padding: '0 4px' }}>
                      <div style={{ height: '4px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: strength.width, backgroundColor: strength.color, transition: 'all 0.3s ease' }} />
                      </div>
                      <span style={{ fontSize: '11px', color: strength.color, marginTop: '4px', display: 'block', textAlign: 'right', fontWeight: '600' }}>{strength.label}</span>
                    </div>
                  )}
                  <PasswordField 
                    label="Confirmar Senha"
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    required
                  />
                  {formData.confirmPassword && (
                    <div style={{ marginTop: '-10px', marginBottom: '15px', fontSize: '0.8rem', textAlign: 'right', fontWeight: '600', color: formData.password === formData.confirmPassword ? '#10b981' : '#ef4444' }}>
                      {formData.password === formData.confirmPassword ? 'Senhas conferem' : 'Senhas não conferem'}
                    </div>
                  )}
                  <div className="form-group span-2">
                    <label className="field-label">Melhor horário para contato</label>
                    <select 
                      className="form-input"
                      value={formData.horarioContato}
                      onChange={(e) => updateFormData('horarioContato', e.target.value)}
                      style={{ paddingLeft: '1rem' }}
                    >
                      <option value="">Selecione</option>
                      <option value="manha">Manhã (8h às 12h)</option>
                      <option value="tarde">Tarde (12h às 18h)</option>
                      <option value="noite">Noite (18h às 22h)</option>
                      <option value="qualquer">Qualquer horário</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="form-grid">
                  <div className="form-group">
                    <label className="field-label">CEP <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="input-with-icon">
                      <MapPin className="field-icon" size={20} />
                      <input
                        required
                        type="text"
                        className="form-input"
                        style={errors.cep ? { borderColor: '#ef4444' } : {}}
                        placeholder="00000-000"
                        value={formData.cep}
                        onChange={(e) => updateFormData('cep', formatCEP(e.target.value))}
                        onBlur={handleCepBlur}
                        maxLength={9}
                      />
                      {loadingCep && <div className="spinner" />}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="field-label">Endereço (Rua, Av.) <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      required
                      type="text"
                      className="form-input"
                      style={errors.endereco ? { borderColor: '#ef4444' } : {}}
                      placeholder="Sua rua ou avenida"
                      value={formData.endereco}
                      onChange={(e) => updateFormData('endereco', e.target.value)}
                      disabled={loadingCep}
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Número <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      required
                      type="text"
                      className="form-input"
                      style={errors.numero ? { borderColor: '#ef4444' } : {}}
                      placeholder="Nº"
                      value={formData.numero}
                      onChange={(e) => updateFormData('numero', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Bairro <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      required
                      type="text"
                      className="form-input"
                      style={errors.bairro ? { borderColor: '#ef4444' } : {}}
                      placeholder="Seu bairro"
                      value={formData.bairro}
                      onChange={(e) => updateFormData('bairro', e.target.value)}
                      disabled={loadingCep}
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Cidade <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      required
                      className="form-input"
                      style={errors.cidade ? { borderColor: '#ef4444' } : {}}
                      placeholder="Sua cidade"
                      value={formData.cidade}
                      onChange={(e) => updateFormData('cidade', e.target.value)}
                      disabled={loadingCep}
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Estado <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      required
                      type="text"
                      className="form-input"
                      style={errors.estado ? { borderColor: '#ef4444' } : {}}
                      placeholder="UF"
                      value={formData.estado}
                      onChange={(e) => updateFormData('estado', e.target.value)}
                      disabled={loadingCep}
                    />
                  </div>
                  <div className="form-group span-2">
                    <label className="field-label">Complemento / Ponto de Referência</label>
                    <input
                      type="text"
                      placeholder="Apto, bloco, próximo a..."
                      value={formData.referencia}
                      onChange={(e) => updateFormData('referencia', e.target.value)}
                    />
                  </div>
                  <div className="form-group span-2">
                    <label className="field-label">Tipo de Moradia <span style={{ color: '#ef4444' }}>*</span></label>
                    <select 
                      required 
                      className="form-input" 
                      style={{ paddingLeft: '1rem', ...(errors.tipoMoradia && { borderColor: '#ef4444' }) }}
                      value={formData.tipoMoradia}
                      onChange={(e) => updateFormData('tipoMoradia', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="casa-propria">Casa própria</option>
                      <option value="casa-alugada">Casa alugada</option>
                      <option value="apartamento">Apartamento</option>
                      <option value="barraco">Barraco</option>
                      <option value="cortico">Cortiço</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                </div>
              )}
              {step === 5 && (
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label className="field-label">Quantas pessoas moram na casa?</label>
                    <div className="selectable-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                      {familyTypes.map((item) => (
                        <div key={item.key} className="family-counter-card">
                          <div className="family-card-header">
                            <span className="family-card-emoji">{item.icon}</span>
                            <span className="family-card-label">{item.label}</span>
                          </div>
                          <div className="family-counter">
                            <button 
                              type="button" 
                              className="counter-btn counter-minus"
                              onClick={() => updateFamilyCount(item.key, -1)}
                              disabled={familyCount[item.key] === 0}
                            >
                              -
                            </button>
                            <span className="counter-display">{familyCount[item.key]}</span>
                            <button 
                              type="button" 
                              className="counter-btn counter-plus"
                              onClick={() => updateFamilyCount(item.key, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label className="field-label">Quais são suas principais necessidades?</label>
                    <div className="selectable-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                      {necessidadesOptions.map((opt) => (
                        <label key={opt.label} className="selectable-item">
                          <input 
                            type="checkbox" 
                            name="necessidades" 
                            value={opt.label}
                            checked={formData.necessidades.includes(opt.label)}
                            onChange={(e) => handleCheckboxChange('necessidades', opt.label, e.target.checked)}
                          />
                          <div className="selectable-card">
                            <div className="selectable-card-icon">{opt.icon}</div>
                            <span className="selectable-card-text">{opt.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-final-box span-2">
                    <Heart size={48} className="final-icon" />
                    <p>Ao cadastrar sua família, você se conecta com uma rede de apoio que pode ajudar nas suas necessidades mais urgentes.</p>
                  </div>
                </div>
              )}

              <div className="fam-reg-form-footer">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="fam-reg-btn-prev">
                    <ChevronLeft size={20} />
                    Anterior
                  </button>
                ) : (
                  <div />
                )}
                
                <div className="nav-actions" style={{ display: 'flex', gap: '1rem' }}>
                  {step === 1 && <Link to="/" className="btn-cancel">Cancelar</Link>}
                  
                  {step < totalSteps ? (
                    <button type="button" onClick={handleNextStep} className="fam-reg-btn-next">
                      <span>Avançar</span>
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button type="submit" className="fam-reg-btn-finish" disabled={isLoading}>
                      <span>{isLoading ? 'Cadastrando...' : 'Finalizar Cadastro'}</span>
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

      {showNeedModal && (
        <div className="fam-reg-modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="fam-reg-modal" style={{
            background: 'white', padding: '24px', borderRadius: '16px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div className="fam-reg-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>Especificar: {currentNeed}</h3>
              <button onClick={() => setShowNeedModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div className="fam-reg-modal-body">
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569' }}>Detalhes (opcional):</label>
              <textarea 
                value={tempDetail} 
                onChange={(e) => setTempDetail(e.target.value)}
                placeholder="Ex: Tamanho, tipo, restrições alimentares..."
                rows={4}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '1rem' }}
              />
            </div>
            <div className="fam-reg-modal-footer" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={saveNeedDetail} style={{
                padding: '12px 24px', background: '#f97316', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer'
              }}>
                Salvar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}