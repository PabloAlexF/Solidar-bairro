import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Users, Heart } from 'lucide-react';
import LandingHeader from '../components/layout/LandingHeader';

export default function TermosUso() {
  return (
    <div className="termos-page">
      <LandingHeader scrolled={true} />

      <div className="termos-container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '120px 2rem 4rem',
        lineHeight: '1.6'
      }}>
        <div className="termos-header" style={{ marginBottom: '3rem' }}>
          <Link
            to="/cadastro"
            className="termos-back-link"
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
            Voltar ao Cadastro
          </Link>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              padding: '0.75rem',
              borderRadius: '12px',
              color: 'white'
            }}>
              <FileText size={24} />
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
                Termos de Uso
              </h1>
              <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="termos-content" style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div className="termos-section" style={{ marginBottom: '2rem' }}>
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
              1. Aceitação dos Termos
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Ao acessar e usar o SolidarBairro, você concorda em cumprir e estar vinculado a estes Termos de Uso.
              Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
            </p>
          </div>

          <div className="termos-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Heart size={20} />
              2. Descrição do Serviço
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              O SolidarBairro é uma plataforma digital que conecta famílias em situação de vulnerabilidade social
              com organizações não governamentais (ONGs), cidadãos voluntários e estabelecimentos comerciais locais
              para promover ações de solidariedade e apoio comunitário.
            </p>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              A plataforma oferece:
            </p>
            <ul style={{ color: '#4b5563', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Cadastro e mapeamento de famílias necessitadas</li>
              <li>Conexão com ONGs e voluntários</li>
              <li>Sistema de pedidos e doações</li>
              <li>Comunicação direta entre usuários</li>
              <li>Relatórios e análises de impacto social</li>
            </ul>
          </div>

          <div className="termos-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Shield size={20} />
              3. Responsabilidades do Usuário
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Ao usar nossa plataforma, você se compromete a:
            </p>
            <ul style={{ color: '#4b5563', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Manter a confidencialidade de sua senha de acesso</li>
              <li>Usar a plataforma apenas para fins de solidariedade social</li>
              <li>Respeitar outros usuários e não praticar atos discriminatórios</li>
              <li>Não utilizar a plataforma para fins comerciais não autorizados</li>
              <li>Reportar qualquer uso indevido ou conteúdo inadequado</li>
            </ul>
          </div>

          <div className="termos-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              4. Privacidade e Proteção de Dados
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Sua privacidade é fundamental para nós. Todas as informações pessoais são tratadas de acordo
              com nossa <Link to="/privacidade" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Política de Privacidade</Link>, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Comprometemo-nos a:
            </p>
            <ul style={{ color: '#4b5563', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Coletar apenas dados necessários para o funcionamento da plataforma</li>
              <li>Utilizar dados apenas para os fins declarados</li>
              <li>Proteger suas informações com medidas de segurança adequadas</li>
              <li>Não compartilhar dados sem seu consentimento explícito</li>
              <li>Fornecer transparência sobre como seus dados são utilizados</li>
            </ul>
          </div>

          <div className="termos-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              5. Uso Aceitável
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Você não pode usar a plataforma para:
            </p>
            <ul style={{ color: '#4b5563', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Violar leis ou regulamentos aplicáveis</li>
              <li>Praticar fraudes ou enganar outros usuários</li>
              <li>Distribuir conteúdo ofensivo, discriminatório ou ilegal</li>
              <li>Tentar acessar sistemas não autorizados</li>
              <li>Interferir no funcionamento normal da plataforma</li>
              <li>Usar robôs ou sistemas automatizados sem autorização</li>
            </ul>
          </div>

          <div className="termos-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              6. Propriedade Intelectual
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Todo o conteúdo da plataforma SolidarBairro, incluindo textos, imagens, logotipos e software,
              é propriedade do SolidarBairro ou de seus licenciadores e está protegido por leis de direitos autorais.
            </p>
          </div>

          <div className="termos-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              7. Limitação de Responsabilidade
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              O SolidarBairro não se responsabiliza por:
            </p>
            <ul style={{ color: '#4b5563', marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Interações diretas entre usuários fora da plataforma</li>
              <li>Qualidade ou segurança de serviços oferecidos por terceiros</li>
              <li>Perdas indiretas ou consequenciais</li>
              <li>Interrupções temporárias do serviço</li>
            </ul>
          </div>

          <div className="termos-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              8. Modificações dos Termos
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas
              serão comunicadas aos usuários por e-mail ou através da plataforma. O uso continuado da plataforma
              após as modificações constitui aceitação dos novos termos.
            </p>
          </div>

          <div className="termos-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              9. Lei Aplicável
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais
              competentes do Brasil.
            </p>
          </div>

          <div className="termos-section">
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem'
            }}>
              10. Contato
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Para dúvidas sobre estes termos, entre em contato conosco através do e-mail:
              <a href="mailto:contato@solidarbairro.com" style={{
                color: '#3b82f6',
                textDecoration: 'none',
                marginLeft: '0.5rem'
              }}>
                contato@solidarbairro.com
              </a>
            </p>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <Heart size={24} style={{ color: '#3b82f6', marginBottom: '0.5rem' }} />
          <p style={{ color: '#6b7280', margin: 0 }}>
            Ao usar o SolidarBairro, você contribui para construir uma comunidade mais solidária e justa.
          </p>
        </div>
      </div>
    </div>
  );
}
