import React from 'react';
import './ReviewSection.css';

const ReviewSection = ({ 
  formData, 
  categories, 
  urgencyLevels, 
  contactMethods, 
  visibilityOptions,
  clothingTypes,
  foodTypes,
  hygieneTypes,
  medicineTypes,
  billTypes,
  workTypes,
  clothingSizes,
  onAnonymousToggle,
  onPublish,
  isSubmitting 
}) => {
  const getCategoryIcon = () => {
    const category = categories.find(c => c.id === formData.category);
    return category?.icon || '❓';
  };

  const getCategoryLabel = () => {
    const category = categories.find(c => c.id === formData.category);
    return category?.label || 'Não especificado';
  };

  const getUrgencyData = () => {
    return urgencyLevels.find(u => u.id === formData.urgency) || {};
  };

  const getTypesList = () => {
    const typesMap = {
      clothes: clothingTypes,
      food: foodTypes,
      hygiene: hygieneTypes,
      meds: medicineTypes,
      bills: billTypes,
      work: workTypes
    };
    return typesMap[formData.category] || [];
  };

  const getVisibilityLabel = () => {
    const option = visibilityOptions.find(v => v.id === formData.visibility);
    return option?.label || 'Não especificado';
  };

  return (
    <div className="review-container">
      {/* Cabeçalho de Confirmação */}
      <div className="review-header">
        <div className="review-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="review-title">Confirme seu pedido</h2>
        <p className="review-subtitle">
          Revise as informações antes de publicar para sua comunidade
        </p>
      </div>

      {/* Informações Principais - Destaque */}
      <div className="review-main-info">
        <div className="main-info-card category-card">
          <div className="card-icon">{getCategoryIcon()}</div>
          <div className="card-content">
            <h3>Categoria</h3>
            <p>{getCategoryLabel()}</p>
          </div>
        </div>

        <div className="main-info-card urgency-card">
          <div className={`urgency-indicator ${formData.urgency}`}>
            <div className="urgency-dot"></div>
          </div>
          <div className="card-content">
            <h3>Urgência</h3>
            <p>{getUrgencyData().label}</p>
          </div>
        </div>
      </div>

      {/* Detalhes do Pedido */}
      <div className="review-section">
        <div className="section-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3>Detalhes do Pedido</h3>
        </div>

        <div className="details-grid">
          {/* Tipos específicos */}
          {formData.categoryDetails?.types?.length > 0 && (
            <div className="detail-item">
              <label>Tipos específicos</label>
              <div className="tags-container">
                {formData.categoryDetails.types.map(typeId => {
                  const typeObj = getTypesList().find(t => t.id === typeId);
                  return (
                    <span key={typeId} className="detail-tag">
                      {typeObj?.icon && <span className="tag-icon">{typeObj.icon}</span>}
                      {typeObj?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tamanhos (para roupas) */}
          {formData.category === 'clothes' && formData.categoryDetails?.sizes?.length > 0 && (
            <div className="detail-item">
              <label>Tamanhos</label>
              <div className="tags-container">
                {formData.categoryDetails.sizes.map(sizeId => {
                  const sizeObj = clothingSizes.find(s => s.id === sizeId);
                  return (
                    <span key={sizeId} className="detail-tag size-tag">
                      {sizeObj?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Descrição */}
          <div className="detail-item description-item">
            <label>Sua mensagem</label>
            <div className="description-box">
              <p>{formData.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configurações de Contato */}
      <div className="review-section">
        <div className="section-header">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3>Como te encontrar</h3>
        </div>

        <div className="contact-grid">
          <div className="contact-item">
            <label>Formas de contato</label>
            <div className="contact-methods">
              {formData.contacts.map(contactId => {
                const method = contactMethods.find(m => m.id === contactId);
                return (
                  <div key={contactId} className="contact-method">
                    <span className="method-icon">{method?.icon}</span>
                    <span className="method-label">{method?.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="contact-item">
            <label>Visibilidade</label>
            <div className="visibility-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{getVisibilityLabel()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Privacidade e Ação Final */}
      <div className="review-final-section">
        <div 
          className={`privacy-toggle ${formData.anonymous ? 'active' : ''}`}
          onClick={onAnonymousToggle}
        >
          <div className="privacy-checkbox">
            {formData.anonymous && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div className="privacy-content">
            <div className="privacy-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Publicar anonimamente</span>
            </div>
            <p>Seu nome não aparecerá publicamente no pedido</p>
          </div>
        </div>

        <div className="publish-section">
          <div className="publish-info">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Ao publicar, sua solicitação ficará visível para pessoas dispostas a ajudar em sua região</p>
          </div>
          
          <button 
            className={`publish-button ${isSubmitting ? 'submitting' : ''}`}
            onClick={onPublish}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner"></div>
                Publicando...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Publicar Pedido
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;