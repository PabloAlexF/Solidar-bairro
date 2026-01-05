import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/PedidoPublicado.css';
import verificaIcon from '../assets/icons/verifica.png';
import iphoneIcon from '../assets/icons/iphone.png';
import thunderIcon from '../assets/icons/contorno-da-forma-desenhada-a-mao-do-thunder-bolt.png';
import starIcon from '../assets/icons/hollywood-star.png';
import arrowIcon from '../assets/icons/seta-esquerda.png';
import heartIcon from '../assets/icons/amor-verde.png';
import usersIcon from '../assets/icons/grupo-de-usuarios.png';

const PedidoPublicado = () => {
  const navigate = useNavigate();

  return (
    <div className="pedido-publicado-page">
      <div className="pedido-publicado-container">
        <div className="pedido-publicado-subdiv">
          <div className="pedido-publicado-line">
            <div className="pedido-publicado-border">
              <div className="pedido-publicado-ico">🎉</div>
              <img src={verificaIcon} alt="Verificado" />
            </div>
            <div className="pedido-publicado-glass">
              <span className="pedido-publicado-circle"></span>
              <p>Pedido Ativo</p>
            </div>
          </div>

          <div className="pedido-publicado-text">
            <h1>Seu pedido foi <br /> <span style={{color: '#00BC7D'}}>publicado!</span></h1>
            <p className="pedido-publicado-text2">Pronto! Sua solicitação já está visível para vizinhos <br /> próximos que estão prontos para ajudar.</p>
          </div>

          <div className="pedido-publicado-notifications">
            <div className="pedido-publicado-arround">
              <img src={iphoneIcon} alt="Notificação" />
            </div>
            <div className="pedido-publicado-text-notifications">
              <h2>Notificações em tempo real</h2>
              <p>Fique atento ao seu celular. Você receberá um aviso <br /> assim que alguém se candidatar para te ajudar.</p>
            </div>
          </div>
        </div>

        <div className="pedido-publicado-divleft">
          <span className="pedido-publicado-waiting">
            <span className="pedido-publicado-orangeborder">
              <img src={thunderIcon} alt="Raio" />
              <p>Enquanto espera</p>
            </span>
          </span>

          <div className="pedido-publicado-helpdiv">
            <h2>Que tal retribuir <br />ajudando alguém? 🤝</h2>
          </div>

          <div>
            <p>Fortalecemos nossa comunidade quando <br /> nos ajudamos. Existem vizinhos <br /> precisando de você agora!</p>
          </div>

          <div>
            <button onClick={() => navigate('/pedidos')}>
              <img src={starIcon} alt="Estrela" /> Descobrir como ajudar
            </button>
            <button onClick={() => navigate('/')}>
              <img src={arrowIcon} alt="Seta" /> Voltar ao início
            </button>
          </div>

          <div className="pedido-publicado-cards">
            <article className="pedido-publicado-card pedido-publicado-card--success">
              <div className="pedido-publicado-card__icon">
                <img src={heartIcon} alt="Coração" />
              </div>
              <h3 className="pedido-publicado-card__title">IMPACTO</h3>
              <p className="pedido-publicado-card__text">Pequenos gestos<br />mudam o dia de<br />alguém.</p>
            </article>

            <article className="pedido-publicado-card pedido-publicado-card--union">
              <div className="pedido-publicado-card__icon">
                <img src={usersIcon} alt="Pessoas" />
              </div>
              <h3 className="pedido-publicado-card__title">UNIÃO</h3>
              <p className="pedido-publicado-card__text">Mais de 500 ajudas<br />esta semana.</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoPublicado;