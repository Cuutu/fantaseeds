'use client';
import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import { EB_Garamond } from 'next/font/google';
import { Tajawal } from 'next/font/google';

// Inicializar las fuentes
const ebGaramond = EB_Garamond({ subsets: ['latin'] });
const tajawal = Tajawal({ 
  weight: ['400', '500', '700'],
  subsets: ['latin']
});

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    motivo: 'consulta',
    mensaje: ''
  });

  const [status, setStatus] = useState('');

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
    }
  }, []);

  const getMotivoText = (value) => {
    const motivos = {
      'consulta': 'Inscripción al club',
      'asesoramiento': 'Consulta General',
      'otro': 'Otro'
    };
    return motivos[value] || value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.nombre,
          from_email: formData.email,
          phone: formData.telefono,
          subject: getMotivoText(formData.motivo),
          message: formData.mensaje,
        }
      );

      setStatus('success');
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        motivo: 'consulta',
        mensaje: ''
      });
      setTimeout(() => {
        onClose();
        setStatus('');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="relative max-w-2xl w-full"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur opacity-25"></div>
            <div className="absolute -inset-1 bg-amber-500 rounded-lg opacity-10"></div>
            
            <motion.div
              className="relative bg-black/80 backdrop-blur-md p-8 rounded-lg shadow-xl border border-amber-500/30"
            >
              <div className="flex justify-between items-center mb-6">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-5xl font-bold text-center mb-8 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] bg-clip-text text-transparent ${ebGaramond.className}`}
                >
                  Inscripción
                </motion.h2>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX size={24} />
                </motion.button>
              </div>

              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div>
                  <label htmlFor="nombre" className={`block text-sm font-medium text-gray-300 mb-2 ${tajawal.className}`}>
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    required
                    className={`w-full px-4 py-2 bg-black border border-gray-700 rounded-lg 
                             text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent ${tajawal.className}`}
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium text-gray-300 mb-2 ${tajawal.className}`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className={`w-full px-4 py-2 bg-black border border-gray-700 rounded-lg 
                             text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent ${tajawal.className}`}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className={`block text-sm font-medium text-gray-300 mb-2 ${tajawal.className}`}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    className={`w-full px-4 py-2 bg-black border border-gray-700 rounded-lg 
                             text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent ${tajawal.className}`}
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  />
                </div>

                <div>
                  <label htmlFor="motivo" className={`block text-sm font-medium text-gray-300 mb-2 ${tajawal.className}`}>
                    Motivo de contacto *
                  </label>
                  <select
                    id="motivo"
                    required
                    className={`w-full px-4 py-2 bg-black border border-gray-700 rounded-lg 
                             text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent ${tajawal.className}`}
                    value={formData.motivo}
                    onChange={(e) => setFormData({...formData, motivo: e.target.value})}
                  >
                    <option value="consulta">Inscripción al club</option>
                    <option value="asesoramiento">Consulta General</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensaje" className={`block text-sm font-medium text-gray-300 mb-2 ${tajawal.className}`}>
                    Mensaje *
                  </label>
                  <textarea
                    id="mensaje"
                    required
                    rows={4}
                    className={`w-full px-4 py-2 bg-black border border-gray-700 rounded-lg 
                             text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent ${tajawal.className}`}
                    value={formData.mensaje}
                    onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#556B2F] hover:bg-[#4A5D29] text-white font-medium py-3 px-4 
                           rounded-lg transition-all duration-300"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Enviando...' : 'Enviar Mensaje'}
                </motion.button>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-green-400 text-center bg-green-900/50 backdrop-blur-sm p-3 
                               rounded-xl font-medium border border-green-500"
                    >
                      ¡Mensaje enviado con éxito!
                    </motion.p>
                  )}
                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-400 text-center bg-red-900/50 backdrop-blur-sm p-3 
                               rounded-xl font-medium border border-red-500"
                    >
                      Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.form>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 