import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Users, Heart } from 'lucide-react';
import ReusableHeader from '../components/layout/ReusableHeader';
import './TermosUso.css';

export default function TermosUso() {
  return (
    <div className="termos-page">
      <ReusableHeader mobileLoginOnly={true} />

      <div className="termos-container">
        <div className="termos-header">
          <Link to="/" className="termos-back-link">
            <ArrowLeft size={16} />
            Voltar
          </Link>

          <div className="termos-title-wrapper">
            <div className="termos-icon-box">
              <FileText size={24} />
            </div>
            <div>
              <h1>Termos de Uso</h1>
              <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>

        <div className="termos-content">
          <div className="termos-section">
            <h2>
              <Users size={20} />
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao acessar e usar o SolidarBairro, você concorda em cumprir e estar vinculado a estes Termos de Uso.
              Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
            </p>
          </div>

          <div className="termos-section">
            <h2>
              <Heart size={20} />
              2. Descrição do Serviço
            </h2>
            <p>
              O SolidarBairro é uma plataforma digital que conecta famílias em situação de vulnerabilidade social
              com organizações não governamentais (ONGs), cidadãos voluntários e estabelecimentos comerciais locais
              para promover ações de solidariedade e apoio comunitário.
            </p>
            <p>A plataforma oferece:</p>
            <ul>
              <li>Cadastro e mapeamento de famílias necessitadas</li>
              <li>Conexão com ONGs e voluntários</li>
              <li>Sistema de pedidos e doações</li>
              <li>Comunicação direta entre usuários</li>
              <li>Relatórios e análises de impacto social</li>
            </ul>
          </div>

          <div className="termos-section">
            <h2>
              <Shield size={20} />
              3. Responsabilidades do Usuário
            </h2>
            <p>Ao usar nossa plataforma, você se compromete a:</p>
            <ul>
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Manter a confidencialidade de sua senha de acesso</li>
              <li>Usar a plataforma apenas para fins de solidariedade social</li>
              <li>Respeitar outros usuários e não praticar atos discriminatórios</li>
              <li>Não utilizar a plataforma para fins comerciais não autorizados</li>
              <li>Reportar qualquer uso indevido ou conteúdo inadequado</li>
            </ul>
          </div>

          <div className="termos-section">
            <h2>4. Privacidade e Proteção de Dados</h2>
            <p>
              Sua privacidade é fundamental para nós. Todas as informações pessoais são tratadas de acordo
              com nossa <Link to="/privacidade">Política de Privacidade</Link>, em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
            <p>Comprometemo-nos a:</p>
            <ul>
              <li>Coletar apenas dados necessários para o funcionamento da plataforma</li>
              <li>Utilizar dados apenas para os fins declarados</li>
              <li>Proteger suas informações com medidas de segurança adequadas</li>
              <li>Não compartilhar dados sem seu consentimento explícito</li>
              <li>Fornecer transparência sobre como seus dados são utilizados</li>
            </ul>
          </div>

          <div className="termos-section">
            <h2>5. Uso Aceitável</h2>
            <p>Você não pode usar a plataforma para:</p>
            <ul>
              <li>Violar leis ou regulamentos aplicáveis</li>
              <li>Praticar fraudes ou enganar outros usuários</li>
              <li>Distribuir conteúdo ofensivo, discriminatório ou ilegal</li>
              <li>Tentar acessar sistemas não autorizados</li>
              <li>Interferir no funcionamento normal da plataforma</li>
              <li>Usar robôs ou sistemas automatizados sem autorização</li>
            </ul>
          </div>

          <div className="termos-section">
            <h2>6. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo da plataforma SolidarBairro, incluindo textos, imagens, logotipos e software,
              é propriedade do SolidarBairro ou de seus licenciadores e está protegido por leis de direitos autorais.
            </p>
          </div>

          <div className="termos-section">
            <h2>7. Limitação de Responsabilidade</h2>
            <p>O SolidarBairro não se responsabiliza por:</p>
            <ul>
              <li>Interações diretas entre usuários fora da plataforma</li>
              <li>Qualidade ou segurança de serviços oferecidos por terceiros</li>
              <li>Perdas indiretas ou consequenciais</li>
              <li>Interrupções temporárias do serviço</li>
            </ul>
          </div>

          <div className="termos-section">
            <h2>8. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas
              serão comunicadas aos usuários por e-mail ou através da plataforma. O uso continuado da plataforma
              após as modificações constitui aceitação dos novos termos.
            </p>
          </div>

          <div className="termos-section">
            <h2>9. Lei Aplicável</h2>
            <p>
              Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais
              competentes do Brasil.
            </p>
          </div>

          <div className="termos-section">
            <h2>10. Contato</h2>
            <p>
              Para dúvidas sobre estes termos, entre em contato conosco através do e-mail:
              <a href="mailto:contato@solidarbairro.com" style={{ marginLeft: '0.5rem' }}>
                contato@solidarbairro.com
              </a>
            </p>
          </div>
        </div>

        <div className="termos-footer-note">
          <Heart size={24} style={{ color: '#3b82f6', marginBottom: '0.5rem', display: 'inline-block' }} />
          <p>
            Ao usar o SolidarBairro, você contribui para construir uma comunidade mais solidária e justa.
          </p>
        </div>
      </div>
    </div>
  );
}
