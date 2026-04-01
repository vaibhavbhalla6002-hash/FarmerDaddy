import React, { useState, useEffect } from 'react';
import { Sun, Leaf, Droplet, Armchair, MoveRight, CloudRain, Wind, Thermometer, CloudSun, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Helper: Generate smart farming recommendation from 7-day data ---
const generateFarmingAdvice = (forecast) => {
  if (!forecast || forecast.length === 0) return { summary: '', details: [], overallScore: 0 };

  const avgTemp = forecast.reduce((s, d) => s + (d.tempMax + d.tempMin) / 2, 0) / forecast.length;
  const avgWind = forecast.reduce((s, d) => s + d.windMax, 0) / forecast.length;
  const avgHumidity = forecast.reduce((s, d) => s + d.humidity, 0) / forecast.length;
  const totalPrecip = forecast.reduce((s, d) => s + d.precipSum, 0);
  const avgRainChance = forecast.reduce((s, d) => s + d.precipChance, 0) / forecast.length;
  const avgSunshine = forecast.reduce((s, d) => s + d.sunshineHours, 0) / forecast.length;
  const rainyDays = forecast.filter(d => d.precipChance > 50).length;
  const hotDays = forecast.filter(d => d.tempMax > 38).length;

  const details = [];
  let irrigationScore = 50; // 0 = don't irrigate at all, 100 = irrigate heavily

  // --- Rain analysis ---
  if (totalPrecip > 20) {
    details.push({ icon: '🌧️', label: 'Rain', text: `Good news! Lots of rain is coming this week. No need to water your fields — the rain will do the job for you.`, color: '#3b82f6' });
    irrigationScore -= 40;
  } else if (totalPrecip > 5) {
    details.push({ icon: '🌦️', label: 'Rain', text: `Some rain is expected this week. Give your fields only half the usual water. Too much water can harm the crops.`, color: '#60a5fa' });
    irrigationScore -= 20;
  } else {
    details.push({ icon: '☀️', label: 'Rain', text: `Very little rain this week. Your fields will be thirsty — make sure to water them regularly.`, color: '#f59e0b' });
    irrigationScore += 20;
  }

  // --- Temperature analysis ---
  if (avgTemp > 35) {
    details.push({ icon: '🌡️', label: 'Heat', text: `It will be very hot this week (around ${avgTemp.toFixed(0)}°C). Water your fields early in the morning or in the evening when it is cool. Hot sun dries up water fast.`, color: '#ef4444' });
    irrigationScore += 15;
  } else if (avgTemp > 25) {
    details.push({ icon: '🌤️', label: 'Heat', text: `Nice warm weather this week (around ${avgTemp.toFixed(0)}°C). Good for your crops! Keep watering as you normally do.`, color: '#f97316' });
  } else if (avgTemp < 15) {
    details.push({ icon: '❄️', label: 'Heat', text: `It will be cold this week (around ${avgTemp.toFixed(0)}°C). Crops don't need much water in cold weather. Don't give too much water or the roots can get damaged.`, color: '#6366f1' });
    irrigationScore -= 15;
  } else {
    details.push({ icon: '🌿', label: 'Heat', text: `The weather is pleasant this week (around ${avgTemp.toFixed(0)}°C). Very good for growing crops. Keep watering your fields as usual.`, color: '#10b981' });
  }

  // --- Wind analysis ---
  if (avgWind > 30) {
    details.push({ icon: '💨', label: 'Wind', text: `Strong winds are coming this week. Don't use sprinklers — the wind will blow the water away. Use pipes or channels to water your fields instead.`, color: '#8b5cf6' });
    irrigationScore += 10;
  } else if (avgWind > 15) {
    details.push({ icon: '🍃', label: 'Wind', text: `Some wind expected this week. Wind dries the soil faster, so you may need to give a little extra water to your fields.`, color: '#a78bfa' });
    irrigationScore += 5;
  } else {
    details.push({ icon: '🌱', label: 'Wind', text: `Very little wind this week. You can water your fields any way you like — all methods will work well.`, color: '#34d399' });
  }

  // --- Humidity analysis ---
  if (avgHumidity > 80) {
    details.push({ icon: '💧', label: 'Moisture in Air', text: `The air will be very wet and sticky this week (${avgHumidity.toFixed(0)}%). Be careful — crops can get diseases in such weather. Give less water and make sure water doesn't stay standing in the field.`, color: '#0ea5e9' });
    irrigationScore -= 15;
  } else if (avgHumidity > 60) {
    details.push({ icon: '🌫️', label: 'Moisture in Air', text: `Normal moisture in the air this week (${avgHumidity.toFixed(0)}%). The soil will hold water well. Keep watering as usual.`, color: '#38bdf8' });
  } else {
    details.push({ icon: '🏜️', label: 'Moisture in Air', text: `The air is very dry this week (${avgHumidity.toFixed(0)}%). Your crops will get thirsty faster. Try covering the soil with straw or dry leaves, and water more often.`, color: '#fbbf24' });
    irrigationScore += 10;
  }

  // --- Sunshine analysis ---
  if (avgSunshine > 10) {
    details.push({ icon: '☀️', label: 'Sunlight', text: `Lots of sunshine this week (~${avgSunshine.toFixed(0)} hours/day). Great for your crops to grow! But more sun means the soil dries faster, so keep the water coming.`, color: '#eab308' });
    irrigationScore += 5;
  } else if (avgSunshine > 5) {
    details.push({ icon: '⛅', label: 'Sunlight', text: `Some sun and some clouds this week (~${avgSunshine.toFixed(0)} hours/day). Good balanced weather for most crops.`, color: '#facc15' });
  } else {
    details.push({ icon: '☁️', label: 'Sunlight', text: `Mostly cloudy this week (~${avgSunshine.toFixed(0)} hours/day). Less sun means the ground stays wet longer — you can water a bit less.`, color: '#94a3b8' });
    irrigationScore -= 5;
  }

  // Clamp score
  irrigationScore = Math.max(0, Math.min(100, irrigationScore));

  // --- Build summary ---
  let summary = '';
  if (irrigationScore >= 70) {
    summary = `Your fields need good watering this week! ${rainyDays === 0 ? 'No rain is coming' : `Only ${rainyDays} day${rainyDays > 1 ? 's' : ''} of rain expected`}${hotDays > 0 ? ` and ${hotDays} day${hotDays > 1 ? 's' : ''} will be very hot` : ''}. Try to water early in the morning when it is cool so the water doesn't dry up too fast.`;
  } else if (irrigationScore >= 40) {
    summary = `Give your fields some water this week, but not too much. ${rainyDays > 0 ? `Rain is expected on ${rainyDays} day${rainyDays > 1 ? 's' : ''} — skip watering on those days.` : 'The weather is fine.'} Check the soil with your hand — if the top feels dry, it's time to water.`;
  } else {
    summary = `Good news! You don't need to water much this week. ${totalPrecip > 10 ? `Rain will take care of your fields.` : 'The weather is cool and the air has enough moisture.'} Just make sure extra water can flow out of the field so crops don't get damaged.`;
  }

  return { summary, details, irrigationScore };
};

// --- Day names helper ---
const getDayName = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tmrw';
  return date.toLocaleDateString('en', { weekday: 'short' });
};

