import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminProtectedRoute from '../components/AdminProtectedRoute';

// Feature-based imports
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import CadastroCidadao from '../pages/Cadastro/components/CadastroCidadao';
import CadastroComercio from '../pages/Cadastro/components/CadastroComercio';
import CadastroFamilia from '../pages/Cadastro/components/CadastroFamilia';
import CadastroONG from '../pages/Cadastro/components/CadastroONG';
import AdminDashboard from '../pages/AdminDashboard';
import QueroAjudar from '../pages/QueroAjudar';
import PrecisoDeAjuda from '../pages/PrecisoDeAjuda';
import AchadosEPerdidos from '../pages/AchadosEPerdidos';
import Perfil from '../pages/Perfil';
import Chat from '../pages/Chat';

// Remaining pages (not yet refactored)
import NovoAnuncio from '../pages/NovoAnuncio';
import Conversas from '../pages/Conversas';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/cadastro/cidadao" element={<CadastroCidadao />} />
      <Route path="/cadastro/comercio" element={<CadastroComercio />} />
      <Route path="/cadastro/familia" element={<CadastroFamilia />} />
      <Route path="/cadastro/ong" element={<CadastroONG />} />
      <Route path="/quero-ajudar" element={<Layout showHeader={false}><QueroAjudar /></Layout>} />
      <Route path="/preciso-de-ajuda" element={<Layout showHeader={false}><PrecisoDeAjuda /></Layout>} />
      <Route path="/achados-e-perdidos" element={<AchadosEPerdidos />} />
      <Route path="/achados-e-perdidos/novo" element={<Layout><NovoAnuncio /></Layout>} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/chat/:id" element={<Layout><Chat /></Layout>} />
    </Routes>
  );
};

export default AppRoutes;