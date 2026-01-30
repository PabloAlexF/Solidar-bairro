"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import MobileHeader from '../../components/layout/MobileHeader';
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
import './mobile-styles-new.css';

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

const ItemCard = ({ item, onOpenDetails, handleOpenChat, isPreview = false }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`mobile-lf-card ${isPreview ? 'preview' : ''}`}
    >
      <div className="mobile-lf-card-image">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="mobile-lf-card-img" />
        ) : (
          <div className="mobile-lf-card-placeholder">
            <Camera size={32} strokeWidth={1} />
          </div>
        )}
        <div className={`mobile-lf-type-badge ${item.type}`}>
          {item.type === 'lost' ? (
            <span className="mobile-badge-content"><Search size={12} /> PERDIDO</span>
          ) : (
            <span className="mobile-badge-content"><CheckCircle2 size={12} /> ACHADO</span>
          )}
        </div>
      </div>

      <div className="mobile-lf-card-body">
        <div className="mobile-lf-card-header">
          <span className="mobile-lf-category-tag">{item.category}</span>
          <span className="mobile-lf-card-date">
            <Clock size={12} />
            {item.date_occurrence ? new Date(item.date_occurrence).toLocaleDateString('pt-BR') : 'Recentemente'}
          </span>
        </div>
        
        <h3 className="mobile-lf-card-title">
          {item.title || 'Novo Item'}
        </h3>
        <p className="mobile-lf-card-desc">{item.description || 'Descreva os detalhes importantes aqui...'}</p>
      
        <div className="mobile-lf-card-meta">
          <div className="mobile-lf-meta-item">
            <MapPin size={14} />
            <span>{item.location || 'Local a definir'}</span>
          </div>
          {item.reward && item.type === 'lost' && (
            <div className="mobile-lf-meta-item reward">
              <Gift size={14} />
              <span>Recompensa: {item.reward}</span>
            </div>
          )}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="mobile-lf-card-tags">
            {item.tags.map((tag, i) => (
              <span key={i} className="mobile-lf-tag">#{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="mobile-lf-card-footer">
        <button className="mobile-lf-details-btn" onClick={() => onOpenDetails && onOpenDetails(item)}>
          VER DETALHES
        </button>
        <button className="mobile-lf-chat-btn" onClick={() => handleOpenChat && handleOpenChat(item)}>
          ABRIR CHAT
        </button>
      </div>
    </motion.div>
  );
};

export default function MobileAchadosEPerdidos() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
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

  // Get user location for display
  const userLocation = user?.cidade && user?.estado ? `${user.cidade}, ${user.estado}` : 
                      user?.bairro && user?.cidade ? `${user.bairro}, ${user.cidade}` :
                      "São Paulo, SP";

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchItems();
    
    // Auto-fill location from user data
    if (user && !formData.location) {
      const userAddr = user?.cidade && user?.estado ? `${user.cidade}, ${user.estado}` : 
                      user?.bairro && user?.cidade ? `${user.bairro}, ${user.cidade}` :
                      "";
      if (userAddr) {
        setFormData(prev => ({ ...prev, location: userAddr }));
      }
    }
  }, [user]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAchadosPerdidos();
      if (response.success && response.data) {
        setItems(response.data);
      }
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async () => {
    if (!formData.title || !formData.contact_info) return;
    
    if (!formData.image_url) {
      setShowImageError(true);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await apiService.createAchadoPerdido(formData);
      if (response.success) {
        await fetchItems();
        setIsModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Erro ao criar item:', error);
      alert('Erro ao criar item. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
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

  const handleOpenChat = async (item) => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Para demonstração, vamos usar um ID fictício se não houver user_id
    const targetUserId = item.user_id || item.created_by || 'demo-user-' + item.id;
    
    try {
      const response = await apiService.createOrGetConversation({
        participantId: targetUserId,
        itemId: item.id,
        itemType: 'achado_perdido',
        title: `Achados e Perdidos: ${item.title}`
      });

      if (response.success) {
        navigate(`/chat/${response.data.id}`);
      }
    } catch (error) {
      console.error('Erro ao abrir chat:', error);
      alert('Erro ao abrir chat. Tente novamente.');
    }
  };

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
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mobile-lf-step">
            <h3 className="mobile-lf-step-title">O que aconteceu?</h3>
            <p className="mobile-lf-step-subtitle">Selecione o tipo de ocorrência</p>
            <div className="mobile-lf-type-grid">
              <button 
                className={`mobile-lf-type-option ${formData.type === 'lost' ? 'active lost' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'lost' })}
              >
                <div className="mobile-lf-type-icon-wrapper">
                  <Search size={32} />
                </div>
                <div className="mobile-lf-type-content">
                  <span className="mobile-lf-type-title">Perdi Algo</span>
                  <span className="mobile-lf-type-desc">Estou procurando um objeto que perdi</span>
                </div>
                {formData.type === 'lost' && (
                  <motion.div layoutId="type-check" className="mobile-lf-type-check">
                    <CheckCircle2 size={20} />
                  </motion.div>
                )}
              </button>
              <button 
                className={`mobile-lf-type-option ${formData.type === 'found' ? 'active found' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'found' })}
              >
                <div className="mobile-lf-type-icon-wrapper">
                  <CheckCircle2 size={32} />
                </div>
                <div className="mobile-lf-type-content">
                  <span className="mobile-lf-type-title">Encontrei Algo</span>
                  <span className="mobile-lf-type-desc">Quero devolver um objeto ao dono</span>
                </div>
                {formData.type === 'found' && (
                  <motion.div layoutId="type-check" className="mobile-lf-type-check">
                    <CheckCircle2 size={20} />
                  </motion.div>
                )}
              </button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mobile-lf-step">
            <h3 className="mobile-lf-step-title">Qual a Categoria?</h3>
            <p className="mobile-lf-step-subtitle">Isso ajuda as pessoas a filtrarem sua busca</p>
            <div className="mobile-lf-category-grid">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  className={`mobile-lf-cat-option ${formData.category === cat ? 'active' : ''}`}
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
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mobile-lf-step">
            <h3 className="mobile-lf-step-title">Detalhes do Item</h3>
            <p className="mobile-lf-step-subtitle">Dê um nome claro e uma boa descrição</p>
            <div className="mobile-lf-form-group">
              <div className="mobile-lf-label-row">
                <label className="mobile-lf-label">Título do Anúncio</label>
                <span className={`mobile-lf-char-count ${formData.title.length >= 24 ? 'limit' : ''}`}>
                  {formData.title.length}/24
                </span>
              </div>
              <input 
                type="text" 
                className="mobile-lf-input-premium"
                placeholder="Ex: Carteira de couro marrom"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={24}
              />
            </div>
            <div className="mobile-lf-form-group">
              <div className="mobile-lf-label-row">
                <label className="mobile-lf-label">Descrição Detalhada</label>
                <span className={`mobile-lf-char-count ${formData.description.length >= 500 ? 'limit' : ''}`}>
                  {formData.description.length}/500
                </span>
              </div>
              <textarea 
                className="mobile-lf-textarea-premium"
                placeholder="Ex: Contém RG em nome de João Silva..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={500}
              />
            </div>
            <div className="mobile-lf-form-group">
              <label className="mobile-lf-label">Palavras-chave (Tags)</label>
              <div className="mobile-lf-tag-input-row">
                <input 
                  type="text" 
                  className="mobile-lf-input-premium"
                  placeholder="Pressione Enter para adicionar"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button type="button" onClick={addTag} className="mobile-lf-add-tag-btn">
                  ADD
                </button>
              </div>
              <div className="mobile-lf-tags-list">
                {formData.tags.map(tag => (
                  <span key={tag} className="mobile-lf-tag-item">
                    #{tag} <X size={12} onClick={() => removeTag(tag)} />
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mobile-lf-step">
            <h3 className="mobile-lf-step-title">Local e Data</h3>
            <p className="mobile-lf-step-subtitle">Onde e quando isso aconteceu?</p>
            <div className="mobile-lf-form-group">
              <label className="mobile-lf-label">Localização Aproximada</label>
              <div className="mobile-lf-input-icon-wrapper">
                <MapPin size={18} className="mobile-lf-input-icon" />
                <input 
                  type="text" 
                  className="mobile-lf-input-premium with-icon"
                  placeholder={userLocation || "Ex: Praça Central, próximo ao banco"}
                  value={formData.location || userLocation}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
            <div className="mobile-lf-form-group">
              <label className="mobile-lf-label">Data da Ocorrência</label>
              <div className="mobile-lf-input-icon-wrapper">
                <Calendar size={18} className="mobile-lf-input-icon" />
                <input 
                  type="date" 
                  className="mobile-lf-input-premium with-icon"
                  value={formData.date_occurrence}
                  onChange={(e) => setFormData({ ...formData, date_occurrence: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="mobile-lf-step">
            <h3 className="mobile-lf-step-title">Contatos e Imagem</h3>
            <p className="mobile-lf-step-subtitle">Como as pessoas podem te encontrar?</p>
            
            <div className="mobile-lf-form-group">
              <label className="mobile-lf-label">Foto do Item</label>
              <div className="mobile-lf-upload-container">
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
                  <div className="mobile-lf-upload-preview">
                    <img src={formData.image_url} alt="Preview" />
                    <button 
                      className="mobile-lf-remove-photo"
                      onClick={() => {
                        setFormData({ ...formData, image_url: '' });
                        setShowImageError(false);
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className={`mobile-lf-upload-options ${showImageError ? 'mobile-error-pulse' : ''}`}>
                    <button 
                      className="mobile-lf-upload-btn gallery"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <ImageIcon size={20} />
                      <span>Galeria</span>
                    </button>
                    <button 
                      className="mobile-lf-upload-btn camera"
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
                    className="mobile-lf-image-warning"
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

            <div className="mobile-lf-form-group">
              <label className="mobile-lf-label">Seu Contato</label>
              <div className="mobile-lf-input-icon-wrapper">
                <Phone size={18} className="mobile-lf-input-icon" />
                <input 
                  type="text" 
                  className="mobile-lf-input-premium with-icon"
                  placeholder="WhatsApp ou Telefone"
                  value={formData.contact_info}
                  onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                />
              </div>
            </div>
            {formData.type === 'lost' && (
              <div className="mobile-lf-form-group">
                <label className="mobile-lf-label">Recompensa (Opcional)</label>
                <div className="mobile-lf-input-icon-wrapper">
                  <Gift size={18} className="mobile-lf-input-icon gift" />
                  <input 
                    type="text" 
                    className="mobile-lf-input-premium with-icon"
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
    <div className="mobile-lost-found-wrapper">
      <div className="mobile-lf-bg-mesh"></div>
      
      <MobileHeader title="Achados e Perdidos" />
      
      <header className="mobile-lf-header-compact">
        <div className="mobile-lf-container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mobile-lf-title-compact"
            >
              Recupere o que é <span className="mobile-text-teal">Seu.</span>
            </motion.h1>
            
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mobile-lf-main-btn-compact"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              ANUNCIAR
            </motion.button>
          </div>
        </div>
      </header>

      <section className="mobile-lf-filter-section">
        <div className="mobile-lf-container">
          <div className="mobile-lf-location-status-bar">
            <div className="mobile-lf-location-info">
              <div className="mobile-lf-location-icon-pulse">
                <MapPin size={20} />
              </div>
              <div className="mobile-lf-location-text">
                <span className="mobile-lf-location-label">Sua Localização</span>
                <span className="mobile-lf-location-value">{userLocation}</span>
              </div>
            </div>
            <div className="mobile-lf-location-scope-toggle">
              <button 
                className={`mobile-lf-scope-btn ${locationScope === 'city' ? 'active' : ''}`} 
                onClick={() => setLocationScope('city')}
              >
                Cidade
              </button>
              <button 
                className={`mobile-lf-scope-btn ${locationScope === 'global' ? 'active' : ''}`} 
                onClick={() => setLocationScope('global')}
              >
                Brasil
              </button>
            </div>
          </div>

          <div className="mobile-lf-filter-bar">
            <div className="mobile-lf-search-box">
              <Search className="mobile-lf-search-icon" size={18} />
              <input 
                type="text" 
                placeholder="O que você está procurando?" 
                className="mobile-lf-filter-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="mobile-lf-filter-group">
              <div className="mobile-lf-select-wrapper">
                <Filter size={16} />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="all">Todas Categorias</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div className="mobile-lf-type-filters">
                <button 
                  className={`mobile-lf-type-btn ${typeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setTypeFilter('all')}
                >
                  Tudo
                </button>
                <button 
                  className={`mobile-lf-type-btn lost ${typeFilter === 'lost' ? 'active' : ''}`}
                  onClick={() => setTypeFilter('lost')}
                >
                  Perdidos
                </button>
                <button 
                  className={`mobile-lf-type-btn found ${typeFilter === 'found' ? 'active' : ''}`}
                  onClick={() => setTypeFilter('found')}
                >
                  Achados
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mobile-lf-container">
        {loading ? (
          <div className="mobile-lf-loading">
            <div className="mobile-lf-spinner"></div>
            <p>Carregando...</p>
          </div>
        ) : (
          <div className="mobile-lf-grid">
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <ItemCard 
                    key={item.id} 
                    item={item} 
                    onOpenDetails={(item) => setSelectedItem(item)}
                    handleOpenChat={handleOpenChat}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="mobile-lf-empty-state"
                >
                  <Package size={60} />
                  <h2>Nada encontrado</h2>
                  <p>Tente ajustar seus filtros ou pesquisar por outro termo.</p>
                  <button 
                    onClick={() => {setSearchTerm(''); setCategoryFilter('all'); setTypeFilter('all');}}
                    className="mobile-lf-reset-btn"
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
          <div className="mobile-lf-modal-backdrop" onClick={() => setSelectedItem(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="mobile-lf-details-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mobile-lf-details-content">
                <div className="mobile-lf-details-image">
                  {selectedItem.image_url ? (
                    <img src={selectedItem.image_url} alt={selectedItem.title} />
                  ) : (
                    <div className="mobile-lf-card-placeholder"><Camera size={50} /></div>
                  )}
                  <div className={`mobile-lf-details-badge ${selectedItem.type}`}>
                    {selectedItem.type === 'lost' ? 'PERDIDO' : 'ACHADO'}
                  </div>
                  <button className="mobile-lf-modal-close-btn" onClick={() => setSelectedItem(null)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="mobile-lf-details-info">
                  <span className="mobile-lf-category-tag">{selectedItem.category}</span>
                  <h2 className="mobile-lf-details-title">{selectedItem.title}</h2>
                  
                  <div className="mobile-lf-details-meta-grid">
                    <div className="mobile-lf-details-meta-box">
                      <MapPin size={18} />
                      <div>
                        <label>Localização</label>
                        <span>{selectedItem.location}</span>
                      </div>
                    </div>
                    <div className="mobile-lf-details-meta-box">
                      <Calendar size={18} />
                      <div>
                        <label>Data</label>
                        <span>{new Date(selectedItem.date_occurrence).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mobile-lf-details-description">
                    <h3>Descrição</h3>
                    <p>{selectedItem.description}</p>
                  </div>

                  {selectedItem.reward && selectedItem.type === 'lost' && (
                    <div className="mobile-lf-details-reward">
                      <Gift size={20} />
                      <div>
                        <label>Recompensa</label>
                        <span>{selectedItem.reward}</span>
                      </div>
                    </div>
                  )}

                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div className="mobile-lf-details-tags">
                      {selectedItem.tags.map((tag, i) => (
                        <span key={i} className="mobile-lf-tag">#{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="mobile-lf-details-footer">
                    <div className="mobile-lf-contact-box">
                      <label>Contato</label>
                      <div className="mobile-lf-contact-value">
                        <Phone size={18} />
                        <span>{selectedItem.contact_info}</span>
                      </div>
                    </div>
                    <button className="mobile-lf-main-btn full-width" onClick={() => handleOpenChat(selectedItem)}>
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
          <div className="mobile-lf-modal-backdrop">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className="mobile-lf-modal-container"
            >
              <div className="mobile-lf-modal-content">
                <div className="mobile-lf-modal-head">
                  <div className="mobile-lf-modal-info">
                    <h2>Reportar Ocorrência</h2>
                    <div className="mobile-lf-stepper-dots">
                      {[1, 2, 3, 4, 5].map(step => (
                        <div key={step} className={`mobile-lf-dot ${currentStep >= step ? 'active' : ''}`} />
                      ))}
                    </div>
                  </div>
                  <button className="mobile-lf-modal-close" onClick={() => setIsModalOpen(false)}>
                    <X size={20} />
                  </button>
                </div>

                <div className="mobile-lf-modal-body">
                  <AnimatePresence mode="wait">
                    {renderStep()}
                  </AnimatePresence>
                </div>

                <div className="mobile-lf-modal-actions">
                  {currentStep > 1 && (
                    <button className="mobile-lf-btn-secondary" onClick={prevStep}>
                      <ChevronLeft size={18} /> Voltar
                    </button>
                  )}
                  {currentStep < 5 ? (
                    <button className="mobile-lf-btn-primary" onClick={nextStep}>
                      Próximo <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button 
                      className="mobile-lf-btn-submit" 
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