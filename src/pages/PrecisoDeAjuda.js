import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/pages/PrecisoDeAjuda.css';

const categories = [
  { id: 'food', label: 'Alimentos', icon: '🛒', desc: 'Comida, cesta básica' },
  { id: 'clothes', label: 'Roupas', icon: '👕', desc: 'Roupas, calçados' },
  { id: 'hygiene', label: 'Higiene', icon: '🧼', desc: 'Produtos de limpeza' },
  { id: 'meds', label: 'Medicamentos', icon: '💊', desc: 'Remédios, consultas' },
  { id: 'bills', label: 'Contas', icon: '🧾', desc: 'Água, luz, aluguel' },
  { id: 'work', label: 'Emprego', icon: '💼', desc: 'Trabalho, renda' },
  { id: 'serv', label: 'Serviços', icon: '🔧', desc: 'Reparos, ajuda técnica' },
  { id: 'other', label: 'Outros', icon: '➕', desc: 'Outras necessidades' },
];

const contactOptions = [
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬', desc: 'Mais rápido' },
  { id: 'phone', label: 'Ligação', icon: '📞', desc: 'Tradicional' },
  { id: 'chat', label: 'Chat Interno', icon: '💬', desc: 'Na plataforma' },
];

const visibilityOptions = [
  { id: 'neighborhood', label: 'Apenas meu bairro', desc: 'Mais próximo' },
  { id: 'nearby', label: 'Bairros próximos', desc: 'Área expandida' },
  { id: 'ngos', label: 'ONGs parceiras', desc: 'Organizações' },
];

const PrecisoDeAjuda = () => {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState(null);
  const [urgency, setUrgency] = useState('media');
  const [description, setDescription] = useState('');
  const [contactMethod, setContactMethod] = useState('whatsapp');
  const [visibility, setVisibility] = useState('neighborhood');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = (e) => {
    e.preventDefault();
    if (selectedCat && description.trim()) {
      // Simulate API call
      setTimeout(() => {
        setIsPublished(true);
      }, 1000);
    }
  };

  if (isPublished) {
    return (
      <div className="preciso-ajuda">
        <Header />
        <main className="success-content">
          <div className="success-animation">
            <div className="success-icon">
              <div className="check-circle">
                ✓
              </div>
              <div className="sparkles">
                <span className="sparkle sparkle-1">✨</span>
                <span className="sparkle sparkle-2">⭐</span>
                <span className="sparkle sparkle-3">💫</span>
              </div>
            </div>
          </div>
          
          <h2>Seu pedido foi publicado!</h2>
          <p className="success-message">
            As pessoas do seu bairro agora podem ver sua necessidade. Fique atento às notificações ou ao seu WhatsApp.
          </p>

          <div className="success-stats">
            <div className="stat-item">
              <span className="stat-number">127</span>
              <span className="stat-label">pessoas no seu bairro</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">~2h</span>
              <span className="stat-label">tempo médio de resposta</span>
            </div>
          </div>

          <div className="success-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/quero-ajudar')}
            >
              Ver ajudas disponíveis perto de mim
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Voltar para o início
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="preciso-ajuda">
      <Header />

      <main className="form-content">
        <div className="container">
          <div className="page-intro">
            <div className="intro-badge">
              <span className="badge-text">🎆 Sua comunidade te ajuda</span>
            </div>
            <h2>Preciso de Ajuda</h2>
            <p>Conte ao seu bairro como podemos te ajudar. Juntos somos mais fortes.</p>
          </div>

          <form onSubmit={handlePublish} className="help-form">
            {/* Tipo de ajuda */}
            <section className="form-section">
              <h3>🎯 O que você está precisando?</h3>
              <div className="categories-grid">
                {categories.map((cat) => {
                  const isSelected = selectedCat === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCat(cat.id)}
                      className={`category-btn ${isSelected ? 'selected' : ''}`}
                    >
                      <span className="category-icon">{cat.icon}</span>
                      <span className="category-label">{cat.label}</span>
                      <span className="category-desc">{cat.desc}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Detalhes */}
            <section className="form-section">
              <h3>📝 Conte mais detalhes</h3>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva brevemente sua necessidade para que as pessoas entendam como ajudar...\n\nExemplo: Preciso de cesta básica para minha família de 4 pessoas. Estou desempregado há 2 meses e as reservas acabaram."
                className="form-textarea"
                rows="5"
                required
              />
              <div className="char-counter">
                {description.length}/500 caracteres
              </div>
            </section>

            {/* Urgência */}
            <section className="form-section">
              <h3>⏰ Qual a urgência?</h3>
              <div className="urgency-grid">
                <label className={`urgency-option ${urgency === 'alta' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="urgency"
                    value="alta"
                    checked={urgency === 'alta'}
                    onChange={(e) => setUrgency(e.target.value)}
                  />
                  <div className="urgency-content">
                    <span className="urgency-emoji">🔴</span>
                    <span className="urgency-label">Alta</span>
                    <span className="urgency-desc">Essa semana</span>
                  </div>
                </label>
                <label className={`urgency-option ${urgency === 'media' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="urgency"
                    value="media"
                    checked={urgency === 'media'}
                    onChange={(e) => setUrgency(e.target.value)}
                  />
                  <div className="urgency-content">
                    <span className="urgency-emoji">🟡</span>
                    <span className="urgency-label">Média</span>
                    <span className="urgency-desc">Até 30 dias</span>
                  </div>
                </label>
                <label className={`urgency-option ${urgency === 'baixa' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="urgency"
                    value="baixa"
                    checked={urgency === 'baixa'}
                    onChange={(e) => setUrgency(e.target.value)}
                  />
                  <div className="urgency-content">
                    <span className="urgency-emoji">🟢</span>
                    <span className="urgency-label">Baixa</span>
                    <span className="urgency-desc">Quando der</span>
                  </div>
                </label>
              </div>
            </section>

            {/* Contato */}
            <section className="form-section">
              <h3>📞 Como prefere ser contatado?</h3>
              <div className="contact-grid">
                {contactOptions.map((option) => {
                  const isSelected = contactMethod === option.id;
                  return (
                    <button 
                      key={option.id}
                      type="button" 
                      onClick={() => setContactMethod(option.id)}
                      className={`contact-option ${isSelected ? 'selected' : ''}`}
                    >
                      <span className="contact-icon">{option.icon}</span>
                      <span className="contact-label">{option.label}</span>
                      <span className="contact-desc">{option.desc}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Privacidade */}
            <section className="privacy-section">
              <div className="privacy-header">
                <span className="privacy-icon">🔒</span>
                <h3>Privacidade e Visibilidade</h3>
              </div>

              <div className="privacy-options">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <div className="checkbox-content">
                    <span className="checkbox-label">Não mostrar meu nome publicamente</span>
                    <span className="checkbox-desc">Seu pedido aparecerá como "Anônimo"</span>
                  </div>
                </label>
                
                <div className="visibility-options">
                  <h4>Quem pode ver seu pedido?</h4>
                  <div className="visibility-buttons">
                    {visibilityOptions.map((option) => {
                      const isSelected = visibility === option.id;
                      return (
                        <button 
                          key={option.id}
                          type="button" 
                          onClick={() => setVisibility(option.id)}
                          className={`visibility-btn ${isSelected ? 'selected' : ''}`}
                        >
                          {option.label}
                          <span className="visibility-desc">{option.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <button 
              type="submit"
              disabled={!selectedCat || !description.trim()}
              className="btn btn-primary btn-large submit-btn"
            >
              <span className="btn-icon">🚀</span>
              Publicar pedido de ajuda
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PrecisoDeAjuda;