import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Clock, CheckCircle, XCircle, 
  AlertTriangle, Calendar, MapPin, ChevronRight, Filter,
  ShoppingBag, Heart, BookOpen, Home, Briefcase
} from 'lucide-react';
import ApiService from '../../services/apiService';
import Toast from '../../components/ui/Toast';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonListItem } from '../../components/ui/Skeleton';
import './styles.css';

const CATEGORY_ICONS = {
  'Alimentação': ShoppingBag,
  'Saúde': Heart,
  'Educação': BookOpen,
  'Moradia': Home,
  'Trabalho': Briefcase,
  'default': Package
};

const CATEGORY_COLORS = {
  'Alimentação': '#10b981',
  'Saúde': '#ef4444',
  'Educação': '#3b82f6',
  'Moradia': '#f59e0b',
  'Trabalho': '#8b5cf6',
  'default': '#64748b'
};

export default function MeusPedidos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [filter, setFilter] = useState('todos'); // todos, ativos, finalizados
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    loadMeusPedidos();
  }, []);

  const loadMeusPedidos = async () => {
    setLoading(true);
    try {
      // Simulação de chamada à API (substituir por ApiService.getMeusPedidos() quando disponível)
      // const response = await ApiService.getMeusPedidos();
      
      // Mock temporário para visualização
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = [
        {
          id: '1',
          titulo: 'Cesta Básica para Família',
          categoria: 'Alimentação',
          data: '2023-10-25',
          status: 'ativo',
          urgencia: 'alta',
          bairro: 'São Benedito'
        },
        {
          id: '2',
          titulo: 'Doação de Roupas Infantis',
          categoria: 'Moradia',
          data: '2023-10-20',
          status: 'finalizado',
          urgencia: 'baixa',
          bairro: 'Palmital'
        },
        {
          id: '3',
          titulo: 'Remédios para Idoso',
          categoria: 'Saúde',
          data: '2023-10-28',
          status: 'pendente',
          urgencia: 'alta',
          bairro: 'São Benedito'
        }
      ];
      
      setPedidos(mockData);
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: 'Erro ao carregar seus pedidos.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredPedidos = pedidos.filter(p => {
    if (filter === 'todos') return true;
    if (filter === 'ativos') return ['ativo', 'pendente'].includes(p.status);
    if (filter === 'finalizados') return ['finalizado', 'cancelado', 'atendido'].includes(p.status);
    return true;
  });

  const getIcon = (category) => {
    const Icon = CATEGORY_ICONS[category] || CATEGORY_ICONS['default'];
    return Icon;
  };

  const getColor = (category) => {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS['default'];
  };

  return (
    <div className="meus-pedidos-page">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">Meus Pedidos</h1>
      </header>

      <main className="page-content">
        <div className="status-tabs">
          <button 
            className={`tab-btn ${filter === 'todos' ? 'active' : ''}`}
            onClick={() => setFilter('todos')}
          >
            Todos
          </button>
          <button 
            className={`tab-btn ${filter === 'ativos' ? 'active' : ''}`}
            onClick={() => setFilter('ativos')}
          >
            Em Andamento
          </button>
          <button 
            className={`tab-btn ${filter === 'finalizados' ? 'active' : ''}`}
            onClick={() => setFilter('finalizados')}
          >
            Finalizados
          </button>
        </div>

        {loading ? (
          <div className="orders-list">
            {[1, 2, 3].map(i => <SkeletonListItem key={i} />)}
          </div>
        ) : filteredPedidos.length > 0 ? (
          <div className="orders-list">
            {filteredPedidos.map(pedido => {
              const Icon = getIcon(pedido.categoria);
              const color = getColor(pedido.categoria);
              
              return (
                <div key={pedido.id} className="order-card" onClick={() => navigate(`/pedidos/${pedido.id}`)}>
                  <div className="order-icon-box" style={{ color: color, backgroundColor: `${color}15` }}>
                    <Icon size={24} />
                  </div>
                  <div className="order-info">
                    <div className="order-header">
                      <h3 className="order-title">{pedido.titulo}</h3>
                      <Badge variant={pedido.status}>{pedido.status}</Badge>
                    </div>
                    <div className="order-meta">
                      <div className="meta-item"><Calendar size={14} /> {new Date(pedido.data).toLocaleDateString('pt-BR')}</div>
                      <div className="meta-item"><MapPin size={14} /> {pedido.bairro}</div>
                    </div>
                    <div className="order-footer">
                      <span className={`urgency-tag ${pedido.urgencia}`}>Urgência {pedido.urgencia}</span>
                      <ChevronRight size={16} color="#94a3b8" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState 
            title="Nenhum pedido encontrado" 
            description={filter === 'todos' ? "Você ainda não criou nenhum pedido de ajuda." : "Não há pedidos com este status."}
            actionLabel={filter === 'todos' ? "Criar Novo Pedido" : "Limpar Filtros"}
            onAction={filter === 'todos' ? () => navigate('/preciso-de-ajuda') : () => setFilter('todos')}
          />
        )}
      </main>

      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}