// --- Weather icon selector ---
const getWeatherEmoji = (precipChance, sunshine, tempMax) => {
  if (precipChance > 70) return '🌧️';
  if (precipChance > 40) return '🌦️';
  if (sunshine > 8 && tempMax > 35) return '🔥';
  if (sunshine > 6) return '☀️';
  if (sunshine > 3) return '⛅';
  return '☁️';
};

const Dashboard = ({ onNavigate }) => {
  const [forecast, setForecast] = useState([]);
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);
  const [advice, setAdvice] = useState({ summary: '', details: [], irrigationScore: 0 });

  useEffect(() => {
    const fetchWeather = async (lat = 28.6139, lon = 77.2090) => {
      try {
        const params = [
          `latitude=${lat}`,
          `longitude=${lon}`,
          'daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,windspeed_10m_max,sunshine_duration',
          'hourly=relative_humidity_2m',
          'timezone=auto',
          'forecast_days=7'
        ].join('&');
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        const data = await res.json();

        if (data && data.daily) {
          // Compute daily average humidity from hourly data
          const dailyHumidity = [];
          if (data.hourly && data.hourly.relative_humidity_2m) {
            for (let d = 0; d < 7; d++) {
              const slice = data.hourly.relative_humidity_2m.slice(d * 24, (d + 1) * 24);
              const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
              dailyHumidity.push(Math.round(avg));
            }
          }

          const days = data.daily.time.map((date, i) => ({
            date,
            tempMax: data.daily.temperature_2m_max[i],
            tempMin: data.daily.temperature_2m_min[i],
            precipChance: data.daily.precipitation_probability_max[i],
            precipSum: data.daily.precipitation_sum[i],
            windMax: data.daily.windspeed_10m_max[i],
            sunshineHours: (data.daily.sunshine_duration[i] || 0) / 3600, // seconds to hours
            humidity: dailyHumidity[i] || 50,
          }));

          setForecast(days);
          setAdvice(generateFarmingAdvice(days));
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setIsLoadingInsight(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather()
      );
    } else {
      fetchWeather();
    }
  }, []);

  const day = forecast[selectedDay] || null;

  return (
    <div style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade-in">
      
      {/* Current Conditions Card - now dynamic */}
      <div style={{
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(220, 140, 50, 0.15)',
        color: 'white',
        minHeight: '260px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '28px 24px',
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(200,100,20,0.8) 100%), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <h2 style={{
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '20px',
          position: 'absolute',
          top: '24px',
          left: '24px',
          color: 'rgba(255,255,255,0.9)'
        }}>CURRENT CONDITIONS</h2>

        <div>
          <h1 translate="no" style={{ fontSize: '72px', fontWeight: 900, lineHeight: '1', color: '#fff', letterSpacing: '-2px' }}>
            {day ? `${Math.round(day.tempMax)}°` : '—°'}<span style={{ fontSize: '56px' }}>C</span>
          </h1>
          <p style={{ fontSize: '18px', fontWeight: 600, marginTop: '8px', opacity: 0.9 }}>
            {day ? (day.precipChance > 60 ? 'Rainy' : day.sunshineHours > 8 ? 'Sunny, Clear Skies' : day.sunshineHours > 4 ? 'Partly Cloudy' : 'Overcast') : 'Loading...'}
          </p>
        </div>

        {/* Floating Glassmorphism panel */}
        <div style={{
          position: 'absolute',
          right: '20px',
          bottom: '24px',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: '150px',
          border: '1px solid rgba(255,255,255,0.3)',
        }}>
          <Sun size={32} color="white" style={{ marginBottom: '16px' }} />
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.3)', width: '100%', marginBottom: '16px' }} />
          
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0 4px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>HUMIDITY</span>
              <span style={{ fontSize: '16px', fontWeight: 800 }}>{day ? `${day.humidity}%` : '—'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>WIND</span>
              <span style={{ fontSize: '16px', fontWeight: 800 }}>{day ? `${Math.round(day.windMax)}km/h` : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 7-DAY SMART FORECAST SECTION                */}
      {/* ============================================ */}
      <section>
        <h3 style={{
          fontSize: '13px',
          fontWeight: 800,
          color: '#8b6f52',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '16px',
        }}>7-DAY FIELD FORECAST</h3>

        <div style={{
          background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 50%, #ede9fe 100%)',
          borderRadius: '28px',
          padding: '28px 20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>

          {/* Scrollable Day Selector */}
          {isLoadingInsight ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>🌾</div>
              <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>Analyzing 7-day weather patterns for your region...</p>
            </div>
          ) : (
            <>
              <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '4px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}>
                {forecast.map((d, i) => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDay(i)}
                    style={{
                      flex: '0 0 auto',
                      minWidth: '72px',
                      padding: '12px 8px',
                      borderRadius: '16px',
                      border: selectedDay === i ? '2px solid #3b82f6' : '2px solid transparent',
                      background: selectedDay === i ? 'white' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedDay === i ? '0 4px 16px rgba(59,130,246,0.15)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 700, color: selectedDay === i ? '#1e40af' : '#64748b' }}>
                      {getDayName(d.date)}
                    </span>
                    <span style={{ fontSize: '22px' }}>
                      {getWeatherEmoji(d.precipChance, d.sunshineHours, d.tempMax)}
                    </span>
                    <span translate="no" style={{ fontSize: '13px', fontWeight: 800, color: selectedDay === i ? '#1e40af' : '#64748b' }}>
                      {Math.round(d.tempMax)}°C
                    </span>
                    <span translate="no" style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>
                      {Math.round(d.tempMin)}°C
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected Day Detail Panel */}
              {day && (
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#fef2f2', borderRadius: '14px' }}>
                    <Thermometer size={18} color="#ef4444" />
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, margin: 0 }}>TEMP</p>
                      <p translate="no" style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', margin: 0 }}>{Math.round(day.tempMin)}° – {Math.round(day.tempMax)}°C</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#eff6ff', borderRadius: '14px' }}>
                    <CloudRain size={18} color="#3b82f6" />
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, margin: 0 }}>RAIN</p>
                      <p style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', margin: 0 }}>{day.precipChance}% · {day.precipSum.toFixed(1)}mm</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#f5f3ff', borderRadius: '14px' }}>
                    <Wind size={18} color="#8b5cf6" />
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, margin: 0 }}>WIND</p>
                      <p style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', margin: 0 }}>{Math.round(day.windMax)} km/h</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#ecfdf5', borderRadius: '14px' }}>
                    <Droplet size={18} color="#10b981" />
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, margin: 0 }}>HUMIDITY</p>
                      <p style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', margin: 0 }}>{day.humidity}%</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#fefce8', borderRadius: '14px', gridColumn: 'span 2' }}>
                    <Sun size={18} color="#eab308" />
                    <div>
                      <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, margin: 0 }}>SUNSHINE</p>
                      <p style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', margin: 0 }}>{day.sunshineHours.toFixed(1)} hours</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Irrigation Score Gauge */}
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0c4a6e', margin: 0 }}>Irrigation Need Score</h4>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    color: advice.irrigationScore >= 70 ? '#ef4444' : advice.irrigationScore >= 40 ? '#f59e0b' : '#10b981',
                  }}>{advice.irrigationScore}%</span>
                </div>
                {/* Progress Bar */}
                <div style={{ height: '8px', borderRadius: '4px', background: '#e2e8f0', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${advice.irrigationScore}%`,
                    borderRadius: '4px',
                    background: advice.irrigationScore >= 70
                      ? 'linear-gradient(90deg, #f97316, #ef4444)'
                      : advice.irrigationScore >= 40
                        ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                        : 'linear-gradient(90deg, #34d399, #10b981)',
                    transition: 'width 0.6s ease',
                  }} />
                </div>
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px', fontWeight: 600 }}>
                  {advice.irrigationScore >= 70 ? 'High — your fields need watering' : advice.irrigationScore >= 40 ? 'Moderate — irrigate selectively' : 'Low — nature has you covered'}
                </p>
              </div>

              {/* Overall Recommendation */}
              <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '20px',
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0c4a6e', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🌾 Weekly Field Recommendation
                </h4>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155', margin: 0, fontWeight: 600 }}>
                  {advice.summary}
                </p>
              </div>

              {/* Detailed Parameter Insights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {advice.details.map((item, i) => (
                  <div key={i} style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    borderLeft: `4px solid ${item.color}`,
                  }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 800, color: item.color, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                      <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#475569', margin: 0, fontWeight: 600 }}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Seasonal Guidance Section */}
      <section>
        <h3 style={{
          fontSize: '13px',
          fontWeight: 800,
          color: '#8b6f52',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '16px',
        }}>SEASONAL GUIDANCE</h3>

        <div style={{
          background: 'white',
          borderRadius: '28px',
          padding: '32px 24px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#ebce5f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}>
            <Leaf size={24} color="#6e5c21" />
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#1a1816', marginBottom: '12px' }}>
            What to Grow
          </h2>
          <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#6e6b66', marginBottom: '24px', maxWidth: '90%' }}>
            Optimized crop recommendations based on your soil profile and current climate window.
          </p>

          <button 
            onClick={() => onNavigate('crops')}
            style={{
              background: '#df882d',
              color: 'white',
              padding: '16px 28px',
              borderRadius: '30px',
              fontSize: '16px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'transform 0.2s',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Explore Selection
            <MoveRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
