'use client';
import { useState } from 'react';

export default function EditUserModal({ isOpen, onClose, onUserUpdated, user }) {
  const [formData, setFormData] = useState({
    nombreApellido: user.nombreApellido || '',
    email: user.email || '',
    usuario: user.usuario || '',
    membresia: user.membresia || '',
    rol: user.rol || 'usuario'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Si no está abierto, no renderizar nada
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          membresia: formData.membresia
        }),
      });

      const data = await response.json();

      if (data.success) {
        onUserUpdated();
        onClose();
      } else {
        throw new Error(data.error || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-white mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Usuario</label>
            <input
              type="text"
              value={formData.usuario}
              onChange={(e) => setFormData({...formData, usuario: e.target.value})}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Nombre y Apellido</label>
            <input
              type="text"
              value={formData.nombreApellido}
              onChange={(e) => setFormData({...formData, nombreApellido: e.target.value})}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Membresía</label>
            <select
              value={formData.membresia}
              onChange={(e) => setFormData({...formData, membresia: e.target.value})}
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100"
            >
              <option value="10G">10G</option>
              <option value="20G">20G</option>
              <option value="30G">30G</option>
            </select>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 