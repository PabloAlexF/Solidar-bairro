import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/pages/PrecisoDeAjudaDesktop.css';
import '../styles/pages/Step7Modern.css';

const categories = [
  { id: 'Alimentos', label: 'Alimentos', icon: <i className="fi fi-rr-shopping-cart"></i>, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'Roupas', label: 'Roupas', icon: <i className="fi fi-rr-shirt"></i>, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'Contas', label: 'Contas', icon: <i className="fi fi-rr-receipt"></i>, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'Medicamentos', label: 'Medicamentos', icon: <i className="fi fi-rr-medicine"></i>, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'Outros', label: 'Outros', icon: <i className="fi fi-rr-plus"></i>, color: 'text-zinc-500', bg: 'bg-zinc-50' },
];

const urgencyOptions = [
  { id: 'urgente', label: 'Urgente', desc: 'Preciso de ajuda imediata (24-48h)', icon: <i className="fi fi-rr-exclamation"></i> },
  { id: 'moderada', label: 'Moderada', desc: 'Posso aguardar alguns dias (3-5 dias)', icon: <i className="fi fi-rr-clock"></i> },
  { id: 'esperar', label: 'Pode esperar', desc: 'Sem pressa imediata (mais de uma semana)', icon: <i className="fi fi-rr-check"></i> },
];

const contactOptions = [
  { id: 'whatsapp', label: 'WhatsApp', icon: <i className="fi fi-rr-smartphone"></i> },
  { id: 'call', label: 'Ligação Telefônica', icon: <i className="fi fi-rr-phone-call"></i> },
  { id: 'chat', label: 'Chat do Aplicativo', icon: <i className="fi fi-rr-comment"></i> },
];

const visibilityOptions = [
  { id: 'bairro', label: 'Meu Bairro', desc: 'Apenas vizinhos imediatos (até 2km)', icon: <i className="fi fi-rr-marker"></i> },
  { id: 'proximos', label: 'Região Próxima', desc: 'Vizinhos e bairros vizinhos (até 10km)', icon: <i className="fi fi-rr-users"></i> },
  { id: 'ongs', label: 'ONGs Parceiras', desc: 'Instituições e órgãos de assistência social', icon: <i className="fi fi-rr-building"></i> },
];

