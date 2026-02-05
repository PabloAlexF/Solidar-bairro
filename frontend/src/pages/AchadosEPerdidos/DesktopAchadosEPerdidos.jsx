import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatLocation } from '../../utils/addressUtils';
import apiService from '../../services/apiService';
import {
  Search,
  Plus,
  MapPin,
  Calendar,
  Filter,
  X,
  Camera,
  Package,
  Loader2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Tag,
  Gift,
  Phone,
  Sparkles,
  Clock,
  ShieldCheck,
  Eye,
  Info,
  Image as ImageIcon,
  Heart,
  ArrowLeft,
  Bell,
  User,
  LogOut,
  Settings
} from 'lucide-react';
import ThreeScene from '../../components/ThreeScene';
import ReusableHeader from '../../components/layout/ReusableHeader';
import './styles.css';

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

const STATS = [
  { label: 'Itens Reportados', value: '1.2k+', icon: Package },
  { label: 'Devolvidos com Sucesso', value: '850', icon: ShieldCheck },
  { label: 'Comunidade Ativa', value: '5k+', icon: Sparkles }
];

// --- Sub-components ---

const ItemCard = ({ item, onOpenDetails, handleOpenChat, isPreview = false }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: isPreview ? 0 : -12 }}
      className={`lf-card ${isPreview ? 'preview' : ''}`}
    >
      <div className="lf-card-image">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="lf-card-img" />
        ) : (
          <div className="lf-card-placeholder">
            <Camera size={48} strokeWidth={1} />
          </div>
        )}
        <div className={`lf-type-badge ${item.type}`}>
          {item.type === 'lost' ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Search size={14} /> PERDIDO</span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle2 size={14} /> ACHADO</span>
          )}
        </div>
      </div>

      <div className="lf-card-body">
        <div className="lf-card-header">
          <span className="lf-category-tag">{item.category}</span>
          <span className="lf-card-date">
            <Clock size={14} />
            {item.date_occurrence ? new Date(item.date_occurrence).toLocaleDateString('pt-BR') : 'Recentemente'}
          </span>
        </div>
        
        <h3 className="lf-card-title">
          {item.title || 'Novo Item'}
        </h3>
        <p className="lf-card-desc" style={{ whiteSpace: 'pre-wrap' }}>{item.description || 'Descreva os detalhes importantes aqui...'}</p>
      
        <div className="lf-card-meta">
          <div className="lf-meta-item">
            <MapPin size={16} />
            <span>{item.location || 'Local a definir'}</span>
          </div>
          {item.reward && item.type === 'lost' && (
            <div className="lf-meta-item reward">
              <Gift size={16} />
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
        <button className="lf-chat-btn" onClick={() => handleOpenChat && handleOpenChat(item)}>
          ABRIR CHAT
        </button>
      </div>
    </motion.div>
  );
};

