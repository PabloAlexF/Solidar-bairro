import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChevronLeft, 
  ArrowRight, 
  Utensils, 
  Shirt, 
  Droplets, 
  Pill, 
  HandCoins, 
  Briefcase, 
  Plus, 
  Check,
  Smartphone,
  Phone,
  MessageSquare,
  AlertCircle,
  Clock,
  MapPin,
  Building2,
  Users,
  ShieldCheck,
  UserCircle,
  Zap,
  Footprints,
  Armchair,
  Tv,
  BookOpen,
  Bus,
  X
} from 'lucide-react';
import './PrecisoDeAjudaWizard.css';

// Constants
const INITIAL_DATA = {
  category: "",
  items: [],
  clothingSize: "",
  clothingPreference: "",
  shoeSize: "",
  description: "",
  urgency: "",
  contactPreferences: [],
  visibility: [],
  location: "",
};

const CATEGORY_CONFIG = {
  "Alimentos": {
    title: "O que falta na sua mesa?",
    subtitle: "Selecione todos os itens que ajudariam você no momento.",
    color: "blue",
    items: [
      { id: "Cesta Básica", label: "Cesta Básica", desc: "Arroz, feijão, óleo e itens essenciais." },
      { id: "Alimentos Frescos", label: "Alimentos Frescos", desc: "Frutas, verduras e carnes." },
      { id: "Alimentação Infantil", label: "Alimentação Infantil", desc: "Leite, fórmulas e papinhas." },
      { id: "Refeições Prontas", label: "Refeições Prontas", desc: "Marmitas ou pães prontos." },
    ]
  },
  "Roupas": {
    title: "Quais peças você precisa?",
    subtitle: "Selecione as peças e informe o tamanho abaixo.",
    color: "indigo",
    items: [
      { id: "Blusas/Camisetas", label: "Blusas/Camisetas", desc: "Peças para o tronco." },
      { id: "Calças/Bermudas", desc: "Peças para as pernas.", label: "Calças/Bermudas" },
      { id: "Roupas Íntimas", desc: "Peças básicas de higiene.", label: "Roupas Íntimas" },
      { id: "Agasalhos", desc: "Casacos e blusas de frio.", label: "Agasalhos" },
    ]
  },
  "Calçados": {
    title: "Qual o calçado ideal?",
    subtitle: "Selecione o tipo e o número que você calça.",
    color: "rose",
    items: [
      { id: "Tênis", label: "Tênis", desc: "Esportivos ou casuais." },
      { id: "Chinelos", label: "Chinelos/Sandálias", desc: "Calçados abertos." },
      { id: "Sapatos", label: "Sapatos", desc: "Calçados formais." },
      { id: "Botas", label: "Botas", desc: "Calçados resistentes." },
    ]
  },
  "Contas": {
    title: "Qual conta precisa de apoio?",
    subtitle: "Sua rede pode ajudar com o pagamento direto ou auxílio.",
    color: "emerald",
    items: [
      { id: "Água", label: "Água / Esgoto", desc: "Conta básica mensal." },
      { id: "Energia", label: "Energia Elétrica", desc: "Conta de luz." },
      { id: "Gás", label: "Gás", desc: "Botijão ou encanado." },
      { id: "Aluguel", label: "Aluguel", desc: "Auxílio com moradia." },
    ]
  },
  "Emprego": {
    title: "Como podemos ajudar na sua carreira?",
    subtitle: "Selecione o tipo de apoio profissional necessário.",
    color: "violet",
    items: [
      { id: "Currículo", label: "Auxílio com Currículo", desc: "Criação ou revisão de CV." },
      { id: "Vagas", label: "Indicação de Vaga", desc: "Oportunidades em aberto." },
      { id: "Cursos", label: "Capacitação", desc: "Cursos ou treinamentos." },
      { id: "Ferramentas", label: "Equipamentos", desc: "Ferramentas para trabalho." },
    ]
  },
  "Higiene": {
    title: "Quais itens de higiene você busca?",
    subtitle: "Essenciais para saúde e bem-estar diário.",
    color: "cyan",
    items: [
      { id: "Banho", label: "Kit Banho", desc: "Sabonete, shampoo e toalha." },
      { id: "Bucal", label: "Higiene Bucal", desc: "Escova e pasta de dente." },
      { id: "Feminino", label: "Produtos Femininos", desc: "Absorventes e cuidados." },
      { id: "Limpeza", label: "Limpeza da Casa", desc: "Sabão, desinfetante, etc." },
    ]
  },
  "Medicamentos": {
    title: "Qual o suporte médico necessário?",
    subtitle: "Lembre-se: Doadores podem solicitar receita para segurança.",
    color: "red",
    items: [
      { id: "Contínuo", label: "Uso Contínuo", desc: "Remédios de rotina." },
      { id: "Primeiros Socorros", label: "Primeiros Socorros", desc: "Curativos e básicos." },
      { id: "Infantil", label: "Medicamentos Infantis", desc: "Para crianças." },
      { id: "Exames", label: "Auxílio com Exames", desc: "Custos laboratoriais." },
    ]
  },
  "Móveis": {
    title: "O que falta no seu lar?",
    subtitle: "Móveis essenciais para dignidade e conforto.",
    color: "amber",
    items: [
      { id: "Cama", label: "Cama/Colchão", desc: "Para o descanso." },
      { id: "Guarda-roupa", label: "Guarda-roupa", desc: "Organização." },
      { id: "Mesa", label: "Mesa/Cadeiras", desc: "Refeições ou estudo." },
      { id: "Sofá", label: "Sofá", desc: "Conforto na sala." },
    ]
  },
  "Eletrodomésticos": {
    title: "Qual aparelho você precisa?",
    subtitle: "Eletros que facilitam a vida doméstica.",
    color: "slate",
    items: [
      { id: "Geladeira", label: "Geladeira", desc: "Conservação de alimentos." },
      { id: "Fogão", label: "Fogão", desc: "Preparo de refeições." },
      { id: "Lavar", label: "Máquina de Lavar", desc: "Higiene das roupas." },
      { id: "Micro-ondas", label: "Micro-ondas", desc: "Praticidade." },
    ]
  },
  "Material Escolar": {
    title: "Tudo pronto para os estudos?",
    subtitle: "Apoie o futuro com os materiais corretos.",
    color: "fuchsia",
    items: [
      { id: "Cadernos", label: "Cadernos/Livros", desc: "Base para o estudo." },
      { id: "Mochila", label: "Mochila", desc: "Transporte dos materiais." },
      { id: "Estojo", label: "Estojo Completo", desc: "Lápis, caneta, etc." },
      { id: "Uniforme", label: "Uniforme", desc: "Vestimenta escolar." },
    ]
  },
  "Transporte": {
    title: "Como você precisa se deslocar?",
    subtitle: "Auxílio para chegar onde é necessário.",
    color: "yellow",
    items: [
      { id: "Passagens", label: "Passagens/Bilhete", desc: "Transporte público." },
      { id: "Bicicleta", label: "Bicicleta", desc: "Meio próprio." },
      { id: "Manutenção", label: "Manutenção", desc: "Conserto de veículo." },
      { id: "Combustível", label: "Combustível", desc: "Auxílio deslocamento." },
    ]
  },
};

