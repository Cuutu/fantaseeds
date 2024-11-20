'use client';

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
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
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-16 relative">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://i.imgur.com/2RJ5Shi.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: '0.1'
        }}
      />
      
      <div className="absolute inset-0 bg-gray-900/90 z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg blur opacity-25"></div>
          <div className="absolute -inset-1 bg-blue-500 rounded-lg opacity-10"></div>
          
          <div className="relative bg-gray-800/90 p-8 rounded-lg shadow-xl backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-center mb-8 text-green-400">
              Contactanos
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-gray-300 mb-2">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  id="nombre"
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                           text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                           text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-300 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                           text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="motivo" className="block text-sm font-medium text-gray-300 mb-2">
                  Motivo de contacto *
                </label>
                <select
                  id="motivo"
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                           text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-300 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  required
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg 
                           text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={formData.mensaje}
                  onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 
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
    </section>
  );
} 