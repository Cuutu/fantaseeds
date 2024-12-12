'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function UserModal({ isOpen, onClose, onUserCreated }) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    nombreApellido: '',
    email: '',
    membresia: '10G'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Enviando datos:', formData);

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: formData.usuario,
          password: formData.password,
          nombreApellido: formData.nombreApellido,
          email: formData.email,
          membresia: formData.membresia
        })
      });

      const data = await response.json();

      if (data.success) {
        onUserCreated();
        onClose();
        setFormData({
          usuario: '',
          password: '',
          nombreApellido: '',
          email: '',
          membresia: '10G',
          domicilio: {
            calle: '',
            numero: '',
            codigoPostal: '',
            ciudad: '',
            provincia: ''
          }
        });
      } else {
        throw new Error(data.error || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto text-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-green-400">Nuevo Usuario</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Usuario</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
              value={formData.usuario}
              onChange={(e) => setFormData({...formData, usuario: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Contraseña</label>
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Nombre y Apellido</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
              value={formData.nombreApellido}
              onChange={(e) => setFormData({...formData, nombreApellido: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Membresía</label>
            <select
              name="membresia"
              value={formData.membresia}
              onChange={(e) => setFormData({...formData, membresia: e.target.value})}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
              required
            >
              <option value="10G">10G</option>
              <option value="20G">20G</option>
              <option value="30G">30G</option>
              <option value="40G">40G</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 ${
                loading ? 'cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 