import React, { useState } from 'react';
import { 
  ArrowLeft, Building2, FileText, Mail, Phone,
  CheckCircle2, ChevronRight, ChevronLeft,
  Heart, Users, Calendar, Globe, ShieldCheck, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PasswordField from '../../../components/ui/PasswordField';
import ApiService from '../../../services/apiService';
import './CadastroONGMobile.css';
import { useCEP } from '../../AdminDashboard/useCEP';

export default function CadastroONGMobile() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAnalysisAlert, setShowAnalysisAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const [formData, setFormData] = useState({
    nomeFantasia: '',
    razaoSocial: '',
    cnpj: '',
    dataFundacao: '',
    telefone: '',
    email: '',
    senha: '',
    website: '',
    causas: []
  });
  const { searchCEP, formatCEP } = useCEP();

  const totalSteps = 3;

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

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 4000);
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.nomeFantasia.trim() && formData.razaoSocial.trim();
      case 2:
        return formData.cnpj.replace(/\D/g, '').length === 14 && formData.dataFundacao;
      case 3:
        return formData.telefone.replace(/\D/g, '').length >= 10 && formData.email.trim() && formData.senha.length >= 6;
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
    if (step !== totalSteps) {
      handleNextStep();
      return;
    }

    setIsLoading(true);
    try {
      await ApiService.createONG(formData);
      setIsSubmitted(true);
      setTimeout(() => setShowAnalysisAlert(true), 2000);
    } catch (error) {
      console.error('Erro ao cadastrar ONG:', error);
      showToast('Erro ao realizar cadastro. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Instituição", icon: <Building2 size={20} /> },
    { id: 2, title: "Documentos", icon: <FileText size={20} /> },
    { id: 3, title: "Contato", icon: <Mail size={20} /> },
  ];

  if (isSubmitted) {
    return (
      <div className="ong-mob-container ong-reg-success-view">
        <div className="ong-mob-bg-blobs">
          <div className="ong-mob-blob ong-mob-blob-1"></div>
          <div className="ong-mob-blob ong-mob-blob-2"></div>
        </div>

        <div className="ong-mob-top">
          <Link to="/" className="ong-mob-back">
            <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeft size={18} />
            </div>
            <span style={{ fontWeight: 700 }}>Voltar</span>
          </Link>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Building2 size={18} />
            </div>
          </div>
        </div>

        <div className="ong-mob-card">
          <div className="ong-reg-success-icon-bg">
            <CheckCircle2 size={48} color="white" />
          </div>
          <h2 className="ong-mob-success-title">
            ONG <br/>
            <span className="ong-reg-text-highlight">Registrada!</span>
          </h2>
          <p className="ong-mob-success-description">
            Sua organização agora faz parte da rede oficial. Prepare-se para ampliar seu impacto!
          </p>
          
          <div className="ong-mob-xp-card">
            <div className="ong-mob-xp-header">
              <div>
                <p className="ong-mob-xp-label">Impacto Institucional</p>
                <h3 className="ong-mob-xp-value">+100 XP</h3>
              </div>
              <Zap size={32} color="#8b5cf6" />
            </div>
            <div className="ong-mob-xp-bar">
              <div className="ong-mob-xp-inner" style={{ width: '25%' }} />
            </div>
            <p className="ong-mob-xp-footer">Complete a verificação para ganhar selo de confiança</p>
          </div>

          <div className="ong-mob-next-steps">
            <h3 className="ong-mob-next-steps-title">Próximos Passos</h3>
            <div className="ong-mob-steps-list">
              {[
                { title: "Verificação CNPJ", desc: "Validaremos os dados da sua instituição", icon: <ShieldCheck size={20} /> },
                { title: "Painel de Gestão", desc: "Acesse ferramentas de mapeamento", icon: <Globe size={20} /> },
                { title: "Rede de Apoio", desc: "Conecte-se com doadores e voluntários", icon: <Users size={20} /> }
              ].map((item, i) => (
                <div key={i} className="ong-mob-step-card">
                  <div className="ong-mob-step-icon">{item.icon}</div>
                  <div>
                    <h4 className="ong-mob-step-title">{item.title}</h4>
                    <p className="ong-mob-step-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ong-mob-success-actions">
            <Link to="/" className="ong-mob-btn ong-mob-btn-primary">Início</Link>
            <button className="ong-mob-btn ong-mob-btn-secondary">Acessar Painel</button>
          </div>
        </div>

        {showAnalysisAlert && (
          <div className="ong-reg-modal-overlay">
            <div className="ong-reg-alert-modal">
              <div className="ong-reg-alert-icon-box">
                <ShieldCheck size={48} />
              </div>
              <h3>Cadastro em Análise</h3>
              <p>Seu cadastro está sendo analisado por nossa equipe. Você receberá uma notificação em até 24 horas.</p>
              <button 
                className="ong-reg-alert-btn" 
                onClick={() => setShowAnalysisAlert(false)}
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ong-mob-container">
      {/* Background Blobs */}
      <div className="ong-mob-bg-blobs">
        <div className="ong-mob-blob ong-mob-blob-1"></div>
        <div className="ong-mob-blob ong-mob-blob-2"></div>
      </div>

      <div className="ong-mob-top">
        <Link to="/cadastro" className="ong-mob-back">
          <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} />
          </div>
          <span style={{ fontWeight: 700 }}>Voltar</span>
        </Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Building2 size={18} />
          </div>
        </div>
      </div>

      {/* Progress Container */}
      <div className="ong-reg-progress-container">
        <div className="ong-progress-wrapper">
          <div className="ong-progress-header">
            <h4 className="ong-progress-title">Etapa {step} de {totalSteps}</h4>
            <span className="ong-progress-percentage">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          
          <div className="ong-progress-track">
            <div 
              className="ong-progress-fill"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          <div className="ong-progress-steps">
            {steps.map((stepItem, index) => (
              <div 
                key={stepItem.id}
                className={`ong-progress-step ${step > index ? 'completed' : ''}`}
              >
                {step > index && <span>✓</span>}
                <span>{stepItem.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ong-mob-content">
        <div className="ong-mob-card">
          <h2 className="ong-mob-title">
            {step === 1 && <>Sua <span className="ong-reg-text-highlight">instituição</span></>}
            {step === 2 && <>Dados <span className="ong-reg-text-highlight">legais</span></>}
            {step === 3 && <>Como <span className="ong-reg-text-highlight">contatá-los</span>?</>}
          </h2>
          <p className="ong-mob-subtitle">
            {step === 1 && "Comece informando o nome e a identidade da sua organização."}
            {step === 2 && "Precisamos do CNPJ e dados de registro para validação."}
            {step === 3 && "Informe os canais oficiais para comunicação."}
          </p>

        <form onSubmit={step === totalSteps ? handleSubmit : (e) => e.preventDefault()} className="ong-mob-form">
          {step === 1 && (
            <>
              <div className="ong-mob-input-group">
                <label className="ong-mob-input-label">Nome Fantasia da ONG <span style={{ color: '#ef4444' }}>*</span></label>
                <div className="ong-mob-input-wrapper">
                  <Building2 className="ong-mob-input-icon" size={20} />
                  <input 
                    required 
                    type="text" 
                    className="ong-mob-input" 
                    placeholder="Nome da organização"
                    value={formData.nomeFantasia}
                    onChange={(e) => setFormData(prev => ({ ...prev, nomeFantasia: e.target.value }))}
                  />
                </div>
              </div>
              <div className="ong-mob-input-group">
                <label className="ong-mob-input-label">Razão Social <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  required 
                  type="text" 
                  className="ong-mob-input" 
                  placeholder="Razão social completa"
                  value={formData.razaoSocial}
                  onChange={(e) => setFormData(prev => ({ ...prev, razaoSocial: e.target.value }))}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="ong-mob-input-group">
                <label className="ong-mob-input-label">CNPJ <span style={{ color: '#ef4444' }}>*</span></label>
                <div className="ong-mob-input-wrapper">
                  <FileText className="ong-mob-input-icon" size={20} />
                  <input 
                    required 
                    type="text" 
                    className="ong-mob-input" 
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={handleCNPJChange}
                    maxLength={18}
                  />
                </div>
              </div>
              <div className="ong-mob-input-group">
                <label className="ong-mob-input-label">Data de Fundação <span style={{ color: '#ef4444' }}>*</span></label>
                <div className="ong-mob-input-wrapper">
                  <Calendar className="ong-mob-input-icon" size={20} />
                  <input 
                    required 
                    type="date" 
                    className="ong-mob-input"
                    value={formData.dataFundacao}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataFundacao: e.target.value }))}
                  />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="ong-mob-input-group">
                <label className="ong-mob-input-label">Telefone Comercial <span style={{ color: '#ef4444' }}>*</span></label>
                <div className="ong-mob-input-wrapper">
                  <Phone className="ong-mob-input-icon" size={20} />
                  <input 
                    required 
                    type="tel" 
                    className="ong-mob-input" 
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={handlePhoneChange}
                    maxLength={15}
                  />
                </div>
              </div>
              <div className="ong-mob-input-group">
                <label className="ong-mob-input-label">E-mail Institucional <span style={{ color: '#ef4444' }}>*</span></label>
                <div className="ong-mob-input-wrapper">
                  <Mail className="ong-mob-input-icon" size={20} />
                  <input 
                    required 
                    type="email" 
                    className="ong-mob-input" 
                    placeholder="contato@ong.org"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
              <PasswordField 
                label="Senha de Acesso"
                placeholder="Crie uma senha segura"
                required
                value={formData.senha}
                onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
              />
            </>
          )}

          <div className="ong-mob-actions">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="ong-mob-btn ong-mob-btn-secondary ong-mob-btn-full">
                <ChevronLeft size={20} />
                <span>Anterior</span>
              </button>
            ) : (
              <Link to="/cadastro" className="ong-mob-btn ong-mob-btn-secondary ong-mob-btn-full" style={{ textAlign: 'center', lineHeight: '36px' }}>Cancelar</Link>
            )}
            
            {step < totalSteps ? (
              <button type="submit" className="ong-mob-btn ong-mob-btn-primary ong-mob-btn-full">
                <span>Continuar</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <button type="submit" className="ong-mob-btn ong-mob-btn-primary ong-mob-btn-full" disabled={isLoading}>
                <span>{isLoading ? 'Finalizando...' : 'Finalizar Registro'}</span>
                <CheckCircle2 size={20} />
              </button>
            )}
          </div>
        </form>
        </div>
      </div>

      {toast.show && (
        <div className="ong-mob-toast" style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: toast.type === 'error' ? '#ef4444' : '#10b981', color: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <div className="ong-mob-toast-content">
            <span className="ong-mob-toast-message">{toast.message}</span>
            <button className="ong-mob-toast-close" onClick={() => setToast({ show: false, message: '', type: 'error' })} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}
