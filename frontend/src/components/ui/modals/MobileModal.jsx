import React, { useEffect } from 'react';
import { X, CheckCircle, XCircle, Heart, Store, Users, UserCircle } from 'lucide-react';
import './MobileModal.css';

const MobileModal = ({ 
  isOpen, 
  onClose, 
  item, 
  type, 
  onConfirm, 
  evaluationChecklist, 
  setEvaluationChecklist,
  loading 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const formatAddress = (address) => {
    if (!address) return "Não informado";
    if (typeof address === 'string') return address;
    if (typeof address === 'object') {
      const parts = [];
      if (address.logradouro) parts.push(address.logradouro);
      if (address.numero) parts.push(address.numero);
      if (address.bairro) parts.push(address.bairro);
      if (address.cidade) parts.push(address.cidade);
      if (address.uf) parts.push(address.uf);
      return parts.join(', ') || "Endereço registrado";
    }
    return "N/A";
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'ong':
        return {
          title: item.nome_fantasia || item.nomeFantasia,
          subtitle: 'Verificação Institucional',
          icon: <Heart size={24} />,
          color: '#8b5cf6',
          bgColor: 'rgba(139, 92, 246, 0.1)'
        };
      case 'commerce':
        return {
          title: item.nome_fantasia || item.nomeFantasia || item.nomeEstabelecimento,
          subtitle: 'Análise de Parceria',
          icon: <Store size={24} />,
          color: '#3b82f6',
          bgColor: 'rgba(59, 130, 246, 0.1)'
        };
      case 'family':
        return {
          title: item.nomeCompleto || item.full_name,
          subtitle: 'Cadastro de Família',
          icon: <Users size={24} />,
          color: '#f97316',
          bgColor: 'rgba(249, 115, 22, 0.1)'
        };
      case 'citizen':
        return {
          title: item.nomeCompleto || item.full_name,
          subtitle: 'Cadastro de Cidadão',
          icon: <UserCircle size={24} />,
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.1)'
        };
      default:
        return {
          title: 'Detalhes',
          subtitle: 'Informações',
          icon: <UserCircle size={24} />,
          color: '#6b7280',
          bgColor: 'rgba(107, 114, 128, 0.1)'
        };
    }
  };

  const config = getTypeConfig();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(item, type);
    }
  };

  const canConfirm = evaluationChecklist.check1 && evaluationChecklist.check2;

  return (
    <div className="mobile-modal-overlay" onClick={handleBackdropClick}>
      <div className="mobile-modal-container">
        {/* Header */}
        <div className="mobile-modal-header" style={{ backgroundColor: config.color }}>
          <div className="mobile-modal-header-content">
            <div className="mobile-modal-icon" style={{ backgroundColor: config.bgColor }}>
              {config.icon}
            </div>
            <div className="mobile-modal-title-area">
              <h2>{config.title}</h2>
              <p>{config.subtitle}</p>
            </div>
          </div>
          <button className="mobile-modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="mobile-modal-body">
          {/* Dados principais */}
          <div className="mobile-detail-section">
            <h3>Informações Principais</h3>
            <div className="mobile-detail-grid">
              {type === 'ong' && (
                <>
                  <div className="mobile-detail-item">
                    <label>Razão Social</label>
                    <p>{item.razao_social || "Não informado"}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>CNPJ</label>
                    <p>{item.cnpj}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>E-mail</label>
                    <p>{item.email}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>Telefone</label>
                    <p>{item.telefone}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>Website</label>
                    <p>{item.website || "N/A"}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>Sede</label>
                    <p>{formatAddress(item.sede)}</p>
                  </div>
                  {item.areas_cobertura && (
                    <div className="mobile-detail-item">
                      <label>Áreas de Cobertura</label>
                      <p>{item.areas_cobertura.join(", ")}</p>
                    </div>
                  )}
                  {item.causas && (
                    <div className="mobile-detail-item">
                      <label>Causas</label>
                      <p>{item.causas.join(", ")}</p>
                    </div>
                  )}
                </>
              )}

              {type === 'commerce' && (
                <>
                  <div className="mobile-detail-item">
                    <label>Razão Social</label>
                    <p>{item.razao_social || "Não informado"}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>CNPJ</label>
                    <p>{item.cnpj}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>Segmento</label>
                    <p>{item.segmento || "Não informado"}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>Responsável</label>
                    <p>{item.responsavel_legal || "Não informado"}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>E-mail</label>
                    <p>{item.email}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>Telefone</label>
                    <p>{item.telefone}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>Endereço</label>
                    <p>{formatAddress(item.endereco)}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>Funcionamento</label>
                    <p>{item.horario_funcionamento || "Não informado"}</p>
                  </div>
                </>
              )}

              {(type === 'family' || type === 'citizen') && (
                <>
                  <div className="mobile-detail-item">
                    <label>CPF</label>
                    <p>{item.cpf}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>E-mail</label>
                    <p>{item.email}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>Telefone</label>
                    <p>{item.telefone || item.phone}</p>
                  </div>
                  <div className="mobile-detail-item">
                    <label>Endereço</label>
                    <p>{formatAddress(item.endereco)}</p>
                  </div>
                  
                  {type === 'family' && (
                    <>
                      <div className="mobile-detail-item">
                        <label>Renda Familiar</label>
                        <p>{item.rendaFamiliar || "Não informado"}</p>
                      </div>
                      <div className="mobile-detail-item">
                        <label>Composição</label>
                        <p>{item.adultos} adultos, {item.criancas} crianças</p>
                      </div>
                      {item.necessidades && (
                        <div className="mobile-detail-item">
                          <label>Necessidades</label>
                          <p>{item.necessidades.join(", ")}</p>
                        </div>
                      )}
                    </>
                  )}

                  {type === 'citizen' && (
                    <>
                      <div className="mobile-detail-item">
                        <label>Profissão</label>
                        <p>{item.profissao || "Não informado"}</p>
                      </div>
                      {item.disponibilidade && (
                        <div className="mobile-detail-item">
                          <label>Disponibilidade</label>
                          <p>{item.disponibilidade.join(", ")}</p>
                        </div>
                      )}
                      {item.interesses && (
                        <div className="mobile-detail-item">
                          <label>Interesses</label>
                          <p>{item.interesses.join(", ")}</p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Contribuições para comércio */}
          {type === 'commerce' && item.contribuicoes && (
            <div className="mobile-detail-section">
              <h3>Contribuições Pretendidas</h3>
              <ul className="mobile-contributions-list">
                {item.contribuicoes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Propósito */}
          {item.proposito && (
            <div className="mobile-detail-section">
              <h3>Propósito</h3>
              <p className="mobile-purpose-text">"{item.proposito}"</p>
            </div>
          )}

          {/* Checklist de análise */}
          <div className="mobile-checklist-section">
            <h3>Checklist de Análise</h3>
            <div className="mobile-checklist-items">
              <div 
                className={`mobile-checklist-item ${evaluationChecklist.check1 ? 'checked' : ''}`}
                onClick={() => setEvaluationChecklist(p => ({ ...p, check1: !p.check1 }))}
              >
                <div className="mobile-checkbox">
                  {evaluationChecklist.check1 && <CheckCircle size={16} />}
                </div>
                <span>
                  {type === 'ong' ? 'Documentação Legal Validada' :
                   type === 'commerce' ? 'CNPJ Ativo na Receita' :
                   'Identidade Confirmada (CPF)'}
                </span>
              </div>
              <div 
                className={`mobile-checklist-item ${evaluationChecklist.check2 ? 'checked' : ''}`}
                onClick={() => setEvaluationChecklist(p => ({ ...p, check2: !p.check2 }))}
              >
                <div className="mobile-checkbox">
                  {evaluationChecklist.check2 && <CheckCircle size={16} />}
                </div>
                <span>
                  {type === 'ong' ? 'Sede Física Verificada' :
                   type === 'commerce' ? 'Compromisso Social Assinado' :
                   'Comprovante de Residência OK'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mobile-modal-footer">
          <button className="mobile-btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="mobile-btn-primary" 
            style={{ backgroundColor: config.color }}
            disabled={!canConfirm || loading}
            onClick={handleConfirm}
          >
            {loading ? 'Processando...' : 'Concluir Análise'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileModal;