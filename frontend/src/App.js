import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import QueroAjudar from './pages/QueroAjudar';
import PrecisoDeAjuda from './pages/PrecisoDeAjuda';
import Pedidos from './pages/Pedidos';
import DetalhesNecessidade from './pages/DetalhesNecessidade';
import PedidoPublicado from './pages/PedidoPublicado';
import Landing from './pages/Landing';
import Register from './pages/Register';
import SobreTipos from './pages/SobreTipos';
import RegisterCidadao from './pages/RegisterCidadao';
import RegisterONG from './pages/RegisterONG';
import RegisterComercio from './pages/RegisterComercio';
import Login from './pages/Login';
import CadastroFamilia from './pages/CadastroFamilia';
import PerfilFamilia from './pages/PerfilFamilia';
import AtualizarStatus from './pages/AtualizarStatus';
import PainelSocial from './pages/PainelSocial';
import Perfil from './pages/Perfil';
import './styles/index.css';
import './styles/globals.css';
import './styles/colors.css';

function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/landing" element={<Layout showHeader={false}><Landing /></Layout>} />
      <Route path="/cadastro" element={<Layout><Register /></Layout>} />
      <Route path="/sobre-tipos" element={<Layout><SobreTipos /></Layout>} />
      <Route path="/cadastro/cidadao" element={<Layout><RegisterCidadao /></Layout>} />
      <Route path="/cadastro/ong" element={<Layout><RegisterONG /></Layout>} />
      <Route path="/cadastro/comercio" element={<Layout><RegisterComercio /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/cadastro-familia" element={<Layout><CadastroFamilia /></Layout>} />
      
      {/* Rotas protegidas */}
      <Route path="/quero-ajudar" element={<Layout><ProtectedRoute><QueroAjudar /></ProtectedRoute></Layout>} />
      <Route path="/preciso-de-ajuda" element={<Layout><ProtectedRoute><PrecisoDeAjuda /></ProtectedRoute></Layout>} />
      <Route path="/pedidos" element={<Layout><ProtectedRoute><Pedidos /></ProtectedRoute></Layout>} />
      <Route path="/necessidade/:id" element={<Layout><ProtectedRoute><DetalhesNecessidade /></ProtectedRoute></Layout>} />
      <Route path="/pedido-publicado" element={<Layout><ProtectedRoute><PedidoPublicado /></ProtectedRoute></Layout>} />
      <Route path="/perfil-familia/:id" element={<Layout><ProtectedRoute><PerfilFamilia /></ProtectedRoute></Layout>} />
      <Route path="/atualizar-status/:id" element={<Layout><ProtectedRoute><AtualizarStatus /></ProtectedRoute></Layout>} />
      <Route path="/painel-social" element={<Layout><ProtectedRoute><PainelSocial /></ProtectedRoute></Layout>} />
      <Route path="/perfil" element={<Layout><ProtectedRoute><Perfil /></ProtectedRoute></Layout>} />
    </Routes>
  );
}

export default App;
