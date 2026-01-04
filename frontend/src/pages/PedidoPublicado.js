import React from 'react';
import Header from '../components/layout/Header';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/PedidoPublicado.css';

const PedidoPublicado = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="container">
        <div className="subdiv">
          <div className="line">
            <div className="border">
              <div id="ico">🎉</div>
              <img src="/assets/icons/verifica.png" alt="" />
            </div>

            <div className="glass">
              <span className="circle"></span>
              <p>Pedido Ativo</p>
            </div>
          </div>

          <div className="text">
            <h1>Seu pedido foi <br /> <span style={{color: '#00BC7D'}}>publicado!</span></h1>
            <p id="text2">Pronto! Sua solicitação já está visível para vizinhos <br /> próximos que estão prontos para ajudar.</p>
          </div>

          <div className="notifications">
            <div className="arround">
              <img src="/assets/icons/iphone.png" alt="" />
            </div>
            <div className="text-notifications">
              <h2>Notificações em tempo real</h2>
              <p>Fique atento ao seu celular. Você receberá um aviso <br /> assim que alguém se candidatar para te ajudar.</p>
            </div>
          </div>
        </div>

        <div className="divleft">
          <span className="waiting">
            <span className="orangeborder">
              <img src="/assets/icons/contorno-da-forma-desenhada-a-mao-do-thunder-bolt.png" alt="" />
              <p>Enquanto espera</p>
            </span>
          </span>

          <div className="helpdiv">
            <h2>Que tal retribuir <br />ajudando alguém? 🤝</h2>
          </div>

          <div>
            <p>Fortalecemos nossa comunidade quando <br /> nos ajudamos. Existem vizinhos <br /> precisando de você agora!</p>
          </div>

          <div>
            <button onClick={() => navigate('/quero-ajudar')}>
              <img src="/assets/icons/hollywood-star.png" alt="" /> Descobrir como ajudar
            </button>
            <button onClick={() => navigate('/')}>
              <img src="/assets/icons/seta-esquerda.png" alt="" /> Voltar ao inicio
            </button>
          </div>

          <div className="cards">
            <article className="card card--success" aria-label="Impacto: Pequenos gestos">
              <div className="card__icon">
                <img src="/assets/icons/amor-verde.png" alt="Coração" />
              </div>
              <h3 className="card__title">IMPACTO</h3>
              <p className="card__text">Pequenos gestos<br />mudam o dia de<br />alguém.</p>
            </article>

            <article className="card card--union" aria-label="União: Mais de 500 ajudas">
              <div className="card__icon">
                <img src="/assets/icons/grupo-de-usuarios.png" alt="Pessoas" />
              </div>
              <h3 className="card__title">União</h3>
              <p className="card__text">Mais de 500 ajudas<br />esta semana.</p>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default PedidoPublicado;