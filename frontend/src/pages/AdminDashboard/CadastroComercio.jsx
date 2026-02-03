import React, { useState } from 'react';
import { Store, Mail, Phone, MapPin, Lock, ArrowRight, Loader2, ArrowLeft, FileText, User, Camera } from 'lucide-react';
import Toast from '../../../components/ui/Toast';
import { useCEP } from './useCEP';

const CadastroComercio = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    nomeEstabelecimento: '', cnpj: '', segmento: '', responsavel: '',
    email: '', telefone: '', senha: '', confirmarSenha: '',
    cep: '', endereco: '', numero: '', bairro: '', cidade: '', uf: ''
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
      setFormData(prev => ({ ...prev, logo: file }));
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
        setFormData(prev => ({ ...prev, endereco: logradouro, bairro, cidade: localidade, uf }));
      }
    }
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', color: '#e2e8f0', width: '0%' };
    const isValid = pass.length >= 6 && /[a-zA-Z]/.test(pass) && /\d/.test(pass);
    if (!isValid) return { label: 'Fraca', color: '#ef4444', width: '33%' };
    if (pass.length >= 8) return { label: 'Forte', color: '#10b981', width: '100%' };
    return { label: 'Média', color: '#f59e0b', width: '66%' };
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nomeEstabelecimento) newErrors.nomeEstabelecimento = 'Nome obrigatório';
    if (!formData.cnpj) newErrors.cnpj = 'CNPJ obrigatório';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.senha || formData.senha.length < 6 || !/[a-zA-Z]/.test(formData.senha) || !/\d/.test(formData.senha)) newErrors.senha = 'Mínimo 6 caracteres, letras e números';
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
        body: JSON.stringify({ type: 'comercio', ...formData })
      });
      if (!response.ok) throw new Error('Erro ao cadastrar');
      setToast({ show: true, message: 'Cadastro realizado com sucesso!', type: 'success' });
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (error) {
      setToast({ show: true, message: error.message, type: 'error' });
    } finally { setLoading(false); }
  };

  const strength = getPasswordStrength(formData.senha);

  return (
    <div className="cadastro-wrapper">
      <div className="cadastro-container">
        <button onClick={onBack} className="btn-back"><ArrowLeft size={20} /> Voltar</button>
        <div className="cadastro-header">
          <h2 className="cadastro-title">Parceiro Comercial</h2>
          <p className="cadastro-subtitle">Cadastre seu estabelecimento e apoie a comunidade</p>
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
              <img src={preview} alt="Logo" className="profile-image-preview" />
            ) : (
              <Camera size={32} className="profile-upload-icon" />
            )}
          </label>
        </div>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group full-width">
            <label className="form-label">Nome do Estabelecimento <span>*</span></label>
            <div className="input-wrapper">
              <Store size={20} className="input-icon" />
              <input type="text" name="nomeEstabelecimento" className={`form-input ${errors.nomeEstabelecimento ? 'error' : ''}`} value={formData.nomeEstabelecimento} onChange={handleChange} />
            </div>
            {errors.nomeEstabelecimento && <span className="error-message">{errors.nomeEstabelecimento}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">CNPJ <span>*</span></label>
            <div className="input-wrapper">
              <FileText size={20} className="input-icon" />
              <input type="text" name="cnpj" className={`form-input ${errors.cnpj ? 'error' : ''}`} value={formData.cnpj} onChange={handleChange} maxLength={18} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Segmento</label>
            <div className="input-wrapper">
              <Store size={20} className="input-icon" />
              <input type="text" name="segmento" className="form-input" placeholder="Ex: Mercado, Farmácia" value={formData.segmento} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Nome do Responsável</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input type="text" name="responsavel" className="form-input" value={formData.responsavel} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Telefone</label>
            <div className="input-wrapper">
              <Phone size={20} className="input-icon" />
              <input type="tel" name="telefone" className="form-input" value={formData.telefone} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">CEP <span>*</span></label>
            <div className="input-wrapper">
              <MapPin size={20} className="input-icon" />
              <input type="text" name="cep" className={`form-input ${errors.cep ? 'error' : ''}`} value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} maxLength={9} />
            </div>
            {errors.cep && <span className="error-message">{errors.cep}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Número <span>*</span></label>
            <div className="input-wrapper">
              <MapPin size={20} className="input-icon" />
              <input type="text" name="numero" className={`form-input ${errors.numero ? 'error' : ''}`} value={formData.numero} onChange={handleChange} />
            </div>
            {errors.numero && <span className="error-message">{errors.numero}</span>}
          </div>
          <div className="form-group full-width">
            <label className="form-label">Endereço</label>
            <div className="input-wrapper">
              <MapPin size={20} className="input-icon" />
              <input type="text" name="endereco" className="form-input" value={formData.endereco} readOnly />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bairro</label>
            <div className="input-wrapper">
              <MapPin size={20} className="input-icon" />
              <input type="text" name="bairro" className="form-input" value={formData.bairro} readOnly />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Cidade/UF</label>
            <div className="input-wrapper">
              <MapPin size={20} className="input-icon" />
              <input type="text" className="form-input" value={`${formData.cidade}/${formData.uf}`} readOnly />
            </div>
          </div>
          <div className="form-group full-width">
            <label className="form-label">E-mail <span>*</span></label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input type="email" name="email" className={`form-input ${errors.email ? 'error' : ''}`} value={formData.email} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Senha <span>*</span></label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input type="password" name="senha" className={`form-input ${errors.senha ? 'error' : ''}`} value={formData.senha} onChange={handleChange} />
            </div>
            {formData.senha && (
              <div style={{ marginTop: '6px' }}>
                <div style={{ height: '4px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: strength.width, backgroundColor: strength.color, transition: 'all 0.3s ease' }} />
                </div>
                <span style={{ fontSize: '11px', color: strength.color, marginTop: '4px', display: 'block', textAlign: 'right', fontWeight: '600' }}>{strength.label}</span>
              </div>
            )}
            {errors.senha && <span className="error-message">{errors.senha}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirmar Senha <span>*</span></label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input type="password" name="confirmarSenha" className={`form-input ${errors.confirmarSenha ? 'error' : ''}`} value={formData.confirmarSenha} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className="btn-submit full-width" disabled={loading}>{loading ? <Loader2 className="spin" /> : <>Cadastrar Comércio <ArrowRight size={20} /></>}</button>
        </form>
      </div>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
};
export default CadastroComercio;