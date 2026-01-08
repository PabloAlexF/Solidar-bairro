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
import '../styles/components/CadastroFamilia.css';

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
  const [familyCount, setFamilyCount] = useState({ criancas: 0, jovens: 0, adultos: 1, idosos: 0 });
  
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
  
  const updateFamilyCount = (key, increment) => {
    setFamilyCount(prev => ({
      ...prev,
      [key]: Math.max(0, prev[key] + increment)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setShowAnalysisAlert(true), 2000);
  };

  const handleMapLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não suportada');
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
          alert('Erro ao obter endereço');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        alert(`Erro GPS: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 25000, maximumAge: 0 }
    );
  };

  if (isSubmitted) {
    return (
      <div className="cadastro-container success-page-desktop familia-theme animate-fadeIn">
        <div className="floating-elements">
          <div className="float-shape s1"></div>
          <div className="float-shape s2"></div>
          <div className="float-shape s3"></div>
        </div>
        
        <div className="success-desktop-wrapper">
          <div className="success-left">
            <div className="success-icon">
              <CheckCircle2 size={64} />
            </div>
            
            <h1 className="success-title">
              Impacto <span className="text-gradient">Confirmado!</span>
            </h1>
            
            <p className="success-text">
              Sua família agora faz parte da nossa rede de solidariedade. Transformamos dados em esperança.
            </p>

            <div className="analysis-info">
              <div className="analysis-icon">
                <ShieldCheck size={24} />
              </div>
              <div className="analysis-text">
                <strong>Análise em Andamento</strong>
                <p>Seu cadastro será analisado em até 24 horas. Você receberá uma notificação quando for aprovado.</p>
              </div>
            </div>

            <div className="success-actions">
              <Link to="/" className="btn-primary">
                <Home size={20} />
                Acessar Painel
              </Link>
              <button className="btn-secondary">
                <User size={20} />
                Ver Perfil
              </button>
            </div>
          </div>

          <div className="success-right">
            <div className="achievements-section">
              <h3>Conquistas Desbloqueadas</h3>
              <div className="achievements-grid">
                <div className="achievement-item unlocked">
                  <Rocket size={24} />
                  <span>Pioneiro</span>
                </div>
                <div className="achievement-item unlocked">
                  <Heart size={24} />
                  <span>Solidário</span>
                </div>
                <div className="achievement-item locked">
                  <Zap size={24} />
                  <span>Ativo</span>
                </div>
                <div className="achievement-item locked">
                  <Award size={24} />
                  <span>Doador</span>
                </div>
              </div>
            </div>

            <div className="success-stats">
              <div className="stat-item">
                <strong>Nível 01</strong>
                <span>50 XP ganhos</span>
              </div>
              <div className="stat-item">
                <strong>Prioritário</strong>
                <span>Status ativo</span>
              </div>
            </div>
          </div>
        </div>

        {showAnalysisAlert && (
          <div className="alert-overlay">
            <div className="analysis-alert">
              <div className="alert-icon">
                <ShieldCheck size={48} />
              </div>
              <h3>Cadastro em Análise</h3>
              <p>Seu cadastro está sendo analisado por nossa equipe. Você receberá uma notificação em até 24 horas com o resultado.</p>
              <button 
                className="alert-btn" 
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
    <div className="cadastro-container familia-theme">
      <div className="bg-blobs">
        <div className="blob-1" />
        <div className="blob-2" />
      </div>

      <nav className="navbar">
        <Link to="/" className="back-link">
          <div className="back-icon">
            <ArrowLeft size={20} />
          </div>
          <span className="back-text">Voltar</span>
        </Link>
        <div className="brand">
          <div className="brand-logo">
            <Users size={24} />
          </div>
          <span className="brand-name">SolidarBairro</span>
        </div>
      </nav>

      <div className="main-grid">
        <aside className="sidebar">
          <div className="steps-card">
            <h2 className="steps-title">Etapas do Cadastro</h2>
            <div className="steps-list">
              {steps.map((s, i) => (
                <div 
                  key={s.id} 
                  className={`step-item ${
                    step === s.id ? "active" : 
                    step > s.id ? "completed" : "pending"
                  }`}
                >
                  <div className="step-icon-box">
                    {step > s.id ? <CheckCircle2 size={20} /> : s.icon}
                  </div>
                  <div>
                    <p className="step-number">Passo 0{s.id}</p>
                    <p className="step-label">{s.title}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`step-connector ${step > s.id ? "completed" : ""}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="content-area">
          <div className="form-card animate-slideUp">
            <div className="form-header">
              <div className="progress-container">
                <span className="step-badge">
                  {steps.find(s => s.id === step)?.title}
                </span>
                <div className="progress-bar-bg">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
              <h1 className="form-title">
                {step === 1 && <>Quem é o <span className="text-highlight">responsável</span>?</>}
                {step === 2 && <>Sua <span className="text-highlight">identidade</span></>}
                {step === 3 && <>Canais de <span className="text-highlight">contato</span></>}
                {step === 4 && <>Onde vocês <span className="text-highlight">moram</span>?</>}
                {step === 5 && <>Sua <span className="text-highlight">família</span></>}
                {step === 6 && <>O que vocês <span className="text-highlight">precisam</span>?</>}
              </h1>
              <p className="form-description">
                {step === 1 && "Inicie o cadastro com os dados básicos de quem representa a família."}
                {step === 2 && "Precisamos validar sua documentação para segurança de todos na rede."}
                {step === 3 && "Como podemos falar com você? Esses dados são essenciais para ajuda rápida."}
                {step === 4 && "Informe a localização para que ONGs próximas possam oferecer suporte."}
                {step === 5 && "Conte-nos quantas pessoas vivem na casa para dimensionarmos o apoio."}
                {step === 6 && "Selecione as necessidades mais urgentes para priorizarmos seu atendimento."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="form-body">
              {step === 1 && (
                <div className="form-grid form-grid-2 animate-fadeIn">
                  <div className="input-group">
                    <label className="input-label">Nome Completo</label>
                    <div className="input-wrapper">
                      <input 
                        required
                        type="text" 
                        className="form-input" 
                        placeholder="Nome do responsável" 
                      />
                      <User className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Data de Nascimento</label>
                    <div className="input-wrapper">
                      <input 
                        required
                        type="date" 
                        className="form-input" 
                      />
                      <Calendar className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label className="input-label">Gênero</label>
                    <div className="radio-grid radio-grid-4">
                      {["Masculino", "Feminino", "Não-binário", "Outro"].map((g) => (
                        <label key={g} className="radio-label">
                          <input type="radio" name="genero" className="radio-input" />
                          <div className="radio-box">
                            {g}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-grid form-grid-2 animate-fadeIn">
                  <div className="input-group">
                    <label className="input-label">CPF</label>
                    <div className="input-wrapper">
                      <input 
                        required
                        type="text" 
                        className="form-input" 
                        placeholder="000.000.000-00" 
                      />
                      <Fingerprint className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">RG / Documento</label>
                    <div className="input-wrapper">
                      <input 
                        required
                        type="text" 
                        className="form-input" 
                        placeholder="Número do documento" 
                      />
                      <IdCard className="input-icon" />
                    </div>
                  </div>
                  <div className="info-banner">
                    <div className="info-icon-box">
                      <ShieldCheck color="#f97316" size={32} />
                    </div>
                    <div className="info-content">
                      <h3>Análise de Documentos</h3>
                      <p>
                        Após finalizar, nossa inteligência fará uma verificação inicial rápida. Isso garante que a ajuda chegue a quem realmente precisa.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="form-grid form-grid-2 animate-fadeIn">
                  <div className="input-group">
                    <label className="input-label">WhatsApp / Celular</label>
                    <div className="input-wrapper">
                      <input 
                        required
                        type="tel" 
                        className="form-input" 
                        placeholder="(00) 00000-0000" 
                      />
                      <Phone className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">E-mail (Opcional)</label>
                    <div className="input-wrapper">
                      <input 
                        type="email" 
                        className="form-input" 
                        placeholder="seu@email.com" 
                      />
                      <Mail className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label className="input-label">Tipo de Cadastro</label>
                    <div className="card-radio-grid">
                      {[
                        { 
                          id: "familia", 
                          title: "Família", 
                          desc: "Grupo familiar com 2 ou mais pessoas", 
                          icon: <Users2 size={24} />,
                          color: "#f97316"
                        },
                        { 
                          id: "individual", 
                          title: "Individual", 
                          desc: "Pessoa que mora sozinha", 
                          icon: <User size={24} />,
                          color: "#3b82f6"
                        },
                        { 
                          id: "instituicao", 
                          title: "Instituição", 
                          desc: "Casa de apoio, abrigo ou similar", 
                          icon: <Home size={24} />,
                          color: "#10b981"
                        }
                      ].map((item) => (
                        <label key={item.id} className="radio-label">
                          <input type="radio" name="tipo_cadastro" className="radio-input" />
                          <div className="card-radio-box-enhanced">
                            <div className="card-icon-box-enhanced" style={{ background: `${item.color}15`, color: item.color }}>
                              {item.icon}
                            </div>
                            <div className="card-content">
                              <p className="card-title-enhanced">{item.title}</p>
                              <p className="card-desc-enhanced">{item.desc}</p>
                            </div>
                            <div className="card-check-indicator">
                              <CheckCircle2 size={20} />
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="form-grid form-grid-2 animate-fadeIn">
                  <div className="input-group" style={{ gridColumn: 'span 2' }}>
                    <label className="input-label">Endereço Residencial</label>
                    <div className="input-wrapper">
                      <input 
                        required
                        type="text" 
                        className="form-input" 
                        placeholder="Rua, número, complemento"
                        value={addressData.endereco}
                        onChange={(e) => setAddressData(prev => ({ ...prev, endereco: e.target.value }))}
                      />
                      <Home className="input-icon" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Bairro</label>
                    <div className="input-wrapper">
                      <input 
                        required
                        type="text" 
                        className="form-input" 
                        placeholder="Digite ou use o mapa"
                        value={addressData.bairro}
                        onChange={(e) => setAddressData(prev => ({ ...prev, bairro: e.target.value }))}
                      />
                      <MapPin className="input-icon" size={16} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Ponto de Referência</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ paddingLeft: '1.25rem' }}
                      placeholder="Ex: Perto do mercado"
                      value={addressData.referencia}
                      onChange={(e) => setAddressData(prev => ({ ...prev, referencia: e.target.value }))}
                    />
                  </div>
                  <MapLocationButton 
                    isLocating={isLocating} 
                    onClick={handleMapLocation} 
                  />
                </div>
              )}

              {step === 5 && (
                <div className="form-grid form-grid-2 animate-fadeIn">
                  <div className="family-input-section">
                    <h3 className="section-subtitle">Quantos moram com você?</h3>
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
                  </div>

                  <div className="special-situations-section">
                    <h3 className="section-subtitle">Situações Especiais</h3>
                    <div className="special-cards-grid">
                      {[
                        { label: "Há gestantes na família", id: "gestantes", icon: <Heart size={20} /> },
                        { label: "Pessoas com deficiência (PcD)", id: "pcd", icon: <Info size={20} /> },
                        { label: "Família chefiada por mulher", id: "mulher_chefe", icon: <User size={20} /> },
                        { label: "Risco de perda de moradia", id: "risco_despejo", icon: <Home size={20} /> }
                      ].map((item) => (
                        <label key={item.id} className="special-card-label">
                          <input type="checkbox" name={item.id} className="special-card-input-hidden" />
                          <div className="special-card-content">
                            <div className="special-card-icon">
                              {item.icon}
                            </div>
                            <span className="special-card-text">{item.label}</span>
                            <div className="special-card-check">
                              <CheckCircle2 size={16} />
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="form-grid form-grid-2 animate-fadeIn">
                  <div className="needs-section">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '2rem' }}>Necessidades Urgentes</h3>
                    <div className="needs-grid">
                      {[
                        "Alimentação & Cesta Básica",
                        "Roupas & Agasalhos",
                        "Produtos de Higiene",
                        "Medicamentos",
                        "Oportunidade de Trabalho",
                        "Apoio Psicológico"
                      ].map((label) => (
                        <label key={label} className="need-item">
                          <input type="checkbox" className="radio-input need-input" />
                          <div className="need-box">
                            <span className="need-label">{label}</span>
                            <div className="check-circle-box">
                              <CheckCircle2 size={16} />
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="final-step-section">
                    <div className="final-card">
                      <h3 className="final-title">Estamos quase lá!</h3>
                      <p className="final-text">
                        Suas respostas serão enviadas para nossa rede de parceiros solidários. 
                        A ajuda pode vir de ONGs, comércios locais ou voluntários individuais.
                      </p>
                      <div className="final-warning">
                        <ShieldCheck size={40} className="warning-icon" />
                        <p className="warning-text">
                          Ao clicar em finalizar, você declara que as informações são verdadeiras.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-footer">
                {step > 1 ? (
                  <button 
                    type="button" 
                    onClick={prevStep} 
                    className="btn-prev"
                  >
                    <ChevronLeft size={20} />
                    Anterior
                  </button>
                ) : (
                  <div />
                )}
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {step === 1 && (
                    <Link to="/cadastro" className="btn-prev">
                      Cancelar
                    </Link>
                  )}
                  
                  {step < totalSteps ? (
                    <button 
                      type="button" 
                      onClick={nextStep} 
                      className="btn-next"
                    >
                      Continuar
                      <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="btn-finish"
                    >
                      Finalizar Cadastro
                      <CheckCircle2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>

      {showPrivacyModal && (
        <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
          <div className="privacy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="privacy-header">
              <ShieldCheck size={32} color="#f97316" />
              <h3>Dica de Segurança</h3>
            </div>
            <p className="privacy-text">
              Seus dados são protegidos pela Lei Geral de Proteção de Dados (LGPD). Nunca compartilharemos informações sem sua permissão.
            </p>
            <button className="privacy-btn" onClick={() => setShowPrivacyModal(false)}>
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}