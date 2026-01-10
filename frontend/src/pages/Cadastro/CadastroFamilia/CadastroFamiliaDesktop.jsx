import { useState } from 'react';
import { 
  Users, ArrowLeft, User, Home, Users2, DollarSign, 
  ListChecks, MapPin, CheckCircle2, ChevronRight, 
  ChevronLeft, Fingerprint, IdCard, Calendar, 
  Phone, Mail, ShieldCheck, Trophy, 
  Zap, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PasswordField from '../../../components/ui/PasswordField';
import ApiService from '../../../services/apiService';
import './CadastroFamiliaDesktop.css';

const FamilyCounter = ({ item, count, onUpdate }) => (
  <div className="fam-reg-family-card-input">
    <div className="fam-reg-family-card-header">
      <span className="fam-reg-family-card-emoji">{item.icon}</span>
      <span className="fam-reg-family-card-label">{item.label}</span>
    </div>
    <div className="fam-reg-family-counter-enhanced">
      <button 
        type="button" 
        className="fam-reg-counter-btn fam-reg-counter-minus"
        onClick={() => onUpdate(item.key, -1)}
        disabled={count === 0}
      >
        -
      </button>
      <span className="fam-reg-counter-display">{count}</span>
      <button 
        type="button" 
        className="fam-reg-counter-btn fam-reg-counter-plus"
        onClick={() => onUpdate(item.key, 1)}
      >
        +
      </button>
    </div>
  </div>
);

const MapLocationButton = ({ isLocating, onClick }) => (
  <button 
    type="button" 
    className="fam-reg-map-button"
    onClick={onClick}
    disabled={isLocating}
  >
    <div className="fam-reg-map-icon-box">
      <MapPin size={28} className={isLocating ? 'animate-pulse' : ''} />
    </div>
    <div className="fam-reg-map-info">
      <h4 className="fam-reg-map-title">
        {isLocating ? 'Localizando...' : 'Localizar no Mapa'}
      </h4>
      <p className="fam-reg-map-desc">
        {isLocating ? 'Obtendo localização' : 'Ajuda as ONGs a te encontrarem com precisão'}
      </p>
    </div>
  </button>
);

export default function CadastroFamiliaDesktop() {
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
    senha: '',
    confirmarSenha: '',
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
  
  const steps = [
    { id: 1, title: "Responsável", icon: <User size={20} /> },
    { id: 2, title: "Documentos", icon: <Fingerprint size={20} /> },
    { id: 3, title: "Contato", icon: <Phone size={20} /> },
    { id: 4, title: "Residência", icon: <MapPin size={20} /> },
    { id: 5, title: "Família", icon: <Users2 size={20} /> },
    { id: 6, title: "Necessidades", icon: <ListChecks size={20} /> },
  ];
  
  const familyTypes = [
    { label: 'Crianças (0-12)', icon: '👶', key: 'criancas' },
    { label: 'Jovens (13-17)', icon: '👦', key: 'jovens' },
    { label: 'Adultos (18-59)', icon: '👨', key: 'adultos' },
    { label: 'Idosos (60+)', icon: '👴', key: 'idosos' }
  ];

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
          
          try {
            const viacepResponse = await fetch(`https://viacep.com.br/ws/${latitude},${longitude}/json/`);
            if (viacepResponse.ok) {
              const viacepData = await viacepResponse.json();
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
          
          if (!addressFound) {
            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=19&addressdetails=1`);
              const data = await response.json();
              
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
      <div className="fam-reg-container fam-reg-theme fam-reg-success-view">
        <div className="fam-reg-form-card-new">
          <div className="fam-reg-success-grid">
            <div className="fam-reg-success-left">
              <div className="fam-reg-success-icon-bg">
                <Trophy size={48} color="white" />
              </div>
              <h1 className="fam-reg-success-title">
                Família <br/>
                <span className="fam-reg-text-highlight">Registrada!</span>
              </h1>
              <p className="fam-reg-success-description">
                Sua família agora faz parte da rede oficial. Prepare-se para receber apoio!
              </p>
              
              <div className="fam-reg-xp-card">
                <div className="fam-reg-xp-header">
                  <div>
                    <p className="fam-reg-xp-label">Impacto Familiar</p>
                    <h3 className="fam-reg-xp-value">+50 XP</h3>
                  </div>
                  <Zap size={32} color="#f97316" />
                </div>
                <div className="fam-reg-xp-bar">
                  <div className="fam-reg-xp-inner" style={{ width: '15%' }} />
                </div>
                <p className="fam-reg-xp-footer">Complete a verificação para ganhar benefícios</p>
              </div>
            </div>

            <div className="fam-reg-success-right">
              <div>
                <h2 className="fam-reg-success-steps-title">Próximos Passos</h2>
                <div className="fam-reg-steps-cards-list">
                  {[
                    { title: "Verificação de Dados", desc: "Validaremos os dados da sua família", icon: <ShieldCheck /> },
                    { title: "Mapa de Apoio", desc: "Veja ONGs próximas a você", icon: <MapPin /> },
                    { title: "Rede de Solidariedade", desc: "Conecte-se com doadores", icon: <Users /> }
                  ].map((item, i) => (
                    <div key={i} className="fam-reg-step-card-mini">
                      <div className="fam-reg-step-card-icon">{item.icon}</div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="fam-reg-success-actions">
                <Link href="/" className="fam-reg-btn-base fam-reg-btn-primary">Início</Link>
                <button className="fam-reg-btn-base fam-reg-btn-secondary">Acessar Painel</button>
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
        <div className="fam-reg-blob-1"></div>
        <div className="fam-reg-blob-2"></div>
      </div>

      <nav className="fam-reg-navbar">
        <Link href="/" className="fam-reg-back-link">
          <div className="fam-reg-back-icon">
            <ArrowLeft size={20} />
          </div>
          <span>Voltar</span>
        </Link>
        
        <div className="fam-reg-brand">
          <div className="fam-reg-brand-logo">
            <Users size={24} />
          </div>
          <h1 className="fam-reg-brand-name">SolidarBairro</h1>
        </div>
      </nav>

      <div className="fam-reg-main-grid">
        <aside className="fam-reg-sidebar">
          <div className="fam-reg-steps-card">
            <h2 className="fam-reg-steps-title">Cadastro da Família</h2>
            
            <div className="fam-reg-steps-list">
              {steps.map((stepItem, index) => (
                <div 
                  key={stepItem.id} 
                  className={`fam-reg-step-item ${
                    stepItem.id === step ? 'fam-reg-active' : 
                    stepItem.id < step ? 'fam-reg-completed' : 'fam-reg-pending'
                  }`}
                >
                  <div className="fam-reg-step-icon-box">
                    {stepItem.id < step ? <CheckCircle2 size={20} /> : stepItem.icon}
                  </div>
                  <div className="fam-reg-step-info">
                    <p className="fam-reg-step-number">Etapa {stepItem.id}</p>
                    <h3 className="fam-reg-step-label">{stepItem.title}</h3>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`fam-reg-step-connector ${stepItem.id < step ? 'fam-reg-completed' : ''}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="fam-reg-content-area">
          <div className="fam-reg-form-card">
            <div className="fam-reg-form-header">
              <div className="fam-reg-progress-container">
                <div className="fam-reg-step-badge">Etapa {step} de {totalSteps}</div>
                <div className="fam-reg-progress-bar-bg">
                  <div 
                    className="fam-reg-progress-bar-fill" 
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <h1 className="fam-reg-form-title">
                {step === 1 && <>Dados do <span className="fam-reg-text-highlight">Responsável</span></>}
                {step === 2 && <>Documentos <span className="fam-reg-text-highlight">Pessoais</span></>}
                {step === 3 && <>Informações de <span className="fam-reg-text-highlight">Contato</span></>}
                {step === 4 && <>Endereço da <span className="fam-reg-text-highlight">Residência</span></>}
                {step === 5 && <>Composição <span className="fam-reg-text-highlight">Familiar</span></>}
                {step === 6 && <>Necessidades <span className="fam-reg-text-highlight">Específicas</span></>}
              </h1>
              
              <p className="fam-reg-form-description">
                {step === 1 && "Vamos começar com os dados básicos do responsável pela família."}
                {step === 2 && "Agora precisamos dos documentos para validação das informações."}
                {step === 3 && "Como podemos entrar em contato com vocês quando necessário?"}
                {step === 4 && "Onde sua família reside? Isso nos ajuda a encontrar ONGs próximas."}
                {step === 5 && "Conte-nos sobre a composição da sua família para melhor atendimento."}
                {step === 6 && "Quais são as principais necessidades da sua família no momento?"}
              </p>
            </div>

            <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }}>
              <div className="fam-reg-form-body">
                {step === 1 && (
                  <div className="fam-reg-form-grid fam-reg-form-grid-2">
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">Nome Completo <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-reg-input-wrapper">
                        <User className="fam-reg-input-icon" />
                        <input 
                          type="text" 
                          className="fam-reg-form-input" 
                          placeholder="Digite seu nome completo"
                          value={formData.nomeCompleto}
                          onChange={(e) => updateFormData('nomeCompleto', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">Data de Nascimento <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-reg-input-wrapper">
                        <Calendar className="fam-reg-input-icon" />
                        <input 
                          type="date" 
                          className="fam-reg-form-input"
                          value={formData.dataNascimento}
                          onChange={(e) => updateFormData('dataNascimento', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">Estado Civil <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-reg-radio-grid fam-reg-radio-grid-4">
                        {['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)'].map((estado) => (
                          <label key={estado} className="fam-reg-radio-label">
                            <input 
                              type="radio" 
                              name="estado_civil" 
                              value={estado} 
                              className="fam-reg-radio-input"
                              checked={formData.estadoCivil === estado}
                              onChange={(e) => updateFormData('estadoCivil', e.target.value)}
                            />
                            <div className="fam-reg-radio-box">{estado}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">Profissão <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-reg-input-wrapper">
                        <User className="fam-reg-input-icon" />
                        <input 
                          type="text" 
                          className="fam-reg-form-input" 
                          placeholder="Qual sua profissão?"
                          value={formData.profissao}
                          onChange={(e) => updateFormData('profissao', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="fam-reg-form-grid fam-reg-form-grid-2">
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">CPF <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-reg-input-wrapper">
                        <IdCard className="fam-reg-input-icon" />
                        <input 
                          type="text" 
                          className="fam-reg-form-input" 
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={handleCPFChange}
                          maxLength={14}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">RG <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-reg-input-wrapper">
                        <Fingerprint className="fam-reg-input-icon" />
                        <input 
                          type="text" 
                          className="fam-reg-form-input" 
                          placeholder="00.000.000-0 ou 000.000.000-00"
                          value={formData.rg}
                          onChange={handleRGChange}
                          maxLength={14}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">NIS (Cadastro Único)</label>
                      <div className="fam-reg-input-wrapper">
                        <IdCard className="fam-reg-input-icon" />
                        <input 
                          type="text" 
                          className="fam-reg-form-input" 
                          placeholder="000.00000.00-0 (se possuir)"
                          value={formData.nis}
                          onChange={(e) => updateFormData('nis', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">Renda Familiar Mensal <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-reg-card-radio-grid-renda">
                        {[
                          { label: 'Até R$ 500', value: 'ate_500', icon: <DollarSign size={20} />, desc: 'Renda baixa' },
                          { label: 'R$ 501 - R$ 1.000', value: '501_1000', icon: <DollarSign size={20} />, desc: 'Renda moderada' },
                          { label: 'R$ 1.001 - R$ 2.000', value: '1001_2000', icon: <DollarSign size={20} />, desc: 'Renda média' },
                          { label: 'Acima de R$ 2.000', value: 'acima_2000', icon: <DollarSign size={20} />, desc: 'Renda alta' }
                        ].map((renda) => (
                          <label key={renda.value} className="fam-reg-radio-label">
                            <input 
                              type="radio" 
                              name="renda" 
                              value={renda.value} 
                              className="fam-reg-radio-input"
                              checked={formData.rendaFamiliar === renda.value}
                              onChange={(e) => updateFormData('rendaFamiliar', e.target.value)}
                            />
                            <div className="fam-reg-card-radio-box-enhanced">
                              <div className="fam-reg-card-icon-box-enhanced">
                                {renda.icon}
                              </div>
                              <div className="fam-reg-card-content">
                                <h4 className="fam-reg-card-title-enhanced">{renda.label}</h4>
                                <p className="fam-reg-card-desc-enhanced">{renda.desc}</p>
                              </div>
                              <div className="fam-reg-card-check-indicator">
                                <CheckCircle2 size={16} />
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="fam-reg-form-grid fam-reg-form-grid-2">
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">Telefone Principal <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-reg-input-wrapper">
                        <Phone className="fam-reg-input-icon" />
                        <input 
                          type="tel" 
                          className="fam-reg-form-input" 
                          placeholder="(00) 00000-0000"
                          value={formData.telefone}
                          onChange={handlePhoneChange}
                          maxLength={15}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">WhatsApp (opcional)</label>
                      <div className="fam-reg-input-wrapper">
                        <Phone className="fam-reg-input-icon" />
                        <input 
                          type="tel" 
                          className="fam-reg-form-input" 
                          placeholder="(00) 00000-0000"
                          value={formData.whatsapp}
                          onChange={handleWhatsAppChange}
                          maxLength={15}
                        />
                      </div>
                    </div>
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">E-mail (opcional)</label>
                      <div className="fam-reg-input-wrapper">
                        <Mail className="fam-reg-input-icon" />
                        <input 
                          type="email" 
                          className="fam-reg-form-input" 
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">Melhor horário para contato <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-reg-radio-grid fam-reg-radio-grid-4">
                        {['Manhã', 'Tarde', 'Noite', 'Qualquer'].map((horario) => (
                          <label key={horario} className="fam-reg-radio-label">
                            <input 
                              type="radio" 
                              name="horario" 
                              value={horario} 
                              className="fam-reg-radio-input"
                              checked={formData.horarioContato === horario}
                              onChange={(e) => updateFormData('horarioContato', e.target.value)}
                            />
                            <div className="fam-reg-radio-box">{horario}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <PasswordField 
                      label="Senha de Acesso"
                      placeholder="Crie uma senha segura"
                      required
                      value={formData.senha}
                      onChange={(e) => updateFormData('senha', e.target.value)}
                    />
                    
                    <PasswordField 
                      label="Confirmar Senha"
                      placeholder="Digite a senha novamente"
                      required
                      value={formData.confirmarSenha}
                      onChange={(e) => updateFormData('confirmarSenha', e.target.value)}
                    />
                  </div>
                )}

                {step === 4 && (
                  <div className="fam-reg-form-grid fam-reg-form-grid-2">
                    <MapLocationButton 
                      isLocating={isLocating} 
                      onClick={handleMapLocation} 
                    />
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">Endereço <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-reg-input-wrapper">
                        <Home className="fam-reg-input-icon" />
                        <input 
                          type="text" 
                          className="fam-reg-form-input" 
                          placeholder="Rua, Avenida, etc."
                          value={addressData.endereco}
                          onChange={(e) => setAddressData(prev => ({ ...prev, endereco: e.target.value }))}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">Bairro <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-reg-input-wrapper">
                        <MapPin className="fam-reg-input-icon" />
                        <input 
                          type="text" 
                          className="fam-reg-form-input" 
                          placeholder="Nome do bairro"
                          value={addressData.bairro}
                          onChange={(e) => setAddressData(prev => ({ ...prev, bairro: e.target.value }))}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">Ponto de Referência</label>
                      <div className="fam-reg-input-wrapper">
                        <MapPin className="fam-reg-input-icon" />
                        <input 
                          type="text" 
                          className="fam-reg-form-input" 
                          placeholder="Próximo a..."
                          value={addressData.referencia}
                          onChange={(e) => setAddressData(prev => ({ ...prev, referencia: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="fam-reg-input-group">
                      <label className="fam-reg-input-label">Tipo de Moradia <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-reg-card-radio-grid-moradia">
                        {[
                          { label: 'Casa Própria', icon: <Home size={20} /> },
                          { label: 'Casa Alugada', icon: <Home size={20} /> },
                          { label: 'Apartamento', icon: <Home size={20} /> },
                          { label: 'Outros', icon: <Home size={20} /> }
                        ].map((tipo) => (
                          <label key={tipo.label} className="fam-reg-radio-label">
                            <input 
                              type="radio" 
                              name="tipo_moradia" 
                              value={tipo.label} 
                              className="fam-reg-radio-input"
                              checked={formData.tipoMoradia === tipo.label}
                              onChange={(e) => updateFormData('tipoMoradia', e.target.value)}
                            />
                            <div className="fam-reg-card-radio-box">
                              <div className="fam-reg-card-icon-box">
                                {tipo.icon}
                              </div>
                              <div>
                                <h4 className="fam-reg-card-title">{tipo.label}</h4>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="fam-reg-family-input-section">
                    <h3 className="fam-reg-section-subtitle">
                      <Users2 size={24} color="#f97316" />
                      Composição Familiar
                    </h3>
                    
                    <div className="fam-reg-family-grid-enhanced">
                      {familyTypes.map((item) => (
                        <FamilyCounter
                          key={item.key}
                          item={item}
                          count={familyCount[item.key]}
                          onUpdate={updateFamilyCount}
                        />
                      ))}
                    </div>
                    
                    <div className="fam-reg-info-banner">
                      <div className="fam-reg-info-icon-box">
                        <Info size={24} color="#f97316" />
                      </div>
                      <div className="fam-reg-info-content">
                        <h3>Informação Importante</h3>
                        <p>Estes dados nos ajudam a dimensionar melhor o tipo de apoio que sua família precisa e conectar com ONGs especializadas.</p>
                      </div>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="fam-reg-needs-section">
                    <h3 className="fam-reg-section-subtitle">
                      <ListChecks size={24} color="#f97316" />
                      Principais Necessidades
                    </h3>
                    
                    <div className="fam-reg-needs-grid">
                      {[
                        'Alimentação', 'Roupas', 'Medicamentos', 'Material Escolar',
                        'Móveis', 'Eletrodomésticos', 'Consultas Médicas', 'Cursos Profissionalizantes'
                      ].map((need) => (
                        <label key={need} className="fam-reg-need-item">
                          <input 
                            type="checkbox" 
                            name="necessidades" 
                            value={need} 
                            className="fam-reg-need-input"
                            checked={formData.necessidades.includes(need)}
                            onChange={(e) => handleCheckboxChange('necessidades', need, e.target.checked)}
                          />
                          <div className="fam-reg-need-box">
                            <span className="fam-reg-need-label">{need}</span>
                            <div className="fam-reg-check-circle-box">
                              <CheckCircle2 size={16} />
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    <div className="fam-reg-final-step-section">
                      <div className="fam-reg-final-card">
                        <h3 className="fam-reg-final-title">Quase Pronto!</h3>
                        <p className="fam-reg-final-text">
                          Revise suas informações e clique em "Finalizar Cadastro" para enviar sua solicitação.
                        </p>
                        <div className="fam-reg-final-warning">
                          <ShieldCheck className="fam-reg-warning-icon" size={24} />
                          <p className="fam-reg-warning-text">
                            Seus dados serão analisados em até 24 horas. Você receberá uma confirmação por telefone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="fam-reg-form-footer">
                {step > 1 && (
                  <button type="button" className="fam-reg-btn-prev" onClick={prevStep}>
                    <ChevronLeft size={20} />
                    Anterior
                  </button>
                )}
                
                <div style={{ flex: 1 }}></div>
                
                {step < totalSteps ? (
                  <button type="submit" className="fam-reg-btn-next">
                    Próximo
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button type="submit" className="fam-reg-btn-finish" disabled={isLoading}>
                    {isLoading ? 'Finalizando...' : 'Finalizar Cadastro'}
                    <CheckCircle2 size={20} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>

      {showPrivacyModal && (
        <div className="fam-reg-modal-overlay">
          <div className="fam-reg-privacy-modal">
            <div className="fam-reg-privacy-header">
              <ShieldCheck size={24} color="#f97316" />
              <h3>Proteção de Dados</h3>
            </div>
            <p className="fam-reg-privacy-text">
              Seus dados serão protegidos conforme a LGPD. Utilizamos apenas para conectar sua família com ONGs e doadores.
            </p>
            <button 
              className="fam-reg-privacy-btn" 
              onClick={() => setShowPrivacyModal(false)}
            >
              Entendi, Continuar
            </button>
          </div>
        </div>
      )}

      {showAnalysisAlert && (
        <div className="fam-reg-alert-overlay">
          <div className="fam-reg-analysis-alert">
            <div className="fam-reg-alert-icon">
              <ShieldCheck size={32} />
            </div>
            <h3>Análise Iniciada!</h3>
            <p>Seu cadastro está sendo analisado. Você receberá uma notificação em até 24 horas.</p>
            <button 
              className="fam-reg-alert-btn" 
              onClick={() => setShowAnalysisAlert(false)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`fam-reg-toast fam-reg-toast-${toast.type}`}>
          <div className="fam-reg-toast-content">
            <span className="fam-reg-toast-message">{toast.message}</span>
            <button 
              className="fam-reg-toast-close" 
              onClick={() => setToast({ ...toast, show: false })}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
