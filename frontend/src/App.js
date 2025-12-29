import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quero-ajudar" element={<QueroAjudar />} />
        <Route path="/preciso-de-ajuda" element={<PrecisoDeAjuda />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/necessidade/:id" element={<DetalhesNecessidade />} />
        <Route path="/pedido-publicado" element={<PedidoPublicado />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/sobre-tipos" element={<SobreTipos />} />
        <Route path="/cadastro/cidadao" element={<RegisterCidadao />} />
        <Route path="/cadastro/ong" element={<RegisterONG />} />
        <Route path="/cadastro/comercio" element={<RegisterComercio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro-familia" element={<CadastroFamilia />} />
        <Route path="/perfil-familia/:id" element={<PerfilFamilia />} />
        <Route path="/atualizar-status/:id" element={<AtualizarStatus />} />
        <Route path="/painel-social" element={<PainelSocial />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;
