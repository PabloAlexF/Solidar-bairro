import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;