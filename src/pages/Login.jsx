import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase-config';
import axios from 'axios';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = ({ setActiveTab }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      if (!auth.config.apiKey || auth.config.apiKey === 'YOUR_API_KEY') {
        throw new Error('Firebase configuration is incomplete. Please add your credentials to src/firebase-config.js');
      }
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const response = await axios.post('http://localhost:5000/api/auth/google', { idToken });
      localStorage.setItem('token', response.data.token);
      setActiveTab('dashboard');
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTraditionalLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setActiveTab('dashboard');
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
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
        <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#1a232c', margin: '0 0 8px 0' }}>Welcome Back</h2>
        <p style={{ color: '#64748b', fontSize: '15px', fontWeight: 500 }}>Sign in to access your farm intelligence</p>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '28px',
        padding: '32px 24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <form onSubmit={handleTraditionalLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              display: 'flex'
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
                width: '100%',
                padding: '16px 16px 16px 48px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                fontSize: '15px',
                fontWeight: 600,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              display: 'flex'
            }}>
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 16px 16px 48px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                fontSize: '15px',
                fontWeight: 600,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#ef4444',
              fontSize: '13px',
              fontWeight: 600,
              lineHeight: '1.4'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              background: 'linear-gradient(135deg, #e08328, #d97520)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 10px 25px rgba(224, 131, 40, 0.25)',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              marginTop: '10px'
            }}
          >
            {loading ? 'Logging in...' : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          margin: '32px 0',
          color: '#cbd5e1'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'currentColor' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: 'currentColor' }} />
        </div>

        <button 
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            background: 'white',
            color: '#1a232c',
            border: '2px solid #f1f5f9',
            borderRadius: '20px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Google Cloud
        </button>
      </div>

      <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
        Don't have an account? {' '}
        <span 
          onClick={() => setActiveTab('signup')}
          style={{ color: '#e08328', cursor: 'pointer', fontWeight: 800 }}
        >
          Create One
        </span>
      </p>
    </div>
  );
};

export default Login;
