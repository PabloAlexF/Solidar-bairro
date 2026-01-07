import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import AchadosEPerdidos from '../pages/AchadosEPerdidos';
import NovoAnuncio from '../pages/NovoAnuncio';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/achados-e-perdidos" element={<AchadosEPerdidos />} />
      <Route path="/achados-e-perdidos/novo" element={<NovoAnuncio />} />
    </Routes>
  );
};

export default AppRoutes;