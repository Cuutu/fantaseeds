'use client';
import { useState } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

export default function Perfil() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    calle: session?.user?.domicilio?.calle || '',
    numero: session?.user?.domicilio?.numero || '',
    codigoPostal: session?.user?.domicilio?.codigoPostal || ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  if (!session) {
    return <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
      <p className="text-white">Cargando...</p>
    </div>;
  }

  return (
    <div className="container mx-auto px-4 pt-16 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Información Personal</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200 flex items-center"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Cambiar Contraseña
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors duration-200 flex items-center"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Perfil
              </button>
            </div>
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
              <p className="text-white text-lg">
                {new Date(session?.user?.fechaAlta).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6">Domicilio</h2>
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

      {/* Modal de Cambio de Contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Cambiar Contraseña</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="newPassword"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
                >
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const handlePasswordChange = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  if (formData.get('newPassword') !== formData.get('confirmPassword')) {
    alert('Las contraseñas no coinciden');
    return;
  }

  try {
    const response = await fetch('/api/users/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert('Contraseña actualizada correctamente');
      setShowPasswordModal(false);
    } else {
      alert(data.error || 'Error al actualizar la contraseña');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al actualizar la contraseña');
  }
}; 