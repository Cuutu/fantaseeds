'use client';
import { FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuccessModal({ isOpen, orderId, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="text-center space-y-6">
            {/* Icono de éxito con animación */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
            </motion.div>

            {/* Título y mensaje */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white">
                ¡Pedido realizado con éxito!
              </h2>
              <p className="text-gray-400">
                Gracias por tu compra. Te notificaremos cuando tu pedido esté listo.
              </p>
            </div>

            {/* Número de pedido */}
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400">Número de pedido</p>
              <p className="text-lg font-mono text-white">{orderId}</p>
            </div>

            {/* Botón de aceptar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-500 transition-colors w-full"
            >
              Aceptar
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
} 