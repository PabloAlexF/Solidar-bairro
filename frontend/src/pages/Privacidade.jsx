import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';
import LandingHeader from '../components/layout/LandingHeader';

export default function Privacidade() {
  return (
    <div className="privacidade-page">
      <LandingHeader scrolled={true} />

      <div className="privacidade-container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '120px 2rem 4rem',
        lineHeight: '1.6'
      }}>
        <div className="privacidade-header" style={{ marginBottom: '3rem' }}>
          <Link
            to="/cadastro"
            className="privacidade-back-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#6b7280',
              textDecoration: 'none',
              marginBottom: '2rem',
              fontSize: '0.9rem'
            }}
          >
            <ArrowLeft size={16} />
            Voltar ao Cadastro
          </Link>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              padding: '0.75rem',
              borderRadius: '12px',
              color: 'white'
            }}>
              <Shield size={24} />
            </div>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0,
                background: 'linear-gradient(135deg, #1e293b, #475569)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Política de Privacidade
              </h1>
              <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div className="privacidade-content" style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div className="privacidade-intro" style={{
            background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <Lock size={24} style={{ color: '#16a34a' }} />
              <h3 style={{ margin: 0, color: '#14532d', fontSize: '1.1rem', fontWeight: '600' }}>
                Seu direito à privacidade é nossa prioridade
              </h3>
            </div>
            <p style={{ margin: 0, color: '#166534', fontSize: '0.95rem' }}>
              Esta política explica como coletamos, usamos e protegemos suas informações pessoais
              em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>

          <div className="privacidade-section" style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Database size={20} />
              1. Informações que Coletamos
            </h2>
            <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
              Coletamos apenas as informações necessárias para conectar pessoas e organizações em ações de solidariedade:
            </p>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1rem' }}>Dados de Cadastro:</h4>
              <ul style={{ color: '#4b5563', margin: 0, paddingLeft: '1.5rem' }}>
                <li>Nome completo, data de nascimento, estado civil</li>
                <li>CPF, RG, NIS (opcional)</li>
                <li>Informações de contato (telefone, e-mail)</li>
                <li>Endereço residencial</li>
              </ul>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1rem' }}>Dados de Uso:</h4>
              <ul style={{ color: '#4b5563', margin: 0, paddingLeft: '1.5rem' }}>
