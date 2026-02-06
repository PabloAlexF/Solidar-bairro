import React, { useState } from 'react';
import { 
  User, ArrowLeft, Heart, Zap, 
  MapPin, CheckCircle2, ChevronRight, 
  ChevronLeft, Fingerprint, Calendar, 
  Phone, Mail, ShieldCheck, Trophy, 
  Award, Info, Sparkles, Target, Home,
  Sun, Moon, CloudSun, AlertTriangle, Coffee,
  Apple, BookOpen, Stethoscope, Hammer, Smile, Truck,
  Share2, Rocket, Search, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PasswordField from '../../../components/ui/PasswordField';
import ApiService from '../../../services/apiService';
import TermsCheckbox from '../../../components/ui/TermsCheckbox';
import './CadastroCidadaoMobile.css';
import '../../../styles/components/PasswordField.css';
import '../../../styles/components/Toast.css';
import { useCEP } from '../../AdminDashboard/useCEP';

export default function CadastroCidadaoMobile() {
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
    cep: '',
    endereco: '', // rua
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
        setFormData(prev => ({ ...prev, endereco: '', bairro: '', cidade: '', estado: '' }));
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
      if (step < totalSteps) {
        handleNextStep();
      }
    }
  };

  const handleSubmit = async () => {
    if (step !== totalSteps) return;

    if (formData.password !== formData.confirmPassword) {
      showToast('As senhas não coincidem.', 'error');
      return;
    }
    if (formData.password.length < 6) {
      showToast('A senha deve ter pelo menos 6 caracteres.', 'error');
      return;
    }

    if (!formData.termosAceitos) {
      showToast('Você deve aceitar os Termos de Uso e Política de Privacidade.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, password, ...dataToSend } = formData;
      const dataWithSenha = { ...dataToSend, senha: password };

      await ApiService.createCidadao(dataWithSenha);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erro ao cadastrar cidadão:', error);
      showToast(error.message || 'Erro ao realizar cadastro. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Perfil", icon: <User size={20} /> },
    { id: 2, title: "Identidade", icon: <Fingerprint size={20} /> },
    { id: 3, title: "Contato", icon: <Phone size={20} /> },
    { id: 4, title: "Local", icon: <MapPin size={20} /> },
    { id: 5, title: "Interesses", icon: <Target size={20} /> },
    { id: 6, title: "Impacto", icon: <Sparkles size={20} /> },
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

  return (
    <div className="mobile-vlt-container mobile-vlt-theme">
      <div className="mobile-vlt-bg-blobs">
        <div className="mobile-vlt-blob mobile-vlt-blob-1" />
        <div className="mobile-vlt-blob mobile-vlt-blob-2" />
      </div>

      <nav className="mobile-vlt-top-nav">
        <Link to="/cadastro" className="mobile-vlt-back-link">
          <div className="mobile-vlt-back-icon-box"><ArrowLeft size={20} /></div>
          <span>Voltar</span>
        </Link>
        <div className="mobile-vlt-header-badge">VOLUNTÁRIO</div>
      </nav>

      <div className="mobile-vlt-main-layout">
        <main className="mobile-vlt-form-main">
          <div className="mobile-vlt-form-container mobile-vlt-animate-up">
            <div className="mobile-vlt-form-header">
              <div className="mobile-vlt-header-top">
                <span className="mobile-vlt-step-badge">{steps.find(s => s.id === step)?.title}</span>
                <div className="mobile-vlt-progress-bar">
                  <div className="mobile-vlt-progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
                </div>
              </div>
              <h1 className="mobile-vlt-main-title">
                {step === 1 && <>Qual o seu <span className="mobile-vlt-text-highlight">perfil</span>?</>}
                {step === 2 && <>Sua <span className="mobile-vlt-text-highlight">identidade</span></>}
                {step === 3 && <>Canais de <span className="mobile-vlt-text-highlight">contato</span></>}
                {step === 4 && <>Onde você <span className="mobile-vlt-text-highlight">atua</span>?</>}
                {step === 5 && <>Seus <span className="mobile-vlt-text-highlight">interesses</span></>}
                {step === 6 && <>Seu <span className="mobile-vlt-text-highlight">propósito</span></>}
              </h1>
              <p className="mobile-vlt-subtitle">
                {step === 1 && "Conte-nos quem você é para começarmos sua jornada voluntária."}
                {step === 2 && "A segurança é prioridade. Validamos todos os voluntários da nossa rede."}
                {step === 3 && "Como podemos falar com você sobre oportunidades de ajuda?"}
                {step === 4 && "Informe seu endereço ou região onde prefere realizar as ações."}
                {step === 5 && "Selecione as áreas onde suas habilidades podem ser mais úteis."}
                {step === 6 && "Defina como você pretende impactar o seu bairro hoje."}
              </p>
            </div>

            <form className="mobile-vlt-form-content" onKeyDown={handleKeyDown}>
              {step === 1 && (
                <div className="mobile-vlt-form-grid">
                  <div className="mobile-vlt-span-2">
                    <label className="mobile-vlt-label">Nome Completo <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="mobile-vlt-input-wrapper">
                      <User className="mobile-vlt-input-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className="mobile-vlt-input" 
                        placeholder="Seu nome completo" 
                        style={errors.nome ? { borderColor: '#ef4444' } : {}}
                        value={formData.nome}
                        onChange={(e) => updateFormData('nome', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mobile-vlt-label">Data de Nascimento <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="mobile-vlt-input-wrapper">
                      <Calendar className="mobile-vlt-input-icon" size={20} />
                      <input 
                        required 
                        type="date" 
                        className="mobile-vlt-input"
                        style={errors.dataNascimento ? { borderColor: '#ef4444' } : {}}
                        value={formData.dataNascimento}
                        onChange={(e) => updateFormData('dataNascimento', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mobile-vlt-label">Ocupação / Habilidade <span style={{ color: '#ef4444' }}>*</span></label>
                    <input 
                      required 
                      type="text" 
                      className="mobile-vlt-input" 
                      style={{ paddingLeft: '1rem', ...(errors.ocupacao && { borderColor: '#ef4444' }) }}
                      placeholder="Ex: Professor, Médico, etc."
                      value={formData.ocupacao}
                      onChange={(e) => updateFormData('ocupacao', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="mobile-vlt-form-grid">
                  <div>
                    <label className="mobile-vlt-label">CPF <span className="mobile-vlt-required">*</span></label>
                    <div className="mobile-vlt-input-wrapper">
                      <Fingerprint className="mobile-vlt-input-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className={`mobile-vlt-input ${errors.cpf ? 'mobile-vlt-input-error' : ''}`}
                        placeholder="000.000.000-00" 
                        value={formData.cpf}
                        onChange={handleCPFChange}
                        maxLength={14}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mobile-vlt-label">RG <span className="mobile-vlt-required">*</span></label>
                    <input 
                      required 
                      type="text" 
                      className={`mobile-vlt-input mobile-vlt-pl-4 ${errors.rg ? 'mobile-vlt-input-error' : ''}`}
                      placeholder="00.000.000-0 ou 000.000.000-00"
                      value={formData.rg}
                      onChange={handleRGChange}
                      maxLength={14}
                    />
                  </div>
                  <div className="mobile-vlt-info-box mobile-vlt-span-2">
                    <div className="mobile-vlt-info-icon-box">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <h4 className="mobile-vlt-info-title">Rede Segura</h4>
                      <p className="mobile-vlt-info-text">Sua identidade é mantida em sigilo e serve apenas para garantir a idoneidade das ações.</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="mobile-vlt-form-grid">
                  <div>
                    <label className="mobile-vlt-label">WhatsApp <span className="mobile-vlt-required">*</span></label>
                    <div className="mobile-vlt-input-wrapper">
                      <Phone className="mobile-vlt-input-icon" size={20} />
                      <input 
                        required 
                        type="tel" 
                        className={`mobile-vlt-input ${errors.telefone ? 'mobile-vlt-input-error' : ''}`}
                        placeholder="(00) 00000-0000" 
                        value={formData.telefone}
                        onChange={handlePhoneChange}
                        maxLength={15}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mobile-vlt-label">E-mail <span className="mobile-vlt-required">*</span></label>
                    <div className="mobile-vlt-input-wrapper">
                      <Mail className="mobile-vlt-input-icon" size={20} />
                      <input 
                        required 
                        type="email" 
                        className={`mobile-vlt-input ${errors.email ? 'mobile-vlt-input-error' : ''}`}
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
                    error={errors.password}
                    required
                  />
                  <PasswordField 
                    label="Confirmar Senha"
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    required
                  />
                </div>
              )}

              {step === 4 && (
                <div className="mobile-vlt-form-grid" style={{ rowGap: '1rem' }}>
                  <div className="mobile-vlt-span-2">
                    <label className="mobile-vlt-label">CEP <span style={{ color: '#ef4444' }}>*</span></label>
                    <div className="mobile-vlt-input-wrapper">
                      <Home className="mobile-vlt-input-icon" size={20} />
                      <input 
                        required 
                        type="text" 
                        className="mobile-vlt-input" 
                        placeholder="00000-000" 
                        style={errors.cep ? { borderColor: '#ef4444' } : {}}
                        value={formData.cep}
                        onChange={(e) => updateFormData('cep', formatCEP(e.target.value))}
                        onBlur={handleCepBlur}
                        maxLength={9}
                      />
                      {loadingCep && <div className="mobile-vlt-spinner" />}
                    </div>
                  </div>
                  <div className="mobile-vlt-span-2">
                    <label className="mobile-vlt-label">Endereço (Rua, Av.) <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      required
                      type="text"
                      className="mobile-vlt-input"
                      style={{ paddingLeft: '1rem', ...(errors.endereco && { borderColor: '#ef4444' }) }}
                      placeholder="Sua rua ou avenida"
                      value={formData.endereco}
                      onChange={(e) => updateFormData('endereco', e.target.value)}
                      disabled={loadingCep}
                    />
                  </div>
                  <div>
                    <label className="mobile-vlt-label">Número <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      required
                      type="text"
                      className="mobile-vlt-input"
                      style={{ paddingLeft: '1rem', ...(errors.numero && { borderColor: '#ef4444' }) }}
                      placeholder="Nº"
                      value={formData.numero}
                      onChange={(e) => updateFormData('numero', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mobile-vlt-label">Bairro <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      required
                      type="text"
                      className="mobile-vlt-input"
                      style={{ paddingLeft: '1rem', ...(errors.bairro && { borderColor: '#ef4444' }) }}
                      placeholder="Seu bairro"
                      value={formData.bairro}
                      onChange={(e) => updateFormData('bairro', e.target.value)}
                      disabled={loadingCep}
                    />
                  </div>
                  <div>
                    <label className="mobile-vlt-label">Cidade <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      required
                      type="text"
                      className="mobile-vlt-input"
                      style={{ paddingLeft: '1rem', ...(errors.cidade && { borderColor: '#ef4444' }) }}
                      placeholder="Sua cidade"
                      value={formData.cidade}
                      onChange={(e) => updateFormData('cidade', e.target.value)}
                      disabled={loadingCep}
                    />
                  </div>
                  <div>
                    <label className="mobile-vlt-label">Estado <span style={{ color: '#ef4444' }}>*</span></label>
                    <input
                      required
                      type="text"
                      className="mobile-vlt-input"
                      style={{ paddingLeft: '1rem', ...(errors.estado && { borderColor: '#ef4444' }) }}
                      placeholder="UF"
                      value={formData.estado}
                      onChange={(e) => updateFormData('estado', e.target.value)}
                      disabled={loadingCep}
                    />
                  </div>
                  <div className="mobile-vlt-span-2">
                    <label className="mobile-vlt-label">Complemento / Referência</label>
                    <input
                      type="text"
                      className="mobile-vlt-input"
                      style={{ paddingLeft: '1rem' }}
                      placeholder="Apto, bloco, etc."
                      value={formData.referencia}
                      onChange={(e) => updateFormData('referencia', e.target.value)}
                    />
                  </div>
                  <div className="mobile-vlt-span-2" style={{ marginTop: '1rem' }}>
                    <label className="mobile-vlt-label">Disponibilidade</label>
                    <div className="mobile-vlt-selectable-grid mobile-vlt-grid-2">
                      {availabilityOptions.map((opt) => (
                        <label key={opt.label} className="mobile-vlt-selectable-item">
                          <input 
                            type="checkbox" 
                            name="disponibilidade" 
                            value={opt.label}
                            checked={formData.disponibilidade.includes(opt.label)}
                            onChange={(e) => handleCheckboxChange('disponibilidade', opt.label, e.target.checked)}
                          />
                          <div className="mobile-vlt-selectable-card">
                            <div className="mobile-vlt-card-icon">{opt.icon}</div>
                            <span className="mobile-vlt-card-text">{opt.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="mobile-vlt-form-grid">
                  <div className="mobile-vlt-span-2">
                    <label className={`mobile-vlt-label ${errors.interesses ? 'mobile-vlt-text-error' : ''}`}>Como você quer ajudar? <span className="mobile-vlt-required">*</span></label>
                    <div className={`mobile-vlt-selectable-grid mobile-vlt-grid-2 ${errors.interesses ? 'mobile-vlt-border-error' : ''}`}>
                      {helpOptions.map((opt) => (
                        <label key={opt.label} className="mobile-vlt-selectable-item">
                          <input 
                            type="checkbox" 
                            name="interesses" 
                            value={opt.label}
                            checked={formData.interesses.includes(opt.label)}
                            onChange={(e) => handleCheckboxChange('interesses', opt.label, e.target.checked)}
                          />
                          <div className="mobile-vlt-selectable-card">
                            <div className="mobile-vlt-card-icon">{opt.icon}</div>
                            <span className="mobile-vlt-card-text">{opt.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="mobile-vlt-form-grid">
                  <div className="mobile-vlt-span-2">
                    <label className="mobile-vlt-label">Conte seu propósito (Opcional)</label>
                    <textarea 
                      className="mobile-vlt-input" 
                      placeholder="Por que você quer ser voluntário?" 
                      rows={4}
                      value={formData.proposito}
                      onChange={(e) => updateFormData('proposito', e.target.value)}
                    ></textarea>
                  </div>
                  <div className="mobile-vlt-span-2">
                    <TermsCheckbox 
                      checked={formData.termosAceitos}
                      onChange={(checked) => updateFormData('termosAceitos', checked)}
                      mobile={true}
                      color="var(--theme-v-primary)"
                      id="termos-mobile"
                    />
                  </div>
                  <div className="mobile-vlt-final-box mobile-vlt-span-2">
                    <Award size={48} className="mobile-vlt-final-icon" />
                    <p>Ao se tornar um voluntário, você ganha acesso a missões exclusivas e badges de reconhecimento na comunidade.</p>
                  </div>
                </div>
              )}

              <div className="mobile-vlt-navigation">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="mobile-vlt-btn mobile-vlt-btn-prev">
                    <ChevronLeft size={20} />
                    <span>Anterior</span>
                  </button>
                ) : (
                  <div />
                )}
                
                <div className="mobile-vlt-nav-actions">
                  {step === 1 && <Link to="/cadastro" className="mobile-vlt-btn-cancel">Cancelar</Link>}
                  
                  {step < totalSteps ? (
                    <button type="button" onClick={handleNextStep} className="mobile-vlt-btn mobile-vlt-btn-next">
                      <span>Avançar</span>
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button type="button" onClick={handleSubmit} className="mobile-vlt-btn mobile-vlt-btn-finish" disabled={isLoading || !formData.termosAceitos}>
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

      {/* SUCCESS MODAL */}
      {isSubmitted && (
        <div className="mobile-vlt-success-overlay mobile-vlt-animate-fade">
          <div className="mobile-vlt-success-container mobile-vlt-animate-up">
            <div className="mobile-vlt-success-header">
              <div className="mobile-vlt-success-icon-box">
                <Check size={64} strokeWidth={3} />
              </div>
              <h1 className="mobile-vlt-success-title">Cadastro Enviado!</h1>
              <p className="mobile-vlt-success-desc">
                Sua solicitação para ser voluntário no <strong>SolidarBairro</strong> foi recebida com sucesso.
              </p>
            </div>

            <div className="mobile-vlt-success-card-main">
              <Rocket size={48} className="mobile-vlt-success-icon-large" />
              <h3 className="mobile-vlt-success-subtitle">
                Próximos Passos
              </h3>
              <p className="mobile-vlt-success-text">
                Agora nossa equipe validará seus dados. Você receberá uma notificação em breve.
              </p>
              <Link to="/" className="mobile-vlt-btn mobile-vlt-btn-finish mobile-vlt-w-full">
                Voltar para Início
              </Link>
            </div>
          </div>
        </div>
      )}



      {/* Toast */}
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
            <button 
              className="toast-close" 
              onClick={() => setToast({ show: false, message: '', type: 'error' })}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Loading Modal */}
      {loadingCep && (
        <div className="mobile-vlt-modal-overlay">
          <div className="mobile-vlt-modal-content">
            <div className="mobile-vlt-spinner-large"></div>
            <h3 className="mobile-vlt-modal-title">Buscando endereço...</h3>
            <p className="mobile-vlt-modal-desc">Aguarde enquanto localizamos o CEP.</p>
          </div>
        </div>
      )}
    </div>
  );
}