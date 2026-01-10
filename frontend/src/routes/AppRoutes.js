import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminProtectedRoute from '../components/AdminProtectedRoute';

// Feature-based imports
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import CadastroWrapper from '../pages/Cadastro/CadastroWrapper';
import CadastroCidadaoWrapper from '../pages/Cadastro/CadastroCidadao/CadastroCidadaoWrapper';
import CadastroComercio from '../pages/Cadastro/CadastroComercio/CadastroComercio';
import CadastroFamilia from '../pages/Cadastro/CadastroFamilia/CadastroFamilia';
import CadastroONG from '../pages/Cadastro/CadastroONG/CadastroONG';
import AdminDashboard from '../pages/AdminDashboard';
import QueroAjudar from '../pages/QueroAjudar/ResponsiveQueroAjudar';
import PrecisoDeAjuda from '../pages/PrecisoDeAjuda';
import AchadosEPerdidos from '../pages/AchadosEPerdidos';
import Perfil from '../pages/Perfil';
import Chat from '../pages/Chat';

// Remaining pages (not yet refactored)
import NovoAnuncio from '../pages/NovoAnuncio';
import Conversas from '../pages/Conversas';

import AdminSimple from '../pages/AdminSimple';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/cadastro" element={<CadastroWrapper />} />
      <Route path="/cadastro/cidadao" element={<CadastroCidadaoWrapper />} />
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