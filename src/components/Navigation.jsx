import React from 'react';
import { LayoutGrid, Leaf, TrendingUp, Calculator, Shield, Camera } from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'crops', label: 'Crops', icon: Leaf },
  { id: 'crop-reader', label: 'Scanner', icon: Camera },
  { id: 'calculator', label: 'Calculator', icon: Calculator },
  { id: 'schemes', label: 'Schemes', icon: Shield },
];

const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      background: 'rgba(255, 255, 255, 0.97)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid #eaeaec',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 8px 20px',
      zIndex: 100,
    }}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: isActive ? '0' : '4px 0',
              background: 'transparent',
              border: 'none',
              position: 'relative',
              cursor: 'pointer',
              minWidth: '56px',
            }}
          >
            {isActive ? (
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e08328, #d97520)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(224, 131, 40, 0.35)',
                marginBottom: '-2px',
                transition: 'all 0.2s ease'
              }}>
                <Icon size={22} strokeWidth={2.5} color="white" />
              </div>
            ) : (
              <Icon size={22} strokeWidth={1.8} color="#8a8884" />
            )}
            
            <span style={{
              fontSize: '10px',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#d97520' : '#8a8884',
              letterSpacing: '0.2px',
              marginTop: isActive ? '2px' : '0px',
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
