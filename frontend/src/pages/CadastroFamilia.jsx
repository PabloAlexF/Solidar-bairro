import React, { useState } from 'react';
import { 
  Users, ArrowLeft, User, Home, Users2, DollarSign, 
  ListChecks, MapPin, CheckCircle2, ChevronRight, 
  ChevronLeft, Fingerprint, IdCard, Calendar, 
  Phone, Mail, ShieldCheck, Trophy, 
  Target, Zap, Award, Heart, Info, Sparkles,
  Star, Rocket, Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ApiService from '../services/apiService';
import '../styles/components/CadastroFamilia.css';
import '../styles/components/Toast.css';

// Componente para contador de família
const FamilyCounter = ({ item, count, onUpdate }) => (
  <div className="family-card-input">
    <div className="family-card-header">
      <span className="family-card-emoji">{item.icon}</span>
      <span className="family-card-label">{item.label}</span>
    </div>
    <div className="family-counter-enhanced">
      <button 
        type="button" 
        className="counter-btn counter-minus"
        onClick={() => onUpdate(item.key, -1)}
        disabled={count === 0}
      >
        -
      </button>
      <span className="counter-display">{count}</span>
      <button 
        type="button" 
        className="counter-btn counter-plus"
        onClick={() => onUpdate(item.key, 1)}
      >
        +
      </button>
    </div>
  </div>
);

// Componente para botão do mapa
const MapLocationButton = ({ isLocating, onClick }) => (
  <button 
    type="button" 
    className="map-button"
    onClick={onClick}
    disabled={isLocating}
  >
    <div className="map-icon-box">
      <MapPin size={28} className={isLocating ? 'animate-pulse' : ''} />
    </div>
    <div className="map-info">
      <h4 className="map-title">
        {isLocating ? 'Localizando...' : 'Localizar no Mapa'}
      </h4>
      <p className="map-desc">
        {isLocating ? 'Obtendo localização' : 'Ajuda as ONGs a te encontrarem com precisão'}
      </p>
    </div>
  </button>
);

export default function CadastroFamilia() {
  // Estados
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(true);
  const [showAnalysisAlert, setShowAnalysisAlert] = useState(false);
  const [addressData, setAddressData] = useState({ endereco: '', bairro: '', referencia: '' });
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [familyCount, setFamilyCount] = useState({ criancas: 0, jovens: 0, adultos: 1, idosos: 0 });
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
    horarioContato: '',
    endereco: '',
    bairro: '',
    pontoReferencia: '',
    tipoMoradia: '',
    criancas: 0,
    jovens: 0,
    adultos: 1,
    idosos: 0,
    necessidades: []
  });
  
  const totalSteps = 6;
  
  // Dados dos steps
  const steps = [
    { id: 1, title: "Responsável", icon: <User size={20} /> },
    { id: 2, title: "Documentos", icon: <Fingerprint size={20} /> },
    { id: 3, title: "Contato", icon: <Phone size={20} /> },
    { id: 4, title: "Residência", icon: <MapPin size={20} /> },
    { id: 5, title: "Família", icon: <Users2 size={20} /> },
    { id: 6, title: "Necessidades", icon: <ListChecks size={20} /> },
  ];
  
  // Dados da família
  const familyTypes = [
    { label: 'Crianças (0-12)', icon: '👶', key: 'criancas' },
    { label: 'Jovens (13-17)', icon: '👦', key: 'jovens' },
    { label: 'Adultos (18-59)', icon: '👨', key: 'adultos' },
    { label: 'Idosos (60+)', icon: '👴', key: 'idosos' }
  ];

  // Funções
  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));
  
  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.nomeCompleto.trim() && formData.dataNascimento && formData.estadoCivil && formData.profissao.trim();
      case 2:
        return formData.cpf.trim() && formData.rg.trim() && formData.rendaFamiliar;
      case 3:
        return formData.telefone.trim() && formData.horarioContato;
      case 4:
        return (addressData.endereco.trim() || formData.endereco.trim()) && (addressData.bairro.trim() || formData.bairro.trim()) && formData.tipoMoradia;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      nextStep();
    } else {
      showToast('Por favor, preencha todos os campos obrigatórios antes de continuar.', 'error');
    }
  };

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
  };

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatRG = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 9) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    } else {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
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

  const handleWhatsAppChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      updateFormData('whatsapp', formatPhone(value));
    }
  };
  
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };
  
  const updateFamilyCount = (key, increment) => {
    const newCount = Math.max(0, familyCount[key] + increment);
    setFamilyCount(prev => ({ ...prev, [key]: newCount }));
    setFormData(prev => ({ ...prev, [key]: newCount }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const submitData = {
        ...formData,
        endereco: addressData.endereco || formData.endereco,
        bairro: addressData.bairro || formData.bairro,
        pontoReferencia: addressData.referencia || formData.pontoReferencia
      };
      
      await ApiService.createFamilia(submitData);
      setIsSubmitted(true);
      setTimeout(() => setShowAnalysisAlert(true), 2000);
    } catch (error) {
      console.error('Erro ao cadastrar família:', error);
      showToast('Erro ao realizar cadastro. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocalização não suportada', 'error');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          console.log(`Precisão GPS: ${accuracy}m`);
          
          let addressFound = false;
          
          // API 1: ViaCEP com coordenadas (mais precisa para Brasil)
          try {
            const viacepResponse = await fetch(`https://viacep.com.br/ws/${latitude},${longitude}/json/`);
            if (viacepResponse.ok) {
              const viacepData = await viacepResponse.json();
              console.log('ViaCEP response:', viacepData);
              if (viacepData && !viacepData.erro) {
                setAddressData({
                  endereco: `${viacepData.logradouro || ''} ${viacepData.complemento || ''}`.trim(),
                  bairro: viacepData.bairro || '',
                  referencia: `CEP: ${viacepData.cep || ''} - ${viacepData.localidade || ''}`
                });
                addressFound = true;
              }
            }
          } catch (e) {
            console.log('ViaCEP falhou:', e);
          }
          
          // API 2: Nominatim como fallback
          if (!addressFound) {
            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=19&addressdetails=1`);
              const data = await response.json();
              console.log('Nominatim response:', data);
              
              if (data.address) {
                const addr = data.address;
                const street = addr.road || addr.pedestrian || addr.footway || '';
                const number = addr.house_number || '';
                const neighborhood = addr.suburb || addr.neighbourhood || addr.quarter || addr.city_district || '';
                
                setAddressData({
                  endereco: `${street} ${number}`.trim() || data.display_name?.split(',')[0] || '',
                  bairro: neighborhood + ' (verificar se está correto)',
                  referencia: `${addr.amenity || addr.shop || addr.building || 'Localização GPS'}`
                });
                addressFound = true;
              }
            } catch (e) {
              console.log('Nominatim falhou:', e);
            }
          }
          
          // Fallback: Coordenadas GPS
          if (!addressFound) {
            setAddressData({
              endereco: `Coordenadas: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
              bairro: 'Digite o bairro correto',
              referencia: `Precisão GPS: ${Math.round(accuracy)}m`
            });
          }
          
        } catch (error) {
          console.error('Erro:', error);
          showToast('Erro ao obter endereço', 'error');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        showToast(`Erro GPS: ${error.message}`, 'error');
      },
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
    );
  };

  if (isSubmitted) {
    return (
      <div className="cadastro-container familia-theme" style={{ height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div className="form-card-new" style={{ width: '100%', maxWidth: '1200px', height: 'auto', maxHeight: '85vh', overflow: 'hidden' }}>
          <div className="success-grid" style={{ display: 'flex', height: '100%' }}>
            <div className="success-left" style={{ flex: '1', minWidth: '400px' }}>
                <div className="brand-icon success-icon-bg">
                  <Trophy size={48} color="white" />
                </div>
                <h1 className="success-title">
                  Família <br/>
                  <span className="text-highlight" style={{ color: '#f97316' }}>Registrada!</span>
                </h1>
                <p className="success-description">
                  Sua família agora faz parte da rede oficial. Prepare-se para receber apoio!
                </p>
                
                <div className="xp-card">
                  <div className="xp-header">
                    <div>
                      <p className="xp-label">Impacto Familiar</p>
                      <h3 className="xp-value">+50 XP</h3>
                    </div>
                    <Zap size={32} color="#f97316" />
                  </div>
                  <div className="xp-bar">
                    <div className="xp-inner" style={{ width: '15%', background: '#f97316' }} />
                  </div>
                  <p className="xp-footer">Complete a verificação para ganhar benefícios</p>
                </div>
              </div>

            <div className="success-right" style={{ flex: '1.2', minWidth: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h2 className="success-steps-title">Próximos Passos</h2>
                <div className="steps-cards-list">
                  {[
                    { title: "Verificação CNPJ", desc: "Validaremos os dados da sua instituição", icon: <ShieldCheck /> },
                    { title: "Painel de Gestão", desc: "Acesse ferramentas de mapeamento", icon: <MapPin /> },
                    { title: "Rede de Apoio", desc: "Conecte-se com doadores e voluntários", icon: <Users /> }
                  ].map((item, i) => (
                    <div key={i} className="step-card-mini">
                      <div className="step-card-icon" style={{ color: '#f97316' }}>{item.icon}</div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="success-actions">
                <Link to="/" className="btn-base btn-primary" style={{ background: '#f97316' }}>Início</Link>
                <button className="btn-base btn-secondary">Acessar Painel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Privacy Modal
  if (showPrivacyModal) {
    return (
      <div className="modal-overlay">
        <div className="privacy-modal">
          <div className="privacy-header">
            <ShieldCheck size={24} color="#f97316" />
            <h3>Proteção de Dados</h3>
          </div>
          <p className="privacy-text">
            Seus dados serão protegidos conforme a LGPD. Utilizamos apenas para conectar sua família com ONGs e doadores.
          </p>
          <button 
            className="privacy-btn" 
            onClick={() => setShowPrivacyModal(false)}
          >
            Entendi, Continuar
          </button>
        </div>
      </div>
    );
  }

  // Analysis Alert Modal
  if (showAnalysisAlert) {
    return (
      <div className="alert-overlay">
        <div className="analysis-alert">
          <div className="alert-icon">
            <ShieldCheck size={32} />
          </div>
          <h3>Análise Iniciada!</h3>
          <p>Seu cadastro está sendo analisado. Você receberá uma notificação em até 24 horas.</p>
          <button 
            className="alert-btn" 
            onClick={() => setShowAnalysisAlert(false)}
          >
            Entendi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cadastro-container familia-theme">
      {/* Background Blobs */}
      <div className="bg-blobs">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="back-link">
          <div className="back-icon">
            <ArrowLeft size={20} />
          </div>
          <span>Voltar</span>
        </Link>
        
        <div className="brand">
          <div className="brand-logo">
            <Users size={24} />
          </div>
          <h1 className="brand-name">SolidarBairro</h1>
        </div>
      </nav>

      {/* Main Grid */}
      <div className="main-grid">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="steps-card">
            <h2 className="steps-title">Cadastro da Família</h2>
            
            <div className="steps-list">
              {steps.map((stepItem, index) => (
                <div 
                  key={stepItem.id} 
                  className={`step-item ${
                    stepItem.id === step ? 'active' : 
                    stepItem.id < step ? 'completed' : 'pending'
                  }`}
                >
                  <div className="step-icon-box">
                    {stepItem.id < step ? <CheckCircle2 size={20} /> : stepItem.icon}
                  </div>
                  <div>
                    <p className="step-number">Etapa {stepItem.id}</p>
                    <h3 className="step-label">{stepItem.title}</h3>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`step-connector ${stepItem.id < step ? 'completed' : ''}`}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="safety-tip">
              <div className="safety-header">
                <ShieldCheck size={20} color="#f97316" />
                <h4>Dados Seguros</h4>
              </div>
              <p className="safety-text">
                Suas informações são protegidas e usadas apenas para conectar sua família com ONGs e doadores.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="content-area">
          <div className="form-card">
            {/* Form Header */}
            <div className="form-header">
              <div className="progress-container">
                <div className="step-badge">Etapa {step} de {totalSteps}</div>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <h1 className="form-title">
                {step === 1 && <>Dados do <span className="text-highlight">Responsável</span></>}
                {step === 2 && <>Documentos <span className="text-highlight">Pessoais</span></>}
                {step === 3 && <>Informações de <span className="text-highlight">Contato</span></>}
                {step === 4 && <>Endereço da <span className="text-highlight">Residência</span></>}
                {step === 5 && <>Composição <span className="text-highlight">Familiar</span></>}
                {step === 6 && <>Necessidades <span className="text-highlight">Específicas</span></>}
              </h1>
              
              <p className="form-description">
                {step === 1 && "Vamos começar com os dados básicos do responsável pela família."}
                {step === 2 && "Agora precisamos dos documentos para validação das informações."}
                {step === 3 && "Como podemos entrar em contato com vocês quando necessário?"}
                {step === 4 && "Onde sua família reside? Isso nos ajuda a encontrar ONGs próximas."}
                {step === 5 && "Conte-nos sobre a composição da sua família para melhor atendimento."}
                {step === 6 && "Quais são as principais necessidades da sua família no momento?"}
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }}>
              <div className="form-body">
                {/* Step 1: Responsável */}
                {step === 1 && (
                  <div className="form-grid form-grid-2">
                    <div className="input-group">
                      <label className="input-label">Nome Completo <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="input-wrapper">
                        <User className="input-icon" />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Digite seu nome completo"
                          value={formData.nomeCompleto}
                          onChange={(e) => updateFormData('nomeCompleto', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">Data de Nascimento <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="input-wrapper">
                        <Calendar className="input-icon" />
                        <input 
                          type="date" 
                          className="form-input"
                          value={formData.dataNascimento}
                          onChange={(e) => updateFormData('dataNascimento', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">Estado Civil <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="radio-grid radio-grid-4">
                        {['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)'].map((estado) => (
                          <label key={estado} className="radio-label">
                            <input 
                              type="radio" 
                              name="estado_civil" 
                              value={estado} 
                              className="radio-input"
                              checked={formData.estadoCivil === estado}
                              onChange={(e) => updateFormData('estadoCivil', e.target.value)}
                            />
                            <div className="radio-box">{estado}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">Profissão <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="input-wrapper">
                        <User className="input-icon" />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Qual sua profissão?"
                          value={formData.profissao}
                          onChange={(e) => updateFormData('profissao', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Documentos */}
                {step === 2 && (
                  <div className="form-grid form-grid-2">
                    <div className="input-group">
                      <label className="input-label">CPF <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="input-wrapper">
                        <IdCard className="input-icon" />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={handleCPFChange}
                          maxLength={14}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">RG <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="input-wrapper">
                        <Fingerprint className="input-icon" />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="00.000.000-0 ou 000.000.000-00"
                          value={formData.rg}
                          onChange={handleRGChange}
                          maxLength={14}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">NIS (Cadastro Único)</label>
                      <div className="input-wrapper">
                        <IdCard className="input-icon" />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="000.00000.00-0 (se possuir)"
                          value={formData.nis}
                          onChange={(e) => updateFormData('nis', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">Renda Familiar Mensal <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="card-radio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {[
                          { label: 'Até R$ 500', value: 'ate_500', icon: <DollarSign size={20} />, desc: 'Renda baixa' },
                          { label: 'R$ 501 - R$ 1.000', value: '501_1000', icon: <DollarSign size={20} />, desc: 'Renda moderada' },
                          { label: 'R$ 1.001 - R$ 2.000', value: '1001_2000', icon: <DollarSign size={20} />, desc: 'Renda média' },
                          { label: 'Acima de R$ 2.000', value: 'acima_2000', icon: <DollarSign size={20} />, desc: 'Renda alta' }
                        ].map((renda) => (
                          <label key={renda.value} className="radio-label">
                            <input 
                              type="radio" 
                              name="renda" 
                              value={renda.value} 
                              className="radio-input"
                              checked={formData.rendaFamiliar === renda.value}
                              onChange={(e) => updateFormData('rendaFamiliar', e.target.value)}
                            />
                            <div className="card-radio-box-enhanced">
                              <div className="card-icon-box-enhanced" style={{ background: '#fff7ed', color: '#f97316' }}>
                                {renda.icon}
                              </div>
                              <div className="card-content">
                                <h4 className="card-title-enhanced">{renda.label}</h4>
                                <p className="card-desc-enhanced">{renda.desc}</p>
                              </div>
                              <div className="card-check-indicator">
                                <CheckCircle2 size={16} />
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Contato */}
                {step === 3 && (
                  <div className="form-grid form-grid-2">
                    <div className="input-group">
                      <label className="input-label">Telefone Principal <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="input-wrapper">
                        <Phone className="input-icon" />
                        <input 
                          type="tel" 
                          className="form-input" 
                          placeholder="(00) 00000-0000"
                          value={formData.telefone}
                          onChange={handlePhoneChange}
                          maxLength={15}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">WhatsApp (opcional)</label>
                      <div className="input-wrapper">
                        <Phone className="input-icon" />
                        <input 
                          type="tel" 
                          className="form-input" 
                          placeholder="(00) 00000-0000"
                          value={formData.whatsapp}
                          onChange={handleWhatsAppChange}
                          maxLength={15}
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">E-mail (opcional)</label>
                      <div className="input-wrapper">
                        <Mail className="input-icon" />
                        <input 
                          type="email" 
                          className="form-input" 
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">Melhor horário para contato <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="radio-grid radio-grid-4">
                        {['Manhã', 'Tarde', 'Noite', 'Qualquer'].map((horario) => (
                          <label key={horario} className="radio-label">
                            <input 
                              type="radio" 
                              name="horario" 
                              value={horario} 
                              className="radio-input"
                              checked={formData.horarioContato === horario}
                              onChange={(e) => updateFormData('horarioContato', e.target.value)}
                            />
                            <div className="radio-box">{horario}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Residência */}
                {step === 4 && (
                  <div className="form-grid form-grid-2">
                    <MapLocationButton 
                      isLocating={isLocating} 
                      onClick={handleMapLocation} 
                    />
                    
                    <div className="input-group">
                      <label className="input-label">Endereço <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="input-wrapper">
                        <Home className="input-icon" />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Rua, Avenida, etc."
                          value={addressData.endereco}
                          onChange={(e) => setAddressData(prev => ({ ...prev, endereco: e.target.value }))}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">Bairro <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="input-wrapper">
                        <MapPin className="input-icon" />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Nome do bairro"
                          value={addressData.bairro}
                          onChange={(e) => setAddressData(prev => ({ ...prev, bairro: e.target.value }))}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">Ponto de Referência</label>
                      <div className="input-wrapper">
                        <MapPin className="input-icon" />
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Próximo a..."
                          value={addressData.referencia}
                          onChange={(e) => setAddressData(prev => ({ ...prev, referencia: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="input-group">
                      <label className="input-label">Tipo de Moradia <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="radio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {[
                          { label: 'Casa Própria', icon: <Home size={20} /> },
                          { label: 'Casa Alugada', icon: <Home size={20} /> },
                          { label: 'Apartamento', icon: <Home size={20} /> },
                          { label: 'Outros', icon: <Home size={20} /> }
                        ].map((tipo) => (
                          <label key={tipo.label} className="radio-label">
                            <input 
                              type="radio" 
                              name="tipo_moradia" 
                              value={tipo.label} 
                              className="radio-input"
                              checked={formData.tipoMoradia === tipo.label}
                              onChange={(e) => updateFormData('tipoMoradia', e.target.value)}
                            />
                            <div className="card-radio-box">
                              <div className="card-icon-box">
                                {tipo.icon}
                              </div>
                              <div>
                                <h4 className="card-title">{tipo.label}</h4>
                              </div>
                            </div>
                          </label>
                        ))}}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Família */}
                {step === 5 && (
                  <div className="family-input-section">
                    <h3 className="section-subtitle">
                      <Users2 size={24} color="#f97316" />
                      Composição Familiar
                    </h3>
                    
                    <div className="family-grid-enhanced">
                      {familyTypes.map((item) => (
                        <FamilyCounter
                          key={item.key}
                          item={item}
                          count={familyCount[item.key]}
                          onUpdate={updateFamilyCount}
                        />
                      ))}
                    </div>
                    
                    <div className="info-banner">
                      <div className="info-icon-box">
                        <Info size={24} color="#f97316" />
                      </div>
                      <div className="info-content">
                        <h3>Informação Importante</h3>
                        <p>Estes dados nos ajudam a dimensionar melhor o tipo de apoio que sua família precisa e conectar com ONGs especializadas.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: Necessidades */}
                {step === 6 && (
                  <div className="needs-section">
                    <h3 className="section-subtitle">
                      <ListChecks size={24} color="#f97316" />
                      Principais Necessidades
                    </h3>
                    
                    <div className="needs-grid">
                      {[
                        'Alimentação', 'Roupas', 'Medicamentos', 'Material Escolar',
                        'Móveis', 'Eletrodomésticos', 'Consultas Médicas', 'Cursos Profissionalizantes'
                      ].map((need) => (
                        <label key={need} className="need-item">
                          <input 
                            type="checkbox" 
                            name="necessidades" 
                            value={need} 
                            className="need-input"
                            checked={formData.necessidades.includes(need)}
                            onChange={(e) => handleCheckboxChange('necessidades', need, e.target.checked)}
                          />
                          <div className="need-box">
                            <span className="need-label">{need}</span>
                            <div className="check-circle-box">
                              <CheckCircle2 size={16} />
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    <div className="final-step-section">
                      <div className="final-card">
                        <h3 className="final-title">Quase Pronto!</h3>
                        <p className="final-text">
                          Revise suas informações e clique em "Finalizar Cadastro" para enviar sua solicitação.
                        </p>
                        <div className="final-warning">
                          <ShieldCheck className="warning-icon" size={24} />
                          <p className="warning-text">
                            Seus dados serão analisados em até 24 horas. Você receberá uma confirmação por telefone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Footer */}
              <div className="form-footer">
                {step > 1 && (
                  <button type="button" className="btn-prev" onClick={prevStep}>
                    <ChevronLeft size={20} />
                    Anterior
                  </button>
                )}
                
                <div style={{ flex: 1 }}></div>
                
                {step < totalSteps ? (
                  <button type="submit" className="btn-next">
                    Próximo
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button type="submit" className="btn-finish" disabled={isLoading}>
                    {isLoading ? 'Finalizando...' : 'Finalizar Cadastro'}
                    <CheckCircle2 size={20} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>

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
    </div>
  );
}