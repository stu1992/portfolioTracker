import React from 'react';
import Header from '../components/layout/HeaderLoggedIn';

const LayoutDefault = ({ children }) => (
  <>
    <Header navPosition="right" className="reveal-from-bottom" />
    <main className="site-content">
      {children}
    </main>
  </>
);

export default LayoutDefault;
