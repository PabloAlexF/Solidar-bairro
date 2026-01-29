import React, { useState } from 'react';
import { Store, Mail, Phone, MapPin, Lock, ArrowRight, Loader2, ArrowLeft, FileText, User, Camera } from 'lucide-react';
import Toast from '../../../components/ui/Toast';

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
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({ ...prev, endereco: data.logradouro, bairro: data.bairro, cidade: data.localidade, uf: data.uf }));
        }
      } catch (error) { console.error("Erro CEP"); }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nomeEstabelecimento) newErrors.nomeEstabelecimento = 'Nome obrigatório';
    if (!formData.cnpj) newErrors.cnpj = 'CNPJ obrigatório';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
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
        body: JSON.stringify({ type: 'comercio', ...formData })
      });
      if (!response.ok) throw new Error('Erro ao cadastrar');
      setToast({ show: true, message: 'Cadastro realizado com sucesso!', type: 'success' });
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (error) {
      setToast({ show: true, message: error.message, type: 'error' });
    } finally { setLoading(false); }
  };

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