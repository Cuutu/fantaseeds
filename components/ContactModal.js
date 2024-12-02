'use client';
import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import { Crimson_Text } from 'next/font/google';
import { Tajawal } from 'next/font/google';

const crimsonText = Crimson_Text({ weight: ['400', '600', '700'], subsets: ['latin'] });
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
      'legal': 'Consulta Legal',
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg blur opacity-25"></div>
        <div className="absolute -inset-1 bg-amber-500 rounded-lg opacity-10"></div>
        
        <div className="relative bg-black p-8 rounded-lg shadow-xl backdrop-blur-sm border border-amber-500/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-3xl font-bold bg-gradient-to-r from-[#556B2F] to-[#6B8E23] bg-clip-text text-transparent ${crimsonText.className}`}>
              Inscripción
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                <option value="legal">Consulta Legal</option>
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

            <button
              type="submit"
              className="w-full bg-[#556B2F] hover:bg-[#4A5D29] text-white font-medium py-3 px-4 
                       rounded-lg transition-colors duration-300"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar Mensaje'}
            </button>

            {status === 'success' && (
              <p className="text-green-400 text-center bg-green-900 bg-opacity-50 p-3 
                         rounded-xl font-medium border border-green-500">
                ¡Mensaje enviado con éxito!
              </p>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-center bg-red-900 bg-opacity-50 p-3 
                         rounded-xl font-medium border border-red-500">
                Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 