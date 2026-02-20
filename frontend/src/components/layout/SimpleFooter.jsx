import React from 'react';
import { Link } from 'react-router-dom';

const SimpleFooter = () => {
  return (
    <footer style={{
      background: '#f8fafc',
      borderTop: '1px solid #e2e8f0',
      padding: '2rem 1rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Link
            to="/politica-privacidade"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#10b981'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            Política de Privacidade
          </Link>
          <Link
            to="/termos-uso"
            style={{
              color: '#64748b',
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#10b981'}
            onMouseLeave={(e) => e.target.style.color = '#64748b'}
          >
            Termos de Uso
          </Link>
        </div>
        <p style={{
          color: '#94a3b8',
          fontSize: '0.875rem',
          margin: 0,
          textAlign: 'center'
        }}>
          © {new Date().getFullYear()} SolidarBrasil. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default SimpleFooter;
