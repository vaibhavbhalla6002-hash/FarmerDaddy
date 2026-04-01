import React, { useState } from 'react';
import CropInfo from './CropInfo';
import { Search, Leaf, Droplet, Sun, ArrowUpDown, Cloud, LayoutGrid } from 'lucide-react';


const crops = [
  {
    name: 'Ragi',
    botanical: 'FINGER MILLET',
    icon: Leaf,
    image: '/crops/ragi.png',
    iconColor: '#e08328',
    details: {
      seasonName: 'Kharif Season (Monsoon)',
      sowing: 'June to July',
      harvesting: 'September to October',
      msp: '₹3,846',
      temperature: '20°C - 30°C',
      rainfall: '50 - 100 cm'
    }
  },
  {
    name: 'Rice',
    botanical: 'PADDY',
    icon: Droplet,
    image: '/crops/rice.png',
    iconColor: '#e08328',
    details: {
      seasonName: 'Kharif Season (Monsoon)',
      sowing: 'June to July',
      harvesting: 'November to December',
      msp: '₹2,183',
      temperature: '22°C - 32°C',
      rainfall: '150 - 300 cm'
    }
  },
  {
    name: 'Wheat',
    botanical: 'TRITICUM',
    icon: Sun,
    image: '/crops/wheat.png',
    iconColor: '#e08328',
    details: {
      seasonName: 'Rabi Season (Winter)',
      sowing: 'October to December',
      harvesting: 'February to May',
      msp: '₹2,275',
      temperature: '10°C - 25°C',
      rainfall: '50 - 100 cm'
    }
  },
  {
    name: 'Sugarcane',
    botanical: 'SACCHARUM',
    icon: ArrowUpDown,
    image: '/crops/sugarcane.png',
    iconColor: '#e08328',
    details: {
      seasonName: 'Kharif & Rabi (Annual)',
      sowing: 'January to March / Oct-Nov',
      harvesting: '10 to 18 months',
      msp: '₹315 (FRP)',
      temperature: '21°C - 27°C',
      rainfall: '75 - 150 cm'
    }
  },
  {
    name: 'Cotton',
    botanical: 'GOSSYPIUM',
    image: '/crops/cotton.png',
    icon: Cloud,
    iconColor: '#e08328',
    details: {
      seasonName: 'Kharif Season (Monsoon)',
      sowing: 'April to July',
      harvesting: 'October to January',
      msp: '₹6,620',
      temperature: '21°C - 30°C',
      rainfall: '50 - 100 cm'
    }
  },
  {
    name: 'Maize',
    botanical: 'CORN',
    image: '/crops/maize.png',
    icon: LayoutGrid,
    iconColor: '#e08328',
    details: {
      seasonName: 'Kharif Season (Monsoon)',
      sowing: 'June to July',
      harvesting: 'September to October',
      msp: '₹2,090',
      temperature: '21°C - 27°C',
      rainfall: '50 - 100 cm'
    }
  }
];

const CropSelector = () => {
  const [selectedCrop, setSelectedCrop] = useState(null);

  if (selectedCrop) {
    return <CropInfo crop={selectedCrop} onBack={() => setSelectedCrop(null)} />;
  }

  return (
    <div style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: '28px' }} className="animate-fade-in">
      
      {/* Search Bar */}
      <div style={{
        background: '#eaeaed',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
      }}>
        <Search size={20} color="#6e6b66" />
        <input 
          type="text" 
          placeholder="Search your next harvest..." 
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: '16px',
            width: '100%',
            color: '#2b2723',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '8px',
        MsOverflowStyle: 'none',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }} className="hide-scroll">
        <button style={{
          background: '#df882d',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '24px',
          fontSize: '15px',
          fontWeight: 700,
          whiteSpace: 'nowrap'
        }}>All Crops</button>
        <button style={{
          background: '#f4f3f0',
          color: '#55514c',
          padding: '12px 24px',
          borderRadius: '24px',
          fontSize: '15px',
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }}>Cereals</button>
        <button style={{
          background: '#f4f3f0',
          color: '#55514c',
          padding: '12px 24px',
          borderRadius: '24px',
          fontSize: '15px',
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }}>Commercial</button>
        <button style={{
          background: '#f4f3f0',
          color: '#55514c',
          padding: '12px 24px',
          borderRadius: '24px',
          fontSize: '15px',
          fontWeight: 600,
          whiteSpace: 'nowrap'
        }}>Legumes</button>
      </div>

      {/* Header section */}
      <div>
        <h3 style={{
          fontSize: '12px',
          fontWeight: 800,
          color: '#8b6f52', // brown
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: '8px',
        }}>PLANTING GUIDE</h3>
        <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#2b2a28', marginBottom: '12px', letterSpacing: '-1px' }}>
          What to Grow
        </h2>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#6e6b66' }}>
          Select a crop to see optimized yield projections based on your soil health and local climate data.
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {crops.map((crop, idx) => {
          const Icon = crop.icon;
          return (
              <div key={idx} onClick={() => setSelectedCrop(crop)} style={{
              background: 'white',
              cursor: 'pointer',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                height: '140px',
                backgroundImage: `url(${crop.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} />
              <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#2a2622', marginBottom: '4px' }}>{crop.name}</h4>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#97938e', letterSpacing: '0.5px' }}>{crop.botanical}</p>
                </div>
                <Icon size={18} color={crop.iconColor} />
              </div>
            </div>
          )
        })}
      </div>

    </div>
  );
};

export default CropSelector;
