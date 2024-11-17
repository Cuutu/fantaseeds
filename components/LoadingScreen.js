'use client';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-white text-6xl font-bold tracking-wider" 
              style={{ 
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '0.15em'
              }}>
            FANTASEEDS
          </h1>
          <h2 className="text-white text-2xl tracking-[0.3em] font-light">
            BUENOS AIRES
          </h2>
        </div>
        
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-t-green-500 border-white rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
} 