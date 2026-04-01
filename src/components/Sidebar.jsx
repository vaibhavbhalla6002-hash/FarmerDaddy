import React from 'react';
import { X, LayoutGrid, Leaf, Calculator, Shield, Camera, TrendingUp, LogIn, UserPlus, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const token = localStorage.getItem('token');
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'crops', label: 'Crops', icon: Leaf },
    { id: 'crop-reader', label: 'Crop Scanner', icon: Camera },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'schemes', label: 'Schemes', icon: Shield },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
  ];

  if (!token) {
    navItems.push({ id: 'login', label: 'Login', icon: LogIn });
    navItems.push({ id: 'signup', label: 'Sign Up', icon: UserPlus });
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setActiveTab('dashboard');
    onClose();
    alert('Logged out successfully');
  };

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(3px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
          zIndex: 998,
        }}
      />

      {/* Sidebar Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          maxWidth: '80vw',
          backgroundColor: '#f6f5f3',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 20px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        }}>
          <div>
            <p style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#8b6f52',
              marginBottom: '2px'
            }}>
              FarmerDaddy
            </p>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 900,
              color: '#1a232c',
              letterSpacing: '-0.5px',
              margin: 0
            }}>
              Navigator
            </h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={24} color="#8b6f52" />
          </button>
        </div>

        <div style={{ padding: '24px 16px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    width: '100%',
                    background: isActive ? 'linear-gradient(135deg, #e08328, #d97520)' : 'transparent',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: isActive ? 'white' : '#5c554d',
                    boxShadow: isActive ? '0 8px 20px rgba(224, 131, 40, 0.25)' : 'none',
                  }}
                >
                  <Icon size={22} color={isActive ? 'white' : '#8a8884'} />
                  <span style={{
                    fontSize: '16px',
                    fontWeight: isActive ? 700 : 600,
                  }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div style={{ padding: '24px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          {token && (
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px',
                background: '#fef2f2',
                color: '#ef4444',
                border: '1px solid #fee2e2',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '16px',
                fontSize: '14px'
              }}
            >
              <LogOut size={18} /> Logout
            </button>
          )}
          <p style={{ fontSize: '12px', color: '#a09d98', textAlign: 'center', margin: 0 }}>
            FarmerDaddy v1.0.0
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
