import React from 'react';
import LandingHeader from './LandingHeader';
import './Layout.css';

const Layout = ({ children, showHeader = true }) => {
  return (
    <div className="app-layout">
      {showHeader && <LandingHeader />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;