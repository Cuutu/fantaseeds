'use client';
import { useState, useEffect } from 'react';

function AgeVerificationModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1500); // 5 segundos de espera

    return () => clearTimeout(timer);
  }, []);

  const handleYes = () => {
    setShowModal(false);
  };

  const handleNo = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative bg-black/40 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full border border-white/10">
        <div className="mb-6 sm:mb-8 text-center">
          <img
            src="https://i.imgur.com/YcJ9dfr.png"
            alt="FANTASEEDS"
            className="w-32 sm:w-48 mx-auto"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          ¿SOS MAYOR DE 18 AÑOS?
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <button
            onClick={handleYes}
            className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                     text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-green-500/20
                     hover:shadow-green-500/30"
          >
            SI
          </button>
          
          <button
            onClick={handleNo}
            className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                     text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-red-500/20
                     hover:shadow-red-500/30"
          >
            NO
          </button>
        </div>

        <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-400">
          Este sitio está destinado únicamente para mayores de 18 años.
        </p>
      </div>
    </div>
  );
}

export default AgeVerificationModal; 