import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
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
      <Route path="/solidar-bairro" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<CadastroWrapper />} />
      <Route path="/cadastro/cidadao" element={<CadastroCidadaoWrapper />} />
      <Route path="/cadastro/comercio" element={<CadastroComercio />} />
      <Route path="/cadastro/familia" element={<CadastroFamilia />} />
      <Route path="/cadastro/ong" element={<CadastroONG />} />
      
      {/* Rotas protegidas */}
      <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
      <Route path="/quero-ajudar" element={<ProtectedRoute><QueroAjudar /></ProtectedRoute>} />
      <Route path="/preciso-de-ajuda" element={<ProtectedRoute><PrecisoDeAjuda /></ProtectedRoute>} />
      <Route path="/achados-e-perdidos" element={<ProtectedRoute><AchadosEPerdidos /></ProtectedRoute>} />
      <Route path="/achados-e-perdidos/novo" element={<ProtectedRoute><Layout><NovoAnuncio /></Layout></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
      <Route path="/conversas" element={<ProtectedRoute><Conversas /></ProtectedRoute>} />
      <Route path="/chat/:id" element={<ProtectedRoute><Layout showHeader={false}><Chat /></Layout></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRoutes;