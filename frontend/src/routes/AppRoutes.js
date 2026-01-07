import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import QueroAjudar from '../pages/QueroAjudar';
import PrecisoDeAjuda from '../pages/PrecisoDeAjuda';
import AchadosEPerdidos from '../pages/AchadosEPerdidos';
import NovoAnuncio from '../pages/NovoAnuncio';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/quero-ajudar" element={<QueroAjudar />} />
      <Route path="/preciso-de-ajuda" element={<PrecisoDeAjuda />} />
      <Route path="/achados-e-perdidos" element={<AchadosEPerdidos />} />
      <Route path="/achados-e-perdidos/novo" element={<NovoAnuncio />} />
    </Routes>
  );
};

export default AppRoutes;