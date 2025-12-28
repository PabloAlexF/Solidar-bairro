import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
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
    urgencia: "Alta",
    tipo: "Alimentos",
    contato: "(31) 99999-1234",
    endereco: "Rua das Flores, 123 - São Lucas",
    dataPublicacao: "2024-01-15",
    status: "ativo",
    usuario: "Maria Silva",
    verificado: true,
    tempo: "há 2 horas"
  };

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
      
      <main className="main-content">
        <div className="container">
          <div className="detalhes-header">
            <button className="back-btn" onClick={() => navigate('/quero-ajudar')}>
              <i className="fi fi-rr-arrow-left"></i>
              Voltar
            </button>
            <div className="header-badges">
              <div className="categoria-badge">
                <span className="categoria-icon">{getCategoryIcon(necessidade.tipo)}</span>
                <span>{necessidade.tipo}</span>
              </div>
              <div 
                className="urgencia-badge"
                style={{ backgroundColor: getUrgencyColor(necessidade.urgencia) }}
              >
                {necessidade.urgencia}
              </div>
            </div>
          </div>

          <div className="detalhes-content">
            <div className="main-info">
              <div className="hero-section">
                <h1 className="necessidade-titulo">{necessidade.titulo}</h1>
                <p className="necessidade-descricao">{necessidade.descricao}</p>
              </div>
              
              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">
                    <i className="fi fi-rr-marker"></i>
                  </div>
                  <div className="info-content">
                    <h4>Localização</h4>
                    <p>{necessidade.distancia}</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-icon">
                    <i className="fi fi-rr-clock"></i>
                  </div>
                  <div className="info-content">
                    <h4>Publicado</h4>
                    <p>{necessidade.tempo}</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-icon">
                    <i className="fi fi-rr-user"></i>
                  </div>
                  <div className="info-content">
                    <h4>Solicitante</h4>
                    <p>{necessidade.usuario} {necessidade.verificado && <span className="verified">✓</span>}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-sidebar">
              <div className="contact-card">
                <div className="card-header">
                  <i className="fi fi-rr-heart"></i>
                  <h3>Como ajudar?</h3>
                </div>
                <p>Entre em contato para combinar a melhor forma de ajudar esta família.</p>

                <div className="safety-tips">
                  <h4><i className="fi fi-rr-shield-check"></i> Dicas de segurança</h4>
                  <ul>
                    <li>Combine encontros em locais públicos</li>
                    <li>Leve um acompanhante se possível</li>
                    <li>Confirme os dados antes de ajudar</li>
                  </ul>
                </div>
                
                <button className="btn-contact" onClick={handleContato}>
                  <i className="fi fi-brands-whatsapp"></i>
                  Entrar em contato
                </button>
              </div>

              <div className="share-card">
                <div className="card-header">
                  <i className="fi fi-rr-share"></i>
                  <h4>Compartilhar</h4>
                </div>
                <p>Ajude a divulgar esta necessidade</p>
                <div className="share-buttons">
                  <button className="share-btn whatsapp" onClick={() => handleShare('whatsapp')}>
                    <i className="fi fi-brands-whatsapp"></i>
                    WhatsApp
                  </button>
                  <button className="share-btn facebook" onClick={() => handleShare('facebook')}>
                    <i className="fi fi-brands-facebook"></i>
                    Facebook
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