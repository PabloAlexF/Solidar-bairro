import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Compass } from 'lucide-react';
import createGlobe from 'cobe';
import './styles.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const canvasRef = useRef();
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  useEffect(() => {
    let phi = 0;
    let width = 0;
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
    window.addEventListener('resize', onResize);
    onResize();
    
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 64,
      height: 64,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 3,
      baseColor: [0.05, 0.2, 0.4],
      markerColor: [1, 0.4, 0.1],
      glowColor: [0.2, 0.6, 1],
      markers: [
        { location: [-23.5505, -46.6333], size: 0.05 },
        { location: [40.7128, -74.006], size: 0.05 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      const userData = JSON.parse(localStorage.getItem('solidar-user'));
      if (userData && userData.tipo === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
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
        navigate('/admin');
        return;
      }
      
      const result = await login(formData.email, formData.senha);
      console.log('Login result:', result);
      
      // Verificar se é admin e redirecionar apropriadamente
      if (result && result.user && result.user.tipo === 'admin') {
        console.log('Admin detected, redirecting to /admin');
        navigate('/admin');
      } else {
        console.log('Regular user, redirecting to /');
        navigate('/');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Creative Background */}
      <div className="bg-overlay">
        <div className="mesh-pattern" />
        <div className="blob blob-1 animate-blob" />
        <div className="blob blob-2 animate-blob animation-delay-2000" />
        <div className="blob blob-3 animate-blob animation-delay-4000" />
      </div>

      {/* Modal Login */}
      <div className="modal-wrapper">
        <div className="modal-card">
          <div className="modal-content">
            
            {/* Left Section: Branding & Welcome */}
            <div className="branding-section section-padding">
              <div className="logo-container">
                <div className="logo-inner">
                  <div className="login-globe-container">
                    <canvas
                      ref={canvasRef}
                      width={64}
                      height={64}
                      style={{ width: "32px", height: "32px", display: "block" }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="branding-content">
                <h1 className="title">
                  Juntos somos <br />
                  <span className="title-accent">mais fortes!</span>
                </h1>
                <p className="subtitle">
                  Acesse sua conta para doar ou solicitar ajuda. Cada gesto faz a diferença na vida de alguém.
                </p>
              </div>

              <div className="social-proof">
                <div className="avatars">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="avatar">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p className="social-text">
                  +20k vidas impactadas
                </p>
              </div>
            </div>

            {/* Right Section: Form */}
            <div className="form-section section-padding">
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="error-alert">
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="email" className="label-text">
                    Identificação Institucional
                  </label>
                  <div className="input-container">
                    <Mail className="input-icon" />
                    <input
                      id="email"
                      name="email"
                      placeholder="seu@email.com"
                      type="email"
                      className="input-field"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="password-header">
                    <label htmlFor="senha" className="label-text password-label">
                      Senha de Acesso
                    </label>
                    <button type="button" className="forgot-password">
                      Esqueceu sua senha?
                    </button>
                  </div>
                  <div className="input-container">
                    <Lock className="input-icon" />
                    <input
                      id="senha"
                      name="senha"
                      placeholder="Sua senha secreta"
                      type={showPassword ? "text" : "password"}
                      className="input-field"
                      value={formData.senha}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="eye-button"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                  <div className="button-gradient" />
                  <div className="button-content">
                    <span>{loading ? 'Entrando...' : 'Entrar agora'}</span>
                    <ArrowRight size={20} />
                  </div>
                </button>
              </form>

              <div className="divider-container">
                <div className="divider">
                  <div className="divider-line" />
                  <span className="divider-text">Novo por aqui?</span>
                  <div className="divider-line" />
                </div>

                <button 
                  className="secondary-button"
                  onClick={() => navigate('/cadastro')}
                >
                  <span className="secondary-button-content">
                    COMEÇAR JORNADA GRATUITA
                    <Compass size={16} className="secondary-button-icon" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer">
          <p className="footer-text">
            © 2026 • Ação Solidária • Transformando vidas com amor
          </p>
          <div className="footer-line" />
        </div>
      </div>
    </div>
  );
};

export default Login;