import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function PublicLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000000', color: '#ffffff' }}>
      <Navbar />
      <main style={{ flex: 1, background: '#000000' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
