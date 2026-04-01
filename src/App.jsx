import React, { useState } from 'react';
import './index.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import CropSelector from './pages/CropSelector';
import CropReader from './pages/CropReader';
import Calculator from './pages/Calculator';
import Schemes from './pages/Schemes';
import Markets from './pages/Markets';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Sidebar from './components/Sidebar';

const headerConfig = {
  dashboard:   { line1: 'PRECISION FARMING', line2: 'Digital Agronomist', showUser: false },
  crops:       { line1: 'CROP SELECTOR', line2: 'Digital Agronomist', showUser: true },
  'crop-reader': { line1: 'CROP SCANNER', line2: 'Disease AI Reader', showUser: true },
  calculator:  { line1: 'FARMING TOOLS', line2: 'Digital Agronomist', showUser: true },
  schemes:     { line1: 'GOVT SCHEMES', line2: 'Digital Agronomist', showUser: true },
  markets:     { line1: 'LIVE MARKETS', line2: 'Current Prices', showUser: true },
  login:       { line1: 'WELCOME BACK', line2: 'Login to Continue', showUser: false },
  signup:      { line1: 'JOIN US', line2: 'Create an Account', showUser: false }
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const config = headerConfig[activeTab] || headerConfig['dashboard'];

  const renderPage = () => {
    switch (activeTab) {
      case 'login':
        return <Login setActiveTab={setActiveTab} />;
      case 'signup':
        return <Signup setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'crops':
        return <CropSelector />;
      case 'crop-reader':
        return <CropReader />;
      case 'calculator':
        return <Calculator />;
      case 'schemes':
        return <Schemes />;
      case 'markets':
        return <Markets />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      <Header
        titleLine1={config.line1}
        titleLine2={config.line2}
        showUserIcon={config.showUser}
        onMenuClick={() => setIsSidebarOpen(true)}
        onUserClick={() => setActiveTab('login')}
      />
      <main style={{ flex: 1, overflowY: 'auto', background: '#f6f5f3' }}>
        {renderPage()}
      </main>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
