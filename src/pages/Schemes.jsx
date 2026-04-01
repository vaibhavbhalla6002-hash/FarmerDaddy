import React from 'react';
import { Shield, ExternalLink, IndianRupee, Calendar, CheckCircle } from 'lucide-react';

const schemes = [
  {
    title: 'PM-KISAN Samman Nidhi',
    desc: 'Direct income support of ₹6,000 per year to small and marginal farmer families.',
    benefit: '₹6,000/year',
    deadline: 'Ongoing',
    status: 'Active',
    color: '#2d8a4e',
    url: 'https://pmkisan.gov.in/'
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana',
    desc: 'Comprehensive crop insurance at minimal premium rates for all food and oilseed crops.',
    benefit: 'Up to ₹2,00,000',
    deadline: 'Kharif: July 31',
    status: 'Active',
    color: '#2d8a4e',
    url: 'https://pmfby.gov.in/'
  },
  {
    title: 'Soil Health Card Scheme',
    desc: 'Free soil testing and nutrient-based recommendations for better crop output.',
    benefit: 'Free Testing',
    deadline: 'Ongoing',
    status: 'Active',
    color: '#2d8a4e',
    url: 'https://soilhealth.dac.gov.in/'
  },
  {
    title: 'Kisan Credit Card (KCC)',
    desc: 'Short-term formal credit for crop production at subsidized interest rates.',
    benefit: '4% Interest',
    deadline: 'Apply Anytime',
    status: 'Active',
    color: '#2d8a4e',
    url: 'https://myscheme.gov.in/schemes/kcc'
  },
];

const Schemes = () => {
  return (
    <div style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #7a4a1c, #c2792a)',
        borderRadius: '24px',
        padding: '28px 24px',
        color: 'white',
        boxShadow: '0 20px 40px rgba(180, 100, 30, 0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Shield size={20} color="#ffd89b" />
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#ffd89b' }}>
            Government Schemes
          </span>
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '8px' }}>Benefits & Subsidies</h2>
        <p style={{ fontSize: '14px', opacity: 0.85, lineHeight: '1.5' }}>
          Explore active government schemes and subsidies available for farmers in your region.
        </p>
      </div>

      {/* Scheme Cards */}
      {schemes.map((scheme, idx) => (
        <div key={idx} style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#2b2723', flex: 1 }}>
              {scheme.title}
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#e6f5ed',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              color: scheme.color,
              whiteSpace: 'nowrap',
            }}>
              <CheckCircle size={12} />
              {scheme.status}
            </div>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#6e6b66', marginBottom: '16px' }}>
            {scheme.desc}
          </p>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IndianRupee size={14} color="#d9822a" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#2b2723' }}>{scheme.benefit}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="#97938e" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#6e6b66' }}>{scheme.deadline}</span>
            </div>
          </div>
          <a 
            href={scheme.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#fbe6d2',
              color: '#a66023',
              padding: '12px 20px',
              borderRadius: '14px',
              fontSize: '14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              width: 'fit-content'
            }}>
            Learn More <ExternalLink size={14} />
          </a>
        </div>
      ))}
    </div>
  );
};

export default Schemes;
