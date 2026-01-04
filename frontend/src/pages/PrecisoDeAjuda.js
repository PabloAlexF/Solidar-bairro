import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/PrecisoDeAjudaModern.css';
import '../styles/pages/PrecisoDeAjudaDesktop.css';
import '../styles/pages/ConfirmationScreen.css';
import '../styles/pages/PublishedSuccess.css';
const categories = [
  { id: 'food', label: 'Alimentos', icon: <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="alimentos" width="32" height="32" />, desc: 'Comida, cesta básica' },
  { id: 'clothes', label: 'Roupas', icon: <img src="https://cdn-icons-png.flaticon.com/512/892/892458.png" alt="roupas" width="32" height="32" />, desc: 'Roupas, calçados' },
  { id: 'hygiene', label: 'Higiene', icon: <img src="https://cdn-icons-png.flaticon.com/512/2553/2553642.png" alt="higiene" width="32" height="32" />, desc: 'Produtos de limpeza' },
  { id: 'meds', label: 'Medicamentos', icon: <img src="https://cdn-icons-png.flaticon.com/512/883/883356.png" alt="medicamentos" width="32" height="32" />, desc: 'Remédios, consultas' },
  { id: 'bills', label: 'Contas', icon: <img src="https://cdn-icons-png.flaticon.com/512/1611/1611179.png" alt="contas" width="32" height="32" />, desc: 'Água, luz, aluguel' },
  { id: 'work', label: 'Emprego', icon: <img src="https://cdn-icons-png.flaticon.com/512/1077/1077976.png" alt="emprego" width="32" height="32" />, desc: 'Trabalho, renda' },
  { id: 'other', label: 'Outros', icon: <img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="outros" width="32" height="32" />, desc: 'Outras necessidades' },
];

