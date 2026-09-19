import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Background3D from '../components/3d/Background3D.jsx';

export default function PublicLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#030305', color: '#ffffff', position: 'relative', overflowX: 'hidden' }}>
      <Background3D />
      <Navbar />
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

