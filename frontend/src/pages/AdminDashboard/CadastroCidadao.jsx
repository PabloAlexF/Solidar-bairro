import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, ArrowRight, Loader2, ArrowLeft, Heart, Briefcase, Camera } from 'lucide-react';
import Toast from '../../../components/ui/Toast';
import { useCEP } from './useCEP';

const CadastroCidadao = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    nome: '', email: '', cpf: '', telefone: '',
    senha: '', confirmarSenha: '',
    cep: '', endereco: '', numero: '', bairro: '', cidade: '', uf: '',
    ocupacao: '', interesses: ''
  });
  const { searchCEP } = useCEP();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, foto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCepBlur = async (e) => {
    const result = await searchCEP(e.target.value);
    if (result) {
      if (result.error) {
        setToast({ show: true, message: result.error, type: 'error' });
      } else {
        const { logradouro, bairro, localidade, uf } = result.data;
        setFormData(prev => ({
          ...prev,
          endereco: logradouro,
          bairro,
          cidade: localidade,
          uf
        }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.cpf || formData.cpf.length < 11) newErrors.cpf = 'CPF inválido';
    if (!formData.senha || formData.senha.length < 6) newErrors.senha = 'Mínimo 6 caracteres';
    if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = 'Senhas não conferem';
    if (!formData.cep) newErrors.cep = 'CEP obrigatório';
    if (!formData.numero) newErrors.numero = 'Número obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cidadao', ...formData })
      });

      if (!response.ok) throw new Error('Erro ao realizar cadastro');
      
      setToast({ show: true, message: 'Cadastro realizado com sucesso! Redirecionando...', type: 'success' });
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (error) {
      setToast({ show: true, message: error.message || 'Erro ao conectar com servidor', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-wrapper">
      <div className="cadastro-container">
        <button onClick={onBack} className="btn-back"><ArrowLeft size={20} /> Voltar</button>
        
        <div className="cadastro-header">
          <h2 className="cadastro-title">Cadastro de Cidadão</h2>
          <p className="cadastro-subtitle">Junte-se a nós para fazer a diferença</p>
        </div>

        <div className="profile-upload-container">
          <label className="profile-upload-label">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="profile-upload-input" 
            />
            {preview ? (
              <img src={preview} alt="Perfil" className="profile-image-preview" />
            ) : (
              <Camera size={32} className="profile-upload-icon" />
            )}
          </label>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group full-width">
            <label className="form-label">Nome Completo <span>*</span></label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input type="text" name="nome" className={`form-input ${errors.nome ? 'error' : ''}`} placeholder="Seu nome completo" value={formData.nome} onChange={handleChange} />
            </div>
            {errors.nome && <span className="error-message">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">CPF <span>*</span></label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input type="text" name="cpf" className={`form-input ${errors.cpf ? 'error' : ''}`} placeholder="000.000.000-00" value={formData.cpf} onChange={handleChange} maxLength={14} />
            </div>
            {errors.cpf && <span className="error-message">{errors.cpf}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Telefone</label>
            <div className="input-wrapper">
              <Phone size={20} className="input-icon" />
              <input type="tel" name="telefone" className="form-input" placeholder="(00) 00000-0000" value={formData.telefone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">CEP <span>*</span></label>
            <div className="input-wrapper">
              <MapPin size={20} className="input-icon" />
              <input type="text" name="cep" className={`form-input ${errors.cep ? 'error' : ''}`} placeholder="00000-000" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} maxLength={9} />
            </div>
            {errors.cep && <span className="error-message">{errors.cep}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Número <span>*</span></label>
            <div className="input-wrapper">
              <MapPin size={20} className="input-icon" />
              <input type="text" name="numero" className={`form-input ${errors.numero ? 'error' : ''}`} placeholder="Nº" value={formData.numero} onChange={handleChange} />
            </div>
            {errors.numero && <span className="error-message">{errors.numero}</span>}
          </div>

          <div className="form-group full-width">
            <label className="form-label">Endereço</label>
            <div className="input-wrapper">
              <MapPin size={20} className="input-icon" />
              <input type="text" name="endereco" className="form-input" placeholder="Rua, Avenida..." value={formData.endereco} onChange={handleChange} readOnly />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Bairro</label>
            <div className="input-wrapper">
              <MapPin size={20} className="input-icon" />
              <input type="text" name="bairro" className="form-input" value={formData.bairro} onChange={handleChange} readOnly />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cidade/UF</label>
            <div className="input-wrapper">
              <MapPin size={20} className="input-icon" />
              <input type="text" className="form-input" value={`${formData.cidade}${formData.uf ? '/' + formData.uf : ''}`} readOnly />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ocupação</label>
            <div className="input-wrapper">
              <Briefcase size={20} className="input-icon" />
              <input type="text" name="ocupacao" className="form-input" placeholder="Ex: Professor" value={formData.ocupacao} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Interesses</label>
            <div className="input-wrapper">
              <Heart size={20} className="input-icon" />
              <input type="text" name="interesses" className="form-input" placeholder="Ex: Educação, Saúde" value={formData.interesses} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">E-mail <span>*</span></label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input type="email" name="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="seu@email.com" value={formData.email} onChange={handleChange} />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Senha <span>*</span></label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input type="password" name="senha" className={`form-input ${errors.senha ? 'error' : ''}`} placeholder="••••••••" value={formData.senha} onChange={handleChange} />
            </div>
            {errors.senha && <span className="error-message">{errors.senha}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirmar Senha <span>*</span></label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input type="password" name="confirmarSenha" className={`form-input ${errors.confirmarSenha ? 'error' : ''}`} placeholder="••••••••" value={formData.confirmarSenha} onChange={handleChange} />
            </div>
            {errors.confirmarSenha && <span className="error-message">{errors.confirmarSenha}</span>}
          </div>

          <button type="submit" className="btn-submit full-width" disabled={loading}>
            {loading ? <Loader2 className="spin" /> : <>Criar Conta <ArrowRight size={20} /></>}
          </button>
        </form>
      </div>
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
};

export default CadastroCidadao;