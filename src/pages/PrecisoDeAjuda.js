import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/pages/PrecisoDeAjuda.css';

const categories = [
  { id: 'food', label: 'Alimentos', icon: '🛒' },
  { id: 'clothes', label: 'Roupas / calçados', icon: '👕' },
  { id: 'hygiene', label: 'Higiene / limpeza', icon: '🧼' },
  { id: 'meds', label: 'Medicamentos', icon: '💊' },
  { id: 'bills', label: 'Contas (água/luz)', icon: '🧾' },
  { id: 'work', label: 'Emprego / renda', icon: '💼' },
  { id: 'serv', label: 'Serviços', icon: '🔧' },
  { id: 'other', label: 'Outros', icon: '➕' },
];

const PrecisoDeAjuda = () => {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState(null);
  const [urgency, setUrgency] = useState('media');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = (e) => {
    e.preventDefault();
    if (selectedCat && description.trim()) {
      setIsPublished(true);
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
              <div className="sparkle">✨</div>
            </div>
          </div>
          
          <h2>Seu pedido foi publicado!</h2>
          <p className="success-message">
            As pessoas do seu bairro agora podem ver sua necessidade. Fique atento às notificações ou ao seu WhatsApp.
          </p>

          <div className="success-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/pedidos')}
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
            <h2>Preciso de Ajuda</h2>
            <p>Conte ao seu bairro como podemos te ajudar.</p>
          </div>

          <form onSubmit={handlePublish} className="help-form">
            {/* Tipo de ajuda */}
            <section className="form-section">
              <h3>O que você está precisando?</h3>
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
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Detalhes */}
            <section className="form-section">
              <h3>Conte mais detalhes</h3>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva brevemente sua necessidade para que as pessoas entendam como ajudar..."
                className="form-textarea"
                rows="4"
                required
              />
            </section>

            {/* Urgência */}
            <section className="form-section">
              <h3>Qual a urgência?</h3>
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
                    <span className="urgency-label">Baixa</span>
                    <span className="urgency-desc">Quando der</span>
                  </div>
                </label>
              </div>
            </section>

            {/* Contato */}
            <section className="form-section">
              <h3>Como prefere ser contatado?</h3>
              <div className="contact-grid">
                <button type="button" className="contact-option selected">
                  <span className="contact-icon">💬</span>
                  <span className="contact-label">WhatsApp</span>
                </button>
                <button type="button" className="contact-option">
                  <span className="contact-icon">📞</span>
                  <span className="contact-label">Ligação</span>
                </button>
                <button type="button" className="contact-option">
                  <span className="contact-icon">💬</span>
                  <span className="contact-label">Chat Interno</span>
                </button>
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
                    <button type="button" className="visibility-btn selected">Apenas meu bairro</button>
                    <button type="button" className="visibility-btn">Bairros próximos</button>
                    <button type="button" className="visibility-btn">ONGs parceiras</button>
                  </div>
                </div>
              </div>
            </section>

            <button 
              type="submit"
              disabled={!selectedCat || !description.trim()}
              className="btn btn-primary btn-large submit-btn"
            >
              Publicar pedido de ajuda
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PrecisoDeAjuda;