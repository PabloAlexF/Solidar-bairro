import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './MobileLogin.css';
import logo from '../../assets/images/marca.png';

const MobileLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({}); // State for validation errors

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'O email é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'O formato do email é inválido.';
    }

    if (!password) {
      newErrors.password = 'A senha é obrigatória.';
    } else if (password.length < 6) {
        newErrors.password = 'A senha deve ter no mínimo 6 caracteres.';
    }
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({}); // Clear previous errors

    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Login successful, navigate to home page
        navigate('/'); // Go to initial/home page after login
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ api: error.message || "Email ou senha inválidos." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-login-container">
      <header className="mobile-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
      </header>

      <div className="brand-section">
        <div className="mobile-logo-container">
          <img src={logo} alt="SolidarBairro" className="brand-logo" />
        </div>
        <h1 className="brand-title">Bem-vindo de volta!</h1>
        <p className="brand-subtitle">Acesse sua conta para continuar conectando com sua comunidade.</p>
      </div>

      <form className="login-form" onSubmit={handleLogin} noValidate>
        {errors.api && <div className="api-error-alert">{errors.api}</div>}

        <div className="input-group">
          <label className="input-label" htmlFor="email">Email</label>
          <div className="input-field-wrapper">
            <Mail className="input-icon" size={20} />
            <input 
              id="email"
              type="email" 
              className={`input-field ${errors.email ? 'has-error' : ''}`}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        {errors.email && <span className="error-message">{errors.email}</span>}

        <div className="input-group">
          <label className="input-label" htmlFor="password">Senha</label>
          <div className="input-field-wrapper">
            <Lock className="input-icon" size={20} />
            <input 
              id="password"
              type={showPassword ? "text" : "password"} 
              className={`input-field ${errors.password ? 'has-error' : ''}`}
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className="btn-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
          <button type="button" className="forgot-password">
            Esqueceu a senha?
          </button>
        </div>

        <button type="submit" className="btn-login" disabled={isLoading}>
          {isLoading ? (
            <div className="spinner" />
          ) : (
            <>
              <span>Entrar na conta</span>
              <LogIn size={20} />
            </>
          )}
        </button>
      </form>

      <div className="footer-section">
        <div className="divider">
          <span>Ainda não tem uma conta?</span>
        </div>
        <button className="btn-register" onClick={() => navigate('/cadastro')}>
          <UserPlus size={20} style={{ marginRight: 8 }} />
          Criar conta gratuita
        </button>
      </div>
    </div>
  );
};

export default MobileLogin;