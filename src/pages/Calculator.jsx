import React, { useState, useMemo } from 'react';
import { Globe, FlaskConical, Users, Droplets, Lightbulb, ChevronDown, Calculator as CalcIcon, Leaf, Droplet, Cloud, MoreHorizontal, Ruler, ChevronLeft, Sprout, Apple, Bean, Sun, Wheat as WheatIcon, ArrowUpDown, X } from 'lucide-react';

// Comprehensive crop data with real Indian govt cost of cultivation data (₹/acre approx)
const cropDatabase = {
  wheat: {
    name: 'Wheat', icon: Leaf, msp: 2275,
    yieldPerAcre: 18, // quintals per acre
    costs: { seeds: 2200, fertilizer: 4800, labor: 5200, irrigation: 3200, pesticides: 1200, machinery: 3500 }
  },
  rice: {
    name: 'Rice', icon: Droplet, msp: 2183,
    yieldPerAcre: 22,
    costs: { seeds: 1800, fertilizer: 5200, labor: 6800, irrigation: 4500, pesticides: 1800, machinery: 3200 }
  },
  cotton: {
    name: 'Cotton', icon: Cloud, msp: 6620,
    yieldPerAcre: 6,
    costs: { seeds: 3200, fertilizer: 4500, labor: 7200, irrigation: 3800, pesticides: 3500, machinery: 2800 }
  },
  maize: {
    name: 'Maize', icon: Sprout, msp: 2090,
    yieldPerAcre: 20,
    costs: { seeds: 2400, fertilizer: 4200, labor: 4800, irrigation: 2800, pesticides: 1400, machinery: 3000 }
  },
  sugarcane: {
    name: 'Sugarcane', icon: ArrowUpDown, msp: 315,
    yieldPerAcre: 300,
    costs: { seeds: 6500, fertilizer: 7200, labor: 9500, irrigation: 6000, pesticides: 2200, machinery: 4500 }
  },
  ragi: {
    name: 'Ragi', icon: Sun, msp: 3846,
    yieldPerAcre: 8,
    costs: { seeds: 1200, fertilizer: 2800, labor: 4200, irrigation: 1800, pesticides: 800, machinery: 2200 }
  },
  soybean: {
    name: 'Soybean', icon: Bean, msp: 4600,
    yieldPerAcre: 8,
    costs: { seeds: 3000, fertilizer: 3200, labor: 4500, irrigation: 2200, pesticides: 1600, machinery: 2800 }
  },
  mustard: {
    name: 'Mustard', icon: Apple, msp: 5650,
    yieldPerAcre: 6,
    costs: { seeds: 1500, fertilizer: 3000, labor: 3800, irrigation: 2000, pesticides: 1000, machinery: 2500 }
  },
};

const primaryCrops = [
  { id: 'wheat', name: 'Wheat', icon: Leaf },
  { id: 'rice', name: 'Rice', icon: Droplet },
  { id: 'cotton', name: 'Cotton', icon: Cloud },
  { id: 'others', name: 'Others', icon: MoreHorizontal },
];

const otherCrops = [
  { id: 'maize', name: 'Maize', icon: Sprout },
  { id: 'sugarcane', name: 'Sugarcane', icon: ArrowUpDown },
  { id: 'ragi', name: 'Ragi', icon: Sun },
  { id: 'soybean', name: 'Soybean', icon: Bean },
  { id: 'mustard', name: 'Mustard', icon: Apple },
];

// Unit conversions to acres
const unitOptions = [
  { id: 'acres', name: 'Acres', toAcres: 1 },
  { id: 'hectares', name: 'Hectares', toAcres: 2.471 },
  { id: 'bigha', name: 'Bigha', toAcres: 0.619 },
  { id: 'kanal', name: 'Kanal', toAcres: 0.125 },
  { id: 'gunta', name: 'Gunta', toAcres: 0.025 },
  { id: 'sqft', name: 'Sq. Feet', toAcres: 0.0000229568 },
  { id: 'sqm', name: 'Sq. Meters', toAcres: 0.000247105 },
];

