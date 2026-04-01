import React, { useState, useEffect } from 'react';
import { Menu, Smartphone, Bell, X, CloudRain, Droplets } from 'lucide-react';

const Header = ({ titleLine1, titleLine2, showUserIcon = false, onMenuClick, onUserClick }) => {
  const [lang, setLang] = useState('en');
  const [precipitationChance, setPrecipitationChance] = useState(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (document.cookie.includes('googtrans=/en/hi') || document.cookie.includes('googtrans=/auto/hi')) {
      setLang('hi');
    }

    const fetchWeather = async (lat = 28.6139, lon = 77.2090) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_probability_max&timezone=auto`);
        const data = await res.json();
        if (data && data.daily && data.daily.precipitation_probability_max) {
          setPrecipitationChance(data.daily.precipitation_probability_max[1]);
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setIsLoadingInsight(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log('Using default location for weather');
          fetchWeather();
        }
      );
    } else {
      fetchWeather();
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    document.cookie = `googtrans=/en/${newLang}; path=/`;
    document.cookie = `googtrans=/auto/${newLang}; path=/`;
    document.cookie = `googtrans=/en/${newLang}; domain=${window.location.hostname}; path=/`;
    document.cookie = `googtrans=/auto/${newLang}; domain=${window.location.hostname}; path=/`;
    setLang(newLang);
    window.location.reload();
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 20px',
      position: 'sticky',
      top: 0,
      background: 'rgba(246, 245, 243, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 50,
    }}>
      <button 
        onClick={onMenuClick}
        style={{ 
          padding: '8px', 
          marginLeft: '-8px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}>
        <Menu color="#92623e" size={24} />
      </button>

      <div style={{ flex: 1, marginLeft: '12px' }}>
        <p style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: '#8b6f52',
          marginBottom: '2px'
        }}>
          {titleLine1}
        </p>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 900,
          color: '#1a232c',
          letterSpacing: '-0.5px'
        }}>
          {titleLine2}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={toggleLanguage}
          className="notranslate"
          style={{
            background: 'rgba(235, 156, 63, 0.15)',
            border: '1px solid #eb9c3f',
            borderRadius: '20px',
            padding: '6px 10px',
            fontSize: '12px',
            fontWeight: 800,
            color: '#c47625',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            letterSpacing: '0.5px',
            transition: 'all 0.2s ease',
          }}
        >
          {lang === 'en' ? 'A/अ' : 'अ/A'}
        </button>

        {/* Circular Notification Alert System */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowAlert(!showAlert)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(235, 156, 63, 0.15)',
              border: '1px solid #eb9c3f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease',
            }}
          >
            <Bell size={18} color="#c47625" />
            {!isLoadingInsight && precipitationChance !== null && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: precipitationChance > 40 ? '#ef4444' : '#10b981', // Red if raining, green if clear
                border: '2px solid white',
              }} />
            )}
          </button>

          {/* Alert Dropdown/Popover */}
          {showAlert && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              width: '280px',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              padding: '20px',
              zIndex: 100,
              border: '1px solid rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#1a232c' }}>Irrigation Alert</h3>
                <button onClick={() => setShowAlert(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <X size={16} color="#64748b" />
                </button>
              </div>

              {isLoadingInsight ? (
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Analyzing geographic weather data...</p>
              ) : (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: precipitationChance > 40 ? '#fef2f2' : '#ecfdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {precipitationChance > 40 ? <CloudRain size={16} color="#ef4444" /> : <Droplets size={16} color="#10b981" />}
                  </div>
                  <div>
                    <p style={{
                      fontSize: '13px',
                      color: '#334155',
                      margin: 0,
                      lineHeight: '1.5',
                      fontWeight: 600
                    }}>
                      {precipitationChance > 40 
                        ? `Rain expected tomorrow (${precipitationChance}% chance). We recommend NOT irrigating your field today.`
                        : `Clear weather tomorrow (${precipitationChance}% rain chance). It's a good time to irrigate your field.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div onClick={onUserClick} style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: token ? '2px solid #10b981' : '2px solid #eb9c3f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: token ? '#ccfbf1' : '#e8dbce',
            cursor: 'pointer',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {token ? (
              <svg viewBox="0 0 24 24" fill="#065f46" style={{ width: '80%', height: '80%', marginTop: '6px' }}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            ) : (
              <Smartphone size={18} color="#2b2723" />
            )}
          </div>
      </div>
    </header>
  );
};

export default Header;
