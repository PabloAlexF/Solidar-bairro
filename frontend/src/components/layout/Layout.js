import React from 'react';
import Header from './Header';
const Layout = ({ children, showHeader = true }) => {
  return (
    <div className="app-layout">
      {showHeader && <Header />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;