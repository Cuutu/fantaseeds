'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
        <div className="relative w-96 h-32 mb-8">
          <Image
            src="https://i.imgur.com/XTwltQ6.png"
            alt="FANTASEEDS"
            fill
            className="object-contain"
            priority
          />
        </div>
        
        {/* Contenedor del spinner centrado horizontalmente */}
        {/*<div className="flex justify-center">
          {/* Spinner circular animado con borde verde en la parte superior 
          <div className="w-8 h-8 border-4 border-t-green-500 border-white rounded-full animate-spin"></div>
        </div>*/}
      </div>
    </div>
  );
} 