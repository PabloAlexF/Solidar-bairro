import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/PrecisoDeAjudaModern.css';
import '../styles/pages/PrecisoDeAjudaDesktop.css';
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
      <main className="min-h-screen bg-gradient-to-br from-zinc-50 to-orange-50/30 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-zinc-200/50 p-8 text-center animate-fade-in-up">
          <div className="success-animation mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in shadow-lg">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 animate-draw-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-zinc-900 mb-4 animate-slide-in" style={{ animationDelay: '200ms' }}>Seu pedido foi publicado!</h2>
          <p className="text-zinc-500 mb-8 text-lg animate-slide-in" style={{ animationDelay: '300ms' }}>
            As pessoas do seu bairro agora podem ver sua necessidade. Fique atento às notificações ou ao seu WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-slide-in" style={{ animationDelay: '400ms' }}>
            <button 
              className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg"
              onClick={() => navigate('/quero-ajudar')}
            >
              Ver ajudas disponíveis perto de mim
            </button>
            <button 
              className="flex-1 py-4 px-6 border-2 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 text-zinc-700 rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-md"
              onClick={() => navigate('/')}
            >
              Voltar para o início
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl lg:max-w-6xl bg-white rounded-3xl shadow-2xl shadow-slate-300/30 overflow-hidden flex flex-col animate-fade-in-up border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
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
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 flex justify-between w-full px-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    i + 1 <= step 
                      ? 'bg-white border-orange-600 shadow-md' 
                      : 'bg-slate-200 border-slate-400'
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
                          ? 'border-orange-500 bg-orange-50 text-slate-800 shadow-lg scale-105'
                          : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50 text-slate-700'
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
                  <h2 className="text-xl font-semibold text-slate-800">
                    {formData.category === 'clothes' && 'Que tipo de roupa você precisa?'}
                    {formData.category === 'food' && 'Que tipo de alimento você precisa?'}
                    {formData.category === 'hygiene' && 'Que produtos de higiene você precisa?'}
                    {formData.category === 'meds' && 'Que tipo de ajuda médica você precisa?'}
                    {formData.category === 'bills' && 'Que tipo de conta você precisa pagar?'}
                    {formData.category === 'work' && 'Que tipo de ajuda profissional você precisa?'}
                  </h2>
                  <p className="text-slate-600">
                    Selecione as opções que melhor descrevem sua necessidade.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 flex items-start gap-2 max-w-md mb-8">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  <p className="text-blue-800 text-xs font-medium">
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
                          <p className="text-sm text-slate-600 font-medium">{type.desc}</p>
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
                            ? 'border-orange-500 bg-orange-50 shadow-md scale-105'
                            : 'border-slate-200 hover:border-orange-300 bg-white hover:bg-slate-50'
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
                          ? 'border-orange-500 bg-orange-50 shadow-lg scale-102'
                          : 'border-slate-200 hover:border-orange-300 bg-white hover:bg-slate-50'
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
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 flex items-start gap-2 max-w-md mb-8">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  <p className="text-blue-800 text-xs font-medium">
                    Você pode escolher mais de uma opção para facilitar o contato.
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
              <div className="space-y-4 animate-fade-in-up">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-orange-900">
                    Revisão do seu pedido
                  </h2>
                  <p className="text-orange-700">
                    Verifique se está tudo correto antes de publicar.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border-2 border-orange-200 shadow-inner animate-slide-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="animate-slide-in" style={{ animationDelay: '100ms' }}>
                      <label className="text-orange-600 text-sm uppercase tracking-wider font-bold">Categoria</label>
                      <p className="text-orange-900 font-medium mt-2 text-lg">
                        <span className="inline-flex items-center gap-3">
                          {categories.find(c => c.id === formData.category)?.icon}
                          {categories.find(c => c.id === formData.category)?.label}
                        </span>
                      </p>
                    </div>
                    
                    {getCategoryHasDetails(formData.category) && (
                      <div className="animate-slide-in" style={{ animationDelay: '150ms' }}>
                        <label className="text-orange-600 text-sm uppercase tracking-wider font-bold">
                          {formData.category === 'clothes' && 'Tipos de Roupas'}
                          {formData.category === 'food' && 'Tipos de Alimentos'}
                          {formData.category === 'hygiene' && 'Produtos de Higiene'}
                          {formData.category === 'meds' && 'Tipo de Ajuda Médica'}
                          {formData.category === 'bills' && 'Tipos de Contas'}
                          {formData.category === 'work' && 'Ajuda Profissional'}
                        </label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.categoryDetails.types.map((t, index) => {
                            const typesList = formData.category === 'clothes' ? clothingTypes :
                                             formData.category === 'food' ? foodTypes :
                                             formData.category === 'hygiene' ? hygieneTypes :
                                             formData.category === 'meds' ? medicineTypes :
                                             formData.category === 'bills' ? billTypes :
                                             formData.category === 'work' ? workTypes : [];
                            const typeObj = typesList.find(ct => ct.id === t);
                            return (
                              <span key={t} className="text-orange-700 text-sm bg-white border border-orange-200 px-3 py-2 rounded-lg shadow-sm animate-bounce-in inline-flex items-center gap-2" style={{ animationDelay: `${200 + index * 50}ms` }}>
                                <span className="w-4 h-4">{typeObj?.icon}</span>
                                {typeObj?.label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {formData.category === 'clothes' && (
                      <div className="animate-slide-in" style={{ animationDelay: '200ms' }}>
                        <label className="text-orange-600 text-sm uppercase tracking-wider font-bold">Tamanhos</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.categoryDetails.sizes.map((s, index) => (
                            <span key={s} className="text-orange-700 text-sm bg-white border border-orange-200 px-3 py-2 rounded-lg shadow-sm animate-bounce-in" style={{ animationDelay: `${250 + index * 50}ms` }}>
                              {clothingSizes.find(cs => cs.id === s)?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="animate-slide-in lg:col-span-2 xl:col-span-3" style={{ animationDelay: `${formData.category === 'clothes' ? '250ms' : getCategoryHasDetails(formData.category) ? '200ms' : '150ms'}` }}>
                      <label className="text-orange-600 text-sm uppercase tracking-wider font-bold">Descrição</label>
                      <p className="text-orange-800 mt-2 leading-relaxed bg-white p-4 rounded-lg border border-orange-200 text-base">
                        {formData.description}
                      </p>
                    </div>

                    <div className="animate-slide-in" style={{ animationDelay: `${formData.category === 'clothes' ? '300ms' : getCategoryHasDetails(formData.category) ? '250ms' : '200ms'}` }}>
                      <label className="text-orange-600 text-sm uppercase tracking-wider font-bold">Urgência</label>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm ${
                          urgencyLevels.find(u => u.id === formData.urgency)?.color
                        }`}>
                          {urgencyLevels.find(u => u.id === formData.urgency)?.label}
                        </span>
                      </div>
                    </div>
                    
                    <div className="animate-slide-in" style={{ animationDelay: `${formData.category === 'clothes' ? '350ms' : getCategoryHasDetails(formData.category) ? '300ms' : '250ms'}` }}>
                      <label className="text-orange-600 text-sm uppercase tracking-wider font-bold">Visibilidade</label>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-bold uppercase tracking-wide bg-blue-100 text-blue-700 border-blue-200 shadow-sm">
                          {visibilityOptions.find(v => v.id === formData.visibility)?.label}
                        </span>
                      </div>
                    </div>
                    
                    <div className="animate-slide-in" style={{ animationDelay: `${formData.category === 'clothes' ? '400ms' : getCategoryHasDetails(formData.category) ? '350ms' : '300ms'}` }}>
                      <label className="text-orange-600 text-sm uppercase tracking-wider font-bold">Contatos</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.contacts.map((c, index) => (
                          <span key={c} className="text-orange-700 text-sm bg-white border border-orange-200 px-3 py-2 rounded-lg shadow-sm animate-bounce-in inline-flex items-center gap-2" style={{ animationDelay: `${400 + index * 50}ms` }}>
                            <span className="w-4 h-4">{contactMethods.find(m => m.id === c)?.icon}</span>
                            {contactMethods.find(m => m.id === c)?.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="bg-orange-100 p-5 rounded-2xl border-2 border-orange-300 shadow-lg animate-slide-in cursor-pointer" 
                  style={{ animationDelay: `${formData.category === 'clothes' ? '450ms' : getCategoryHasDetails(formData.category) ? '400ms' : '350ms'}` }}
                  onClick={() => setFormData({ ...formData, anonymous: !formData.anonymous })}
                >
                  <div className="flex items-center gap-3 transition-all duration-300 hover:bg-white p-3 rounded-lg">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-300 shadow-sm flex-shrink-0 ${
                      formData.anonymous
                        ? 'bg-orange-500 border-orange-500 scale-110 shadow-orange-200'
                        : 'bg-white border-orange-400 hover:border-orange-500 hover:shadow-md'
                    }`}>
                      {formData.anonymous && (
                        <svg className="w-3 h-3 text-white animate-bounce-in" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <img src="https://cdn-icons-png.flaticon.com/512/1828/1828490.png" alt="anônimo" width="20" height="20" className="flex-shrink-0" />
                    <span className="text-lg font-semibold text-orange-900">Manter publicação anônima</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-3 px-3 font-medium cursor-pointer">Seu nome não aparecerá publicamente na solicitação</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200 flex items-center justify-between gap-4">
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
          
          <button
            onClick={step === totalSteps ? handlePublish : nextStep}
            disabled={!isStepValid() && step < totalSteps}
            className={`rounded-xl px-8 py-3 h-auto text-lg font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 hover:shadow-xl ${
              step === totalSteps 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-200/50' 
                : 'bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 text-white'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed scale-95' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publicando...
              </>
            ) : step === totalSteps ? (
              <>
                Publicar Pedido
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            ) : (
              <>
                Continuar
                <svg className="w-5 h-5 transition-transform duration-300 hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
};

export default PrecisoDeAjuda;