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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiEdit2 className="w-4 h-4" />
          {isEditing ? 'Guardar' : 'Editar Perfil'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Información Personal (No editable) */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Información Personal</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Nombre y Apellido</p>
              <p className="text-white">{session?.user?.nombreApellido}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Usuario</p>
              <p className="text-white">{session?.user?.usuario}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white">{session?.user?.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Membresía</p>
              <p className="text-white">{session?.user?.membresia}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Fecha de Alta</p>
              <p className="text-white">{session?.user?.fechaAlta}</p>
            </div>
          </div>
        </div>

        {/* Domicilio (Editable) */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Domicilio</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400 text-sm">Calle</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.calle}
                  onChange={(e) => setFormData({...formData, calle: e.target.value})}
                  className="bg-gray-800 text-white p-2 rounded mt-1 w-full"
                  placeholder="Ingresa tu calle"
                />
              ) : (
                <p className="text-white">{formData.calle || 'No especificado'}</p>
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm">Número</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData({...formData, numero: e.target.value})}
                  className="bg-gray-800 text-white p-2 rounded mt-1 w-full"
                  placeholder="Ingresa el número"
                />
              ) : (
                <p className="text-white">{formData.numero || 'No especificado'}</p>
              )}
            </div>
            <div>
              <p className="text-gray-400 text-sm">Código Postal</p>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.codigoPostal}
                  onChange={(e) => setFormData({...formData, codigoPostal: e.target.value})}
                  className="bg-gray-800 text-white p-2 rounded mt-1 w-full"
                  placeholder="Ingresa el código postal"
                />
              ) : (
                <p className="text-white">{formData.codigoPostal || 'No especificado'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 