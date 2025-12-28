import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/pages/DetalhesNecessidade.css';

const DetalhesNecessidade = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Dados mockados - em produção viria de uma API
  const necessidade = {
    id: 1,
    titulo: "Família precisa de cesta básica urgente",
    descricao: "Família com 4 pessoas, incluindo 2 crianças, sem renda há 2 meses. O pai perdeu o emprego e a mãe está cuidando de um bebê recém-nascido. Precisam urgentemente de alimentos básicos como arroz, feijão, óleo, açúcar, leite em pó e fraldas.",
    bairro: "São Lucas",
    distancia: "0.8 km",
    urgencia: "alta",
    categoria: "alimentacao",
    contato: "(31) 99999-1234",
    endereco: "Rua das Flores, 123 - São Lucas",
    dataPublicacao: "2024-01-15",
    status: "ativo",
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
      ]
    }
  };

  const getUrgenciaColor = (urgencia) => {
    switch(urgencia) {
      case 'alta': return '#ef4444';
      case 'media': return '#f59e0b';
      case 'baixa': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getCategoriaIcon = (categoria) => {
    switch(categoria) {
      case 'alimentacao': return '🍽️';
      case 'saude': return '💊';
      case 'educacao': return '📚';
      case 'moradia': return '🏠';
      default: return '❤️';
    }
  };

  const handleContato = () => {
    const mensagem = `Olá! Vi seu pedido de ajuda no SolidarBairro sobre "${necessidade.titulo}" e gostaria de ajudar. Como posso contribuir?`;
    const whatsappUrl = `https://wa.me/55${necessidade.contato.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="detalhes-necessidade">
      <div className="container">
        <div className="detalhes-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Voltar
          </button>
          <div className="header-badges">
            <div className="categoria-badge">
              <span className="categoria-icon">{getCategoriaIcon(necessidade.categoria)}</span>
              <span>{necessidade.categoria}</span>
            </div>
            <div 
              className="urgencia-badge"
              style={{ backgroundColor: getUrgenciaColor(necessidade.urgencia) }}
            >
              {necessidade.urgencia}
            </div>
          </div>
        </div>

        <div className="detalhes-content">
          <div className="main-info">
            <h1 className="necessidade-titulo">{necessidade.titulo}</h1>
            
            <div className="info-grid">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <div>
                  <strong>Localização</strong>
                  <p>{necessidade.bairro} • {necessidade.distancia}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">📅</span>
                <div>
                  <strong>Publicado em</strong>
                  <p>{new Date(necessidade.dataPublicacao).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="info-item">
                <span className="info-icon">👥</span>
                <div>
                  <strong>Pessoas</strong>
                  <p>{necessidade.detalhes.pessoas} pessoas ({necessidade.detalhes.criancas} crianças)</p>
                </div>
              </div>
            </div>

            <div className="descricao-section">
              <h3>Descrição da situação</h3>
              <p>{necessidade.descricao}</p>
            </div>

            <div className="itens-section">
              <h3>Itens específicos necessários</h3>
              <div className="itens-grid">
                {necessidade.detalhes.itensEspecificos.map((item, index) => (
                  <div key={index} className="item-badge">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="action-sidebar">
            <div className="contact-card">
              <h3>Como ajudar?</h3>
              <p>Entre em contato diretamente com a família para combinar a melhor forma de ajudar.</p>

              <div className="safety-tips">
                <h4>💡 Dicas de segurança</h4>
                <ul>
                  <li>Combine encontros em locais públicos</li>
                  <li>Leve um acompanhante se possível</li>
                  <li>Confirme os dados antes de ajudar</li>
                  <li>Documente sua ajuda (foto/recibo)</li>
                </ul>
              </div>
              
              <button className="btn btn-primary btn-large" onClick={handleContato}>
                <span>💬</span>
                Entrar em contato via WhatsApp
              </button>
            </div>

            <div className="share-card">
              <h4>Compartilhar</h4>
              <p>Ajude a divulgar esta necessidade</p>
              <div className="share-buttons">
                <button className="share-btn whatsapp">
                  <span>📱</span>
                  WhatsApp
                </button>
                <button className="share-btn facebook">
                  <span>📘</span>
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesNecessidade;