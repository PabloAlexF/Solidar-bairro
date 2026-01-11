"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  Filter, 
  X, 
  Camera, 
  Package,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Gift,
  Phone,
  Sparkles,
  Clock,
  Info,
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react';
import './mobile-styles.css';

const CATEGORIES = [
  'Eletrônicos',
  'Documentos',
  'Pets',
  'Chaves',
  'Vestuário',
  'Carteiras',
  'Bolsas/Mochilas',
  'Joias/Relógios',
  'Outros'
];

const ItemCard = ({ item, onOpenDetails, isPreview = false }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`lf-card ${isPreview ? 'preview' : ''}`}
    >
      <div className="lf-card-image">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="lf-card-img" />
        ) : (
          <div className="lf-card-placeholder">
            <Camera size={32} strokeWidth={1} />
          </div>
        )}
        <div className={`lf-type-badge ${item.type}`}>
          {item.type === 'lost' ? (
            <span className="badge-content"><Search size={12} /> PERDIDO</span>
          ) : (
            <span className="badge-content"><CheckCircle2 size={12} /> ACHADO</span>
          )}
        </div>
      </div>

      <div className="lf-card-body">
        <div className="lf-card-header">
          <span className="lf-category-tag">{item.category}</span>
          <span className="lf-card-date">
            <Clock size={12} />
            {item.date_occurrence ? new Date(item.date_occurrence).toLocaleDateString('pt-BR') : 'Recentemente'}
          </span>
        </div>
        
        <h3 className="lf-card-title">
          {item.title || 'Novo Item'}
        </h3>
        <p className="lf-card-desc">{item.description || 'Descreva os detalhes importantes aqui...'}</p>
      
        <div className="lf-card-meta">
          <div className="lf-meta-item">
            <MapPin size={14} />
            <span>{item.location || 'Local a definir'}</span>
          </div>
          {item.reward && item.type === 'lost' && (
            <div className="lf-meta-item reward">
              <Gift size={14} />
              <span>Recompensa: {item.reward}</span>
            </div>
          )}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="lf-card-tags">
            {item.tags.map((tag, i) => (
              <span key={i} className="lf-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="lf-card-footer">
        <button className="lf-details-btn" onClick={() => onOpenDetails && onOpenDetails(item)}>
          VER DETALHES
        </button>
        <button className="lf-chat-btn">
          ABRIR CHAT
        </button>
      </div>
    </motion.div>
  );
};

export default function MobileAchadosEPerdidos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showImageError, setShowImageError] = useState(false);
  const [locationScope, setLocationScope] = useState('city');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Eletrônicos',
    type: 'lost',
    location: '',
    date_occurrence: new Date().toISOString().split('T')[0],
    contact_info: '',
    image_url: '',
    reward: '',
    tags: [],
    status: 'active'
  });

  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setTimeout(() => {
      setItems([
        {
          id: 1,
          title: 'Carteira Preta',
          description: 'Carteira de couro preta com documentos pessoais.',
          category: 'Carteiras',
          type: 'lost',
          location: 'Centro, São Paulo',
          date_occurrence: '2024-01-15',
          contact_info: '(11) 99999-9999',
          image_url: '',
          reward: 'R$ 100,00',
          tags: ['couro', 'documentos'],
          status: 'active'
        },
        {
          id: 2,
          title: 'Chaves com Chaveiro',
          description: 'Molho de chaves com chaveiro vermelho.',
          category: 'Chaves',
          type: 'found',
          location: 'Parque Ibirapuera',
          date_occurrence: '2024-01-18',
          contact_info: '(11) 88888-8888',
          image_url: '',
          reward: '',
          tags: ['chaves', 'vermelho'],
          status: 'active'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleCreateItem = async () => {
    if (!formData.title || !formData.contact_info) return;
    
    if (!formData.image_url) {
      setShowImageError(true);
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      const newItem = { ...formData, id: Date.now() };
      setItems(prev => [newItem, ...prev]);
      setIsModalOpen(false);
      resetForm();
      setIsSubmitting(false);
    }, 1000);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Eletrônicos',
      type: 'lost',
      location: '',
      date_occurrence: new Date().toISOString().split('T')[0],
      contact_info: '',
      image_url: '',
      reward: '',
      tags: [],
      status: 'active'
    });
    setCurrentStep(1);
  };

  const addTag = () => {
    const cleanTag = newTag.trim().toLowerCase().replace(/^#/, '');
    if (cleanTag && !formData.tags.includes(cleanTag)) {
      setFormData({ ...formData, tags: [...formData.tags, cleanTag] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData({ ...formData, image_url: e.target.result });
      setShowImageError(false);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    fetchItems();
  }, [categoryFilter, typeFilter, searchTerm]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="lf-step">
            <h3 className="lf-step-title">O que aconteceu?</h3>
            <p className="lf-step-subtitle">Selecione o tipo de ocorrência</p>
            <div className="lf-type-grid">
              <button 
                className={`lf-type-option ${formData.type === 'lost' ? 'active lost' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'lost' })}
              >
                <div className="lf-type-icon-wrapper">
                  <Search size={32} />
                </div>
                <div className="lf-type-content">
                  <span className="lf-type-title">Perdi Algo</span>
                  <span className="lf-type-desc">Estou procurando um objeto que perdi</span>
                </div>
                {formData.type === 'lost' && (
                  <motion.div layoutId="type-check" className="lf-type-check">
                    <CheckCircle2 size={20} />
                  </motion.div>
                )}
              </button>
              <button 
                className={`lf-type-option ${formData.type === 'found' ? 'active found' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'found' })}
              >
                <div className="lf-type-icon-wrapper">
                  <CheckCircle2 size={32} />
                </div>
                <div className="lf-type-content">
                  <span className="lf-type-title">Encontrei Algo</span>
                  <span className="lf-type-desc">Quero devolver um objeto ao dono</span>
                </div>
                {formData.type === 'found' && (
                  <motion.div layoutId="type-check" className="lf-type-check">
                    <CheckCircle2 size={20} />
                  </motion.div>
                )}
              </button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="lf-step">
            <h3 className="lf-step-title">Qual a Categoria?</h3>
            <p className="lf-step-subtitle">Isso ajuda as pessoas a filtrarem sua busca</p>
            <div className="lf-category-grid">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  className={`lf-cat-option ${formData.category === cat ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, category: cat })}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="lf-step">
            <h3 className="lf-step-title">Detalhes do Item</h3>
            <p className="lf-step-subtitle">Dê um nome claro e uma boa descrição</p>
            <div className="lf-form-group">
              <div className="lf-label-row">
                <label className="lf-label">Título do Anúncio</label>
                <span className={`lf-char-count ${formData.title.length >= 24 ? 'limit' : ''}`}>
                  {formData.title.length}/24
                </span>
              </div>
              <input 
                type="text" 
                className="lf-input-premium"
                placeholder="Ex: Carteira de couro marrom"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={24}
              />
            </div>
            <div className="lf-form-group">
              <div className="lf-label-row">
                <label className="lf-label">Descrição Detalhada</label>
                <span className={`lf-char-count ${formData.description.length >= 500 ? 'limit' : ''}`}>
                  {formData.description.length}/500
                </span>
              </div>
              <textarea 
                className="lf-textarea-premium"
                placeholder="Ex: Contém RG em nome de João Silva..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={500}
              />
            </div>
            <div className="lf-form-group">
              <label className="lf-label">Palavras-chave (Tags)</label>
              <div className="lf-tag-input-row">
                <input 
                  type="text" 
                  className="lf-input-premium"
                  placeholder="Pressione Enter para adicionar"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button type="button" onClick={addTag} className="lf-add-tag-btn">
                  ADD
                </button>
              </div>
              <div className="lf-tags-list">
                {formData.tags.map(tag => (
                  <span key={tag} className="lf-tag-item">
                    #{tag} <X size={12} onClick={() => removeTag(tag)} />
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="lf-step">
            <h3 className="lf-step-title">Local e Data</h3>
            <p className="lf-step-subtitle">Onde e quando isso aconteceu?</p>
            <div className="lf-form-group">
              <label className="lf-label">Localização Aproximada</label>
              <div className="lf-input-icon-wrapper">
                <MapPin size={18} className="lf-input-icon" />
                <input 
                  type="text" 
                  className="lf-input-premium with-icon"
                  placeholder="Ex: Praça Central, próximo ao banco"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
            <div className="lf-form-group">
              <label className="lf-label">Data da Ocorrência</label>
              <div className="lf-input-icon-wrapper">
                <Calendar size={18} className="lf-input-icon" />
                <input 
                  type="date" 
                  className="lf-input-premium with-icon"
                  value={formData.date_occurrence}
                  onChange={(e) => setFormData({ ...formData, date_occurrence: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="lf-step">
            <h3 className="lf-step-title">Contatos e Imagem</h3>
            <p className="lf-step-subtitle">Como as pessoas podem te encontrar?</p>
            
            <div className="lf-form-group">
              <label className="lf-label">Foto do Item</label>
              <div className="lf-upload-container">
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  ref={cameraInputRef} 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                />
                
                {formData.image_url ? (
                  <div className="lf-upload-preview">
                    <img src={formData.image_url} alt="Preview" />
                    <button 
                      className="lf-remove-photo"
                      onClick={() => {
                        setFormData({ ...formData, image_url: '' });
                        setShowImageError(false);
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className={`lf-upload-options ${showImageError ? 'error-pulse' : ''}`}>
                    <button 
                      className="lf-upload-btn gallery"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <ImageIcon size={20} />
                      <span>Galeria</span>
                    </button>
                    <button 
                      className="lf-upload-btn camera"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Camera size={20} />
                      <span>Tirar Foto</span>
                    </button>
                  </div>
                )}
              </div>
              <AnimatePresence>
                {showImageError && !formData.image_url && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lf-image-warning"
                  >
                    <Info size={16} />
                    <p>
                      <strong>Foto Obrigatória:</strong> Sem uma foto clara do item, 
                      será impossível para outras pessoas identificarem.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lf-form-group">
              <label className="lf-label">Seu Contato</label>
              <div className="lf-input-icon-wrapper">
                <Phone size={18} className="lf-input-icon" />
                <input 
                  type="text" 
                  className="lf-input-premium with-icon"
                  placeholder="WhatsApp ou Telefone"
                  value={formData.contact_info}
                  onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                />
              </div>
            </div>
            {formData.type === 'lost' && (
              <div className="lf-form-group">
                <label className="lf-label">Recompensa (Opcional)</label>
                <div className="lf-input-icon-wrapper">
                  <Gift size={18} className="lf-input-icon gift" />
                  <input 
                    type="text" 
                    className="lf-input-premium with-icon"
                    placeholder="Ex: R$ 50,00 ou Gratificação"
                    value={formData.reward}
                    onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                  />
                </div>
              </div>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="lost-found-wrapper">
      <div className="lf-bg-mesh"></div>
      
      <nav className="lf-nav">
        <div className="lf-nav-container">
          <button className="lf-back-btn">
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </button>
          
          <div className="lf-logo">
            <span>Achados<span className="logo-accent">&Perdidos</span></span>
          </div>

          <button className="lf-nav-action-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
          </button>
        </div>
      </nav>
      
      <header className="lf-header">
        <div className="lf-container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lf-title"
          >
            Recupere o que é <span className="text-teal">Seu.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lf-subtitle"
          >
            A plataforma mais rápida para reunir objetos e seus donos.
          </motion.p>
          
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="lf-main-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            ANUNCIAR AGORA
          </motion.button>
        </div>
      </header>

      <section className="lf-filter-section">
        <div className="lf-container">
          <div className="lf-location-status-bar">
            <div className="lf-location-info">
              <div className="lf-location-icon-pulse">
                <MapPin size={20} />
              </div>
              <div className="lf-location-text">
                <span className="lf-location-label">Sua Localização</span>
                <span className="lf-location-value">São Paulo, SP</span>
              </div>
            </div>
            <div className="lf-location-scope-toggle">
              <button 
                className={`lf-scope-btn ${locationScope === 'city' ? 'active' : ''}`} 
                onClick={() => setLocationScope('city')}
              >
                Cidade
              </button>
              <button 
                className={`lf-scope-btn ${locationScope === 'global' ? 'active' : ''}`} 
                onClick={() => setLocationScope('global')}
              >
                Brasil
              </button>
            </div>
          </div>

          <div className="lf-filter-bar">
            <div className="lf-search-box">
              <Search className="lf-search-icon" size={18} />
              <input 
                type="text" 
                placeholder="O que você está procurando?" 
                className="lf-filter-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="lf-filter-group">
              <div className="lf-select-wrapper">
                <Filter size={16} />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="all">Todas Categorias</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div className="lf-type-filters">
                <button 
                  className={`lf-type-btn ${typeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setTypeFilter('all')}
                >
                  Tudo
                </button>
                <button 
                  className={`lf-type-btn lost ${typeFilter === 'lost' ? 'active' : ''}`}
                  onClick={() => setTypeFilter('lost')}
                >
                  Perdidos
                </button>
                <button 
                  className={`lf-type-btn found ${typeFilter === 'found' ? 'active' : ''}`}
                  onClick={() => setTypeFilter('found')}
                >
                  Achados
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="lf-container">
        {loading ? (
          <div className="lf-loading">
            <div className="lf-spinner"></div>
            <p>Carregando...</p>
          </div>
        ) : (
          <div className="lf-grid">
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    onOpenDetails={(item) => setSelectedItem(item)}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="lf-empty-state"
                >
                  <Package size={60} />
                  <h2>Nada encontrado</h2>
                  <p>Tente ajustar seus filtros ou pesquisar por outro termo.</p>
                  <button 
                    onClick={() => {setSearchTerm(''); setCategoryFilter('all'); setTypeFilter('all');}}
                    className="lf-reset-btn"
                  >
                    Resetar Filtros
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedItem && (
          <div className="lf-modal-backdrop" onClick={() => setSelectedItem(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="lf-details-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lf-details-content">
                <div className="lf-details-image">
                  {selectedItem.image_url ? (
                    <img src={selectedItem.image_url} alt={selectedItem.title} />
                  ) : (
                    <div className="lf-card-placeholder"><Camera size={50} /></div>
                  )}
                  <div className={`lf-details-badge ${selectedItem.type}`}>
                    {selectedItem.type === 'lost' ? 'PERDIDO' : 'ACHADO'}
                  </div>
                  <button className="lf-modal-close-btn" onClick={() => setSelectedItem(null)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="lf-details-info">
                  <span className="lf-category-tag">{selectedItem.category}</span>
                  <h2 className="lf-details-title">{selectedItem.title}</h2>
                  
                  <div className="lf-details-meta-grid">
                    <div className="lf-details-meta-box">
                      <MapPin size={18} />
                      <div>
                        <label>Localização</label>
                        <span>{selectedItem.location}</span>
                      </div>
                    </div>
                    <div className="lf-details-meta-box">
                      <Calendar size={18} />
                      <div>
                        <label>Data</label>
                        <span>{new Date(selectedItem.date_occurrence).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lf-details-description">
                    <h3>Descrição</h3>
                    <p>{selectedItem.description}</p>
                  </div>

                  {selectedItem.reward && selectedItem.type === 'lost' && (
                    <div className="lf-details-reward">
                      <Gift size={20} />
                      <div>
                        <label>Recompensa</label>
                        <span>{selectedItem.reward}</span>
                      </div>
                    </div>
                  )}

                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div className="lf-details-tags">
                      {selectedItem.tags.map((tag, i) => (
                        <span key={i} className="lf-tag">#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="lf-details-footer">
                    <div className="lf-contact-box">
                      <label>Contato</label>
                      <div className="lf-contact-value">
                        <Phone size={18} />
                        <span>{selectedItem.contact_info}</span>
                      </div>
                    </div>
                    <button className="lf-main-btn full-width">
                      <Sparkles size={18} />
                      ABRIR CHAT
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div className="lf-modal-backdrop">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className="lf-modal-container"
            >
              <div className="lf-modal-content">
                <div className="lf-modal-head">
                  <div className="lf-modal-info">
                    <h2>Reportar Ocorrência</h2>
                    <div className="lf-stepper-dots">
                      {[1, 2, 3, 4, 5].map(step => (
                        <div key={step} className={`lf-dot ${currentStep >= step ? 'active' : ''}`} />
                      ))}
                    </div>
                  </div>
                  <button className="lf-modal-close" onClick={() => setIsModalOpen(false)}>
                    <X size={20} />
                  </button>
                </div>

                <div className="lf-modal-body">
                  <AnimatePresence mode="wait">
                    {renderStep()}
                  </AnimatePresence>
                </div>

                <div className="lf-modal-actions">
                  {currentStep > 1 && (
                    <button className="lf-btn-secondary" onClick={prevStep}>
                      <ChevronLeft size={18} /> Voltar
                    </button>
                  )}
                  {currentStep < 5 ? (
                    <button className="lf-btn-primary" onClick={nextStep}>
                      Próximo <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button 
                      className="lf-btn-submit" 
                      onClick={handleCreateItem}
                      disabled={isSubmitting || !formData.title || !formData.contact_info}
                    >
                      {isSubmitting ? (
                        <>Publicando...</>
                      ) : (
                        <><CheckCircle2 size={18} /> PUBLICAR</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}