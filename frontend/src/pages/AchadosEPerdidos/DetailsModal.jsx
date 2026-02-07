import React, { useState } from 'react';
import { X, MapPin, Calendar, Tag, MessageCircle, Send, User, Share2 } from 'lucide-react';
import './styles.css';

const DetailsModal = ({ item, onClose }) => {
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'comments'
  const [commentText, setCommentText] = useState('');
  
  // Mock de comentários para demonstração (idealmente viria do backend/props)
  const [comments, setComments] = useState([
    { id: 1, author: 'Maria Silva', text: 'Acho que vi algo parecido perto da praça central ontem à tarde.', date: 'Há 2 horas', avatar: 'MS' },
    { id: 2, author: 'João Souza', text: 'Compartilhei no grupo de moradores do bairro.', date: 'Há 5 horas', avatar: 'JS' }
  ]);

  if (!item) return null;

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    
    const newComment = {
      id: Date.now(),
      author: 'Você',
      text: commentText,
      date: 'Agora',
      avatar: 'EU'
    };
    
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  return (
    <div className="lf-modal-backdrop" onClick={onClose}>
      <div className="lf-details-modal" onClick={e => e.stopPropagation()}>
        <div className="lf-details-grid">
          {/* Lado Esquerdo - Imagem */}
          <div className="lf-details-image">
            <img 
              src={item.image || "/api/placeholder/600/800"} 
              alt={item.title} 
            />
            <div className={`lf-details-badge ${item.type === 'lost' ? 'lost' : 'found'}`}>
              {item.type === 'lost' ? 'PERDIDO' : 'ENCONTRADO'}
            </div>
          </div>

          {/* Lado Direito - Informações e Abas */}
          <div className="lf-details-info">
            <div className="lf-details-head">
              {/* Navegação por Abas */}
              <div className="lf-details-tabs">
                <button 
                  className={`lf-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Detalhes
                </button>
                <button 
                  className={`lf-tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('comments')}
                >
                  Comentários ({comments.length})
                </button>
              </div>
              
              <button className="lf-modal-close-small" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo da Aba: Detalhes */}
            {activeTab === 'details' ? (
              <div className="lf-tab-content">
                <h2 className="lf-details-title">{item.title}</h2>

                <div className="lf-details-meta-grid">
                  <div className="lf-details-meta-box">
                    <MapPin size={20} />
                    <div>
                      <label>Localização</label>
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <div className="lf-details-meta-box">
                    <Calendar size={20} />
                    <div>
                      <label>Data</label>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                {item.reward && (
                  <div className="lf-details-reward">
                    <Tag size={24} />
                    <div>
                      <label>Recompensa</label>
                      <span>{item.reward}</span>
                    </div>
                  </div>
                )}

                <div className="lf-details-description">
                  <h3>Descrição</h3>
                  <p>{item.description}</p>
                </div>

                <div className="lf-details-tags">
                  {item.tags && item.tags.map((tag, index) => (
                    <span key={index} className="lf-tag">#{tag}</span>
                  ))}
                </div>

                <div className="lf-details-footer">
                  <div className="lf-contact-box">
                    <label>Publicado por</label>
                    <div className="lf-contact-value">
                      <User size={24} />
                      <span>{item.contactName || 'Usuário SolidarBairro'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Conteúdo da Aba: Comentários */
              <div className="lf-comments-section">
                <h3 className="lf-comments-title">
                  <MessageCircle size={20} />
                  Discussão da Comunidade
                </h3>
                
                <div className="lf-comments-list">
                  {comments.map(comment => (
                    <div key={comment.id} className="lf-comment">
                      <div className="lf-comment-avatar">
                        {comment.avatar}
                      </div>
                      <div className="lf-comment-content">
                        <div className="lf-comment-header">
                          <span className="lf-comment-author">{comment.author}</span>
                          <span className="lf-comment-date">{comment.date}</span>
                        </div>
                        <p className="lf-comment-text">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lf-comment-input-box">
                  <input 
                    type="text" 
                    className="lf-comment-input" 
                    placeholder="Escreva um comentário ou dica..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                  />
                  <button className="lf-comment-send-btn" onClick={handleSendComment}>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;