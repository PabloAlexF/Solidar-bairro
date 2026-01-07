import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatLocation } from '../utils/addressUtils';
import FlatIcon from '../components/FlatIcon';
import '../styles/pages/PrecisoDeAjuda.css';

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

export default function PrecisoDeAjuda() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const totalSteps = 7;

  // Atualizar localização com base no usuário logado
  useEffect(() => {
    if (user && user.endereco) {
      const userLocation = formatLocation(user.endereco, user.cidade, user.estado);
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
    <>
      <div className="wizard-card">
        
        {/* Header */}
        <div className="wizard-header">
          <div className="header-brand">
            <div className="brand-icon">
              <FlatIcon type="zap" size={40} color="white" />
            </div>
            <div className="brand-title">
              <h1>PEDIDO DE APOIO</h1>
              <div className="online-status">
                <div className="status-dot" />
                <p className="status-text">Comunidade Ativa • Online agora</p>
              </div>
            </div>
          </div>
          
          <div className="progress-container">
            <div className="progress-dots">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div 
                  key={i} 
                  className={`dot ${step > i ? 'active' : ''}`}
                /> 
              ))}
            </div>
            <div className="step-badge">
              ETAPA {step}/{totalSteps}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="wizard-content">
          <div className="content-inner">
            <StepContent 
              step={step} 
              formData={formData} 
              updateData={updateData}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="wizard-footer">
          <button
            className="btn-prev"
            onClick={prevStep}
            disabled={step === 1}
          >
            <FlatIcon type="chevronLeft" size={24} />
            Anterior
          </button>
          
          {step < totalSteps ? (
            <button
              className="btn-next"
              onClick={nextStep}
              disabled={!isStepValid()}
            >
              PRÓXIMO PASSO
              <FlatIcon type="arrowRight" size={24} />
            </button>
          ) : (
            <button
              className="btn-confirm"
              onClick={() => alert("Seu pedido está sendo processado pela nossa rede!")}
            >
              CONFIRMAR E PUBLICAR
              <FlatIcon type="check" size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Modal fora do wizard-card */}
      {isModalOpen && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-title-icon">
                  <FlatIcon type="plus" size={32} color="white" />
                </div>
                <div className="modal-title-text">
                  <h3>OUTRAS CATEGORIAS</h3>
                  <p className="modal-subtitle">Selecione a opção que melhor se encaixa</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="btn-close"
              >
                <FlatIcon type="x" size={32} />
              </button>
            </div>

            <div className="modal-body">
              {[
                { id: "Alimentos", icon: "utensils", label: "Alimentos 🛒", color: "text-orange-500", bg: "bg-orange-50" },
                { id: "Roupas", icon: "shirt", label: "Roupas 👕", color: "text-blue-500", bg: "bg-blue-50" },
                { id: "Calçados", icon: "footprints", label: "Calçados 👟", color: "text-rose-500", bg: "bg-rose-50" },
                { id: "Contas", icon: "handCoins", label: "Contas 🧾", color: "text-emerald-500", bg: "bg-emerald-50" },
                { id: "Emprego", icon: "briefcase", label: "Emprego 🔧", color: "text-indigo-500", bg: "bg-indigo-50" },
                { id: "Higiene", icon: "droplets", label: "Higiene 🧼", color: "text-cyan-500", bg: "bg-cyan-50" },
                { id: "Medicamentos", icon: "pill", label: "Medicamentos 💊", color: "text-red-500", bg: "bg-red-50" },
                { id: "Móveis", icon: "armchair", label: "Móveis 🪑", color: "text-amber-500", bg: "bg-amber-50" },
                { id: "Eletrodomésticos", icon: "tv", label: "Eletrodomésticos 📺", color: "text-slate-500", bg: "bg-slate-50" },
                { id: "Material Escolar", icon: "bookOpen", label: "Material Escolar 📚", color: "text-violet-500", bg: "bg-violet-50" },
                { id: "Transporte", icon: "bus", label: "Transporte 🚌", color: "text-yellow-600", bg: "bg-yellow-50" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    handleCategorySelect(opt.id);
                    setIsModalOpen(false);
                  }}
                  className={`modal-option ${formData.category === opt.id ? 'selected' : ''}`}
                >
                  <div className={`option-icon ${opt.bg} ${opt.color}`}>
                    <FlatIcon type={opt.icon} size={24} />
                  </div>
                  <span className="option-label">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="modal-footer-msg">
              <p className="footer-msg-text">Clique fora para cancelar</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function StepContent({ step, formData, updateData, setIsModalOpen }) {
  switch (step) {
    case 1: return <Step1 formData={formData} updateData={updateData} setIsModalOpen={setIsModalOpen} />;
    case 2: return <Step2 formData={formData} updateData={updateData} />;
    case 3: return <Step3 formData={formData} updateData={updateData} />;
    case 4: return <Step4 formData={formData} updateData={updateData} />;
    case 5: return <Step5 formData={formData} updateData={updateData} />;
    case 6: return <Step6 formData={formData} updateData={updateData} />;
    case 7: return <Step7 formData={formData} updateData={updateData} />;
    default: return null;
  }
}

function Step1({ formData, updateData, setIsModalOpen }) {
  const categories = [
    { id: "Alimentos", icon: "utensils", label: "Alimentos", color: "text-orange-500", bg: "bg-orange-50" },
    { id: "Roupas", icon: "shirt", label: "Roupas", color: "text-blue-500", bg: "bg-blue-50" },
    { id: "Higiene", icon: "droplets", label: "Higiene", color: "text-cyan-500", bg: "bg-cyan-50" },
    { id: "Medicamentos", icon: "pill", label: "Medicamentos", color: "text-red-500", bg: "bg-red-50" },
    { id: "Contas", icon: "handCoins", label: "Contas", color: "text-green-500", bg: "bg-green-50" },
    { id: "Emprego", icon: "briefcase", label: "Emprego", color: "text-indigo-500", bg: "bg-indigo-50" },
    { id: "Outros", icon: "plus", label: "Outros", color: "text-zinc-500", bg: "bg-zinc-50" },
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
    <div className="step-content">
      <div className="step-title-container">
        <h2 className="step-title">
          Olá! Do que você <br/>
          <span className="text-orange">precisa hoje?</span>
        </h2>
        <p className="step-subtitle">
          Selecione uma categoria principal para que possamos direcionar seu pedido às pessoas certas.
        </p>
      </div>

      <div className="category-grid">
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
            className={`category-card ${formData.category === cat.id ? 'selected' : ''}`}
          >
            <div className={`category-icon-wrapper ${cat.bg} ${cat.color}`}>
              <FlatIcon type={cat.icon} size={40} />
            </div>
            <span className="category-label">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

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

  const colorMap = {
    blue: "border-blue-500 bg-blue-50 shadow-blue-100",
    indigo: "border-indigo-500 bg-indigo-50 shadow-indigo-100",
    rose: "border-rose-500 bg-rose-50 shadow-rose-100",
    emerald: "border-emerald-500 bg-emerald-50 shadow-emerald-100",
    violet: "border-violet-500 bg-violet-50 shadow-violet-100",
    cyan: "border-cyan-500 bg-cyan-50 shadow-cyan-100",
    red: "border-red-500 bg-red-50 shadow-red-100",
    amber: "border-amber-500 bg-amber-50 shadow-amber-100",
    slate: "border-slate-500 bg-slate-50 shadow-slate-100",
    fuchsia: "border-fuchsia-500 bg-fuchsia-50 shadow-fuchsia-100",
    yellow: "border-yellow-600 bg-yellow-50 shadow-yellow-100",
  };

  const textColorMap = {
    blue: "text-blue-500",
    indigo: "text-indigo-500",
    rose: "text-rose-500",
    emerald: "text-emerald-500",
    violet: "text-violet-500",
    cyan: "text-cyan-500",
    red: "text-red-500",
    amber: "text-amber-500",
    slate: "text-slate-500",
    fuchsia: "text-fuchsia-500",
    yellow: "text-yellow-600",
  };

  const bgIconColorMap = {
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    rose: "bg-rose-500",
    emerald: "bg-emerald-500",
    violet: "bg-violet-500",
    cyan: "bg-cyan-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
    slate: "bg-slate-500",
    fuchsia: "bg-fuchsia-500",
    yellow: "bg-yellow-600",
  };

  return (
    <div className="step-content">
      <div className="step-title-container">
        <h2 className="step-title">
          {config.title.split('?')[0]} <br/>
          <span className={textColorMap[config.color]}>
            {config.title.split('?')[1] || config.title}?
          </span>
        </h2>
        <p className="step-subtitle">{config.subtitle}</p>
      </div>

      <div className="items-grid">
        {config.items.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.label)}
            className={`item-card ${formData.items.includes(opt.label) ? 'selected' : ''}`}
          >
            <div className="item-check">
              {formData.items.includes(opt.label) ? <FlatIcon type="check" size={24} color="white" /> : <FlatIcon type="plus" size={24} />}
            </div>
            <div className="item-info">
              <h4>{opt.label}</h4>
              <p>{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Campos Específicos para Roupas */}
      {formData.category === "Roupas" && (
        <div className="selection-group">
          <div>
            <h3 className="selection-title">Qual o tamanho das peças?</h3>
            <div className="pill-container">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => updateData({ clothingSize: size })}
                  className={`pill-btn ${formData.clothingSize === size ? 'selected' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="selection-title">Qual a preferência de estilo?</h3>
            <div className="pill-container">
              {preferences.map(pref => (
                <button
                  key={pref}
                  onClick={() => updateData({ clothingPreference: pref })}
                  className={`pill-btn ${formData.clothingPreference === pref ? 'selected' : ''}`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Campos Específicos para Calçados */}
      {formData.category === "Calçados" && (
        <div className="selection-group">
          <div>
            <h3 className="selection-title">Qual o número do calçado?</h3>
            <div className="pill-container">
              {shoeSizes.map(size => (
                <button
                  key={size}
                  onClick={() => updateData({ shoeSize: size })}
                  className={`pill-btn ${formData.shoeSize === size ? 'selected' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Step3({ formData, updateData }) {
  return (
    <div className="step-content">
      <div className="step-title-container">
        <h2 className="step-title">
          Conte um pouco <br/>
          <span className="text-red">sua história</span>
        </h2>
        <p className="step-subtitle">
          Sua mensagem ajuda os vizinhos a entenderem como melhor te apoiar.
        </p>
      </div>

      <div className="textarea-wrapper">
        <textarea
          className="custom-textarea"
          placeholder="Ex: Sou mãe solo de 3 crianças e meu auxílio atrasou este mês. Precisaria de uma ajuda básica para as refeições da semana..."
          value={formData.description}
          onChange={(e) => updateData({ description: e.target.value.slice(0, 1000) })}
        />
        <div className="char-counter">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(formData.description.length / 1000) * 100}%` }} 
            />
          </div>
          <span className="char-text">{formData.description.length}/1000</span>
        </div>
      </div>
    </div>
  );
}

function Step4({ formData, updateData }) {
  const options = [
    { id: "urgente", label: "URGENTE", desc: "Preciso para hoje", icon: "alertCircle", color: "text-red-600", bg: "bg-red-50", border: "border-red-500" },
    { id: "moderada", label: "MODERADA", desc: "Até o fim da semana", icon: "clock", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-500" },
    { id: "esperar", label: "TRANQUILO", desc: "Pode esperar", icon: "check", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-500" },
  ];

  return (
    <div className="step-content">
      <div className="step-title-container">
        <h2 className="step-title">
          Qual o seu <br/>
          <span className="text-red">nível de pressa?</span>
        </h2>
        <p className="step-subtitle">
          Isso define a prioridade do seu card no mural da comunidade.
        </p>
      </div>

      <div className="urgency-grid">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => updateData({ urgency: opt.id })}
            className={`urgency-card ${formData.urgency === opt.id ? 'selected' : ''}`}
          >
            <div className={`urgency-icon-box ${opt.bg} ${opt.color}`}>
              <FlatIcon type={opt.icon} size={64} />
            </div>
            <div className="urgency-info">
              <h5>{opt.label}</h5>
              <p>{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step5({ formData, updateData }) {
  const options = [
    { id: "WhatsApp", label: "WHATSAPP", icon: "smartphone", color: "text-green-600", bg: "bg-green-100/50" },
    { id: "Ligação", label: "LIGAÇÃO", icon: "phone", color: "text-blue-600", bg: "bg-blue-100/50" },
    { id: "Chat", label: "CHAT LOCAL", icon: "messageSquare", color: "text-orange-600", bg: "bg-orange-100/50" },
  ];

  const toggle = (id) => {
    const current = formData.contactPreferences;
    const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updateData({ contactPreferences: next });
  };

  return (
    <div className="step-content">
      <div className="step-title-container">
        <h2 className="step-title">
          Como prefere <br/>
          <span className="text-green">ser contatado?</span>
        </h2>
        <p className="step-subtitle">
          Seu número só será exibido para doadores verificados.
        </p>
      </div>

      <div className="urgency-grid">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`urgency-card ${formData.contactPreferences.includes(opt.id) ? 'selected' : ''}`}
          >
            <div className={`urgency-icon-box ${formData.contactPreferences.includes(opt.id) ? 'bg-zinc-900 text-white' : opt.bg + ' ' + opt.color}`}>
              <FlatIcon type={opt.icon} size={48} />
            </div>
            <h5>{opt.label}</h5>
            <div className={`checkbox ${formData.contactPreferences.includes(opt.id) ? 'checked' : ''}`}>
              {formData.contactPreferences.includes(opt.id) && <FlatIcon type="check" size={16} color="white" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step6({ formData, updateData }) {
  const options = [
    { id: "Apenas meu bairro", label: "MEU BAIRRO", desc: "Vizinhos mais próximos", icon: "mapPin" },
    { id: "Bairros próximos", label: "ENTORNO", desc: "Raio de 5km a 10km", icon: "users" },
    { id: "ONGs parceiras", label: "INSTITUIÇÕES", desc: "Doadores corporativos", icon: "building2" },
  ];

  const toggle = (id) => {
    const current = formData.visibility;
    const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updateData({ visibility: next });
  };

  return (
    <div className="step-content">
      <div className="step-title-container">
        <h2 className="step-title">
          Quem pode ver <br/>
          <span className="text-indigo">seu pedido?</span>
        </h2>
        <p className="step-subtitle">
          Controle o alcance da sua solicitação por segurança e privacidade.
        </p>
      </div>

      <div className="urgency-grid">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`urgency-card ${formData.visibility.includes(opt.id) ? 'selected' : ''}`}
          >
            <div className={`urgency-icon-box ${formData.visibility.includes(opt.id) ? 'bg-indigo-500 text-white' : 'bg-white text-zinc-300'}`}>
              <FlatIcon type={opt.icon} size={48} />
            </div>
            <div className="urgency-info">
              <h5>{opt.label}</h5>
              <p>{opt.desc}</p>
            </div>
            <div className={`checkbox ${formData.visibility.includes(opt.id) ? 'checked' : ''}`}>
              {formData.visibility.includes(opt.id) && <FlatIcon type="check" size={16} color="white" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

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
    <div className="review-container">
      
      <div className="review-main">
        
        <div className="review-section">
          <h2>Informações do pedido</h2>
          
          <div className="info-cards">
            <div className="info-card">
              <div className="info-card-content">
                <span>Categoria</span>
                <p>{formData.category}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl text-orange-500">
                <FlatIcon type="plus" size={24} />
              </div>
            </div>

            <div className="info-card">
              <div className="info-card-content">
                <span>Urgência</span>
                <div className="flex items-center gap-3 mt-1">
                  <div className={`w-4 h-4 rounded-full animate-pulse ${
                    formData.urgency === 'urgente' ? 'bg-red-500 shadow-lg shadow-red-200' : 
                    formData.urgency === 'moderada' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <p className="font-black text-2xl text-zinc-900 uppercase tracking-tighter">{formData.urgency}</p>
                </div>
              </div>
            </div>

            {(formData.clothingSize || formData.shoeSize) && (
              <div className="info-card">
                <div className="info-card-content">
                  <span>Tamanho</span>
                  <p>{formData.category === "Roupas" ? formData.clothingSize : formData.shoeSize}</p>
                </div>
              </div>
            )}

            {formData.clothingPreference && (
              <div className="info-card">
                <div className="info-card-content">
                  <span>Preferência</span>
                  <p>{formData.clothingPreference}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="review-section">
          <h2>Itens Solicitados</h2>
          <div className="items-pills">
            {formData.items.length > 0 ? formData.items.map(item => (
              <div key={item} className="item-pill">
                {item}
              </div>
            )) : (
              <div className="bg-zinc-50 px-10 py-6 rounded-[32px] border-4 border-dashed border-zinc-200">
                <p className="text-zinc-400 font-black italic tracking-widest uppercase text-sm">Nenhum item específico</p>
              </div>
            )}
          </div>
        </div>

        <div className="location-card">
          <div className="location-icon-bg">
            <FlatIcon type="mapPin" size={128} color="rgba(255,255,255,0.2)" />
          </div>
          <div className="location-details">
            <span className="location-label">Localização da Ajuda</span>
            <p className="location-text">{formData.location || "Localização não definida"}</p>
            <div className="location-status">
              <FlatIcon type="check" size={16} color="#4ade80" />
              Área com alta atividade de vizinhos
            </div>
          </div>
        </div>
      </div>

      <div className="review-side">
        
        <div className="review-section">
          <h2>Sua mensagem</h2>
          <div className="message-box">
            <div className="absolute -top-6 -left-6 bg-red-500 text-white p-5 rounded-3xl shadow-xl rotate-12">
              <FlatIcon type="messageSquare" size={32} color="white" />
            </div>
            <p className="message-quote">
              "{formData.description || "Nenhuma descrição fornecida..."}"
            </p>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-placeholder">
              <FlatIcon type="userCircle" size={48} color="rgba(255,255,255,0.8)" />
            </div>
            <div>
              <p className="profile-name">{user?.nome || 'Usuário'}</p>
              <div className="flex items-center gap-2">
                <div className="bg-green-400 text-green-900 font-black text-[10px] px-2 py-1 rounded">VERIFICADO</div>
              </div>
            </div>
          </div>

          <div className="profile-detail-row">
            <span className="profile-detail-label">Preferência:</span>
            <span>{formData.contactPreferences.join(" • ") || "N/A"}</span>
          </div>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Alcance:</span>
            <span>{formData.visibility.join(" • ") || "N/A"}</span>
          </div>

          <div className="security-box">
            <FlatIcon type="shieldCheck" size={32} color="#4ade80" />
            <p className="security-text">
              Seus dados estão protegidos pela nossa rede de segurança comunitária.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}