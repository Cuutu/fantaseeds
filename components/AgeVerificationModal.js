'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgeVerificationModal() {
  const handleYes = () => {
    window.location.href = '/';
  };

  const handleNo = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative bg-black/40 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/10"
        >
          <div className="mb-8 text-center">
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              src="https://i.imgur.com/YcJ9dfr.png"
              alt="FANTASEEDS"
              className="w-48 mx-auto"
            />
          </div>

          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent"
          >
            ¿SOS MAYOR DE 18 AÑOS?
          </motion.h2>

          <div className="flex gap-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleYes}
              className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                         text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-green-500/20
                         hover:shadow-green-500/30"
            >
              SI
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNo}
              className="px-12 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                         text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-red-500/20
                         hover:shadow-red-500/30"
            >
              NO
            </motion.button>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-sm text-gray-400"
          >
            Este sitio está destinado únicamente para mayores de 18 años.
          </motion.p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 