import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import RegisterCidadao from '../pages/RegisterCidadao';
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
      <Route path="/cadastro" element={<Register />} />
      <Route path="/cadastro/cidadao" element={<RegisterCidadao />} />
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