const expenseIcons = {
  seeds: Globe, fertilizer: FlaskConical, labor: Users, irrigation: Droplets, pesticides: Sprout, machinery: CalcIcon
};
const expenseLabels = {
  seeds: 'Seeds', fertilizer: 'Fertilizer', labor: 'Labor & Wages', irrigation: 'Irrigation', pesticides: 'Pesticides', machinery: 'Machinery & Rent'
};

const Calculator = () => {
  const [area, setArea] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('acres');
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [showResults, setShowResults] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  // Field dimension calculator
  const [fieldLength, setFieldLength] = useState('');
  const [fieldWidth, setFieldWidth] = useState('');
  const [dimUnit, setDimUnit] = useState('feet');
  const [showDimDropdown, setShowDimDropdown] = useState(false);

  const dimUnits = [
    { id: 'feet', name: 'Feet' },
    { id: 'meters', name: 'Meters' },
  ];

  const calculatedArea = useMemo(() => {
    if (!fieldLength || !fieldWidth) return null;
    const l = parseFloat(fieldLength);
    const w = parseFloat(fieldWidth);
    if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) return null;
    const sqUnit = l * w;
    // Convert to acres
    if (dimUnit === 'feet') return sqUnit * 0.0000229568;
    if (dimUnit === 'meters') return sqUnit * 0.000247105;
    return null;
  }, [fieldLength, fieldWidth, dimUnit]);

  const areaInAcres = useMemo(() => {
    if (calculatedArea !== null && !area) return calculatedArea;
    const val = parseFloat(area);
    if (isNaN(val) || val <= 0) return 0;
    const unit = unitOptions.find(u => u.id === selectedUnit);
    return val * (unit?.toAcres || 1);
  }, [area, selectedUnit, calculatedArea]);

  const results = useMemo(() => {
    if (areaInAcres <= 0) return null;
    const crop = cropDatabase[selectedCrop];
    if (!crop) return null;

    const costEntries = Object.entries(crop.costs).map(([key, costPerAcre]) => {
      const total = Math.round(costPerAcre * areaInAcres);
      return { key, label: expenseLabels[key], icon: expenseIcons[key], amount: total };
    });

    const totalCost = costEntries.reduce((s, e) => s + e.amount, 0);
    const totalYield = Math.round(crop.yieldPerAcre * areaInAcres * 10) / 10;
    const totalRevenue = Math.round(totalYield * crop.msp);
    const profit = totalRevenue - totalCost;
    const maxCost = Math.max(...costEntries.map(e => e.amount));

    return { costEntries, totalCost, totalYield, totalRevenue, profit, maxCost, crop };
  }, [areaInAcres, selectedCrop]);

  const handleCalculate = () => {
    if (areaInAcres > 0 && cropDatabase[selectedCrop]) {
      setShowResults(true);
    }
  };

  const handleCropSelect = (cropId) => {
    if (cropId === 'others') {
      setShowOthers(true);
    } else {
      setSelectedCrop(cropId);
      setShowOthers(false);
    }
  };

  const handleUseCalculatedArea = () => {
    if (calculatedArea !== null) {
      setArea(calculatedArea.toFixed(4));
      setSelectedUnit('acres');
    }
  };

  const currentUnitName = unitOptions.find(u => u.id === selectedUnit)?.name || 'Acres';
  const currentDimUnitName = dimUnits.find(u => u.id === dimUnit)?.name || 'Feet';

  return (
    <div style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
      
      {/* Title */}
      <div>
        <h3 style={{
          fontSize: '12px', fontWeight: 800, color: '#8b6f52',
          textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px',
        }}>FINANCIAL PLANNING</h3>
        <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#2b2a28', marginBottom: '12px', lineHeight: '1.1' }}>
          Cultivation Cost<br/>Calculator
        </h2>
      </div>

      {/* Field Dimension Calculator */}
      <div style={{
        background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: '#2e7d32', padding: '8px', borderRadius: '12px' }}>
            <Ruler size={18} color="white" />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#1b5e20' }}>Field Dimension Calculator</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <input
            type="number" placeholder="Length"
            value={fieldLength} onChange={e => setFieldLength(e.target.value)}
            style={{
              flex: 1, padding: '14px', borderRadius: '14px', border: '1.5px solid #a5d6a7',
              fontSize: '15px', fontWeight: 600, color: '#1b5e20', outline: 'none',
              background: 'rgba(255,255,255,0.8)', minWidth: 0, fontFamily: 'inherit'
            }}
          />
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '20px', fontWeight: 700, color: '#2e7d32' }}>×</span>
          <input
            type="number" placeholder="Width"
            value={fieldWidth} onChange={e => setFieldWidth(e.target.value)}
            style={{
              flex: 1, padding: '14px', borderRadius: '14px', border: '1.5px solid #a5d6a7',
              fontSize: '15px', fontWeight: 600, color: '#1b5e20', outline: 'none',
              background: 'rgba(255,255,255,0.8)', minWidth: 0, fontFamily: 'inherit'
            }}
          />
          {/* Dimension Unit Selector */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowDimDropdown(!showDimDropdown)}
              style={{
                background: 'rgba(255,255,255,0.9)', borderRadius: '14px', padding: '14px 12px',
                display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer',
                border: '1.5px solid #a5d6a7', whiteSpace: 'nowrap'
              }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1b5e20' }}>{currentDimUnitName}</span>
              <ChevronDown size={14} color="#1b5e20" />
            </div>
            {showDimDropdown && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '4px', background: 'white',
                borderRadius: '14px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden', minWidth: '100px'
              }}>
                {dimUnits.map(u => (
                  <div key={u.id} onClick={() => { setDimUnit(u.id); setShowDimDropdown(false); }}
                    style={{ padding: '12px 16px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                      color: dimUnit === u.id ? '#2e7d32' : '#555', background: dimUnit === u.id ? '#e8f5e9' : 'white'
                    }}>
                    {u.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {calculatedArea !== null && (
          <div style={{
            background: 'rgba(255,255,255,0.85)', borderRadius: '14px', padding: '14px 16px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px'
          }}>
            <div>
              <span style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>Calculated Area: </span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#1b5e20' }}>{calculatedArea.toFixed(2)} Acres</span>
            </div>
            <button onClick={handleUseCalculatedArea} style={{
              background: '#2e7d32', color: 'white', border: 'none', padding: '8px 14px',
              borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer'
            }}>Use This</button>
          </div>
        )}
      </div>

      {/* Main Form Card */}
      <div style={{
        background: 'white', borderRadius: '24px', padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}>
        
        {/* Land Area & Units */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '15px', fontWeight: 700, color: '#4a4641', marginBottom: '16px' }}>
            Land Area & Units
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="number" placeholder="Enter area value"
              value={area} onChange={e => setArea(e.target.value)}
              style={{
                flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid #e2dfdb',
                fontSize: '16px', fontWeight: 600, color: '#2b2723', outline: 'none',
                minWidth: 0, fontFamily: 'inherit'
              }}
            />
            {/* Unit Dropdown */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowUnitDropdown(!showUnitDropdown)}
                style={{
                  background: '#eaeaed', borderRadius: '16px', padding: '0 16px', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer',
                  minWidth: '90px'
                }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#2b2a28' }}>{currentUnitName}</span>
                <ChevronDown size={16} color="#2b2a28" />
              </div>
              {showUnitDropdown && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '6px', background: 'white',
                  borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 50, overflow: 'hidden', minWidth: '140px'
                }}>
                  {unitOptions.map(u => (
                    <div key={u.id} onClick={() => { setSelectedUnit(u.id); setShowUnitDropdown(false); }}
                      style={{
                        padding: '14px 18px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                        color: selectedUnit === u.id ? '#e08328' : '#555',
                        background: selectedUnit === u.id ? '#fef3e2' : 'white',
                        borderBottom: '1px solid #f5f5f5'
                      }}>
                      {u.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Crop Type */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '15px', fontWeight: 700, color: '#4a4641', marginBottom: '16px' }}>
            Crop Type
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {primaryCrops.map((crop) => {
              const isSelected = selectedCrop === crop.id && crop.id !== 'others';
              const isOthersActive = showOthers && crop.id === 'others';
              const Icon = crop.icon;
              return (
                <div key={crop.id} onClick={() => handleCropSelect(crop.id)}
                  style={{
                    padding: '2px', borderRadius: '20px',
                    border: (isSelected || isOthersActive) ? '2px dashed #7a9cf9' : '2px dashed transparent',
                    transition: 'border 0.2s ease'
                  }}>
                  <div style={{
                    background: (isSelected || isOthersActive) ? '#e08328' : '#ffffff',
                    border: (isSelected || isOthersActive) ? '1px solid #e08328' : '1px solid #f4f3f0',
                    borderRadius: '18px', padding: '20px 16px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                    cursor: 'pointer', transition: 'all 0.2s ease', height: '100%', boxSizing: 'border-box',
                    boxShadow: (isSelected || isOthersActive) ? '0 4px 10px rgba(224, 131, 40, 0.3)' : 'none'
                  }}>
                    <Icon size={28} color={(isSelected || isOthersActive) ? 'white' : '#a66023'} strokeWidth={(isSelected || isOthersActive) ? 2.5 : 2} />
                    <span style={{ fontSize: '15px', fontWeight: 700, color: (isSelected || isOthersActive) ? 'white' : '#4a4641' }}>{crop.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Others Panel */}
          {showOthers && (
            <div style={{
              marginTop: '16px', background: '#fef8f0', borderRadius: '20px', padding: '20px',
              border: '1px solid #f0e0c8'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#a66023' }}>Select a crop</span>
                <button onClick={() => setShowOthers(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                  <X size={18} color="#a66023" />
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {otherCrops.map((crop) => {
                  const isSelected = selectedCrop === crop.id;
                  const Icon = crop.icon;
                  return (
                    <div key={crop.id} onClick={() => { setSelectedCrop(crop.id); }}
                      style={{
                        padding: '10px 16px', borderRadius: '14px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: isSelected ? '#e08328' : 'white',
                        border: isSelected ? '1px solid #e08328' : '1px solid #e8ddd0',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 4px 10px rgba(224, 131, 40, 0.25)' : 'none'
                      }}>
                      <Icon size={16} color={isSelected ? 'white' : '#a66023'} />
                      <span style={{ fontSize: '14px', fontWeight: 700, color: isSelected ? 'white' : '#4a4641' }}>{crop.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <button onClick={handleCalculate}
          style={{
            width: '100%', background: '#e08328', color: 'white', padding: '18px', borderRadius: '24px',
            fontSize: '18px', fontWeight: 800, border: 'none', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '12px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(224, 131, 40, 0.2)',
            opacity: areaInAcres > 0 ? 1 : 0.5, transition: 'opacity 0.2s'
          }}>
          Calculate Costs <CalcIcon size={20} />
        </button>
      </div>

      {/* Results */}
      {showResults && results && (
        <div className="animate-fade-in" style={{ marginTop: '8px' }}>

          {/* Revenue Summary Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1a3a2a, #2d5a3d)', borderRadius: '24px',
            padding: '28px 24px', color: 'white', marginBottom: '24px',
            boxShadow: '0 20px 40px rgba(30, 80, 50, 0.15)',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#7dd3a0' }}>
              Revenue Estimate — {results.crop.name}
            </span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px' }}>Expected Yield</p>
                <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0 }}>
                  <span>{results.totalYield}</span> <span style={{ fontSize: '14px', fontWeight: 600, opacity: 0.8 }}>qtl</span>
                </h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '4px' }}>MSP Revenue</p>
                <h2 style={{ fontSize: '28px', fontWeight: 900, margin: 0, color: '#7dd3a0' }}>
                  <span>₹{results.totalRevenue.toLocaleString('en-IN')}</span>
                </h2>
              </div>
            </div>
            <div style={{
              marginTop: '20px', padding: '14px 18px', borderRadius: '14px',
              background: results.profit >= 0 ? 'rgba(125, 211, 160, 0.15)' : 'rgba(255, 100, 100, 0.15)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 700, opacity: 0.9 }}>
                {results.profit >= 0 ? 'Estimated Profit' : 'Estimated Loss'}
              </span>
              <span style={{
                fontSize: '20px', fontWeight: 900,
                color: results.profit >= 0 ? '#7dd3a0' : '#ff8888'
              }}>
                <span>{results.profit >= 0 ? '+' : ''}₹{results.profit.toLocaleString('en-IN')}</span>
              </span>
            </div>
          </div>

          {/* Cost Breakdown */}
          <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#2b2a28', marginBottom: '16px' }}>
            Cost Breakdown
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {results.costEntries.map((item) => {
              const Icon = item.icon;
              const progress = results.maxCost > 0 ? item.amount / results.maxCost : 0;
              return (
                <div key={item.key} style={{
                  background: 'white', borderRadius: '20px', padding: '22px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '50%', background: '#fbe6d2',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Icon size={18} color="#8a5a3a" />
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#2b2723' }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#2b2723' }}>
                      <span>₹{item.amount.toLocaleString('en-IN')}</span>
                    </span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: '#f0ece6', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '3px', width: `${progress * 100}%`,
                      background: 'linear-gradient(90deg, #d9822a, #e8a637)', transition: 'width 0.8s ease-in-out'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Cost */}
          <div style={{
            background: '#fef3e2', borderRadius: '20px', padding: '22px', marginTop: '14px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            border: '2px solid #f0d68a'
          }}>
            <span style={{ fontSize: '17px', fontWeight: 800, color: '#92400e' }}>Total Cultivation Cost</span>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#92400e' }}>
              <span>₹{results.totalCost.toLocaleString('en-IN')}</span>
            </span>
          </div>

          {/* Per Acre Breakdown */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '22px', marginTop: '14px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#8b6f52', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', display: 'block' }}>
              Per Acre Summary
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Cost/Acre', value: `₹${Math.round(results.totalCost / areaInAcres).toLocaleString('en-IN')}` },
                { label: 'Revenue/Acre', value: `₹${Math.round(results.totalRevenue / areaInAcres).toLocaleString('en-IN')}` },
                { label: 'Yield/Acre', value: `${results.crop.yieldPerAcre} qtl` },
                { label: 'MSP Rate', value: `₹${results.crop.msp}/qtl` },
              ].map((stat, i) => (
                <div key={i} style={{ background: '#faf8f5', borderRadius: '14px', padding: '14px' }}>
                  <p style={{ fontSize: '12px', color: '#97938e', fontWeight: 600, marginBottom: '4px' }}>{stat.label}</p>
                  <p style={{ fontSize: '17px', fontWeight: 800, color: '#2b2723', margin: 0 }}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Card */}
          <div style={{
            background: '#fef8ec', border: '2px solid #f0d68a', borderRadius: '20px', padding: '24px',
            display: 'flex', gap: '16px', alignItems: 'flex-start', marginTop: '16px'
          }}>
            <div style={{
              minWidth: '40px', height: '40px', borderRadius: '50%', background: '#f5e6aa',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Lightbulb size={20} color="#8a6f15" />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#2b2723', marginBottom: '8px' }}>
                <span>Smart Tip: {results.crop.name}</span>
              </h4>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#6e6b66', margin: 0 }}>
                {results.profit >= 0
                  ? `At current MSP of ₹${results.crop.msp}/qtl, your ${areaInAcres.toFixed(1)} acre ${results.crop.name} farm can earn a healthy profit. Try renting equipment with neighbors to save up to 15% on machinery costs.`
                  : `Current costs exceed MSP revenue. Consider reducing input costs by using organic compost instead of chemical fertilizer, or explore direct-to-market sales for better prices than MSP.`
                }
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Calculator;