const Header = ({ notifications = [] }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    if (logout) await logout();
    navigate('/login');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-200 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
            S
          </div>
          <span className="text-xl font-bold text-slate-900">Solidar</span>
        </a>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Início
          </a>
          <a href="/chat" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Mensagens
          </a>
          <a href="/perfil" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
            Meu Perfil
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 transition-all relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-white">Notificações</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
                        {unreadCount} novas
                      </span>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? (
                      notifications.map((notif, i) => (
                        <div key={i} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${!notif.read ? 'bg-blue-500/10' : ''}`}>
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-500/20">
                              <Bell size={14} />
                            </div>
                            <div>
                              <p className="text-sm text-white font-medium">{notif.title}</p>
                              <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                              <p className="text-[10px] text-slate-500 mt-2">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-500">
                        <Bell size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm">Nenhuma notificação</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 pl-6 border-l border-slate-200 hover:opacity-80 transition-opacity"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-slate-900">{user.nome || 'Usuário'}</p>
                  <p className="text-xs text-slate-500">Ver Perfil</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-md">
                  {user.nome ? user.nome[0].toUpperCase() : <User size={20} />}
                </div>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-100 lg:hidden">
                      <p className="font-bold text-slate-900">{user.nome || 'Usuário'}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <a href="/perfil" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors">
                        <User size={18} /> Meu Perfil
                      </a>
                      <a href="/configuracoes" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors">
                        <Settings size={18} /> Configurações
                      </a>
                      <div className="h-px bg-slate-100 my-1" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut size={18} /> Sair
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <a href="/login" className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              Entrar
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

// --- Main Component ---
export default function DesktopAchadosEPerdidos() {
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [locationScope, setLocationScope] = useState('city');

  // Form State
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
    
    // Auto-fill location from user data
    if (user && !formData.location) {
      const userAddr = user?.cidade && user?.estado ? `${user.cidade}, ${user.estado}` : 
                      user?.bairro && user?.cidade ? `${user.bairro}, ${user.cidade}` :
                      formatLocation(user?.endereco, user?.cidade, user?.estado) || 
                      user?.bairro || 
                      "";
      if (userAddr) {
        setFormData(prev => ({ ...prev, location: userAddr }));
      }
    }
    
    const loadNotifications = () => {
      const saved = localStorage.getItem('solidar-notifications');
      if (saved) {
        try {
          setNotifications(JSON.parse(saved));
        } catch (error) {
          setNotifications([]);
        }
      }
    };
    
    loadNotifications();
    
  }, [user]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      if (typeFilter !== 'all') filters.type = typeFilter;
      if (searchTerm) filters.search = searchTerm;
      
      // Add location-based filtering
      if (locationScope === 'city' && user) {
        filters.city = user.cidade;
        filters.state = user.estado;
      }
      
      const response = await apiService.getAchadosPerdidos(filters);
      if (response.success) {
        let itemsData = response.data || [];
        
        // Sort by proximity if user location is available
        if (locationScope === 'city' && user?.cidade) {
          itemsData = itemsData.sort((a, b) => {
            const aIsLocal = a.city === user.cidade && a.state === user.estado;
            const bIsLocal = b.city === user.cidade && b.state === user.estado;
            if (aIsLocal && !bIsLocal) return -1;
            if (!aIsLocal && bIsLocal) return 1;
            return 0;
          });
        }
        
        setItems(itemsData);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setItems([]);
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
        setItems(prev => [response.data, ...prev]);
        setIsModalOpen(false);
        resetForm();
      } else {
        throw new Error(response.error || 'Erro ao criar item');
      }
    } catch (err) {
      console.error('Error creating item:', err);
      alert('Erro ao criar item: ' + err.message);
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

  const handleImageUpload = async (event, isCamera) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Simulate upload - replace with actual upload logic
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, image_url: e.target.result });
        setShowImageError(false);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Erro ao fazer upload da imagem. Tente novamente.');
      setUploading(false);
    }
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

  // Refetch when filters change
  useEffect(() => {
    fetchItems();
  }, [categoryFilter, typeFilter, searchTerm, locationScope, user]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const userName = user?.nome || user?.nomeCompleto || user?.name || user?.nomeFantasia || user?.razaoSocial || "Vizinho";
  const userLocation = user?.cidade && user?.estado ? `${user.cidade}, ${user.estado}` : 
                      user?.bairro && user?.cidade ? `${user.bairro}, ${user.cidade}` :
                      formatLocation(user?.endereco, user?.cidade, user?.estado) || 
                      user?.bairro || 
                      "São Paulo, SP";

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="lf-step">
            <h3 className="lf-step-title">O que aconteceu?</h3>
            <p className="lf-step-subtitle">Selecione o tipo de ocorrência para começar</p>
            <div className="lf-type-grid">
              <button 
                className={`lf-type-option ${formData.type === 'lost' ? 'active lost' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'lost' })}
              >
                <div className="lf-type-icon-wrapper">
                  <Search size={48} />
                </div>
                <div className="lf-type-content">
                  <span className="lf-type-title">Perdi Algo</span>
                  <span className="lf-type-desc">Estou procurando um objeto que perdi</span>
                </div>
                {formData.type === 'lost' && (
                  <motion.div layoutId="type-check" className="lf-type-check">
                    <CheckCircle2 size={24} />
                  </motion.div>
                )}
              </button>
              <button 
                className={`lf-type-option ${formData.type === 'found' ? 'active found' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'found' })}
              >
                <div className="lf-type-icon-wrapper">
                  <CheckCircle2 size={48} />
                </div>
                <div className="lf-type-content">
                  <span className="lf-type-title">Encontrei Algo</span>
                  <span className="lf-type-desc">Quero devolver um objeto ao dono</span>
                </div>
                {formData.type === 'found' && (
                  <motion.div layoutId="type-check" className="lf-type-check">
                    <CheckCircle2 size={24} />
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                <label className="lf-label" style={{ marginBottom: 0 }}>Título do Anúncio</label>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: formData.title.length >= 24 ? 'var(--sb-orange)' : 'var(--sb-text-light)' }}>
                  {formData.title.length}/24
                </span>
              </div>
              <input 
                type="text" 
                className="lf-input-premium"
                placeholder="Ex: Carteira de couro marrom com documentos"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={24}
              />
            </div>
            <div className="lf-form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                <label className="lf-label" style={{ marginBottom: 0 }}>Descrição Detalhada</label>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: formData.description.length >= 500 ? 'var(--sb-orange)' : 'var(--sb-text-light)' }}>
                  {formData.description.length}/500 caracteres
                </span>
              </div>
              <textarea 
                className="lf-textarea-premium"
                placeholder="Ex: Contém RG em nome de João Silva, cartões e chaves..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={500}
              />
              {formData.description.length >= 500 && (
                <p style={{ fontSize: '0.7rem', color: 'var(--sb-orange)', fontWeight: 700, marginTop: '0.5rem' }}>
                  Você atingiu o limite máximo de caracteres.
                </p>
              )}
            </div>
            <div className="lf-form-group">
              <label className="lf-label">Palavras-chave (Tags)</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  className="lf-input-premium"
                  placeholder="Pressione Enter para adicionar"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  onClick={addTag}
                  style={{ padding: '0 1.5rem', background: 'var(--sb-text)', color: 'white', borderRadius: '1rem', fontWeight: 800 }}
                >
                  ADD
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1rem' }}>
                {formData.tags.map(tag => (
                  <span key={tag} style={{ background: 'var(--sb-purple-soft)', color: 'var(--sb-purple)', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    #{tag} <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeTag(tag)} />
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
              <div style={{ position: 'relative' }}>
                <MapPin size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-teal)' }} />
                <input 
                  type="text" 
                  className="lf-input-premium"
                  placeholder={userLocation || "Ex: Praça Central, próximo ao banco"}
                  value={formData.location || userLocation}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{ paddingLeft: '3.5rem' }}
                />
              </div>
            </div>
            <div className="lf-form-group">
              <label className="lf-label">Data da Ocorrência</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-teal)' }} />
                <input 
                  type="date" 
                  className="lf-input-premium"
                  value={formData.date_occurrence}
                  onChange={(e) => setFormData({ ...formData, date_occurrence: e.target.value })}
                  style={{ paddingLeft: '3.5rem' }}
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
                  onChange={(e) => handleImageUpload(e, false)} 
                  style={{ display: 'none' }} 
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  ref={cameraInputRef} 
                  onChange={(e) => handleImageUpload(e, true)} 
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
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className={`lf-upload-options ${showImageError ? 'error-pulse' : ''}`}>
                    <button 
                      className="lf-upload-btn gallery"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <Loader2 className="animate-spin" /> : <ImageIcon size={24} />}
                      <span>Galeria</span>
                    </button>
                    <button 
                      className="lf-upload-btn camera"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <Loader2 className="animate-spin" /> : <Camera size={24} />}
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
                    <Info size={18} />
                    <p>
                      <strong>Foto Obrigatória:</strong> Sem uma foto clara do item, 
                      será praticamente impossível para outras pessoas identificarem 
                      e ajudarem você a encontrá-lo ou devolvê-lo.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="lf-form-group">
              <label className="lf-label">Seu Contato</label>
              <div style={{ position: 'relative' }}>
                <Phone size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-teal)' }} />
                <input 
                  type="text" 
                  className="lf-input-premium"
                  placeholder="WhatsApp ou Telefone"
                  value={formData.contact_info}
                  onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                  style={{ paddingLeft: '3.5rem' }}
                />
              </div>
            </div>
            {formData.type === 'lost' && (
              <div className="lf-form-group">
                <label className="lf-label">Recompensa (Opcional)</label>
                <div style={{ position: 'relative' }}>
                  <Gift size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--sb-orange)' }} />
                  <input 
                    type="text" 
                    className="lf-input-premium"
                    placeholder="Ex: R$ 50,00 ou Gratificação"
                    value={formData.reward}
                    onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                    style={{ paddingLeft: '3.5rem' }}
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
      <ReusableHeader
        navigationItems={[
          { path: '/', label: 'Início' },
          { path: '/chat', label: 'Mensagens' },
          { path: '/perfil', label: 'Meu Perfil' }
        ]}
        showLoginButton={true}
        showAdminButtons={true}
        showPainelSocial={true}
      />
      
      {/* Hero Section */}
      <header className="lf-header" style={{ paddingTop: '80px' }}>
        <div className="lf-container">
          <div className="lf-header-content">
            <div className="lf-title-group">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lf-title"
              >
                Recupere o que é <br />
                <span className="text-teal">Seu por Direito.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lf-subtitle"
              >
                A plataforma mais inteligente e rápida para reunir objetos e seus donos. 
                Reporte agora e ajude a fortalecer nossa comunidade.
              </motion.p>
              
              <div className="lf-hero-actions">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="lf-main-btn"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={24} />
                  ANUNCIAR AGORA
                </motion.button>
                
                <div className="lf-hero-stats">
                  {STATS.map((stat, i) => (
                    <div key={i} className="lf-stat">
                      <span className="lf-stat-num">{stat.value}</span>
                      <span className="lf-stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lf-3d-container">
              <ThreeScene />
            </div>
          </div>
        </div>
      </header>

      {/* Filter & Search */}
      <section className="lf-filter-section">
        <div className="lf-container">
          {/* Location Status Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lf-location-status-bar"
            style={{ marginBottom: '2rem' }}
          >
            <div className="lf-location-info">
              <div className="lf-location-icon-pulse">
                <MapPin size={24} />
              </div>
              <div className="lf-location-text">
                <span className="lf-location-label">Sua Localização Cadastrada</span>
                <span className="lf-location-value">{userLocation}</span>
              </div>
            </div>
            <div className="lf-location-scope-toggle">
              <button 
                className={`lf-scope-btn ${locationScope === 'city' ? 'active' : ''}`} 
                onClick={() => setLocationScope('city')}
              >
                Minha Cidade
              </button>
              <button 
                className={`lf-scope-btn ${locationScope === 'global' ? 'active' : ''}`} 
                onClick={() => setLocationScope('global')}
              >
                Brasil Inteiro
              </button>
            </div>
          </motion.div>
          <div className="lf-filter-bar">
            <div className="lf-search-box">
              <Search className="lf-search-icon" size={20} />
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
                <Filter size={18} />
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

      {/* Main Grid */}
      <main className="lf-container">
        {loading ? (
          <div className="lf-loading">
            <Loader2 className="animate-spin" style={{ color: 'var(--sb-teal)', width: '64px', height: '64px' }} />
            <p className="font-bold text-xl mt-4">Sincronizando dados...</p>
          </div>
        ) : (
          <div className="lf-grid">
            <AnimatePresence mode="popLayout">
              {items.length > 0 ? (
                items.map((item) => (
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
                  className="lf-empty-state"
                >
                  <div style={{ background: '#f1f5f9', padding: '2rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1.5rem' }}>
                    <Package size={80} style={{ color: '#94a3b8' }} />
                  </div>
                  <h2>Nada encontrado</h2>
                  <p>Tente ajustar seus filtros ou pesquisar por outro termo.</p>
                  <button 
                    className="mt-6"
                    onClick={() => {setSearchTerm(''); setCategoryFilter('all'); setTypeFilter('all');}}
                    style={{ background: 'var(--sb-teal-soft)', color: 'var(--sb-teal)', padding: '0.75rem 1.5rem', borderRadius: '1rem', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                  >
                    Resetar Filtros
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Item Details Modal */}
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
              <div className="lf-details-grid">
                <div className="lf-details-image">
                  {selectedItem.image_url ? (
                    <img src={selectedItem.image_url} alt={selectedItem.title} />
                  ) : (
                    <div className="lf-card-placeholder"><Camera size={80} /></div>
                  )}
                  <div className={`lf-details-badge ${selectedItem.type}`}>
                    {selectedItem.type === 'lost' ? 'PERDIDO' : 'ACHADO'}
                  </div>
                </div>
                <div className="lf-details-info">
                  <div className="lf-details-head">
                    <span className="lf-category-tag">{selectedItem.category}</span>
                    <button className="lf-modal-close-small" onClick={() => setSelectedItem(null)}>
                      <X size={20} />
                    </button>
                  </div>
                  <h2 className="lf-details-title">{selectedItem.title}</h2>
                  <div className="lf-details-meta-grid">
                    <div className="lf-details-meta-box">
                      <MapPin size={20} />
                      <div>
                        <label>Localização</label>
                        <span>{selectedItem.location}</span>
                      </div>
                    </div>
                    <div className="lf-details-meta-box">
                      <Calendar size={20} />
                      <div>
                        <label>Data</label>
                        <span>{new Date(selectedItem.date_occurrence).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lf-details-description">
                    <h3>Descrição Completa</h3>
                    <p>{selectedItem.description}</p>
                  </div>

                  {selectedItem.reward && selectedItem.type === 'lost' && (
                    <div className="lf-details-reward">
                      <Gift size={24} />
                      <div>
                        <label>Recompensa Oferecida</label>
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
                      <label>Informação de Contato</label>
                      <div className="lf-contact-value">
                        <Phone size={20} />
                        <span>{selectedItem.contact_info}</span>
                      </div>
                    </div>
                    <button className="lf-main-btn" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => handleOpenChat(selectedItem)}>
                      <Sparkles size={20} />
                      ABRIR CHAT AGORA
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Announcement Modal (Stepper) */}
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
                {/* Modal Header */}
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
                    <X size={24} />
                  </button>
                </div>

                <div className="lf-modal-layout">
                  {/* Stepper Form Side */}
                  <div className="lf-modal-form-side">
                    <div className="lf-modal-form-scroll">
                      <AnimatePresence mode="wait">
                        {renderStep()}
                      </AnimatePresence>
                    </div>

                    <div className="lf-modal-actions">
                      {currentStep > 1 && (
                        <button className="lf-btn-secondary" onClick={prevStep}>
                          <ChevronLeft size={20} /> Voltar
                        </button>
                      )}
                      {currentStep < 5 ? (
                        <button className="lf-btn-primary" onClick={nextStep}>
                          Próximo <ChevronRight size={20} />
                        </button>
                      ) : (
                        <button 
                          className="lf-btn-submit" 
                          onClick={handleCreateItem}
                          disabled={isSubmitting || !formData.title || !formData.contact_info}
                        >
                          {isSubmitting ? (
                            <><Loader2 className="animate-spin" /> PUBLICANDO...</>
                          ) : (
                            <><CheckCircle2 size={20} /> PUBLICAR AGORA</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Real-time Preview Side */}
                  <div className="lf-modal-preview-side">
                    <div className="lf-preview-header">
                      <Sparkles size={16} style={{ color: 'var(--sb-teal)' }} />
                      <span style={{ marginLeft: '8px' }}>PRÉ-VISUALIZAÇÃO EM TEMPO REAL</span>
                    </div>
                    <div style={{ width: '100%', maxWidth: '320px' }}>
                      <ItemCard item={formData} isPreview handleOpenChat={() => {}} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}