const PrecisoDeAjudaDesktop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    foodTypes: [],
    description: '',
    urgency: '',
    contactPreferences: [],
    visibility: [],
  });

  const totalSteps = 7;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.category !== '';
      case 2: return formData.category !== 'Alimentos' || formData.foodTypes.length > 0;
      case 3: return formData.description.length >= 10;
      case 4: return formData.urgency !== '';
      case 5: return formData.contactPreferences.length > 0;
      case 6: return formData.visibility.length > 0;
      default: return true;
    }
  };

  const updateData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handlePublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/pedido-publicado');
    }, 2000);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-header">
              <h2>Qual tipo de ajuda você precisa?</h2>
              <p>Selecione a categoria que melhor descreve sua necessidade atual para mobilizarmos os vizinhos mais próximos.</p>
            </div>
            <div className="categories-grid">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateData({ category: cat.id })}
                  className={`category-card ${formData.category === cat.id ? 'active' : ''}`}
                >
                  <div className="category-icon">{cat.icon}</div>
                  <span className="category-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        if (formData.category !== 'Alimentos') {
          return (
            <div className="step-content centered">
              <div className="skip-step">
                <div className="skip-icon"><i className="fi fi-rr-info"></i></div>
                <h2>Etapa não necessária</h2>
                <p>Esta seção é dedicada a pedidos de alimentação. Como sua solicitação é sobre <strong>{formData.category}</strong>, clique em avançar.</p>
              </div>
            </div>
          );
        }

        const foodOptions = [
          { id: 'cesta', label: 'Cesta Básica', desc: 'Arroz, feijão, óleo, açúcar, macarrão e itens essenciais de despensa seca.' },
          { id: 'frescos', label: 'Alimentos Frescos', desc: 'Frutas, verduras, legumes, ovos e proteínas para a semana.' },
          { id: 'infantil', label: 'Alimentação Infantil', desc: 'Fórmulas lácteas, leites especiais, papinhas prontas e fraldas descartáveis.' },
          { id: 'prontas', label: 'Refeições Prontas', desc: 'Marmitas para consumo no dia, lanches ou refeições completas prontas.' },
        ];

        const toggleFood = (id) => {
          const current = formData.foodTypes;
          const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
          updateData({ foodTypes: next });
        };

        return (
          <div className="step-content">
            <div className="step-header">
              <h2>Que tipo de alimento você precisa?</h2>
              <p>Selecione as opções que fariam a diferença para você e sua família agora.</p>
            </div>
            <div className="info-banner">
              <div className="info-icon"><i className="fi fi-rr-info"></i></div>
              <p>Você pode escolher mais de uma opção. Isso ajuda os vizinhos a entenderem exatamente o que oferecer.</p>
            </div>
            <div className="options-grid">
              {foodOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleFood(opt.id)}
                  className={`option-card ${formData.foodTypes.includes(opt.id) ? 'selected' : ''}`}
                >
                  <div className="checkbox">
                    {formData.foodTypes.includes(opt.id) && <span><i className="fi fi-rr-check"></i></span>}
                  </div>
                  <div className="option-content">
                    <h3>{opt.label}</h3>
                    <p>{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="step-header">
              <h2>Explique sua necessidade</h2>
              <p>Compartilhe um pouco da sua situação. A transparência gera confiança e ajuda mais rápida.</p>
            </div>
            <div className="textarea-container">
              <textarea
                placeholder="Ex: Olá, vizinhos. Moro no bairro há 10 anos e estou enfrentando uma fase difícil. Precisaria de uma ajuda com cesta básica para este mês até conseguir uma nova oportunidade de trabalho..."
                value={formData.description}
                onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
                className="description-textarea"
              />
              <div className={`char-counter ${formData.description.length >= 10 ? 'valid' : ''}`}>
                {formData.description.length} / 500
              </div>
            </div>
            <div className="tip-banner">
              <div className="tip-icon"><i className="fi fi-rr-comment"></i></div>
              <p>Dica: Pedidos com um tom pessoal e sincero costumam receber respostas 3x mais rápido.</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="step-header">
              <h2>Qual a urgência do pedido?</h2>
              <p>Isso ajuda a comunidade a priorizar quem realmente não pode esperar.</p>
            </div>
            <div className="urgency-grid">
              {urgencyOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => updateData({ urgency: opt.id })}
                  className={`urgency-card ${formData.urgency === opt.id ? 'active' : ''}`}
                >
                  <div className="urgency-icon">{opt.icon}</div>
                  <div className="urgency-content">
                    <h3>{opt.label}</h3>
                    <p>{opt.desc}</p>
                  </div>
                  {formData.urgency === opt.id && <div className="check-mark"><i className="fi fi-rr-check"></i></div>}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        const toggleContact = (id) => {
          const current = formData.contactPreferences;
          const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
          updateData({ contactPreferences: next });
        };

        return (
          <div className="step-content">
            <div className="step-header">
              <h2>Como prefere ser contatado?</h2>
              <p>Selecione os meios onde você se sente mais seguro para combinar a entrega da ajuda.</p>
            </div>
            <div className="contact-grid">
              {contactOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleContact(opt.id)}
                  className={`contact-card ${formData.contactPreferences.includes(opt.id) ? 'selected' : ''}`}
                >
                  <div className="checkbox">
                    {formData.contactPreferences.includes(opt.id) && <span><i className="fi fi-rr-check"></i></span>}
                  </div>
                  <div className="contact-icon">{opt.icon}</div>
                  <span className="contact-label">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        const toggleVisibility = (id) => {
          const current = formData.visibility;
          const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
          updateData({ visibility: next });
        };

        return (
          <div className="step-content">
            <div className="step-header">
              <h2>Quem pode ver seu pedido?</h2>
              <p>Você decide o alcance da sua solicitação. Quanto maior o alcance, maior a chance de ajuda.</p>
            </div>
            <div className="visibility-grid">
              {visibilityOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => toggleVisibility(opt.id)}
                  className={`visibility-card ${formData.visibility.includes(opt.id) ? 'selected' : ''}`}
                >
                  <div className="visibility-icon">{opt.icon}</div>
                  <div className="visibility-content">
                    <h3>{opt.label}</h3>
                    <p>{opt.desc}</p>
                  </div>
                  <div className="checkbox">
                    {formData.visibility.includes(opt.id) && <span><i className="fi fi-rr-check"></i></span>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="step-content">
            {/* Header da página de revisão */}
            <div className="text-center mb-16">
              <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fi fi-rr-check text-green-500 text-4xl"></i>
              </div>
              <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">Pronto para Publicar!</h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
                Revise todas as informações antes de publicar seu pedido na comunidade.
              </p>
            </div>

            {/* Container principal com layout inspirado no CSS */}
            <div className="bg-white rounded-[40px] border border-zinc-100 shadow-lg overflow-hidden max-w-[1400px] mx-auto">
              
              {/* Seção de informações principais */}
              <div className="p-12 border-b border-zinc-100">
                <div className="grid md:grid-cols-2 gap-12">
                  
                  {/* Coluna esquerda - Informações básicas */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                        Informações do Pedido
                      </h3>
                      
                      <div className="flex items-center gap-4 mb-6">
                        {/* Card de Categoria */}
                        <div className="bg-zinc-50 min-w-[200px] h-[75px] border-2 border-zinc-200 rounded-[24px] flex items-center justify-center transition-all hover:border-orange-300">
                          <p className="font-bold text-zinc-900 uppercase tracking-[0.2em] text-lg">
                            {formData.category}
                          </p>
                        </div>

                        {/* Card de Urgência */}
                        <div className="bg-zinc-50 min-w-[150px] h-[75px] border-2 border-zinc-200 rounded-[24px] flex items-center justify-center transition-all hover:border-orange-300">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${
                              formData.urgency === 'urgente' ? 'bg-red-500' : 
                              formData.urgency === 'moderada' ? 'bg-orange-500' : 'bg-blue-500'
                            }`} />
                            <p className="font-bold text-zinc-600 uppercase tracking-widest text-sm">
                              {formData.urgency}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Itens solicitados (se for alimentos) */}
                    {formData.category === "Alimentos" && formData.foodTypes.length > 0 && (
                      <div className="pt-8 border-t border-zinc-100">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                          Itens Solicitados
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {formData.foodTypes.map(item => (
                            <span 
                              key={item} 
                              className="px-6 py-3 bg-orange-50 border border-orange-200 rounded-full font-bold text-orange-700 text-sm transition-all hover:bg-orange-100"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Coluna direita - Mensagem */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                      Sua Mensagem
                    </h3>
                    <div className="relative">
                      <div className="bg-zinc-50 border-2 border-zinc-200 rounded-[32px] p-8 min-h-[200px] transition-all hover:border-orange-300">
                        <p className="text-zinc-700 text-lg leading-relaxed font-medium italic">
                          "{formData.description}"
                        </p>
                      </div>
                      <div className="absolute top-6 right-6 text-zinc-300">
                        <i className="fi fi-rr-comment text-2xl"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção de detalhes de contato e visibilidade */}
              <div className="p-12">
                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Card de Contato */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-[32px] border-2 border-orange-200 transition-all hover:shadow-lg hover:border-orange-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-orange-500 p-3 rounded-xl shadow-lg">
                        <i className="fi fi-rr-smartphone text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">
                          Contato Preferencial
                        </p>
                        <p className="font-bold text-orange-900 text-lg">
                          {formData.contactPreferences.length > 0 
                            ? formData.contactPreferences.join(", ") 
                            : "Não definido"
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card de Visibilidade */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-[32px] border-2 border-blue-200 transition-all hover:shadow-lg hover:border-blue-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
                        <i className="fi fi-rr-marker text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                          Alcance do Pedido
                        </p>
                        <p className="font-bold text-blue-900 text-lg">
                          {formData.visibility.length > 0 
                            ? formData.visibility.join(", ") 
                            : "Não definido"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banner de confirmação */}
                <div className="mt-12 bg-gradient-to-r from-green-500 to-emerald-500 p-8 rounded-[32px] text-white shadow-xl">
                  <div className="flex items-center gap-6">
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                      <i className="fi fi-rr-check text-white text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Tudo pronto!</h3>
                      <p className="text-green-100 text-lg font-medium">
                        Seu pedido será publicado na rede de apoio comunitário e vizinhos próximos poderão te ajudar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Seção do usuário - Card compacto */}
                <div className="w-80 bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-[24px] text-white shadow-lg ml-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <i className="fi fi-rr-user text-white text-lg"></i>
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-tight">
                        {user?.nome || user?.nomeCompleto || user?.displayName || 'Usuário'}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="inline-flex items-center justify-center rounded border py-0.5 px-1.5 bg-green-400 text-green-900 font-bold text-[8px] uppercase">
                          VERIFICADO
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/70">Contato:</span>
                      <span className="text-white font-semibold">
                        {formData.contactPreferences.length > 0 ? formData.contactPreferences.length + ' opções' : 'N/D'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Alcance:</span>
                      <span className="text-white font-semibold">
                        {formData.visibility.length > 0 ? formData.visibility.length + ' áreas' : 'N/D'}
                      </span>
                    </div>
                    {user?.telefone && (
                      <div className="flex justify-between">
                        <span className="text-white/70">Telefone:</span>
                        <span className="text-white font-semibold">
                          {user.telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-2">
                    <i className="fi fi-rr-shield text-green-400 text-sm"></i>
                    <p className="text-[10px] text-white/80 leading-tight">
                      Dados protegidos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="preciso-ajuda-desktop">
      <div className="background-decoration">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
      </div>

      <div className="wizard-card">
        <div className="wizard-header">
          <div className="header-content">
            <div className="header-left">
              <div className="app-icon"><i className="fi fi-rr-users"></i></div>
              <div className="app-info">
                <h1>Preciso de Ajuda</h1>
                <p>Rede de Apoio Solidário</p>
              </div>
            </div>
            <div className="step-badge">
              <span className="step-label">Status</span>
              <div className="step-number">Etapa {step} de {totalSteps}</div>
            </div>
          </div>
          <div className="progress-bar">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`progress-step ${i + 1 <= step ? 'active' : ''}`} />
            ))}
          </div>
        </div>

        <div className="wizard-content">
          {renderStepContent()}
        </div>

        <div className="wizard-footer">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="btn-secondary"
          >
            ← Voltar
          </button>
          
          {step < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="btn-primary"
            >
              Próxima Etapa →
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="btn-publish"
            >
              {isSubmitting ? 'Publicando...' : 'Publicar Pedido'} <i className="fi fi-rr-check"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrecisoDeAjudaDesktop;