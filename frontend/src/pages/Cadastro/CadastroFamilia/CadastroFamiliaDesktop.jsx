import { useState } from 'react';
import { 
  Users, ArrowLeft, User, Home, Users2, DollarSign, 
  ListChecks, MapPin, CheckCircle2, ChevronRight, 
  ChevronLeft, Fingerprint, IdCard, Calendar, 
  Phone, Mail, ShieldCheck, Trophy, 
  Zap, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FormStep from '../../../components/forms/FormStep';
import Step1ResponsavelData from '../../../components/forms/Step1ResponsavelData';
import Step2DocumentosData from '../../../components/forms/Step2DocumentosData';
import Step3ContatoData from '../../../components/forms/Step3ContatoData';
import Step4EnderecoData from '../../../components/forms/Step4EnderecoData';
import Step5FamiliaData from '../../../components/forms/Step5FamiliaData';
import Step6NecessidadesData from '../../../components/forms/Step6NecessidadesData';
import Toast from '../../../components/ui/Toast';
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
  const [showAddressModal, setShowAddressModal] = useState(false);
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
      showToast('Família cadastrada com sucesso! Seu cadastro está sendo analisado. Você receberá uma notificação em até 24 horas. O administrador precisa liberar seu acesso.', 'success');
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
                  bairro: neighborhood,
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
          
          // Mostrar modal de confirmação
          setShowAddressModal(true);
          
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
                <Link to="/" className="fam-reg-btn-base fam-reg-btn-primary">Início</Link>
                <Link to="/quero-ajudar" className="fam-reg-btn-base fam-reg-btn-secondary">Ver meu pedido</Link>
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
        <Link to="/" className="fam-reg-back-link">
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
                  <Step1ResponsavelData 
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}

                {step === 2 && (
                  <Step2DocumentosData 
                    formData={formData}
                    updateFormData={updateFormData}
                    formatters={{
                      handleCPFChange,
                      handleRGChange
                    }}
                  />
                )}

                {step === 3 && (
                  <Step3ContatoData 
                    formData={formData}
                    updateFormData={updateFormData}
                    formatters={{
                      handlePhoneChange,
                      handleWhatsAppChange
                    }}
                  />
                )}

                {step === 4 && (
                  <Step4EnderecoData 
                    formData={formData}
                    updateFormData={updateFormData}
                    addressData={addressData}
                    setAddressData={setAddressData}
                    isLocating={isLocating}
                    handleMapLocation={handleMapLocation}
                  />
                )}

                {step === 5 && (
                  <Step5FamiliaData 
                    familyCount={familyCount}
                    updateFamilyCount={updateFamilyCount}
                  />
                )}

                {step === 6 && (
                  <Step6NecessidadesData 
                    formData={formData}
                    handleCheckboxChange={handleCheckboxChange}
                  />
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

      {showAddressModal && (
        <div className="fam-reg-modal-overlay">
          <div className="fam-reg-address-modal">
            <div className="fam-reg-address-header">
              <MapPin size={24} color="#f97316" />
              <h3>Confirme seu Endereço</h3>
            </div>
            <div className="fam-reg-address-content">
              <p><strong>Endereço:</strong> {addressData.endereco}</p>
              <p><strong>Bairro:</strong> {addressData.bairro}</p>
              <p><strong>Referência:</strong> {addressData.referencia}</p>
            </div>
            <p className="fam-reg-address-warning">
              Por favor, verifique se as informações estão corretas e faça as correções necessárias nos campos.
            </p>
            <button 
              className="fam-reg-address-btn" 
              onClick={() => setShowAddressModal(false)}
            >
              Entendi, vou conferir
            </button>
          </div>
        </div>
      )}

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

      {/* Toast */}
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ show: false, message: '', type: 'error' })}
      />
    </div>
  );
}