const urgencyLevels = [
  { id: 'alta', label: 'Urgente', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  { id: 'media', label: 'Moderada', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  { id: 'flexivel', label: 'Pode esperar', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
];

const contactMethods = [
  { id: 'whatsapp', label: 'WhatsApp', icon: <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="whatsapp" width="24" height="24" />, desc: 'Mais rápido' },
  { id: 'phone', label: 'Ligação', icon: <img src="https://cdn-icons-png.flaticon.com/512/724/724664.png" alt="telefone" width="24" height="24" />, desc: 'Tradicional' },
  { id: 'chat', label: 'Chat Interno', icon: <img src="https://cdn-icons-png.flaticon.com/512/2040/2040946.png" alt="chat" width="24" height="24" />, desc: 'Na plataforma' },
];

const visibilityOptions = [
  { id: 'bairro', label: 'Apenas meu bairro', icon: <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="bairro" width="24" height="24" />, desc: 'Somente vizinhos próximos' },
  { id: 'proximos', label: 'Bairros próximos', icon: <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="próximos" width="24" height="24" />, desc: 'Área expandida' },
  { id: 'ongs', label: 'ONGs parceiras', icon: <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="ongs" width="24" height="24" />, desc: 'Organizações especializadas' },
];

const clothingSizes = [
  { id: 'pp', label: 'PP', desc: 'Extra Pequeno' },
  { id: 'p', label: 'P', desc: 'Pequeno' },
  { id: 'm', label: 'M', desc: 'Médio' },
  { id: 'g', label: 'G', desc: 'Grande' },
  { id: 'gg', label: 'GG', desc: 'Extra Grande' },
  { id: 'xgg', label: 'XGG', desc: 'Extra Extra Grande' },
  { id: 'no-preference', label: 'Não tenho preferência', desc: 'Qualquer tamanho serve' },
];

const clothingTypes = [
  { id: 'casual', label: 'Roupas Casuais', icon: <img src="https://cdn-icons-png.flaticon.com/512/892/892458.png" alt="casual" width="24" height="24" />, desc: 'Camisetas, calças, shorts' },
  { id: 'work', label: 'Roupas de Trabalho', icon: <img src="https://cdn-icons-png.flaticon.com/512/3004/3004458.png" alt="trabalho" width="24" height="24" />, desc: 'Uniformes, roupas formais' },
  { id: 'shoes', label: 'Calçados', icon: <img src="https://cdn-icons-png.flaticon.com/512/2553/2553642.png" alt="calçados" width="24" height="24" />, desc: 'Sapatos, tênis, sandálias' },
  { id: 'underwear', label: 'Roupas Íntimas', icon: <img src="https://cdn-icons-png.flaticon.com/512/3004/3004424.png" alt="íntimas" width="24" height="24" />, desc: 'Cuecas, calcinhas, meias' },
  { id: 'winter', label: 'Roupas de Inverno', icon: <img src="https://cdn-icons-png.flaticon.com/512/2553/2553788.png" alt="inverno" width="24" height="24" />, desc: 'Casacos, blusas de frio' },
];

const foodTypes = [
  { id: 'basic-basket', label: 'Cesta Básica', icon: <img src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png" alt="cesta" width="24" height="24" />, desc: 'Arroz, feijão, óleo, açúcar' },
  { id: 'fresh-food', label: 'Alimentos Frescos', icon: <img src="https://cdn-icons-png.flaticon.com/512/1625/1625048.png" alt="frescos" width="24" height="24" />, desc: 'Frutas, verduras, carnes' },
  { id: 'baby-food', label: 'Alimentação Infantil', icon: <img src="https://cdn-icons-png.flaticon.com/512/2553/2553642.png" alt="infantil" width="24" height="24" />, desc: 'Leite, papinha, fralda' },
  { id: 'ready-meals', label: 'Refeições Prontas', icon: <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" alt="prontas" width="24" height="24" />, desc: 'Marmitas, lanches' },
];

const hygieneTypes = [
  { id: 'personal', label: 'Higiene Pessoal', icon: <img src="https://cdn-icons-png.flaticon.com/512/2553/2553642.png" alt="pessoal" width="24" height="24" />, desc: 'Sabonete, shampoo, pasta de dente' },
  { id: 'cleaning', label: 'Produtos de Limpeza', icon: <img src="https://cdn-icons-png.flaticon.com/512/3003/3003984.png" alt="limpeza" width="24" height="24" />, desc: 'Detergente, desinfetante, sabão' },
  { id: 'baby-hygiene', label: 'Higiene Infantil', icon: <img src="https://cdn-icons-png.flaticon.com/512/2945/2945403.png" alt="infantil" width="24" height="24" />, desc: 'Fraldas, lenços umedecidos' },
  { id: 'feminine', label: 'Higiene Feminina', icon: <img src="https://cdn-icons-png.flaticon.com/512/3004/3004424.png" alt="feminina" width="24" height="24" />, desc: 'Absorventes, produtos íntimos' },
];

const medicineTypes = [
  { id: 'prescription', label: 'Medicamentos com Receita', icon: <img src="https://cdn-icons-png.flaticon.com/512/883/883356.png" alt="receita" width="24" height="24" />, desc: 'Remédios controlados' },
  { id: 'over-counter', label: 'Medicamentos Livres', icon: <img src="https://cdn-icons-png.flaticon.com/512/2945/2945403.png" alt="livres" width="24" height="24" />, desc: 'Analgésicos, vitaminas' },
  { id: 'consultation', label: 'Consultas Médicas', icon: <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="consulta" width="24" height="24" />, desc: 'Médico, dentista, exames' },
  { id: 'emergency', label: 'Emergência Médica', icon: <img src="https://cdn-icons-png.flaticon.com/512/883/883407.png" alt="emergência" width="24" height="24" />, desc: 'Atendimento urgente' },
];

const billTypes = [
  { id: 'utilities', label: 'Contas Básicas', icon: <img src="https://cdn-icons-png.flaticon.com/512/1611/1611179.png" alt="básicas" width="24" height="24" />, desc: 'Água, luz, gás' },
  { id: 'rent', label: 'Moradia', icon: <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="moradia" width="24" height="24" />, desc: 'Aluguel, financiamento' },
  { id: 'transport', label: 'Transporte', icon: <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="transporte" width="24" height="24" />, desc: 'Passagem, combustível' },
  { id: 'communication', label: 'Comunicação', icon: <img src="https://cdn-icons-png.flaticon.com/512/724/724664.png" alt="comunicação" width="24" height="24" />, desc: 'Internet, telefone' },
];

const workTypes = [
  { id: 'job-search', label: 'Procura de Emprego', icon: <img src="https://cdn-icons-png.flaticon.com/512/1077/1077976.png" alt="procura" width="24" height="24" />, desc: 'Ajuda com currículo, entrevistas' },
  { id: 'freelance', label: 'Trabalhos Pontuais', icon: <img src="https://cdn-icons-png.flaticon.com/512/3003/3003984.png" alt="pontuais" width="24" height="24" />, desc: 'Serviços temporários' },
  { id: 'training', label: 'Capacitação', icon: <img src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="capacitação" width="24" height="24" />, desc: 'Cursos, treinamentos' },
  { id: 'entrepreneurship', label: 'Empreendedorismo', icon: <img src="https://cdn-icons-png.flaticon.com/512/1828/1828925.png" alt="empreender" width="24" height="24" />, desc: 'Ajuda para negócio próprio' },
];

const PrecisoDeAjuda = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    urgency: '',
    contacts: [],
    visibility: 'bairro',
    categoryDetails: {
      types: [],
      sizes: [],
      preferences: []
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const getCategoryHasDetails = (category) => {
    return ['clothes', 'food', 'hygiene', 'meds', 'bills', 'work'].includes(category);
  };

  const getTotalSteps = () => {
    if (formData.category === 'clothes') return 8;
    if (getCategoryHasDetails(formData.category)) return 7;
    return 6;
  };
  const totalSteps = getTotalSteps();
  const progress = (step / totalSteps) * 100;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleCategorySelect = (id) => {
    setFormData({ ...formData, category: id });
    setTimeout(nextStep, 300);
  };

  const toggleCategoryType = (id) => {
    setFormData(prev => ({
      ...prev,
      categoryDetails: {
        ...prev.categoryDetails,
        types: prev.categoryDetails.types.includes(id)
          ? prev.categoryDetails.types.filter(t => t !== id)
          : [...prev.categoryDetails.types, id]
      }
    }));
  };

  const toggleCategorySize = (id) => {
    setFormData(prev => {
      const currentSizes = prev.categoryDetails.sizes;
      
      if (id === 'no-preference') {
        // Se selecionou "não tenho preferência", remove todos os outros e adiciona apenas este
        return {
          ...prev,
          categoryDetails: {
            ...prev.categoryDetails,
            sizes: currentSizes.includes('no-preference') ? [] : ['no-preference']
          }
        };
      } else {
        // Se selecionou um tamanho específico, remove "não tenho preferência" se estiver selecionado
        const sizesWithoutNoPreference = currentSizes.filter(s => s !== 'no-preference');
        return {
          ...prev,
          categoryDetails: {
            ...prev.categoryDetails,
            sizes: sizesWithoutNoPreference.includes(id)
              ? sizesWithoutNoPreference.filter(s => s !== id)
              : [...sizesWithoutNoPreference, id]
          }
        };
      }
    });
  };

  const toggleCategoryPreference = (id) => {
    setFormData(prev => ({
      ...prev,
      categoryDetails: {
        ...prev.categoryDetails,
        preferences: prev.categoryDetails.preferences.includes(id)
          ? prev.categoryDetails.preferences.filter(p => p !== id)
          : [...prev.categoryDetails.preferences, id]
      }
    }));
  };

  const toggleContact = (id) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts.includes(id)
        ? prev.contacts.filter(c => c !== id)
        : [...prev.contacts, id]
    }));
  };

  const isStepValid = () => {
    if (getCategoryHasDetails(formData.category)) {
      switch (step) {
        case 1: return !!formData.category;
        case 2: return formData.categoryDetails.types.length > 0;
        case 3: return formData.category === 'clothes' ? formData.categoryDetails.sizes.length > 0 : formData.description.length >= 10;
        case 4: return formData.category === 'clothes' ? formData.description.length >= 10 : !!formData.urgency;
        case 5: return formData.category === 'clothes' ? !!formData.urgency : formData.contacts.length > 0;
        case 6: return formData.category === 'clothes' ? formData.contacts.length > 0 : !!formData.visibility;
        case 7: return !!formData.visibility;
        default: return true;
      }
    } else {
      switch (step) {
        case 1: return !!formData.category;
        case 2: return formData.description.length >= 10;
        case 3: return !!formData.urgency;
        case 4: return formData.contacts.length > 0;
        case 5: return !!formData.visibility;
        default: return true;
      }
    }
  };

  const handlePublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsPublished(true);
    }, 2000);
  };

  if (isPublished) {
    return (
      <main className="published-success-main">
        <div className="published-success-card">
          {/* Barra superior colorida */}
          <div style={{ height: '8px', backgroundColor: '#10b981' }} />
          
          <div className="published-success-content">
            {/* Header Section */}
            <div className="published-success-header">
              <div className="published-success-icon-container">
                <div className="published-success-icon-wrapper">
                  <div className="published-success-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="published-success-emoji">
                    🎉
                  </div>
                </div>
              </div>
              <h1 className="published-success-title">
                Seu pedido foi publicado!
              </h1>
              <p className="published-success-subtitle">
                Pronto! Sua solicitação já está visível para vizinhos próximos.
              </p>
            </div>

            {/* Info Card */}
            <div className="published-success-info-card">
              <div className="published-success-info-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="published-success-info-text">
                Você receberá notificações quando alguém quiser ajudar
              </p>
            </div>

            {/* Call to Action Section */}
            <div className="published-success-cta">
              <div className="published-success-cta-header">
                <div className="published-success-cta-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="published-success-cta-label">
                  Enquanto isso
                </span>
              </div>
              
              <div>
                <p className="published-success-cta-text">
                  Que tal retribuir ajudando outras pessoas da sua comunidade? 🤝
                </p>
                
                <button 
                  onClick={() => navigate('/quero-ajudar')}
                  className="published-success-button"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Descobrir como posso ajudar
                </button>
              </div>
            </div>

            {/* Footer Actions */}
            <div>
              <div className="published-success-footer">
                <button 
                  onClick={() => navigate('/')}
                  className="published-success-back-button"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar ao início
                </button>
              </div>

              <div className="published-success-security">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Suas informações estão 100% seguras. Apenas os contatos escolhidos serão compartilhados.</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl lg:max-w-6xl bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14"/>
                <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h11c1.1 0 2.1-.4 2.8-1.2l5.1-5.1c.4-.4.4-1 0-1.4s-1-.4-1.4 0L15 15"/>
              </svg>
              Preciso de Ajuda
            </h1>
            <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              Etapa {step} de {totalSteps}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner relative">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 flex justify-between w-full px-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full border transition-all duration-300 ${
                    i + 1 <= step 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'bg-slate-200 border-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden min-h-[500px]">
          <div className={`p-6 sm:p-8 lg:p-12 h-full flex flex-col transition-all duration-500 ease-out transform ${
            step === 1 ? 'opacity-100 translate-x-0' : 
            step === 2 ? 'opacity-100 translate-x-0' :
            step === 3 ? 'opacity-100 translate-x-0' :
            step === 4 ? 'opacity-100 translate-x-0' :
            'opacity-100 translate-x-0'
          }`}>
            {step === 1 && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Qual tipo de ajuda você precisa?
                  </h2>
                  <p className="text-slate-600">
                    Selecione a categoria que melhor descreve seu pedido.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {categories.map((cat, index) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 gap-3 group hover:shadow-lg transform hover:scale-105 animate-slide-in ${
                        formData.category === cat.id
                          ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 text-slate-800 shadow-xl shadow-orange-200/50 scale-105'
                          : 'border-slate-200 hover:border-orange-300 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100 text-slate-700'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 ${
                        formData.category === cat.id ? 'scale-125' : ''
                      }`}>
                        {cat.icon}
                      </div>
                      <span className="font-medium text-sm">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && getCategoryHasDetails(formData.category) && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Que tipo de alimento você precisa?
                  </h2>
                  <p className="text-slate-600 text-lg mb-1">
                    Selecione as opções que melhor descrevem sua necessidade.
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-4 flex items-start gap-3 max-w-2xl mb-8 shadow-sm">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                  </div>
                  <p className="text-orange-800 text-sm font-medium leading-relaxed">
                    Você pode escolher mais de uma opção para facilitar as doações.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {(formData.category === 'clothes' ? clothingTypes :
                    formData.category === 'food' ? foodTypes :
                    formData.category === 'hygiene' ? hygieneTypes :
                    formData.category === 'meds' ? medicineTypes :
                    formData.category === 'bills' ? billTypes :
                    formData.category === 'work' ? workTypes : []).map((type, index) => (
                    <div
                      key={type.id}
                      onClick={() => toggleCategoryType(type.id)}
                      className={`p-6 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-102 animate-slide-in ${
                        formData.categoryDetails.types.includes(type.id)
                          ? 'border-orange-500 bg-orange-50 shadow-lg scale-102'
                          : 'border-slate-200 hover:border-orange-300 bg-white hover:bg-slate-50'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all duration-300 ${
                        formData.categoryDetails.types.includes(type.id)
                          ? 'bg-orange-500 border-orange-500 scale-110'
                          : 'border-zinc-300 hover:border-orange-300'
                      }`}>
                        {formData.categoryDetails.types.includes(type.id) && (
                          <svg className="w-4 h-4 text-white animate-bounce-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`transition-all duration-300 p-2 rounded-lg border ${
                          formData.categoryDetails.types.includes(type.id) ? 'scale-110 bg-orange-100 border-orange-300' : 'bg-zinc-100 border-zinc-300'
                        }`}>
                          {type.icon}
                        </div>
                        <div className="text-left">
                          <span className="text-lg font-semibold text-slate-800">{type.label}</span>
                          <p className="text-sm text-slate-700 font-semibold leading-relaxed bg-white/60 px-3 py-1 rounded-lg">{type.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && formData.category === 'clothes' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Qual o tamanho das roupas?
                  </h2>
                  <p className="text-slate-600">
                    Selecione os tamanhos que você precisa ou se não tem preferência.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 flex items-start gap-2 max-w-md mb-8">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  <p className="text-blue-800 text-xs font-medium">
                    Você pode escolher vários tamanhos ou marcar "Não tenho preferência".
                  </p>
                </div>
                
                <div className="max-w-4xl mx-auto space-y-4">
                  {/* Opção sem preferência - linha completa */}
                  <div
                    onClick={() => toggleCategorySize('no-preference')}
                    className={`w-full p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md transform hover:scale-102 animate-slide-in ${
                      formData.categoryDetails.sizes.includes('no-preference')
                        ? 'border-orange-500 bg-orange-50 shadow-md scale-102'
                        : 'border-slate-200 hover:border-orange-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-center">
                      <span className="text-lg font-semibold text-slate-800">Não tenho preferência</span>
                      <p className="text-sm text-slate-600 mt-1">Qualquer tamanho serve</p>
                    </div>
                  </div>
                  
                  {/* Tamanhos específicos em grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {clothingSizes.filter(size => size.id !== 'no-preference').map((size, index) => (
                      <button
                        key={size.id}
                        onClick={() => toggleCategorySize(size.id)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md transform hover:scale-105 animate-slide-in ${
                          formData.categoryDetails.sizes.includes(size.id)
                            ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 shadow-xl shadow-orange-200/50 scale-105'
                            : 'border-slate-200 hover:border-orange-300 bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100'
                        }`}
                        style={{ animationDelay: `${(index + 1) * 80}ms` }}
                      >
                        <div className="text-center">
                          <span className="text-lg font-bold text-slate-800">{size.label}</span>
                          <p className="text-xs text-slate-500">{size.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {((step === 2 && !getCategoryHasDetails(formData.category)) || (step === 3 && getCategoryHasDetails(formData.category) && formData.category !== 'clothes') || (step === 4 && formData.category === 'clothes')) && (
              <div className="space-y-6 animate-fade-in-up flex flex-col justify-center h-full">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Explique sua necessidade
                  </h2>
                  <p className="text-slate-600">
                    Sua mensagem será vista por vizinhos dispostos a ajudar.
                  </p>
                </div>
                <div className="space-y-2 flex flex-col max-w-3xl mx-auto w-full">
                  <textarea
                    placeholder="Ex: Estou passando por um momento difícil e precisaria de uma cesta básica para este mês..."
                    className="min-h-[200px] resize-none border-2 border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-2xl p-4 text-lg transition-all duration-300 hover:shadow-md focus:shadow-lg bg-slate-50/30"
                    maxLength={500}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <div className="flex justify-end">
                    <span className={`text-xs font-medium transition-colors duration-300 ${
                      formData.description.length > 450 ? 'text-orange-600' : 'text-slate-500'
                    }`}>
                      {formData.description.length}/500 caracteres
                    </span>
                  </div>
                  
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-2 flex items-start gap-2 mt-4 max-w-md">
                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                    <p className="text-blue-800 text-xs font-medium">
                      Seja claro sobre o que você precisa para que os vizinhos possam agir rápido.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {((step === 3 && !getCategoryHasDetails(formData.category)) || (step === 4 && getCategoryHasDetails(formData.category) && formData.category !== 'clothes') || (step === 5 && formData.category === 'clothes')) && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Qual a urgência do pedido?
                  </h2>
                  <p className="text-slate-600">
                    Isso ajuda a comunidade a priorizar os atendimentos.
                  </p>
                </div>
                <div className="space-y-4">
                  {urgencyLevels.map((level, index) => (
                    <button
                      key={level.id}
                      onClick={() => setFormData({ ...formData, urgency: level.id })}
                      className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 hover:shadow-lg transform hover:scale-102 animate-slide-in ${
                        formData.urgency === level.id
                          ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-orange-100 shadow-xl shadow-orange-200/50 scale-102'
                          : 'border-slate-200 hover:border-orange-300 bg-white hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100'
                      }`}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full transition-all duration-300 ${level.dot} ${
                          formData.urgency === level.id ? 'scale-125 shadow-lg' : ''
                        }`} />
                        <span className="text-lg font-medium text-slate-800">{level.label}</span>
                      </div>
                      {formData.urgency === level.id && (
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center animate-bounce-in">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {((step === 4 && !getCategoryHasDetails(formData.category)) || (step === 5 && getCategoryHasDetails(formData.category) && formData.category !== 'clothes') || (step === 6 && formData.category === 'clothes')) && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-zinc-900">
                    Qual seria a preferência de contato?
                  </h2>
                  <p className="text-zinc-500">
                    Selecione onde você se sente mais confortável para conversar.
                  </p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-3 flex items-center gap-3 max-w-fit mb-8 shadow-sm">
                  <div className="text-blue-500 text-lg">
                    🚀
                  </div>
                  <p className="text-blue-800 text-sm font-semibold">
                    Escolha múltiplas opções para que mais pessoas possam te ajudar rapidamente!
                  </p>
                </div>
                
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div
                      key={method.id}
                      onClick={() => toggleContact(method.id)}
                      className={`p-6 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-102 animate-slide-in ${
                        formData.contacts.includes(method.id)
                          ? 'border-orange-500 bg-orange-50 shadow-lg scale-102'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all duration-300 ${
                        formData.contacts.includes(method.id)
                          ? 'bg-orange-500 border-orange-500 scale-110'
                          : 'border-zinc-300 hover:border-orange-300'
                      }`}>
                        {formData.contacts.includes(method.id) && (
                          <svg className="w-4 h-4 text-white animate-bounce-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`transition-all duration-300 p-2 rounded-lg border ${
                          formData.contacts.includes(method.id) ? 'scale-110 bg-orange-100 border-orange-300' : 'bg-zinc-100 border-zinc-300'
                        }`}>
                          {method.icon}
                        </div>
                        <div className="text-left">
                          <span className="text-lg font-semibold text-zinc-800">{method.label}</span>
                          <p className="text-sm text-zinc-500 font-medium">{method.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {((step === 5 && !getCategoryHasDetails(formData.category)) || (step === 6 && getCategoryHasDetails(formData.category) && formData.category !== 'clothes') || (step === 7 && formData.category === 'clothes')) && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="space-y-2 mb-8">
                  <h2 className="text-xl font-semibold text-zinc-900">
                    Quem pode ver seu pedido?
                  </h2>
                  <p className="text-zinc-500">
                    Escolha o alcance da sua solicitação de ajuda.
                  </p>
                </div>
                <div className="space-y-4">
                  {visibilityOptions.map((option, index) => (
                    <button
                      key={option.id}
                      onClick={() => setFormData({ ...formData, visibility: option.id })}
                      className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 hover:shadow-lg transform hover:scale-102 animate-slide-in ${
                        formData.visibility === option.id
                          ? 'border-orange-500 bg-orange-50 shadow-lg scale-102'
                          : 'border-zinc-100 hover:border-zinc-200'
                      }`}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`transition-all duration-300 ${
                          formData.visibility === option.id ? 'scale-110' : ''
                        }`}>
                          {option.icon}
                        </div>
                        <div className="text-left">
                          <span className="text-lg font-medium text-zinc-700 block">{option.label}</span>
                          <span className="text-sm text-zinc-500">{option.desc}</span>
                        </div>
                      </div>
                      {formData.visibility === option.id && (
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center animate-bounce-in">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {((step === 6 && !getCategoryHasDetails(formData.category)) || (step === 7 && getCategoryHasDetails(formData.category) && formData.category !== 'clothes') || (step === 8 && formData.category === 'clothes')) && (
              <div className="confirmation-screen max-w-5xl mx-auto space-y-6">
                {/* 1. RESUMO PRINCIPAL - Hero Section */}
                <div className="hero-summary bg-gradient-to-br from-blue-50 via-white to-green-50 border-2 border-blue-200 rounded-3xl p-8 text-center relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
                  
                  <h1 className="text-3xl font-bold text-slate-800 mb-3">Tudo pronto para publicar!</h1>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Sua solicitação será vista por <strong>vizinhos próximos</strong> que podem te ajudar. 
                    Revise os detalhes abaixo antes de confirmar.
                  </p>
                  
                  {/* Urgência em Destaque */}
                  <div className="urgency-highlight mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                    <div className={`urgency-pulse w-4 h-4 rounded-full animate-ping ${
                      formData.urgency === 'alta' ? 'bg-red-500' :
                      formData.urgency === 'media' ? 'bg-orange-500' : 'bg-green-500'
                    }`}></div>
                    <div className={`urgency-dot w-4 h-4 rounded-full ${
                      formData.urgency === 'alta' ? 'bg-red-500' :
                      formData.urgency === 'media' ? 'bg-orange-500' : 'bg-green-500'
                    }`}></div>
                    <span className={`font-bold text-lg ${
                      formData.urgency === 'alta' ? 'text-red-700' :
                      formData.urgency === 'media' ? 'text-orange-700' : 'text-green-700'
                    }`}>
                      {urgencyLevels.find(u => u.id === formData.urgency)?.label}
                    </span>
                  </div>
                </div>

                {/* 2. CARDS PRINCIPAIS - Categoria e Detalhes */}
                <div className="main-cards grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Card da Categoria */}
                  <div className="category-card bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
                    
                    {/* Header com ícone e título */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="category-icon text-4xl transform hover:scale-110 transition-transform duration-300">
                        {categories.find(c => c.id === formData.category)?.icon}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">O que você precisa</h3>
                    </div>
                    
                    {/* Tipos Específicos */}
                    {getCategoryHasDetails(formData.category) && formData.categoryDetails.types.length > 0 && (
                      <div className="types-section mt-12">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tipos específicos</h4>
                        <div className="flex flex-wrap gap-2">
                          {formData.categoryDetails.types.map(t => {
                            const typesList = formData.category === 'clothes' ? clothingTypes :
                                             formData.category === 'food' ? foodTypes :
                                             formData.category === 'hygiene' ? hygieneTypes :
                                             formData.category === 'meds' ? medicineTypes :
                                             formData.category === 'bills' ? billTypes :
                                             formData.category === 'work' ? workTypes : [];
                            const typeObj = typesList.find(ct => ct.id === t);
                            return (
                              <span key={t} className="type-tag bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 shadow-sm">
                                <span className="w-3 h-3">{typeObj?.icon}</span>
                                {typeObj?.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* Tamanhos (para roupas) */}
                    {formData.category === 'clothes' && formData.categoryDetails.sizes.length > 0 && (
                      <div className="sizes-section mt-3">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tamanhos</h4>
                        <div className="flex flex-wrap gap-1">
                          {formData.categoryDetails.sizes.map(s => (
                            <span key={s} className="size-tag bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                              {clothingSizes.find(cs => cs.id === s)?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Card da Mensagem */}
                  <div className="message-card bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    
                    {/* Header com ícone e título */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="message-icon w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Sua mensagem</h3>
                    </div>
                    
                    {/* Conteúdo da mensagem */}
                    <div className="message-content bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-4 relative min-h-[120px] max-h-[300px] lg:min-h-[180px] lg:max-h-[400px] overflow-y-auto">
                      <div className="quote-mark absolute -top-2 left-3 bg-white px-1 text-2xl text-purple-500 font-bold">&ldquo;</div>
                      <p className="text-slate-700 leading-relaxed italic break-words">{formData.description}</p>
                    </div>
                  </div>
                </div>

                {/* 3. CONTATO E ALCANCE - Seção Crítica */}
                <div className="contact-reach-section bg-white border-2 border-blue-200 rounded-2xl p-6 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  
                  {/* Header simplificado */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="header-icon w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">Como as pessoas vão te encontrar</h2>
                  </div>
                  
                  <div className="contact-reach-grid grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Formas de Contato */}
                    <div className="contact-methods">
                      <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Formas de contato
                      </h3>
                      <div className="contact-list space-y-2">
                        {formData.contacts.map(c => {
                          const method = contactMethods.find(m => m.id === c);
                          return (
                            <div key={c} className="contact-item flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                              <span className="contact-icon w-6 h-6 flex-shrink-0">{method?.icon}</span>
                              <div>
                                <span className="font-semibold text-blue-800">{method?.label}</span>
                                <p className="text-xs text-blue-600">{method?.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Alcance/Visibilidade */}
                    <div className="visibility-section">
                      <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Quem pode ver
                      </h3>
                      <div className="visibility-card p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="visibility-icon w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-blue-800 text-lg">{visibilityOptions.find(v => v.id === formData.visibility)?.label}</p>
                            <p className="text-sm text-blue-600">{visibilityOptions.find(v => v.id === formData.visibility)?.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. PRIVACIDADE E PUBLICAÇÃO - Seção Final */}
                <div className="privacy-publish-section space-y-6">
                  {/* Toggle de Privacidade */}
                  <div 
                    className={`privacy-toggle p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg relative overflow-hidden ${
                      formData.anonymous 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-md' 
                        : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300 hover:border-amber-400'
                    }`}
                    onClick={() => setFormData({ ...formData, anonymous: !formData.anonymous })}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                      formData.anonymous ? 'from-green-500 to-emerald-500' : 'from-amber-500 to-yellow-500'
                    }`}></div>
                    
                    <div className="privacy-content flex items-center gap-4">
                      {/* Ícone e Texto */}
                      <div className="privacy-info flex items-center gap-3 flex-1">
                        <div className={`privacy-avatar w-12 h-12 rounded-full flex items-center justify-center ${
                          formData.anonymous ? 'bg-green-100' : 'bg-amber-100'
                        }`}>
                          <svg className={`w-6 h-6 ${
                            formData.anonymous ? 'text-green-600' : 'text-amber-600'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${
                            formData.anonymous ? 'text-green-800' : 'text-amber-800'
                          }`}>Manter anonimato</h3>
                          <p className={`text-sm ${
                            formData.anonymous ? 'text-green-700' : 'text-amber-700'
                          }`}>
                            {formData.anonymous 
                              ? 'Seu nome ficará oculto na publicação' 
                              : 'Clique para ocultar seu nome na publicação'
                            }
                          </p>
                        </div>
                      </div>
                      
                      {/* Checkbox Visual */}
                      <div className={`privacy-checkbox w-12 h-12 lg:w-16 lg:h-16 border-2 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        formData.anonymous
                          ? 'bg-green-500 border-green-500 scale-110 shadow-lg'
                          : 'bg-white border-amber-400 hover:border-amber-500 hover:scale-105'
                      }`}>
                        {formData.anonymous && (
                          <svg className="w-7 h-7 lg:w-9 lg:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Botão de Publicação */}
                  <div className="text-center">
                    <button 
                      onClick={handlePublish}
                      disabled={isSubmitting}
                      className={`publish-button bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 lg:px-10 lg:py-4 rounded-2xl font-bold text-lg lg:text-xl flex items-center justify-center gap-3 mx-auto transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl min-w-[240px] lg:min-w-[280px] ${
                        isSubmitting ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:shadow-blue-500/25'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="loading-spinner w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Publicando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          <span>Publicar Pedido de Ajuda</span>
                        </>
                      )}
                    </button>
                    
                    {/* Texto de Segurança */}
                    <p className="security-text text-xs text-slate-500 mt-4 max-w-md mx-auto">
                      🔒 Suas informações pessoais estão protegidas. Apenas os métodos de contato escolhidos serão compartilhados.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="rounded-xl px-6 py-3 h-auto text-slate-600 hover:bg-white hover:shadow-md disabled:opacity-30 transition-all duration-300 flex items-center gap-2 hover:scale-105 border border-slate-200"
          >
            <svg className="w-5 h-5 transition-transform duration-300 hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          
          {/* Só mostrar o botão Continuar se não estiver no step final */}
          {step < totalSteps && (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="rounded-xl px-8 py-3 h-auto text-lg font-semibold transition-all duration-300 flex items-center gap-2 hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white"
            >
              Continuar
              <svg className="w-5 h-5 transition-transform duration-300 hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default PrecisoDeAjuda;