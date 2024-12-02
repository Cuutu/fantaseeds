'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgeVerificationModal() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Verificar si ya se confirmó la edad anteriormente
    const ageVerified = localStorage.getItem('ageVerified');
    if (!ageVerified) {
      setShowModal(true);
    }
  }, []);

  const handleYes = () => {
    localStorage.setItem('ageVerified', 'true');
    setShowModal(false);
  };

  const handleNo = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!showModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-700"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            ¿SOS MAYOR DE 18 AÑOS?
          </h2>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleYes}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 min-w-[120px]"
            >
              SI
            </button>
            <button
              onClick={handleNo}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 min-w-[120px]"
            >
              NO
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 