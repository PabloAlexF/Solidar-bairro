import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/pages/DetalhesNecessidade.css';

const DetalhesNecessidade = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Dados mockados - em produção viria de uma API
  const getMockData = () => {
    // Primeiro, tentar buscar dados reais do localStorage
    const savedPedidos = localStorage.getItem('solidar-pedidos');
    if (savedPedidos) {
      const pedidos = JSON.parse(savedPedidos);
      const pedidoReal = pedidos.find(p => p.id.toString() === id);
      if (pedidoReal) {
        return pedidoReal;
      }
    }
    
    // Se não encontrar, usar dados mockados baseados no ID
    const baseData = {
      id: parseInt(id) || 1,
      bairro: "São Lucas",
      distancia: "0.8 km",
      contato: "(31) 99999-1234",
      endereco: "Rua das Flores, 123 - São Lucas",
      dataPublicacao: "2024-01-15",
      status: "ativo",
      usuario: "Maria Silva",
      verificado: true,
      tempo: "há 2 horas"
    };

    // Mapear IDs específicos para categorias (fallback)
    const idToCategory = {
      '1766853043857': 'Alimentos',
      '1': 'Alimentos',
      '2': 'Roupas', 
      '3': 'Medicamentos',
      '4': 'Contas',
      '5': 'Trabalho'
    };
    
    const category = idToCategory[id] || 'Alimentos';

    switch(category) {
      case 'Alimentos':
        return {
          ...baseData,
          titulo: "Família precisa de cesta básica urgente",
          descricao: "Família com 4 pessoas, incluindo 2 crianças, sem renda há 2 meses. O pai perdeu o emprego e a mãe está cuidando de um bebê recém-nascido. Precisam urgentemente de alimentos básicos.",
          urgencia: "Alta",
          tipo: "Alimentos",
          detalhes: {
            pessoas: 4,
            criancas: 2,
            idosos: 0,
            situacao: "Desemprego recente",
            itensEspecificos: [
              "Arroz (5kg)",
              "Feijão (2kg)", 
              "Óleo de soja",
              "Açúcar (2kg)",
              "Leite em pó",
              "Fraldas tamanho M",
              "Produtos de higiene"
            ],
            preferencias: {
              horario: "Manhã (8h às 12h)",
              local: "Próximo ao mercado central",
              observacoes: "Prefere receber aos finais de semana"
            }
          }
        };
      case 'Roupas':
        return {
          ...baseData,
          titulo: "Preciso de roupas de inverno para as crianças",
          descricao: "Mãe solteira com duas crianças pequenas precisa de roupas de inverno. As crianças cresceram e as roupas do ano passado não servem mais. Tamanhos 4 e 6 anos.",
          urgencia: "Média",
          tipo: "Roupas"
        };
      case 'Medicamentos':
        return {
          ...baseData,
          titulo: "Medicamento para diabetes - urgente",
          descricao: "Idoso diabético precisa de insulina e medicamentos para controle da diabetes. Sem condições de comprar este mês devido a problemas financeiros.",
          urgencia: "Alta",
          tipo: "Medicamentos"
        };
      case 'Contas':
        return {
          ...baseData,
          titulo: "Ajuda para pagar conta de luz",
          descricao: "Família em dificuldades financeiras precisa de ajuda para quitar a conta de energia elétrica que está em atraso. Valor: R$ 180,00.",
          urgencia: "Média",
          tipo: "Contas"
        };
      case 'Trabalho':
        return {
          ...baseData,
          titulo: "Procuro oportunidade de trabalho",
          descricao: "Pai de família desempregado há 3 meses procura qualquer oportunidade de trabalho. Experiência em construção civil, limpeza e serviços gerais.",
          urgencia: "Baixa",
          tipo: "Trabalho"
        };
      default:
        return {
          ...baseData,
          titulo: "Preciso de ajuda",
          descricao: "Descrição da necessidade",
          urgencia: "Média",
          tipo: "Outros"
        };
    }
  };

  const necessidade = getMockData();

  const getUrgencyColor = (urgencia) => {
    switch(urgencia) {
      case 'Alta': return '#ef4444';
      case 'Média': return '#f59e0b';
      case 'Baixa': return '#22c55e';
      default: return '#64748b';
    }
  };

  const getCategoryIcon = (tipo) => {
    switch(tipo) {
      case 'Alimentos': return <i className="fi fi-rr-apple-whole"></i>;
      case 'Roupas': return <i className="fi fi-rr-shirt"></i>;
      case 'Medicamentos': return <i className="fi fi-rr-medicine"></i>;
      case 'Contas': return <i className="fi fi-rr-receipt"></i>;
      case 'Trabalho': return <i className="fi fi-rr-briefcase"></i>;
      default: return <i className="fi fi-rr-heart"></i>;
    }
  };

  const handleContato = () => {
    const mensagem = `Olá! Vi seu pedido de ajuda no SolidarBairro sobre "${necessidade.titulo}" e gostaria de ajudar. Como posso contribuir?`;
    const whatsappUrl = `https://wa.me/55${necessidade.contato?.replace(/\D/g, '') || ''}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Ajude esta família: ${necessidade.titulo} - SolidarBairro`;
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
  };

  return (
    <div className="detalhes-necessidade">
      <Header showLoginButton={false} />
      
      <div className="page-hero">
        <div className="container">
          <button className="back-btn" onClick={() => navigate('/quero-ajudar')}>
            <i className="fi fi-rr-arrow-left"></i>
            <span>Voltar aos pedidos</span>
          </button>
          
          <div className="hero-badges">
            <div className="categoria-badge">
              <span className="categoria-icon">{getCategoryIcon(necessidade.tipo)}</span>
              <span>{necessidade.tipo}</span>
            </div>
            <div 
              className="urgencia-badge"
              style={{ backgroundColor: getUrgencyColor(necessidade.urgencia) }}
            >
              <i className="fi fi-rr-exclamation"></i>
              {necessidade.urgencia}
            </div>
          </div>
        </div>
      </div>

      <main className="main-content">
        <div className="container">
          <div className="content-grid">
            <div className="main-column">
              <div className="request-card">
                <div className="request-header">
                  <h1 className="request-title">{necessidade.titulo}</h1>
                  <div className="request-meta">
                    <div className="meta-item">
                      <i className="fi fi-rr-user"></i>
                      <span>{necessidade.usuario}</span>
                      {necessidade.verificado && <i className="fi fi-rr-badge-check verified"></i>}
                    </div>
                    <div className="meta-item">
                      <i className="fi fi-rr-clock"></i>
                      <span>{necessidade.tempo}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fi fi-rr-marker"></i>
                      <span>{necessidade.distancia}</span>
                    </div>
                  </div>
                </div>
                
                <div className="request-description">
                  <h3>Descrição da situação</h3>
                  <p>{necessidade.descricao}</p>
                </div>
              </div>

              <div className="details-grid">
                {necessidade.tipo === 'Alimentos' && necessidade.detalhes && (
                  <>
                    <div className="detail-card">
                      <div className="detail-header">
                        <div className="detail-icon">
                          <i className="fi fi-rr-users"></i>
                        </div>
                        <h4>Composição familiar</h4>
                      </div>
                      <div className="detail-content">
                        <div className="detail-item">
                          <span className="label">Total de pessoas:</span>
                          <span className="value">{necessidade.detalhes.pessoas}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Crianças:</span>
                          <span className="value">{necessidade.detalhes.criancas}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Situação:</span>
                          <span className="value">{necessidade.detalhes.situacao}</span>
                        </div>
                      </div>
                    </div>

                    <div className="detail-card">
                      <div className="detail-header">
                        <div className="detail-icon">
                          <i className="fi fi-rr-list-check"></i>
                        </div>
                        <h4>Itens necessários</h4>
                      </div>
                      <div className="detail-content">
                        <div className="items-grid">
                          {necessidade.detalhes.itensEspecificos.map((item, index) => (
                            <div key={index} className="item-tag">
                              <i className="fi fi-rr-check"></i>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="detail-card">
                      <div className="detail-header">
                        <div className="detail-icon">
                          <i className="fi fi-rr-clock"></i>
                        </div>
                        <h4>Preferências de entrega</h4>
                      </div>
                      <div className="detail-content">
                        <div className="detail-item">
                          <span className="label">Melhor horário:</span>
                          <span className="value">{necessidade.detalhes.preferencias.horario}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Local preferido:</span>
                          <span className="value">{necessidade.detalhes.preferencias.local}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Observações:</span>
                          <span className="value">{necessidade.detalhes.preferencias.observacoes}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="sidebar-column">
              <div className="action-card">
                <div className="action-header">
                  <div className="action-icon">
                    <i className="fi fi-rr-heart"></i>
                  </div>
                  <div>
                    <h3>Quero ajudar!</h3>
                    <p>Entre em contato e faça a diferença</p>
                  </div>
                </div>
                
                <div className="contact-section">
                  <button className="contact-btn" onClick={handleContato}>
                    <i className="fi fi-brands-whatsapp"></i>
                    <span>Conversar no WhatsApp</span>
                  </button>
                  
                  <div className="safety-notice">
                    <div className="notice-header">
                      <i className="fi fi-rr-shield-check"></i>
                      <span>Dicas de segurança</span>
                    </div>
                    <ul>
                      <li>Encontre-se em locais públicos</li>
                      <li>Leve um acompanhante</li>
                      <li>Confirme os dados antes</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="share-card">
                <h4>Compartilhar pedido</h4>
                <p>Ajude a divulgar esta necessidade</p>
                <div className="share-buttons">
                  <button className="share-btn whatsapp" onClick={() => handleShare('whatsapp')}>
                    <i className="fi fi-brands-whatsapp"></i>
                    <span>WhatsApp</span>
                  </button>
                  <button className="share-btn facebook" onClick={() => handleShare('facebook')}>
                    <i className="fi fi-brands-facebook"></i>
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetalhesNecessidade;