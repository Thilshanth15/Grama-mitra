import React, { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';

// Public pages
import Home from './pages/public/Home.jsx';
import Services from './pages/public/Services.jsx';
import HowItWorks from './pages/public/HowItWorks.jsx';
import VoiceAssistant from './pages/public/VoiceAssistant.jsx';
import About from './pages/public/About.jsx';
import Contact from './pages/public/Contact.jsx';
import Login from './pages/public/Login.jsx';
import CommunityMap from './pages/public/CommunityMap.jsx';

// Admin pages
import AdminOverview from './pages/admin/AdminOverview.jsx';
import UserQueries from './pages/admin/UserQueries.jsx';
import KnowledgeBase from './pages/admin/KnowledgeBase.jsx';
import Handoffs from './pages/admin/Handoffs.jsx';
import SafetyAlerts from './pages/admin/SafetyAlerts.jsx';
import CallLogs from './pages/admin/CallLogs.jsx';
import Analytics from './pages/admin/Analytics.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import Hotspots from './pages/admin/Hotspots.jsx';

// Officer pages
import DistrictBlockLogin from './pages/officer/DistrictBlockLogin.jsx';
import DistrictBlockDashboard from './pages/officer/DistrictBlockDashboard.jsx';
import VillageOfficerLogin from './pages/officer/VillageOfficerLogin.jsx';
import VillageOfficerDashboard from './pages/officer/VillageOfficerDashboard.jsx';

// Auth context
import { useAuth } from './hooks/useAuth.js';

// Auth context for sharing
export const AuthContext = createContext(null);

function App() {
  const auth = useAuth();

  return (
    <LanguageProvider>
      <AuthContext.Provider value={auth}>
        <BrowserRouter>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/assistant" element={<VoiceAssistant />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/community-map" element={<CommunityMap />} />

          {/* District / Block Officer routes */}
          <Route path="/officer/district-block/login" element={<DistrictBlockLogin />} />
          <Route path="/officer/district-block/dashboard" element={<DistrictBlockDashboard />} />

          {/* Village Officer routes */}
          <Route path="/officer/village/login" element={<VillageOfficerLogin />} />
          <Route path="/officer/village/dashboard" element={<VillageOfficerDashboard />} />

          {/* Admin routes — protected by AdminLayout */}
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/hotspots" element={<Hotspots />} />
          <Route path="/admin/queries" element={<UserQueries />} />
          <Route path="/admin/knowledge" element={<KnowledgeBase />} />
          <Route path="/admin/handoffs" element={<Handoffs />} />
          <Route path="/admin/safety" element={<SafetyAlerts />} />
          <Route path="/admin/calls" element={<CallLogs />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* 404 fallback */}
          <Route path="*" element={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--gray-300)' }}>404</div>
              <h1 style={{ fontSize: '1.5rem', color: 'var(--gray-900)' }}>Page not found</h1>
              <a href="/" className="btn btn-primary">Go Home</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  </LanguageProvider>
  );
}

export default App;
