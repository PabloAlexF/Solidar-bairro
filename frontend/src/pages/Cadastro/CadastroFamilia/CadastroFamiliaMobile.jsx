import { useState } from 'react';
import { 
  Users, ArrowLeft, User, Home, Users2, DollarSign, 
  ListChecks, MapPin, CheckCircle2, ChevronRight, 
  ChevronLeft, Fingerprint, IdCard, Calendar, 
  Phone, Mail, ShieldCheck, Trophy, 
  Zap, Info, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PasswordField from '../../../components/ui/PasswordField';
import ApiService from '../../../services/apiService';
import './CadastroFamiliaMobile.css';
import { useCEP } from '../../AdminDashboard/useCEP';

const FamilyCounter = ({ item, count, onUpdate }) => (
  <div className="fam-mob-family-card-input">
    <div className="fam-mob-family-card-header">
      <span className="fam-mob-family-card-emoji">{item.icon}</span>
      <span className="fam-mob-family-card-label">{item.label}</span>
    </div>
    <div className="fam-mob-family-counter-enhanced">
      <button 
        type="button" 
        className="fam-mob-counter-btn fam-mob-counter-minus"
        onClick={() => onUpdate(item.key, -1)}
        disabled={count === 0}
      >
        -
      </button>
      <span className="fam-mob-counter-display">{count}</span>
      <button 
        type="button" 
        className="fam-mob-counter-btn fam-mob-counter-plus"
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
    className="fam-mob-map-button"
    onClick={onClick}
    disabled={isLocating}
  >
    <div className="fam-mob-map-icon-box">
      <MapPin size={28} className={isLocating ? 'animate-pulse' : ''} />
    </div>
    <div className="fam-mob-map-info">
      <h4 className="fam-mob-map-title">
        {isLocating ? 'Localizando...' : 'Localizar no Mapa'}
      </h4>
      <p className="fam-mob-map-desc">
        {isLocating ? 'Obtendo localização' : 'Ajuda as ONGs a te encontrarem com precisão'}
      </p>
    </div>
  </button>
);

export default function CadastroFamiliaMobile() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(true);
  const [showAnalysisAlert, setShowAnalysisAlert] = useState(false);
  const [addressData, setAddressData] = useState({ endereco: '', bairro: '', referencia: '', cep: '', numero: '', cidade: '', estado: '' });
  const [isLocating, setIsLocating] = useState(false);
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
  const { loadingCep, formatCEP, searchCEP } = useCEP();
  
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
        if (!formData.cpf.trim()) newErrors.cpf = true;
        if (!formData.rg.trim()) newErrors.rg = true;
        if (!formData.rendaFamiliar) newErrors.rendaFamiliar = true;
        break;
      case 3:
        if (!formData.telefone.trim()) newErrors.telefone = true;
        if (!formData.horarioContato) newErrors.horarioContato = true;
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

  const handleCepBlur = async (e) => {
    const result = await searchCEP(e.target.value);
    if (result) {
      if (result.error) {
        showToast(result.error, 'error');
        setAddressData(prev => ({ ...prev, endereco: '', bairro: '', cidade: '', estado: '' }));
      } else {
        showToast('Endereço encontrado!', 'success');
        const { logradouro, bairro, localidade, uf } = result.data;
        setAddressData(prev => ({
          ...prev,
          endereco: logradouro || '',
          bairro: bairro || '',
          cidade: localidade || '',
          estado: uf || '',
        }));
      }
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
        setFormData(prev => ({
          ...prev,
          [field]: [...prev[field], value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: prev[field].filter(item => item !== value)
        }));
        const newDetails = { ...needDetails };
        delete newDetails[value];
        setNeedDetails(newDetails);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: checked 
          ? [...prev[field], value]
          : prev[field].filter(item => item !== value)
      }));
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
    setIsLoading(true);
    
    try {
      const submitData = {
        ...formData,
        endereco: addressData.endereco || formData.endereco,
        bairro: addressData.bairro || formData.bairro,
        pontoReferencia: addressData.referencia || formData.pontoReferencia,
        subQuestionAnswers: needDetails
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
      <div className="fam-mob-container fam-mob-theme fam-mob-success-view">
        <div className="fam-mob-form-card-new">
          <div className="fam-mob-success-grid">
            <div className="fam-mob-success-left">
              <div className="fam-mob-success-icon-bg">
                <Trophy size={48} color="white" />
              </div>
              <h1 className="fam-mob-success-title">
                Família <br/>
                <span className="fam-mob-text-highlight">Registrada!</span>
              </h1>
              <p className="fam-mob-success-description">
                Sua família agora faz parte da rede oficial. Prepare-se para receber apoio!
              </p>
              
              <div className="fam-mob-xp-card">
                <div className="fam-mob-xp-header">
                  <div>
                    <p className="fam-mob-xp-label">Impacto Familiar</p>
                    <h3 className="fam-mob-xp-value">+50 XP</h3>
                  </div>
                  <Zap size={32} color="#f97316" />
                </div>
                <div className="fam-mob-xp-bar">
                  <div className="fam-mob-xp-inner" style={{ width: '15%' }} />
                </div>
                <p className="fam-mob-xp-footer">Complete a verificação para ganhar benefícios</p>
              </div>
            </div>

            <div className="fam-mob-success-right">
              <div>
                <h2 className="fam-mob-success-steps-title">Próximos Passos</h2>
                <div className="fam-mob-steps-cards-list">
                  {[
                    { title: "Verificação de Dados", desc: "Validaremos os dados da sua família", icon: <ShieldCheck /> },
                    { title: "Mapa de Apoio", desc: "Veja ONGs próximas a você", icon: <MapPin /> },
                    { title: "Rede de Solidariedade", desc: "Conecte-se com doadores", icon: <Users /> }
                  ].map((item, i) => (
                    <div key={i} className="fam-mob-step-card-mini">
                      <div className="fam-mob-step-card-icon">{item.icon}</div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="fam-mob-success-actions">
                <Link href="/" className="fam-mob-btn-base fam-mob-btn-primary">Início</Link>
                <button className="fam-mob-btn-base fam-mob-btn-secondary">Acessar Painel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fam-mob-container fam-mob-theme">
      <div className="fam-mob-bg-blobs">
        <div className="fam-mob-blob-1"></div>
        <div className="fam-mob-blob-2"></div>
      </div>

      <nav className="fam-mob-navbar">
        <Link to="/cadastro" className="fam-mob-back-link">
          <div className="fam-mob-back-icon">
            <ArrowLeft size={20} />
          </div>
          <span>Voltar</span>
        </Link>
        
        <div className="fam-mob-brand">
          <div className="fam-mob-brand-logo">
            <Users size={24} />
          </div>
          <h1 className="fam-mob-brand-name">SolidarBairro</h1>
        </div>
      </nav>

      <div className="fam-mob-main-grid">
        <main className="fam-mob-content-area">
          <div className="fam-mob-form-card">
            <div className="fam-mob-form-header">
              <div className="fam-mob-progress-container">
                <div className="fam-mob-step-badge">Etapa {step} de {totalSteps}</div>
                <div className="fam-mob-progress-bar-bg">
                  <div 
                    className="fam-mob-progress-bar-fill" 
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <h1 className="fam-mob-form-title">
                {step === 1 && <>Dados do <span className="fam-mob-text-highlight">Responsável</span></>}
                {step === 2 && <>Documentos <span className="fam-mob-text-highlight">Pessoais</span></>}
                {step === 3 && <>Informações de <span className="fam-mob-text-highlight">Contato</span></>}
                {step === 4 && <>Endereço da <span className="fam-mob-text-highlight">Residência</span></>}
                {step === 5 && <>Composição <span className="fam-mob-text-highlight">Familiar</span></>}
                {step === 6 && <>Necessidades <span className="fam-mob-text-highlight">Específicas</span></>}
              </h1>
              
              <p className="fam-mob-form-description">
                {step === 1 && "Vamos começar com os dados básicos do responsável pela família."}
                {step === 2 && "Agora precisamos dos documentos para validação das informações."}
                {step === 3 && "Como podemos entrar em contato com vocês quando necessário?"}
                {step === 4 && "Onde sua família reside? Isso nos ajuda a encontrar ONGs próximas."}
                {step === 5 && "Conte-nos sobre a composição da sua família para melhor atendimento."}
                {step === 6 && "Quais são as principais necessidades da sua família no momento?"}
              </p>
            </div>

            <form onSubmit={step === totalSteps ? handleSubmit : (e) => e.preventDefault()} className="fam-mob-form">
              <div className="fam-mob-form-body">
                {step === 1 && (
                  <div className="fam-mob-form-grid">
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">Nome Completo <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-input-wrapper">
                        <User className="fam-mob-input-icon" />
                        <input 
                          type="text" 
                          className="fam-mob-form-input"
                          style={errors.nomeCompleto ? { borderColor: '#ef4444' } : {}}
                          placeholder="Digite seu nome completo"
                          value={formData.nomeCompleto}
                          onChange={(e) => updateFormData('nomeCompleto', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">Data de Nascimento <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-input-wrapper">
                        <Calendar className="fam-mob-input-icon" />
                        <input 
                          type="date" 
                          className="fam-mob-form-input"
                          style={errors.dataNascimento ? { borderColor: '#ef4444' } : {}}
                          value={formData.dataNascimento}
                          onChange={(e) => updateFormData('dataNascimento', e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">Estado Civil <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-radio-grid" style={errors.estadoCivil ? { border: '1px solid #ef4444', borderRadius: '12px', padding: '0.5rem' } : {}}>
                        {['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)'].map((estado) => (
                          <label key={estado} className="fam-mob-radio-label">
                            <input 
                              type="radio" 
                              name="estado_civil" 
                              value={estado} 
                              className="fam-mob-radio-input"
                              checked={formData.estadoCivil === estado}
                              onChange={(e) => updateFormData('estadoCivil', e.target.value)}
                            />
                            <div className="fam-mob-radio-box">{estado}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">Profissão <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-input-wrapper">
                        <User className="fam-mob-input-icon" />
                        <input 
                          type="text" 
                          className="fam-mob-form-input"
                          style={errors.profissao ? { borderColor: '#ef4444' } : {}}
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
                  <div className="fam-mob-form-grid">
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">CPF <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-input-wrapper">
                        <IdCard className="fam-mob-input-icon" />
                        <input 
                          type="text" 
                          className="fam-mob-form-input"
                          style={errors.cpf ? { borderColor: '#ef4444' } : {}}
                          placeholder="000.000.000-00"
                          value={formData.cpf}
                          onChange={handleCPFChange}
                          maxLength={14}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">RG <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-input-wrapper">
                        <Fingerprint className="fam-mob-input-icon" />
                        <input 
                          type="text" 
                          className="fam-mob-form-input"
                          style={errors.rg ? { borderColor: '#ef4444' } : {}}
                          placeholder="00.000.000-0 ou 000.000.000-00"
                          value={formData.rg}
                          onChange={handleRGChange}
                          maxLength={14}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">NIS (Cadastro Único)</label>
                      <div className="fam-mob-input-wrapper">
                        <IdCard className="fam-mob-input-icon" />
                        <input 
                          type="text" 
                          className="fam-mob-form-input" 
                          placeholder="000.00000.00-0 (se possuir)"
                          value={formData.nis}
                          onChange={(e) => updateFormData('nis', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">Renda Familiar Mensal <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-card-radio-grid" style={errors.rendaFamiliar ? { border: '1px solid #ef4444', borderRadius: '12px', padding: '0.5rem' } : {}}>
                        {[
                          { label: 'Até R$ 500', value: 'ate_500', icon: <DollarSign size={20} />, desc: 'Renda baixa' },
                          { label: 'R$ 501 - R$ 1.000', value: '501_1000', icon: <DollarSign size={20} />, desc: 'Renda moderada' },
                          { label: 'R$ 1.001 - R$ 2.000', value: '1001_2000', icon: <DollarSign size={20} />, desc: 'Renda média' },
                          { label: 'Acima de R$ 2.000', value: 'acima_2000', icon: <DollarSign size={20} />, desc: 'Renda alta' }
                        ].map((renda) => (
                          <label key={renda.value} className="fam-mob-radio-label">
                            <input 
                              type="radio" 
                              name="renda" 
                              value={renda.value} 
                              className="fam-mob-radio-input"
                              checked={formData.rendaFamiliar === renda.value}
                              onChange={(e) => updateFormData('rendaFamiliar', e.target.value)}
                            />
                            <div className="fam-mob-card-radio-box-enhanced">
                              <div className="fam-mob-card-icon-box-enhanced">
                                {renda.icon}
                              </div>
                              <div className="fam-mob-card-content">
                                <h4 className="fam-mob-card-title-enhanced">{renda.label}</h4>
                                <p className="fam-mob-card-desc-enhanced">{renda.desc}</p>
                              </div>
                              <div className="fam-mob-card-check-indicator">
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
                  <div className="fam-mob-form-grid">
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">Telefone Principal <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-input-wrapper">
                        <Phone className="fam-mob-input-icon" />
                        <input 
                          type="tel" 
                          className="fam-mob-form-input"
                          style={errors.telefone ? { borderColor: '#ef4444' } : {}}
                          placeholder="(00) 00000-0000"
                          value={formData.telefone}
                          onChange={handlePhoneChange}
                          maxLength={15}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">WhatsApp (opcional)</label>
                      <div className="fam-mob-input-wrapper">
                        <Phone className="fam-mob-input-icon" />
                        <input 
                          type="tel" 
                          className="fam-mob-form-input" 
                          placeholder="(00) 00000-0000"
                          value={formData.whatsapp}
                          onChange={handleWhatsAppChange}
                          maxLength={15}
                        />
                      </div>
                    </div>
                    
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">E-mail (opcional)</label>
                      <div className="fam-mob-input-wrapper">
                        <Mail className="fam-mob-input-icon" />
                        <input 
                          type="email" 
                          className="fam-mob-form-input" 
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">Melhor horário para contato <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-radio-grid" style={errors.horarioContato ? { border: '1px solid #ef4444', borderRadius: '12px', padding: '0.5rem' } : {}}>
                        {['Manhã', 'Tarde', 'Noite', 'Qualquer'].map((horario) => (
                          <label key={horario} className="fam-mob-radio-label">
                            <input 
                              type="radio" 
                              name="horario" 
                              value={horario} 
                              className="fam-mob-radio-input"
                              checked={formData.horarioContato === horario}
                              onChange={(e) => updateFormData('horarioContato', e.target.value)}
                            />
                            <div className="fam-mob-radio-box">{horario}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <PasswordField 
                      label="Senha de Acesso"
                      placeholder="Crie uma senha segura"
                      required
                      error={errors.senha}
                      value={formData.senha}
                      onChange={(e) => updateFormData('senha', e.target.value)}
                    />
                    
                    <PasswordField 
                      label="Confirmar Senha"
                      error={errors.confirmarSenha}
                      placeholder="Digite a senha novamente"
                      required
                      value={formData.confirmarSenha}
                      onChange={(e) => updateFormData('confirmarSenha', e.target.value)}
                    />
                  </div>
                )}

                {step === 4 && (
                  <div className="fam-mob-form-grid">
                    <MapLocationButton
                      isLocating={isLocating}
                      onClick={handleMapLocation}
                    />

                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">CEP <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-input-wrapper">
                        <Home className="fam-mob-input-icon" />
                        <input
                          type="text"
                          className="fam-mob-form-input"
                          style={errors.cep ? { borderColor: '#ef4444' } : {}}
                          placeholder="00000-000"
                          value={addressData.cep}
                          onChange={(e) => setAddressData(prev => ({ ...prev, cep: formatCEP(e.target.value) }))}
                          onBlur={handleCepBlur}
                          maxLength={9}
                          disabled={loadingCep}
                        />
                        {loadingCep && <div className="fam-mob-spinner" />}
                      </div>
                    </div>

                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">Endereço <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-input-wrapper">
                        <Home className="fam-mob-input-icon" />
                        <input
                          type="text"
                          className="fam-mob-form-input"
                          style={errors.endereco ? { borderColor: '#ef4444' } : {}}
                          placeholder="Rua, Avenida, etc."
                          value={addressData.endereco}
                          onChange={(e) => setAddressData(prev => ({ ...prev, endereco: e.target.value }))}
                          disabled={loadingCep}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">Bairro <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-input-wrapper">
                        <MapPin className="fam-mob-input-icon" />
                        <input 
                          type="text" 
                          className="fam-mob-form-input"
                          style={errors.bairro ? { borderColor: '#ef4444' } : {}}
                          placeholder="Nome do bairro"
                          value={addressData.bairro}
                          onChange={(e) => setAddressData(prev => ({ ...prev, bairro: e.target.value }))}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">Ponto de Referência</label>
                      <div className="fam-mob-input-wrapper">
                        <MapPin className="fam-mob-input-icon" />
                        <input 
                          type="text" 
                          className="fam-mob-form-input" 
                          placeholder="Próximo a..."
                          value={addressData.referencia}
                          onChange={(e) => setAddressData(prev => ({ ...prev, referencia: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="fam-mob-input-group">
                      <label className="fam-mob-input-label">Tipo de Moradia <span style={{ color: '#ef4444' }}>*</span></label>
                      <div className="fam-mob-card-radio-grid" style={errors.tipoMoradia ? { border: '1px solid #ef4444', borderRadius: '12px', padding: '0.5rem' } : {}}>
                        {[
                          { label: 'Casa Própria', icon: <Home size={20} /> },
                          { label: 'Casa Alugada', icon: <Home size={20} /> },
                          { label: 'Apartamento', icon: <Home size={20} /> },
                          { label: 'Outros', icon: <Home size={20} /> }
                        ].map((tipo) => (
                          <label key={tipo.label} className="fam-mob-radio-label">
                            <input 
                              type="radio" 
                              name="tipo_moradia" 
                              value={tipo.label} 
                              className="fam-mob-radio-input"
                              checked={formData.tipoMoradia === tipo.label}
                              onChange={(e) => updateFormData('tipoMoradia', e.target.value)}
                            />
                            <div className="fam-mob-card-radio-box">
                              <div className="fam-mob-card-icon-box">
                                {tipo.icon}
                              </div>
                              <div>
                                <h4 className="fam-mob-card-title">{tipo.label}</h4>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="fam-mob-family-input-section">
                    <h3 className="fam-mob-section-subtitle">
                      <Users2 size={24} color="#f97316" />
                      Composição Familiar
                    </h3>
                    
                    <div className="fam-mob-family-grid-enhanced">
                      {familyTypes.map((item) => (
                        <FamilyCounter
                          key={item.key}
                          item={item}
                          count={familyCount[item.key]}
                          onUpdate={updateFamilyCount}
                        />
                      ))}
                    </div>
                    
                    <div className="fam-mob-info-banner">
                      <div className="fam-mob-info-icon-box">
                        <Info size={24} color="#f97316" />
                      </div>
                      <div className="fam-mob-info-content">
                        <h3>Informação Importante</h3>
                        <p>Estes dados nos ajudam a dimensionar melhor o tipo de apoio que sua família precisa e conectar com ONGs especializadas.</p>
                      </div>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="fam-mob-needs-section">
                    <h3 className="fam-mob-section-subtitle">
                      <ListChecks size={24} color="#f97316" />
                      Principais Necessidades
                    </h3>
                    
                    <div className="fam-mob-needs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                      {[
                        'Alimentação', 'Roupas', 'Medicamentos', 'Material Escolar',
                        'Móveis', 'Eletrodomésticos', 'Consultas Médicas', 'Cursos Profissionalizantes'
                      ].map((need) => (
                        <label key={need} className="fam-mob-need-item">
                          <input 
                            type="checkbox" 
                            name="necessidades" 
                            value={need} 
                            className="fam-mob-need-input"
                            checked={formData.necessidades.includes(need)}
                            onChange={(e) => handleCheckboxChange('necessidades', need, e.target.checked)}
                          />
                          <div className="fam-mob-need-box">
                            <span className="fam-mob-need-label">{need}</span>
                            <div className="fam-mob-check-circle-box">
                              <CheckCircle2 size={16} />
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                    
                    <div className="fam-mob-final-step-section">
                      <div className="fam-mob-final-card">
                        <h3 className="fam-mob-final-title">Quase Pronto!</h3>
                        <p className="fam-mob-final-text">
                          Revise suas informações e clique em "Finalizar Cadastro" para enviar sua solicitação.
                        </p>
                        <div className="fam-mob-final-warning">
                          <ShieldCheck className="fam-mob-warning-icon" size={24} />
                          <p className="fam-mob-warning-text">
                            Seus dados serão analisados em até 24 horas. Você receberá uma confirmação por telefone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="fam-mob-form-footer">
                {step > 1 && (
                  <button type="button" className="fam-mob-btn-prev" onClick={prevStep}>
                    <ChevronLeft size={20} />
                    Anterior
                  </button>
                )}
                
                <div style={{ flex: 1 }}></div>
                
                {step < totalSteps ? (
                  <button type="button" onClick={handleNextStep} className="fam-mob-btn-next">
                    Próximo
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button type="submit" className="fam-mob-btn-finish" disabled={isLoading}>
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
        <div className="fam-mob-modal-overlay">
          <div className="fam-mob-privacy-modal">
            <div className="fam-mob-privacy-header">
              <ShieldCheck size={24} color="#f97316" />
              <h3>Proteção de Dados</h3>
            </div>
            <p className="fam-mob-privacy-text">
              Seus dados serão protegidos conforme a LGPD. Utilizamos apenas para conectar sua família com ONGs e doadores.
            </p>
            <button 
              className="fam-mob-privacy-btn" 
              onClick={() => setShowPrivacyModal(false)}
            >
              Entendi, Continuar
            </button>
          </div>
        </div>
      )}

      {showAnalysisAlert && (
        <div className="fam-mob-alert-overlay">
          <div className="fam-mob-analysis-alert">
            <div className="fam-mob-alert-icon">
              <ShieldCheck size={32} />
            </div>
            <h3>Cadastro Concluído!</h3>
            <p>Seu cadastro foi aprovado automaticamente. Você já pode acessar o sistema.</p>
            <button 
              className="fam-mob-alert-btn" 
              onClick={() => setShowAnalysisAlert(false)}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`fam-mob-toast fam-mob-toast-${toast.type}`}>
          <div className="fam-mob-toast-content">
            <span className="fam-mob-toast-message">{toast.message}</span>
            <button 
              className="fam-mob-toast-close" 
              onClick={() => setToast({ ...toast, show: false })}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showNeedModal && (
        <div className="fam-mob-modal-overlay" style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div className="fam-mob-modal" style={{
            background: 'white', padding: '20px', borderRadius: '20px', width: '90%', maxWidth: '350px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>Especificar: {currentNeed}</h3>
              <button onClick={() => setShowNeedModal(false)} style={{ background: 'none', border: 'none', padding: '4px' }}><X size={20} /></button>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b' }}>Detalhes (opcional):</label>
              <textarea 
                value={tempDetail} 
                onChange={(e) => setTempDetail(e.target.value)}
                placeholder="Ex: Tamanho, tipo, restrições..."
                rows={4}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ marginTop: '20px' }}>
              <button onClick={saveNeedDetail} style={{
                width: '100%', padding: '14px', background: '#f97316', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem'
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
