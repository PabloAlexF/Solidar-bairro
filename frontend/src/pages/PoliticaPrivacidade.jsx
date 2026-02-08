import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Users, Heart } from 'lucide-react';
import ReusableHeader from '../components/layout/ReusableHeader';

export default function PoliticaPrivacidade() {
  return (
    <div className="privacidade-page">
      <ReusableHeader mobileLoginOnly={true} />

      <div className="privacidade-container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '120px 2rem 4rem',
        lineHeight: '1.6'
      }}>
        <div className="privacidade-header" style={{ marginBottom: '3rem' }}>
          <Link
            to="/"
            className="privacidade-back-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6b7280',
              textDecoration: 'none',
              marginBottom: '2rem',
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              padding: '0.75rem',
              borderRadius: '12px',
              color: 'white'
            }}>
              <Shield size={24} />
            </div>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0,
                background: 'linear-gradient(135deg, #1e293b, #475569)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Política de Privacidade
              </h1>
              <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="privacidade-content" style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div className="privacidade-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Lock size={20} />
              1. Introdução
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              A privacidade dos nossos usuários é prioridade no SolidarBairro. Esta Política de Privacidade
              explica como coletamos, usamos, armazenamos e protegemos suas informações pessoais,
              em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Ao usar nossa plataforma, você concorda com as práticas descritas nesta política.
            </p>
          </div>

          <div className="privacidade-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Database size={20} />
              2. Dados que Coletamos
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Coletamos apenas as informações necessárias para o funcionamento da plataforma:
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                Dados de Cadastro:
              </h3>
              <ul style={{ color: '#4b5563', marginLeft: '1.5rem' }}>
                <li>Nome completo</li>
                <li>Data de nascimento</li>
                <li>CPF e RG</li>
                <li>Endereço completo</li>
                <li>Informações de contato (telefone, e-mail)</li>
                <li>Ocupação e renda (para famílias)</li>
              </ul>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                Dados de Uso:
              </h3>
              <ul style={{ color: '#4b5563', marginLeft: '1.5rem' }}>
                <li>Interações na plataforma</li>
                <li>Histórico de pedidos e doações</li>
                <li>Preferências de voluntariado</li>
                <li>Localização aproximada (para matching com ONGs próximas)</li>
              </ul>
            </div>
          </div>

          <div className="privacidade-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Eye size={20} />
              3. Como Usamos Seus Dados
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Utilizamos suas informações exclusivamente para:
            </p>
            <ul style={{ color: '#4b5563', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><strong>Conectar famílias e ONGs:</strong> Matching baseado em localização e necessidades</li>
              <li><strong>Facilitar doações:</strong> Coordenação entre doadores e beneficiários</li>
              <li><strong>Comunicação:</strong> Envio de notificações sobre oportunidades de ajuda</li>
              <li><strong>Segurança:</strong> Verificação de identidade e prevenção de fraudes</li>
              <li><strong>Melhorias:</strong> Análise de dados para aprimorar nossos serviços</li>
              <li><strong>Relatórios:</strong> Geração de estatísticas de impacto social (dados anonimizados)</li>
            </ul>
          </div>

          <div className="privacidade-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Users size={20} />
              4. Compartilhamento de Dados
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              <strong>Não vendemos seus dados.</strong> Compartilhamos informações apenas quando necessário:
            </p>
            <ul style={{ color: '#4b5563', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><strong>Com ONGs parceiras:</strong> Apenas dados necessários para prestação de serviços</li>
              <li><strong>Com voluntários:</strong> Informações básicas para coordenação de ações</li>
              <li><strong>Com estabelecimentos:</strong> Dados para parcerias solidárias</li>
              <li><strong>Por obrigação legal:</strong> Quando exigido por lei ou decisão judicial</li>
              <li><strong>Com seu consentimento:</strong> Apenas quando você autorizar explicitamente</li>
            </ul>
          </div>

          <div className="privacidade-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              5. Seus Direitos (LGPD)
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              De acordo com a LGPD, você tem os seguintes direitos:
            </p>
            <ul style={{ color: '#4b5563', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><strong>Confirmação:</strong> Saber se tratamos seus dados pessoais</li>
              <li><strong>Acesso:</strong> Obter cópia dos dados que mantemos sobre você</li>
              <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou incorretos</li>
              <li><strong>Anonimização:</strong> Solicitar anonimização de dados desnecessários</li>
              <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
              <li><strong>Exclusão:</strong> Solicitar exclusão de dados quando não houver obrigação legal</li>
              <li><strong>Revogação:</strong> Revogar consentimento para tratamento de dados</li>
            </ul>
          </div>

          <div className="privacidade-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              6. Segurança dos Dados
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Implementamos medidas técnicas e administrativas para proteger seus dados:
            </p>
            <ul style={{ color: '#4b5563', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Criptografia de dados em trânsito e armazenamento</li>
              <li>Controle de acesso restrito aos dados</li>
              <li>Monitoramento contínuo de segurança</li>
              <li>Backups regulares e seguros</li>
              <li>Treinamento da equipe sobre proteção de dados</li>
              <li>Auditorias de segurança periódicas</li>
            </ul>
          </div>

          <div className="privacidade-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              7. Retenção de Dados
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Mantemos seus dados apenas pelo tempo necessário:
            </p>
            <ul style={{ color: '#4b5563', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><strong>Dados de cadastro:</strong> Enquanto sua conta estiver ativa</li>
              <li><strong>Histórico de ações:</strong> Por 5 anos para fins de auditoria</li>
              <li><strong>Dados anonimizados:</strong> Indefinidamente para análise de impacto</li>
            </ul>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Quando não houver mais necessidade, os dados são anonimizados ou excluídos permanentemente.
            </p>
          </div>

          <div className="privacidade-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              8. Cookies e Tecnologias Similares
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Utilizamos cookies e tecnologias similares para melhorar sua experiência:
            </p>
            <ul style={{ color: '#4b5563', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li><strong>Cookies essenciais:</strong> Para funcionamento básico da plataforma</li>
              <li><strong>Cookies de segurança:</strong> Para proteção contra fraudes</li>
              <li><strong>Cookies analíticos:</strong> Para entender como a plataforma é usada</li>
            </ul>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Você pode controlar o uso de cookies através das configurações do seu navegador.
            </p>
          </div>

          <div className="privacidade-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              9. Menores de Idade
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              O SolidarBairro é destinado a maiores de 18 anos. Não coletamos intencionalmente dados
              de menores de idade. Se descobrirmos que coletamos dados de uma criança, excluiremos
              essas informações imediatamente.
            </p>
          </div>

          <div className="privacidade-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              10. Alterações nesta Política
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Podemos atualizar esta política periodicamente. Alterações significativas serão comunicadas
              por e-mail ou através de aviso na plataforma. A versão mais recente estará sempre disponível
              nesta página.
            </p>
          </div>

          <div className="privacidade-section">
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              11. Contato e Direitos
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:
            </p>
            <div style={{
              background: '#f8fafc',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '1rem'
            }}>
              <p style={{ margin: 0, fontWeight: '600', color: '#1e293b' }}>
                Encarregado de Dados (DPO)
              </p>
              <p style={{ margin: '0.5rem 0', color: '#4b5563' }}>
                E-mail: privacidade@solidarbairro.com
              </p>
              <p style={{ margin: 0, color: '#4b5563' }}>
                Telefone: (11) 9999-9999
              </p>
            </div>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Responderemos às suas solicitações em até 15 dias úteis, conforme determina a LGPD.
            </p>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#f0f9ff',
          borderRadius: '12px',
          border: '1px solid #bae6fd'
        }}>
          <Shield size={24} style={{ color: '#0284c7', marginBottom: '0.5rem' }} />
          <p style={{ color: '#0c4a6e', margin: 0, fontWeight: '500' }}>
            Sua privacidade é protegida. Seus dados são usados apenas para construir uma comunidade mais solidária.
          </p>
        </div>
      </div>
    </div>
  );
}