// Main Component
export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const { user } = useAuth();
  const totalSteps = 7;

  // Atualizar localização com base no usuário logado
  useEffect(() => {
    if (user && user.endereco && user.endereco.cidade && user.endereco.bairro) {
      const userLocation = `${user.endereco.cidade}, ${user.endereco.estado || 'MG'} - Bairro ${user.endereco.bairro}`;
      setFormData(prev => ({ ...prev, location: userLocation }));
    }
  }, [user]);

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.category !== "";
      case 2: 
        if (formData.category === "Roupas") {
          return formData.items.length > 0 && formData.clothingSize !== "" && formData.clothingPreference !== "";
        }
        if (formData.category === "Calçados") {
          return formData.items.length > 0 && formData.shoeSize !== "";
        }
        return formData.items.length > 0;
      case 3: return formData.description.length >= 10;
      case 4: return formData.urgency !== "";
      case 5: return formData.contactPreferences.length > 0;
      case 6: return formData.visibility.length > 0;
      default: return true;
    }
  };

  const updateData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="wizard-container">
      <div className="wizard-wrapper">
        <div className="wizard-card">
          
          {/* Header */}
          <div className="wizard-header">
            <div className="wizard-header-content">
              <div className="wizard-header-icon">
                <Zap className="icon-large" />
              </div>
              <div>
                <h1 className="wizard-title">PEDIDO DE APOIO</h1>
                <div className="wizard-status">
                  <div className="status-dot" />
                  <p className="status-text">Comunidade Ativa • Online agora</p>
                </div>
              </div>
            </div>
            
            <div className="wizard-progress">
              <div className="progress-dots">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`progress-dot ${step > i ? 'active' : ''}`}
                  />
                ))}
              </div>
              <div className="step-badge">
                ETAPA {step}/{totalSteps}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="wizard-content">
            <div className="wizard-bg-decoration" />
            <div className="wizard-bg-decoration-2" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="step-content"
              >
                <StepContent 
                  step={step} 
                  formData={formData} 
                  updateData={updateData} 
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Navigation */}
          <div className="wizard-footer">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="btn-prev"
            >
              <ChevronLeft className="icon-medium" />
              Anterior
            </button>
            
            {step < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="btn-next"
              >
                PRÓXIMO PASSO
                <ArrowRight className="icon-medium" />
              </button>
            ) : (
              <button
                onClick={() => alert("Seu pedido está sendo processado pela nossa rede!")}
                className="btn-submit"
              >
                CONFIRMAR E PUBLICAR
                <Check className="icon-medium" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Content Router
function StepContent({ step, formData, updateData }) {
  switch (step) {
    case 1: return <Step1 formData={formData} updateData={updateData} />;
    case 2: return <Step2 formData={formData} updateData={updateData} />;
    case 3: return <Step3 formData={formData} updateData={updateData} />;
    case 4: return <Step4 formData={formData} updateData={updateData} />;
    case 5: return <Step5 formData={formData} updateData={updateData} />;
    case 6: return <Step6 formData={formData} updateData={updateData} />;
    case 7: return <Step7 formData={formData} updateData={updateData} />;
    default: return null;
  }
}

// Step 1 - Category Selection
function Step1({ formData, updateData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    { id: "Alimentos", icon: Utensils, label: "Alimentos", color: "orange" },
    { id: "Roupas", icon: Shirt, label: "Roupas", color: "blue" },
    { id: "Higiene", icon: Droplets, label: "Higiene", color: "cyan" },
    { id: "Medicamentos", icon: Pill, label: "Medicamentos", color: "red" },
    { id: "Contas", icon: HandCoins, label: "Contas", color: "green" },
    { id: "Emprego", icon: Briefcase, label: "Emprego", color: "indigo" },
    { id: "Outros", icon: Plus, label: "Outros", color: "zinc" },
  ];

  const modalOptions = [
    { id: "Alimentos", icon: Utensils, label: "Alimentos 🛒", color: "orange" },
    { id: "Roupas", icon: Shirt, label: "Roupas 👕", color: "blue" },
    { id: "Calçados", icon: Footprints, label: "Calçados 👟", color: "rose" },
    { id: "Contas", icon: HandCoins, label: "Contas 🧾", color: "emerald" },
    { id: "Emprego", icon: Briefcase, label: "Emprego 🔧", color: "indigo" },
    { id: "Higiene", icon: Droplets, label: "Higiene 🧼", color: "cyan" },
    { id: "Medicamentos", icon: Pill, label: "Medicamentos 💊", color: "red" },
    { id: "Móveis", icon: Armchair, label: "Móveis 🪑", color: "amber" },
    { id: "Eletrodomésticos", icon: Tv, label: "Eletrodomésticos 📺", color: "slate" },
    { id: "Material Escolar", icon: BookOpen, label: "Material Escolar 📚", color: "violet" },
    { id: "Transporte", icon: Bus, label: "Transporte 🚌", color: "yellow" },
  ];

  const handleCategorySelect = (id) => {
    updateData({ 
      category: id,
      items: [],
      clothingSize: "",
      clothingPreference: "",
      shoeSize: ""
    });
  };

  return (
    <div className="step1-container">
      <div className="step1-header">
        <h2 className="step1-title">
          Olá! Do que você <br/>
          <span className="text-highlight">precisa hoje?</span>
        </h2>
        <p className="step1-subtitle">
          Selecione uma categoria principal para que possamos direcionar seu pedido às pessoas certas.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              if (cat.id === "Outros") {
                setIsModalOpen(true);
              } else {
                handleCategorySelect(cat.id);
              }
            }}
            className={`category-btn ${formData.category === cat.id ? 'selected' : ''} ${cat.color}`}
          >
            <div className={`category-icon ${formData.category === cat.id ? 'selected' : ''}`}>
              <cat.icon className="icon-large" />
            </div>
            <span className={`category-label ${formData.category === cat.id ? 'selected' : ''}`}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="modal-overlay"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="modal-content"
            >
              <div className="modal-header">
                <div className="modal-header-content">
                  <div className="modal-icon">
                    <Plus className="icon-medium" />
                  </div>
                  <div>
                    <h3 className="modal-title">OUTRAS CATEGORIAS</h3>
                    <p className="modal-subtitle">Selecione a opção que melhor se encaixa</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="modal-close"
                >
                  <X className="icon-medium" />
                </button>
              </div>

              <div className="modal-options">
                {modalOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      handleCategorySelect(opt.id);
                      setIsModalOpen(false);
                    }}
                    className={`modal-option ${formData.category === opt.id ? 'selected' : ''} ${opt.color}`}
                  >
                    <div className={`modal-option-icon ${formData.category === opt.id ? 'selected' : ''}`}>
                      <opt.icon className="icon-small" />
                    </div>
                    <span className={`modal-option-label ${formData.category === opt.id ? 'selected' : ''}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="modal-footer">
                <p className="modal-footer-text">Clique fora para cancelar</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Step 2 - Items Selection
function Step2({ formData, updateData }) {
  const config = CATEGORY_CONFIG[formData.category] || CATEGORY_CONFIG["Alimentos"];

  const toggle = (id) => {
    const current = formData.items;
    const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updateData({ items: next });
  };

  const sizes = ["PP", "P", "M", "G", "GG", "EXG", "Infantil"];
  const preferences = ["Masculino", "Feminino", "Unissex", "Infantil"];
  const shoeSizes = ["20-25", "26-30", "31-35", "36-38", "39-41", "42-45"];

  return (
    <div className="step2-container">
      <div className="step2-header">
        <h2 className="step2-title">
          {config.title.split('?')[0]} <br/>
          <span className={`text-${config.color}`}>
            {config.title.split('?')[1] || config.title}?
          </span>
        </h2>
        <p className="step2-subtitle">{config.subtitle}</p>
      </div>

      <div className="items-grid">
        {config.items.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.label)}
            className={`item-btn ${formData.items.includes(opt.label) ? 'selected' : ''} ${config.color}`}
          >
            <div className={`item-check ${formData.items.includes(opt.label) ? 'selected' : ''}`}>
              {formData.items.includes(opt.label) ? <Check className="icon-small" /> : <Plus className="icon-small" />}
            </div>
            <div className="item-content">
              <p className="item-label">{opt.label}</p>
              <p className="item-desc">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Clothing specific fields */}
      {formData.category === "Roupas" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="clothing-options"
        >
          <div className="size-section">
            <h3 className="size-title">Qual o tamanho das peças?</h3>
            <div className="size-buttons">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => updateData({ clothingSize: size })}
                  className={`size-btn ${formData.clothingSize === size ? 'selected' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="preference-section">
            <h3 className="preference-title">Qual a preferência de estilo?</h3>
            <div className="preference-buttons">
              {preferences.map(pref => (
                <button
                  key={pref}
                  onClick={() => updateData({ clothingPreference: pref })}
                  className={`preference-btn ${formData.clothingPreference === pref ? 'selected' : ''}`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Shoe specific fields */}
      {formData.category === "Calçados" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="shoe-options"
        >
          <div className="shoe-size-section">
            <h3 className="shoe-size-title">Qual o número do calçado?</h3>
            <div className="shoe-size-buttons">
              {shoeSizes.map(size => (
                <button
                  key={size}
                  onClick={() => updateData({ shoeSize: size })}
                  className={`shoe-size-btn ${formData.shoeSize === size ? 'selected' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Step 3 - Description
function Step3({ formData, updateData }) {
  return (
    <div className="step3-container">
      <div className="step3-header">
        <h2 className="step3-title">
          Conte um pouco <br/>
          <span className="text-red">sua história</span>
        </h2>
        <p className="step3-subtitle">
          Sua mensagem ajuda os vizinhos a entenderem como melhor te apoiar.
        </p>
      </div>

      <div className="textarea-container">
        <div className="textarea-bg" />
        <textarea
          placeholder="Ex: Sou mãe solo de 3 crianças e meu auxílio atrasou este mês. Precisaria de uma ajuda básica para as refeições da semana..."
          value={formData.description}
          onChange={(e) => updateData({ description: e.target.value.slice(0, 1000) })}
          className="description-textarea"
        />
        <div className="textarea-counter">
          <div className="counter-bar">
            <div 
              className="counter-fill" 
              style={{ width: `${(formData.description.length / 1000) * 100}%` }} 
            />
          </div>
          <span className="counter-text">{formData.description.length}/1000</span>
        </div>
      </div>
    </div>
  );
}

// Step 4 - Urgency
function Step4({ formData, updateData }) {
  const options = [
    { id: "urgente", label: "URGENTE", desc: "Preciso para hoje", icon: AlertCircle, color: "red" },
    { id: "moderada", label: "MODERADA", desc: "Até o fim da semana", icon: Clock, color: "orange" },
    { id: "esperar", label: "TRANQUILO", desc: "Pode esperar", icon: Check, color: "blue" },
  ];

  return (
    <div className="step4-container">
      <div className="step4-header">
        <h2 className="step4-title">
          Qual o seu <br/>
          <span className="text-red">nível de pressa?</span>
        </h2>
        <p className="step4-subtitle">
          Isso define a prioridade do seu card no mural da comunidade.
        </p>
      </div>

      <div className="urgency-grid">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => updateData({ urgency: opt.id })}
            className={`urgency-btn ${formData.urgency === opt.id ? 'selected' : ''} ${opt.color}`}
          >
            <div className={`urgency-icon ${opt.color}`}>
              <opt.icon className="icon-xl" />
            </div>
            <div className="urgency-content">
              <span className="urgency-label">{opt.label}</span>
              <p className="urgency-desc">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 5 - Contact Preferences
function Step5({ formData, updateData }) {
  const options = [
    { id: "WhatsApp", label: "WHATSAPP", icon: Smartphone, color: "green" },
    { id: "Ligação", label: "LIGAÇÃO", icon: Phone, color: "blue" },
    { id: "Chat", label: "CHAT LOCAL", icon: MessageSquare, color: "orange" },
  ];

  const toggle = (id) => {
    const current = formData.contactPreferences;
    const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updateData({ contactPreferences: next });
  };

  return (
    <div className="step5-container">
      <div className="step5-header">
        <h2 className="step5-title">
          Como prefere <br/>
          <span className="text-green">ser contatado?</span>
        </h2>
        <p className="step5-subtitle">
          Seu número só será exibido para doadores verificados.
        </p>
      </div>

      <div className="contact-grid">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`contact-btn ${formData.contactPreferences.includes(opt.id) ? 'selected' : ''}`}
          >
            <div className={`contact-icon ${formData.contactPreferences.includes(opt.id) ? 'selected' : ''} ${opt.color}`}>
              <opt.icon className="icon-large" />
            </div>
            <span className="contact-label">{opt.label}</span>
            <div className={`contact-check ${formData.contactPreferences.includes(opt.id) ? 'selected' : ''}`}>
              {formData.contactPreferences.includes(opt.id) && <Check className="icon-xs" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 6 - Visibility
function Step6({ formData, updateData }) {
  const options = [
    { id: "Apenas meu bairro", label: "MEU BAIRRO", desc: "Vizinhos mais próximos", icon: MapPin },
    { id: "Bairros próximos", label: "ENTORNO", desc: "Raio de 5km a 10km", icon: Users },
    { id: "ONGs parceiras", label: "INSTITUIÇÕES", desc: "Doadores corporativos", icon: Building2 },
  ];

  const toggle = (id) => {
    const current = formData.visibility;
    const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updateData({ visibility: next });
  };

  return (
    <div className="step6-container">
      <div className="step6-header">
        <h2 className="step6-title">
          Quem pode ver <br/>
          <span className="text-indigo">seu pedido?</span>
        </h2>
        <p className="step6-subtitle">
          Controle o alcance da sua solicitação por segurança e privacidade.
        </p>
      </div>

      <div className="visibility-grid">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`visibility-btn ${formData.visibility.includes(opt.id) ? 'selected' : ''}`}
          >
            <div className={`visibility-icon ${formData.visibility.includes(opt.id) ? 'selected' : ''}`}>
              <opt.icon className="icon-large" />
            </div>
            <div className="visibility-content">
              <span className="visibility-label">{opt.label}</span>
              <p className="visibility-desc">{opt.desc}</p>
            </div>
            <div className={`visibility-check ${formData.visibility.includes(opt.id) ? 'selected' : ''}`}>
              {formData.visibility.includes(opt.id) && <Check className="icon-xs" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 7 - Review
function Step7({ formData }) {
  const { user } = useAuth();
  
  const formatMemberSince = (date) => {
    if (!date) return '2024';
    try {
      let year;
      if (date._seconds) {
        year = new Date(date._seconds * 1000).getFullYear();
      } else if (date.seconds) {
        year = new Date(date.seconds * 1000).getFullYear();
      } else if (date.toDate) {
        year = date.toDate().getFullYear();
      } else {
        year = new Date(date).getFullYear();
      }
      return isNaN(year) ? '2024' : year.toString();
    } catch (error) {
      return '2024';
    }
  };

  return (
    <div className="step7-container">
      
      <div className="step7-content">
        
        {/* Left Side - Request Info */}
        <div className="step7-left">
          
          <div className="info-section">
            <h2 className="section-title">Informações do pedido</h2>
            
            <div className="info-cards">
              {/* Category Card */}
              <div className="info-card category-card">
                <div className="card-content">
                  <span className="card-label">Categoria</span>
                  <p className="card-value">{formData.category}</p>
                </div>
                <div className="card-icon orange">
                  <Plus className="icon-small" />
                </div>
              </div>

              {/* Urgency Card */}
              <div className="info-card urgency-card">
                <div className="card-content">
                  <span className="card-label">Urgência</span>
                  <div className="urgency-display">
                    <div className={`urgency-dot ${formData.urgency === 'urgente' ? 'red' : formData.urgency === 'moderada' ? 'orange' : 'blue'}`} />
                    <p className="card-value">{formData.urgency}</p>
                  </div>
                </div>
              </div>

              {/* Size Cards */}
              {(formData.clothingSize || formData.shoeSize) && (
                <div className="info-card size-card">
                  <div className="card-content">
                    <span className="card-label">Tamanho</span>
                    <p className="card-value">
                      {formData.category === "Roupas" ? formData.clothingSize : formData.shoeSize}
                    </p>
                  </div>
                </div>
              )}

              {formData.clothingPreference && (
                <div className="info-card preference-card">
                  <div className="card-content">
                    <span className="card-label">Preferência</span>
                    <p className="card-value">{formData.clothingPreference}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="items-section">
            <h2 className="section-title">Itens Solicitados</h2>
            <div className="items-display">
              {formData.items.length > 0 ? formData.items.map(item => (
                <div key={item} className="item-tag">
                  <span>{item}</span>
                </div>
              )) : (
                <div className="no-items">
                  <p>Nenhum item específico</p>
                </div>
              )}
            </div>
          </div>

          {/* Location Card */}
          <div className="location-card">
            <div className="location-bg-icon">
              <MapPin className="icon-xl" />
            </div>
            <div className="location-content">
              <span className="location-label">Localização da Ajuda</span>
              <p className="location-value">{formData.location || "Localização não definida"}</p>
              <div className="location-status">
                <Check className="icon-xs" />
                Área com alta atividade de vizinhos
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Message and Profile */}
        <div className="step7-right">
          
          <div className="message-section">
            <h2 className="section-title">Sua mensagem</h2>
            <div className="message-card">
              <div className="message-icon">
                <MessageSquare className="icon-medium" />
              </div>
              <p className="message-text">
                "{formData.description || "Nenhuma descrição fornecida..."}"
              </p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <UserCircle className="icon-large" />
              </div>
              <div className="profile-info">
                <p className="profile-name">{user?.nome || 'Usuário'}</p>
                <div className="profile-badges">
                  <div className="verified-badge">VERIFICADO</div>
                </div>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Preferência:</span>
                <span className="detail-value">{formData.contactPreferences.join(" • ") || "N/A"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Alcance:</span>
                <span className="detail-value">{formData.visibility.join(" • ") || "N/A"}</span>
              </div>
            </div>

            <div className="security-notice">
              <ShieldCheck className="icon-medium" />
              <p>Seus dados estão protegidos pela nossa rede de segurança comunitária.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}