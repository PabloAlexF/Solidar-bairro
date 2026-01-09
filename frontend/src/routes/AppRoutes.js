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

// Other pages (to be refactored)
import AdminDashboard from '../pages/AdminDashboard';
import QueroAjudar from '../pages/QueroAjudar';
import PrecisoDeAjuda from '../pages/PrecisoDeAjuda';
import AchadosEPerdidos from '../pages/AchadosEPerdidos';
import NovoAnuncio from '../pages/NovoAnuncio';
import Perfil from '../pages/Perfil';
import Conversas from '../pages/Conversas';
import Chat from '../pages/Chat';

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
      <Route path="/quero-ajudar" element={<Layout><QueroAjudar /></Layout>} />
      <Route path="/preciso-de-ajuda" element={<Layout><PrecisoDeAjuda /></Layout>} />
      <Route path="/achados-e-perdidos" element={<AchadosEPerdidos />} />
      <Route path="/achados-e-perdidos/novo" element={<Layout><NovoAnuncio /></Layout>} />
      <Route path="/perfil" element={<Layout><Perfil /></Layout>} />
      <Route path="/conversas" element={<Conversas />} />
      <Route path="/chat/:id" element={<Layout><Chat /></Layout>} />
    </Routes>
  );
};

export default AppRoutes;