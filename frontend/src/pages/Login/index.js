import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Heart, ArrowRight, LogIn, Users, ShieldCheck, Sparkles } from 'lucide-react';
import './styles.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Usuário temporário para admin
      if (formData.email === 'admin@solidar.com' && formData.senha === 'admin123') {
        localStorage.setItem('authToken', 'admin-token');
        localStorage.setItem('userRole', 'admin');
        navigate('/admin/dashboard');
        return;
      }
      
      await login(formData.email, formData.senha);
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-view-root">
      <div className="login-layout-wrapper">
        {/* Lado Esquerdo - Visual/Informações (Apenas Desktop) */}
        <div className="login-visual-panel">
          <div className="login-mesh-bg">
            <div className="login-mesh-orb orb-1"></div>
            <div className="login-mesh-orb orb-2"></div>
            <div className="login-mesh-orb orb-3"></div>
          </div>
          
          <div className="login-visual-content">
            <div className="login-visual-badge">
              <Sparkles size={16} />
              <span>Rede de Solidariedade</span>
            </div>
            
            <h2 className="login-visual-title">
              Onde cada <span className="text-gradient">conexão</span> gera um <span className="text-gradient">impacto</span> real.
            </h2>
            <p className="login-visual-description">
              Faça parte da maior rede de colaboração social. Sua jornada para transformar o mundo começa com um clique.
            </p>
            
            <div className="login-visual-cards">
              <div className="login-glass-card">
                <div className="login-card-icon">
                  <Users size={24} />
                </div>
                <div className="login-card-info">
                  <span className="login-card-label">Membros Ativos</span>
                  <span className="login-card-value">+15.000</span>
                </div>
              </div>
              
              <div className="login-glass-card">
                <div className="login-card-icon">
                  <ShieldCheck size={24} />
                </div>
                <div className="login-card-info">
                  <span className="login-card-label">Segurança Total</span>
                  <span className="login-card-value">Criptografado</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="login-visual-footer-glass">
            <div className="login-visual-avatars">
              <div className="login-avatar" style={{ background: 'linear-gradient(45deg, #10b981, #34d399)' }} />
              <div className="login-avatar" style={{ background: 'linear-gradient(45deg, #f97316, #fbbf24)' }} />
              <div className="login-avatar" style={{ background: 'linear-gradient(45deg, #8b5cf6, #a78bfa)' }} />
              <div className="login-avatar-plus">+500</div>
            </div>
            <p className="login-avatars-text">Junte-se a <strong>milhares de voluntários</strong> hoje mesmo.</p>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="login-form-panel">
          <div className="login-box-container animate-fade-in">
            <div className="login-header">
              <div className="login-brand-icon">
                <Heart size={24} fill="currentColor" />
              </div>
              <h1 className="login-title">Fazer Login</h1>
              <p className="login-subtitle">Acesse sua conta para continuar</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {error && (
                <div className="error-alert">
                  <span>{error}</span>
                </div>
              )}
              
              <div className="login-input-group">
                <label className="login-label">E-mail ou telefone</label>
                <div className="login-input-wrapper">
                  <Mail className="login-input-icon" size={18} />
                  <input 
                    type="text" 
                    name="email"
                    className="login-field"
                    placeholder="Digite seu e-mail ou telefone"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label className="login-label">Senha</label>
                <div className="login-input-wrapper">
                  <Lock className="login-input-icon" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="senha"
                    className="login-field"
                    placeholder="Digite sua senha"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                  />
                  <button 
                    type="button" 
                    className="login-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                <span>{loading ? 'Entrando...' : 'Entrar na plataforma'}</span>
                <LogIn size={18} />
              </button>
            </form>

            <div className="login-divider">Ou</div>

            <div className="login-footer-section">
              <p className="login-footer-text">Ainda não faz parte da comunidade?</p>
              <button 
                className="login-create-acc-btn"
                onClick={() => navigate('/cadastro')}
              >
                Criar conta gratuita
                <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </button>
              <p className="login-footer-tagline">
                <Heart size={14} className="login-heart-icon" fill="currentColor" />
                Junte-se à rede de solidariedade
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decoração de fundo adaptada */}
      <div className="login-bg-decoration">
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
      </div>
    </div>
  );
};

export default Login;