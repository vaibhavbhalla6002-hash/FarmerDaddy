import React from 'react';
import { ArrowLeft, Calendar, IndianRupee, ThermometerSun, Droplet } from 'lucide-react';

const CropInfo = ({ crop, onBack }) => {
  return (
    <div style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={onBack}
          style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <ArrowLeft size={20} color="#2b2a28" />
        </button>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#2b2a28', margin: 0 }}>{crop.name} Profile</h2>
      </div>

      {/* Hero Image */}
      <div style={{ width: '100%', height: '220px', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
        <img src={crop.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={crop.name} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '20px' }}>
          <h1 style={{ color: 'white', fontSize: '32px', margin: 0, fontWeight: 900 }}>{crop.name}</h1>
          <p style={{ color: '#eaeaed', fontSize: '14px', margin: 0, fontWeight: 600 }}>{crop.botanical}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {/* Season Info */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} color="#0284c7" />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#2b2a28' }}>Best Season to Grow</h3>
          </div>
          <p style={{ margin: 0, fontSize: '16px', color: '#4a4641', lineHeight: '1.5', fontWeight: 500 }}>
            <strong style={{ color: '#2b2a28' }}>{crop.details.seasonName}</strong>
            <br />
            Sowing: {crop.details.sowing}
            <br />
            Harvesting: {crop.details.harvesting}
          </p>
        </div>

        {/* MSP Info */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#def7ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IndianRupee size={20} color="#059669" />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#2b2a28' }}>Govt. MSP (2024-25)</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ margin: 0, fontSize: '36px', fontWeight: 900, color: '#059669' }}>{crop.details.msp}</h2>
            <span style={{ fontSize: '16px', color: '#6e6b66', fontWeight: 600 }}>/ quintal</span>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6e6b66' }}>
            Minimum Support Price declared by the Cabinet Committee on Economic Affairs (CCEA).
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <ThermometerSun size={24} color="#d9822a" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '12px', color: '#8b6f52', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Temperature</div>
            <div translate="no" style={{ fontSize: '16px', fontWeight: 700, color: '#2b2a28', margin: 0, whiteSpace: 'normal', wordWrap: 'break-word' }}>{crop.details.temperature}</div>
          </div>
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <Droplet size={24} color="#0284c7" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '12px', color: '#8b6f52', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Rainfall</div>
            <div translate="no" style={{ fontSize: '16px', fontWeight: 700, color: '#2b2a28', margin: 0, whiteSpace: 'normal', wordWrap: 'break-word' }}>{crop.details.rainfall}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropInfo;
