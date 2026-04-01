import React, { useRef, useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, X, RefreshCcw, ScanLine } from 'lucide-react';

const CropReader = () => {
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [isScanning, setIsScanning] = useState(false);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Fallback or show informative message
      setError("Camera permission denied or not available. Please allow permissions or upload an image.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject && !capturedImage) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, capturedImage]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageUrl);
      simulateScan();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        simulateScan();
      };
      reader.readAsDataURL(file);
    }
  };

  const retake = () => {
    setCapturedImage(null);
    setIsScanning(false);
  };

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2500);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#f6f5f3',
      position: 'relative'
    }}>
      {!capturedImage ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#000' }}>
          {error ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', color: 'white' }}>
              <Camera size={48} color="#eb9c3f" style={{ marginBottom: '16px' }} />
              <p style={{ marginBottom: '24px' }}>{error}</p>
              <button 
                onClick={() => fileInputRef.current.click()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#eb9c3f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                <ImageIcon size={20} />
                Upload from Gallery
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              
              {/* Scanner Grid Overlay */}
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}>
                <div style={{
                  width: '70%',
                  aspectRatio: '1',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)',
                  position: 'relative',
                  borderRadius: '16px'
                }}>
                  {/* Corner marks */}
                  <div style={{ position: 'absolute', top: -2, left: -2, width: 30, height: 30, borderTop: '4px solid #eb9c3f', borderLeft: '4px solid #eb9c3f', borderTopLeftRadius: '16px' }}></div>
                  <div style={{ position: 'absolute', top: -2, right: -2, width: 30, height: 30, borderTop: '4px solid #eb9c3f', borderRight: '4px solid #eb9c3f', borderTopRightRadius: '16px' }}></div>
                  <div style={{ position: 'absolute', bottom: -2, left: -2, width: 30, height: 30, borderBottom: '4px solid #eb9c3f', borderLeft: '4px solid #eb9c3f', borderBottomLeftRadius: '16px' }}></div>
                  <div style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderBottom: '4px solid #eb9c3f', borderRight: '4px solid #eb9c3f', borderBottomRightRadius: '16px' }}></div>
                  
                  {/* Subtle scanning line animation */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'rgba(235, 156, 63, 0.8)',
                    boxShadow: '0 0 8px rgba(235, 156, 63, 0.8)',
                    animation: 'scan 2s linear infinite'
                  }}></div>
                </div>
              </div>
              
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes scan {
                  0% { top: 5%; opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { top: 95%; opacity: 0; }
                }
              `}} />

              <div style={{
                position: 'absolute',
                top: '40px',
                left: 0,
                right: 0,
                textAlign: 'center',
                zIndex: 10
              }}>
                <span style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  backdropFilter: 'blur(4px)'
                }}>
                  Position plant leaf within the frame
                </span>
              </div>
            </div>
          )}

          {/* Camera Controls */}
          {!error && (
            <div style={{
              height: '110px',
              backgroundColor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '40px',
              paddingBottom: '20px'
            }}>
              <button 
                onClick={() => fileInputRef.current.click()}
                style={{
                  width: '48px', height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#2a2a2a',
                  border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <ImageIcon color="white" size={20} />
              </button>
              
              <button 
                onClick={captureImage}
                style={{
                  width: '72px', height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  border: '4px solid white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '56px', height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  transition: 'all 0.2s',
                  transform: 'scale(1)'
                }}></div>
              </button>

              <button 
                onClick={toggleCamera}
                style={{
                  width: '48px', height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#2a2a2a',
                  border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <RefreshCcw color="white" size={20} />
              </button>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleFileUpload}
          />
        </div>
      ) : (
        // Preview & Result UI
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f6f5f3' }}>
          <div style={{ position: 'relative', height: '50vh', backgroundColor: '#111' }}>
            <img 
              src={capturedImage} 
              alt="Captured Leaf" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            
            <button 
              onClick={retake}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                width: '40px', height: '40px',
                borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)',
                border: 'none', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 10,
                backdropFilter: 'blur(4px)'
              }}
            >
              <X size={20} />
            </button>
            
            {isScanning && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(235, 156, 63, 0.2)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 5
              }}>
                <ScanLine size={64} color="#fff" style={{ 
                  animation: 'pulse 1.5s infinite',
                  filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' 
                }} />
                <p style={{ color: 'white', fontWeight: 'bold', marginTop: '16px', fontSize: '18px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  Analyzing Leaf Patterns...
                </p>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes pulse {
                    0% { transform: scale(0.9); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.9); opacity: 0.8; }
                  }
                `}} />
              </div>
            )}
          </div>
          
          <div style={{
            flex: 1,
            padding: '24px',
            backgroundColor: '#fff',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            marginTop: '-24px',
            zIndex: 10,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {isScanning ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  width: '40px', height: '40px',
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #eb9c3f',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ marginTop: '16px', color: '#6d6b67', fontWeight: '500' }}>Processing image with AI models...</p>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}} />
              </div>
            ) : (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                `}} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#1a232c' }}>
                    Disease Detected
                  </h3>
                  <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                    High Confidence
                  </span>
                </div>
                
                <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '12px', border: '1px solid #eaeaec', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#dc2626', fontWeight: 700 }}>
                    Early Blight
                  </h4>
                  <p style={{ margin: 0, color: '#6d6b67', fontSize: '14px', lineHeight: '1.5' }}>
                    Fungal disease caused by Alternaria solani. Identified by characterized dark brown, concentric rings on older leaves.
                  </p>
                </div>
                
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 700, color: '#1a232c' }}>
                  Recommended Action
                </h4>
                <ul style={{ margin: '0 0 24px 0', padding: '0 0 0 20px', color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>
                  <li>Remove and destroy affected lower leaves immediately.</li>
                  <li>Apply copper-based fungicide to protect remaining healthy foliage.</li>
                  <li>Ensure proper spacing for adequate airflow between plants.</li>
                  <li>Adopt drip irrigation rather than overhead watering.</li>
                </ul>
                
                <button style={{
                  width: '100%', padding: '16px',
                  backgroundColor: '#eb9c3f', color: 'white',
                  border: 'none', borderRadius: '12px',
                  fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(235, 156, 63, 0.3)'
                }}>
                  View Treatment Products
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropReader;
