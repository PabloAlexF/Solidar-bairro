import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/PrecisoDeAjudaModern.css';

const categories = [
  { id: 'food', label: 'Alimentos', icon: '🍽️', desc: 'Comida, cesta básica' },
  { id: 'clothes', label: 'Roupas', icon: '👕', desc: 'Roupas, calçados' },
  { id: 'hygiene', label: 'Higiene', icon: '🧼', desc: 'Produtos de limpeza' },
  { id: 'meds', label: 'Medicamentos', icon: '💊', desc: 'Remédios, consultas' },
  { id: 'bills', label: 'Contas', icon: '💳', desc: 'Água, luz, aluguel' },
  { id: 'work', label: 'Emprego', icon: '💼', desc: 'Trabalho, renda' },
  { id: 'other', label: 'Outros', icon: '➕', desc: 'Outras necessidades' },
];

const urgencyLevels = [
  { id: 'alta', label: 'Urgente', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  { id: 'media', label: 'Moderada', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
  { id: 'flexivel', label: 'Pode esperar', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
];

const contactMethods = [
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬', desc: 'Mais rápido' },
  { id: 'phone', label: 'Ligação', icon: '📞', desc: 'Tradicional' },
  { id: 'chat', label: 'Chat Interno', icon: '💬', desc: 'Na plataforma' },
];

const PrecisoDeAjuda = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    urgency: '',
    contacts: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleCategorySelect = (id) => {
    setFormData({ ...formData, category: id });
    setTimeout(nextStep, 300);
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
    switch (step) {
      case 1: return !!formData.category;
      case 2: return formData.description.length >= 10;
      case 3: return !!formData.urgency;
      case 4: return formData.contacts.length > 0;
      default: return true;
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
      <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-zinc-200/50 p-8 text-center">
          <div className="success-animation mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Seu pedido foi publicado!</h2>
          <p className="text-zinc-500 mb-8">
            As pessoas do seu bairro agora podem ver sua necessidade. Fique atento às notificações ou ao seu WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="flex-1 py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/quero-ajudar')}
            >
              Ver ajudas disponíveis perto de mim
            </button>
            <button 
              className="flex-1 py-3 px-6 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-2xl font-medium transition-all duration-300"
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
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-zinc-200/50 overflow-hidden flex flex-col min-h-[600px]">
        {/* Header */}
        <div className="p-6 border-b border-zinc-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14"/>
                <path d="m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h11c1.1 0 2.1-.4 2.8-1.2l5.1-5.1c.4-.4.4-1 0-1.4s-1-.4-1.4 0L15 15"/>
              </svg>
              Preciso de Ajuda
            </h1>
            <span className="text-sm font-medium text-zinc-500">
              Etapa {step} de {totalSteps}
            </span>
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden">
          <div className={`p-8 h-full flex flex-col transition-all duration-300 ${step === 1 ? 'opacity-100 translate-x-0' : 'opacity-100 translate-x-0'}`}>
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-zinc-900">
                    Qual tipo de ajuda você precisa?
                  </h2>
                  <p className="text-zinc-500">
                    Selecione a categoria que melhor descreve seu pedido.
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all gap-3 group ${
                        formData.category === cat.id
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-zinc-100 hover:border-orange-200 hover:bg-zinc-50 text-zinc-600'
                      }`}
                    >
                      <div className={`text-2xl transition-transform group-hover:scale-110 ${
                        formData.category === cat.id ? 'text-orange-500' : 'text-zinc-400'
                      }`}>
                        {cat.icon}
                      </div>
                      <span className="font-medium text-sm">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-zinc-900">
                    Explique sua necessidade
                  </h2>
                  <p className="text-zinc-500">
                    Sua mensagem será vista por vizinhos dispostos a ajudar.
                  </p>
                </div>
                <div className="space-y-2 flex-1 flex flex-col">
                  <textarea
                    placeholder="Ex: Estou passando por um momento difícil e precisaria de uma cesta básica para este mês..."
                    className="flex-1 min-h-[200px] resize-none border border-zinc-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-2xl p-4 text-lg transition-all"
                    maxLength={500}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <div className="flex justify-end">
                    <span className={`text-xs font-medium ${
                      formData.description.length > 450 ? 'text-orange-500' : 'text-zinc-400'
                    }`}>
                      {formData.description.length}/500 caracteres
                    </span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-zinc-900">
                    Qual a urgência do pedido?
                  </h2>
                  <p className="text-zinc-500">
                    Isso ajuda a comunidade a priorizar os atendimentos.
                  </p>
                </div>
                <div className="space-y-4">
                  {urgencyLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setFormData({ ...formData, urgency: level.id })}
                      className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        formData.urgency === level.id
                          ? 'border-orange-500 bg-orange-50 shadow-sm'
                          : 'border-zinc-100 hover:border-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${level.dot}`} />
                        <span className="text-lg font-medium text-zinc-700">{level.label}</span>
                      </div>
                      {formData.urgency === level.id && (
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
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

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-zinc-900">
                    Como podemos entrar em contato?
                  </h2>
                  <p className="text-zinc-500">
                    Selecione onde você se sente mais confortável para conversar.
                  </p>
                </div>
                <div className="space-y-4">
                  {contactMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => toggleContact(method.id)}
                      className={`p-6 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all ${
                        formData.contacts.includes(method.id)
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-zinc-100 hover:border-zinc-200'
                      }`}
                    >
                      <div className={`w-6 h-6 border-2 rounded flex items-center justify-center ${
                        formData.contacts.includes(method.id)
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-zinc-300'
                      }`}>
                        {formData.contacts.includes(method.id) && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl text-zinc-400">
                          {method.icon}
                        </div>
                        <span className="text-lg font-medium text-zinc-700">{method.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-zinc-900">
                    Revisão do seu pedido
                  </h2>
                  <p className="text-zinc-500">
                    Verifique se está tudo correto antes de publicar.
                  </p>
                </div>
                
                <div className="space-y-6 bg-zinc-50 p-6 rounded-3xl border border-zinc-100">
                  <div className="grid gap-4">
                    <div>
                      <label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Categoria</label>
                      <p className="text-zinc-900 font-medium capitalize mt-1">
                        {categories.find(c => c.id === formData.category)?.label}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Descrição</label>
                      <p className="text-zinc-700 mt-1 leading-relaxed">
                        {formData.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Urgência</label>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            urgencyLevels.find(u => u.id === formData.urgency)?.color
                          }`}>
                            {urgencyLevels.find(u => u.id === formData.urgency)?.label}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Contatos</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {formData.contacts.map(c => (
                            <span key={c} className="text-zinc-600 text-sm bg-white border border-zinc-200 px-2 py-1 rounded-lg">
                              {contactMethods.find(m => m.id === c)?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between gap-4">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="rounded-xl px-6 py-3 h-auto text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          
          <button
            onClick={step === totalSteps ? handlePublish : nextStep}
            disabled={!isStepValid() && step < totalSteps}
            className={`rounded-xl px-8 py-3 h-auto text-lg font-semibold shadow-lg transition-all flex items-center gap-2 ${
              step === totalSteps 
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200/50' 
                : 'bg-zinc-900 hover:bg-zinc-800 text-white'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publicando...
              </>
            ) : step === totalSteps ? (
              <>
                Publicar Pedido
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            ) : (
              <>
                Continuar
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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