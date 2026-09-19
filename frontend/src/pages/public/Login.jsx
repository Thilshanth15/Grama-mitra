import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import OfficerSignInModal from '../../components/OfficerSignInModal.jsx';

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/admin" replace />;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0c',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <OfficerSignInModal
        isOpen={true}
        onClose={() => navigate('/')}
      />
    </div>
  );
}
