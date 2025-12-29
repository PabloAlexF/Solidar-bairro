import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import '../styles/pages/SobreTipos.css';

const SobreTipos = () => {
  const navigate = useNavigate();

  const tiposDetalhados = [
    {
      id: 'cidadao',
      title: 'Cidadao',
      subtitle: 'Para pessoas fisicas da comunidade',
      description: 'O cadastro de cidadao e ideal para moradores que querem participar ativamente da rede solidaria do bairro.',
      benefits: [
        'Pedir ajuda quando estiver passando por dificuldades',
        'Oferecer ajuda aos vizinhos que precisam',
        'Participar de acoes solidarias organizadas',
        'Conectar-se com outros moradores do bairro',
        'Receber notificacoes sobre necessidades proximas'
      ],
      requirements: [
        'Ser maior de 18 anos',
        'Morar no bairro ou regiao',
        'Fornecer dados basicos de contato'
      ],
      time: 'Cadastro em 2 minutos'
    },
    {
      id: 'comercio',
      title: 'Comercio Local',
      subtitle: 'Para estabelecimentos comerciais',
      description: 'Cadastro para empresas locais que querem apoiar a comunidade e participar da economia solidaria.',
      benefits: [
        'Oferecer produtos com precos solidarios',
        'Aceitar moeda social como pagamento',
        'Participar de campanhas comunitarias',
        'Aumentar visibilidade no bairro',
        'Fortalecer lacos com a comunidade'
      ],
      requirements: [
        'Possuir CNPJ ativo',
        'Estabelecimento fisico no bairro',
        'Responsavel legal identificado'
      ],
      time: 'Cadastro em 5 minutos'
    },
    {
      id: 'ong',
      title: 'ONG',
      subtitle: 'Para organizacoes sem fins lucrativos',
      description: 'Cadastro rigoroso para ONGs que precisam de acesso a dados de vulnerabilidade e coordenacao de acoes sociais.',
      benefits: [
        'Acesso a dados de vulnerabilidade das familias',
        'Relatorios detalhados para prestacao de contas',
        'Coordenar acoes sociais oficiais',
        'Integracao com sistemas da prefeitura',
        'Ferramentas avancadas de gestao social'
      ],
      requirements: [
        'CNPJ ativo de organizacao sem fins lucrativos',
        'Estatuto social atualizado',
        'Ata de nomeacao da diretoria',
        'Certidoes negativas',
        'Verificacao documental obrigatoria'
      ],
      time: 'Cadastro em 15 minutos + verificacao em ate 48h'
    }
  ];

  return (
    <>
      <Header showLoginButton={false} />
      <div className="sobre-tipos">
      <div className="container">
        <div className="sobre-header">
          <button className="back-btn" onClick={() => navigate('/cadastro')}>
            ← Voltar ao cadastro
          </button>
          <h1>Entenda cada tipo de cadastro</h1>
          <p>Escolha a opcao que melhor se adequa ao seu perfil e objetivos</p>
        </div>

        <div className="tipos-detalhados">
          {tiposDetalhados.map(tipo => (
            <div key={tipo.id} className="tipo-detalhado">
              <div className="tipo-header">
                <h2>{tipo.title}</h2>
                <span className="tipo-subtitle">{tipo.subtitle}</span>
                <span className="tipo-time">{tipo.time}</span>
              </div>
              
              <p className="tipo-description">{tipo.description}</p>
              
              <div className="tipo-content">
                <div className="benefits-section">
                  <h3>O que voce pode fazer:</h3>
                  <ul>
                    {tipo.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="requirements-section">
                  <h3>Requisitos:</h3>
                  <ul>
                    {tipo.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <button 
                className="btn btn-primary"
                onClick={() => navigate(`/cadastro/${tipo.id}`)}
              >
                Cadastrar como {tipo.title}
              </button>
            </div>
          ))}
        </div>
        
        <div className="help-section">
          <h2>Ainda tem duvidas?</h2>
          <p>Entre em contato conosco pelo WhatsApp: <strong>(31) 99999-9999</strong></p>
          <p>Ou envie um e-mail para: <strong>ajuda@solidarbairro.com.br</strong></p>
        </div>
      </div>
    </div>
    </>
  );
};

export default SobreTipos;