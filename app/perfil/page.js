'use client';
import { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

export default function Perfil() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    calle: '',
    numero: '',
    codigoPostal: ''
  });

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
        </div>

        {/* Contenido Principal */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Información Personal */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Información Personal</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
                {isEditing ? 'Guardar' : 'Editar Perfil'}
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Nombre y Apellido</p>
                <p className="text-white text-lg">{session?.user?.nombreApellido}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Usuario</p>
                <p className="text-white text-lg">{session?.user?.usuario}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white text-lg">{session?.user?.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Membresía</p>
                <p className="text-white text-lg">{session?.user?.membresia}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Fecha de Alta</p>
                <p className="text-white text-lg">{session?.user?.fechaAlta}</p>
              </div>
            </div>
          </div>

          {/* Domicilio */}
          <div className="bg-gray-800/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Domicilio</h2>
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Calle</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.calle}
                    onChange={(e) => setFormData({...formData, calle: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Ingresa tu calle"
                  />
                ) : (
                  <p className="text-white text-lg">{formData.calle || 'No especificado'}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Número</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.numero}
                    onChange={(e) => setFormData({...formData, numero: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Ingresa el número"
                  />
                ) : (
                  <p className="text-white text-lg">{formData.numero || 'No especificado'}</p>
                )}
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Código Postal</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.codigoPostal}
                    onChange={(e) => setFormData({...formData, codigoPostal: e.target.value})}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Ingresa el código postal"
                  />
                ) : (
                  <p className="text-white text-lg">{formData.codigoPostal || 'No especificado'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 