import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

const Signup = ({ setActiveTab }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      localStorage.setItem('token', response.data.token);
      setActiveTab('dashboard');
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '0 20px 40px',
      gap: '24px'
    }} className="animate-fade-in">
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#1a232c', margin: '0 0 8px 0' }}>Join Us</h2>
        <p style={{ color: '#64748b', fontSize: '15px', fontWeight: 500 }}>Start your precision farming journey</p>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '28px',
        padding: '32px 24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '16px', top: '50%', transform: 'translateY(-50%)',
              color: '#94a3b8', display: 'flex'
            }}>
              <User size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%', padding: '16px 16px 16px 48px', background: '#f8fafc',
                border: '1px solid #e2e8f0', borderRadius: '16px', fontSize: '15px',
                fontWeight: 600, outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '16px', top: '50%', transform: 'translateY(-50%)',
              color: '#94a3b8', display: 'flex'
            }}>
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '16px 16px 16px 48px', background: '#f8fafc',
                border: '1px solid #e2e8f0', borderRadius: '16px', fontSize: '15px',
                fontWeight: 600, outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '16px', top: '50%', transform: 'translateY(-50%)',
              color: '#94a3b8', display: 'flex'
            }}>
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              placeholder="Create Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%', padding: '16px 16px 16px 48px', background: '#f8fafc',
                border: '1px solid #e2e8f0', borderRadius: '16px', fontSize: '15px',
                fontWeight: 600, outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: '12px', background: '#fef2f2',
              border: '1px solid #fee2e2', color: '#ef4444', fontSize: '13px',
              fontWeight: 600, lineHeight: '1.4'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '18px', background: 'linear-gradient(135deg, #e08328, #d97520)',
              color: 'white', border: 'none', borderRadius: '20px', fontSize: '16px',
              fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(224, 131, 40, 0.25)',
              opacity: loading ? 0.7 : 1, transition: 'all 0.2s ease', marginTop: '10px'
            }}
          >
            {loading ? 'Creating Account...' : (
              <>Create Account <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
        Already have an account? {' '}
        <span 
          onClick={() => setActiveTab('login')}
          style={{ color: '#e08328', cursor: 'pointer', fontWeight: 800 }}
        >
          Sign In
        </span>
      </p>
    </div>
  );
};

export default Signup;
