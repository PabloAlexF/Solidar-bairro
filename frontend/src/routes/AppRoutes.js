import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Pages
import Login from '../pages/Login/ResponsiveLoginPage';
import Dashboard from '../pages/LandingPage/index';
import AdminDashboard from '../pages/AdminDashboard/index';
import Cadastro from '../pages/Cadastro/index';
import FamiliaDashboard from '../pages/PerfilFamilia';
import OngDashboard from '../pages/RegisterONG';
import ComercioDashboard from '../pages/RegisterComercio';
import CidadaoDashboard from '../pages/RegisterCidadao';
import Chat from '../pages/Chat/index';
import Conversas from '../pages/Conversas/index';
import Perfil from '../pages/Perfil/index';
import QueroAjudar from '../pages/QueroAjudar/ResponsiveQueroAjudar';
import PrecisoDeAjuda from '../pages/PrecisoDeAjuda/ResponsivePrecisoDeAjuda';
import AchadosEPerdidos from '../pages/AchadosEPerdidos/ResponsiveAchadosEPerdidos';
import PainelSocial from '../pages/PainelSocial/PainelSocialWrapper';
import TermosUso from '../pages/TermosUso';
import PoliticaPrivacidade from '../pages/PoliticaPrivacidade';

// Components
import ProtectedRoute from '../components/ProtectedRoute';
import AdminProtectedRoute from '../components/AdminProtectedRoute';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro/*" element={<Cadastro />} />
      <Route path="/termos-uso" element={<TermosUso />} />
      <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />

      {/* Protected Routes */}
      <Route
        path="/admin/*"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />

      <Route
        path="/familia/*"
        element={
          <ProtectedRoute allowedRoles={['familia']}>
            <FamiliaDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ong/*"
        element={
          <ProtectedRoute allowedRoles={['ong']}>
            <OngDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/comercio/*"
        element={
          <ProtectedRoute allowedRoles={['comercio']}>
            <ComercioDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cidadao/*"
        element={
          <ProtectedRoute allowedRoles={['cidadao']}>
            <CidadaoDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:id"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route
        path="/conversas"
        element={
          <ProtectedRoute>
            <Conversas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/perfil/*"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />

      <Route
        path="/quero-ajudar"
        element={
          <ProtectedRoute>
            <QueroAjudar />
          </ProtectedRoute>
        }
      />

      <Route
        path="/preciso-de-ajuda"
        element={
          <ProtectedRoute>
            <PrecisoDeAjuda />
          </ProtectedRoute>
        }
      />

      <Route
        path="/achados-e-perdidos"
        element={
          <ProtectedRoute>
            <AchadosEPerdidos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/painel-social"
        element={
          <ProtectedRoute>
            <PainelSocial />
          </ProtectedRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}

export default AppRoutes;
