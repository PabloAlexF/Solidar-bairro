import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsCheckbox({ 
  checked, 
  onChange, 
  id = "termos-check", 
  color = "#10b981", // Cor padrão (verde desktop)
  mobile = false 
}) {
  const checkboxStyle = {
    width: mobile ? '1.5rem' : '1.25rem',
    height: mobile ? '1.5rem' : '1.25rem',
    marginTop: '0.15rem',
    cursor: 'pointer',
    accentColor: color,
    flexShrink: 0
  };

  const labelStyle = {
    fontSize: mobile ? '0.9rem' : '0.95rem',
    color: mobile ? 'var(--v-slate-600, #4b5563)' : '#4b5563',
    cursor: 'pointer',
    lineHeight: mobile ? '1.4' : '1.5'
  };

  const linkStyle = {
    color: color,
    fontWeight: mobile ? '600' : '500',
    textDecoration: mobile ? 'none' : 'underline'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.5rem 0' }}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={checkboxStyle}
      />
      <label htmlFor={id} style={labelStyle}>
        Li e concordo com os <Link to="/termos-uso" target="_blank" style={linkStyle}>Termos de Uso</Link> e a <Link to="/politica-privacidade" target="_blank" style={linkStyle}>Política de Privacidade</Link> do SolidarBairro.
      </label>
    </div>
  );
}