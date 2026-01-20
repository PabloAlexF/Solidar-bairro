import React, { useState } from 'react';
import { Button, Input, Card, Loading } from '../components/ui';
import { Heart, User, Search } from 'lucide-react';

const DesignSystemDemo = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    
    setTimeout(() => {
      setErrors(newErrors);
      setLoading(false);
      if (Object.keys(newErrors).length === 0) {
        alert('Formulário enviado com sucesso!');
      }
    }, 2000);
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="sb-container" style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div className="sb-flex sb-items-center sb-justify-center sb-gap-4">
          <Heart size={32} style={{ color: 'var(--sb-primary)' }} />
          <h1 className="sb-text-4xl sb-font-bold">SolidarBairro</h1>
        </div>
        <p className="sb-text-lg" style={{ color: 'var(--sb-gray-600)' }}>Design System Demonstration</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        <Card>
          <Card.Header>
            <h3 className="sb-text-xl sb-font-semibold">Botões</h3>
          </Card.Header>
          <Card.Body>
            <div className="sb-flex sb-flex-col sb-gap-4">
              <Button variant="primary">
                <Heart size={16} />
                Primário
              </Button>
              <Button variant="secondary">
                <User size={16} />
                Secundário
              </Button>
              <Button variant="outline">
                <Search size={16} />
                Outline
              </Button>
              <Button variant="ghost">
                Ghost
              </Button>
              <Button variant="primary" loading>
                Carregando...
              </Button>
              <Button variant="primary" disabled>
                Desabilitado
              </Button>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="sb-text-xl sb-font-semibold">Tamanhos</h3>
          </Card.Header>
          <Card.Body>
            <div className="sb-flex sb-flex-col sb-gap-4">
              <Button size="sm">Pequeno</Button>
              <Button size="base">Base</Button>
              <Button size="lg">Grande</Button>
              <Button size="xl">Extra Grande</Button>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="sb-text-xl sb-font-semibold">Formulário</h3>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit} className="sb-flex sb-flex-col sb-gap-4">
              <Input
                label="Nome completo"
                placeholder="Digite seu nome"
                value={formData.name}
                onChange={handleInputChange('name')}
                error={errors.name}
                required
              />
              
              <Input
                type="email"
                label="Email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={errors.email}
                helperText="Usaremos para entrar em contato"
                required
              />
              
              <Input
                type="password"
                label="Senha"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange('password')}
                error={errors.password}
                required
              />
              
              <Button type="submit" loading={loading}>
                {loading ? 'Enviando...' : 'Enviar'}
              </Button>
            </form>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="sb-text-xl sb-font-semibold">Loading States</h3>
          </Card.Header>
          <Card.Body>
            <div className="sb-flex sb-flex-col sb-gap-6">
              <div>
                <p className="sb-text-sm sb-font-medium" style={{ marginBottom: '0.5rem' }}>Spinner Pequeno</p>
                <Loading size="sm" />
              </div>
              
              <div>
                <p className="sb-text-sm sb-font-medium" style={{ marginBottom: '0.5rem' }}>Spinner Base</p>
                <Loading />
              </div>
              
              <div>
                <p className="sb-text-sm sb-font-medium" style={{ marginBottom: '0.5rem' }}>Spinner Grande</p>
                <Loading size="lg" />
              </div>
              
              <div>
                <p className="sb-text-sm sb-font-medium" style={{ marginBottom: '0.5rem' }}>Com Texto</p>
                <Loading text="Carregando dados..." />
              </div>
              
              <div>
                <p className="sb-text-sm sb-font-medium" style={{ marginBottom: '0.5rem' }}>Skeleton</p>
                <div className="sb-flex sb-flex-col sb-gap-2">
                  <Loading.Skeleton height="20px" />
                  <Loading.Skeleton height="20px" width="80%" />
                  <Loading.Skeleton height="20px" width="60%" />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="sb-text-xl sb-font-semibold">Badges & Estados</h3>
          </Card.Header>
          <Card.Body>
            <div className="sb-flex sb-flex-col sb-gap-4">
              <div className="sb-flex sb-gap-2">
                <span className="sb-badge sb-badge-primary">Primário</span>
                <span className="sb-badge sb-badge-success">Sucesso</span>
                <span className="sb-badge sb-badge-warning">Aviso</span>
                <span className="sb-badge sb-badge-error">Erro</span>
              </div>
              
              <div className="sb-alert sb-alert-success">
                <strong>Sucesso!</strong> Operação realizada com êxito.
              </div>
              
              <div className="sb-alert sb-alert-warning">
                <strong>Atenção!</strong> Verifique os dados informados.
              </div>
              
              <div className="sb-alert sb-alert-error">
                <strong>Erro!</strong> Algo deu errado. Tente novamente.
              </div>
              
              <div className="sb-alert sb-alert-info">
                <strong>Info:</strong> Esta é uma mensagem informativa.
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="sb-text-xl sb-font-semibold">Tipografia</h3>
          </Card.Header>
          <Card.Body>
            <div className="sb-flex sb-flex-col sb-gap-3">
              <h1 className="sb-text-4xl sb-font-bold">Heading 1</h1>
              <h2 className="sb-text-3xl sb-font-semibold">Heading 2</h2>
              <h3 className="sb-text-2xl sb-font-medium">Heading 3</h3>
              <h4 className="sb-text-xl sb-font-medium">Heading 4</h4>
              <p className="sb-text-base">Texto base normal para leitura.</p>
              <p className="sb-text-sm" style={{ color: 'var(--sb-gray-600)' }}>Texto pequeno secundário.</p>
              <p className="sb-text-xs" style={{ color: 'var(--sb-gray-500)' }}>Texto extra pequeno.</p>
            </div>
          </Card.Body>
        </Card>

      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default DesignSystemDemo;