import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import SobreTipos from './pages/SobreTipos';
import RegisterCidadao from './pages/RegisterCidadao';
import RegisterONG from './pages/RegisterONG';
import RegisterComercio from './pages/RegisterComercio';
import Login from './pages/Login';
import Home from './pages/Home';
import CadastroFamilia from './pages/CadastroFamilia';
import PerfilFamilia from './pages/PerfilFamilia';
import AtualizarStatus from './pages/AtualizarStatus';
import PainelSocial from './pages/PainelSocial';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/sobre-tipos" element={<SobreTipos />} />
        <Route path="/cadastro/cidadao" element={<RegisterCidadao />} />
        <Route path="/cadastro/ong" element={<RegisterONG />} />
        <Route path="/cadastro/comercio" element={<RegisterComercio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cadastro-familia" element={<CadastroFamilia />} />
        <Route path="/perfil-familia/:id" element={<PerfilFamilia />} />
        <Route path="/atualizar-status/:id" element={<AtualizarStatus />} />
        <Route path="/painel-social" element={<PainelSocial />} />
      </Routes>
    </Router>
  );
}

export default App;
