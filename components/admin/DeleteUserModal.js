'use client';

export default function DeleteUserModal({ isOpen, onClose, onConfirm, user, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full text-gray-100">
        <h2 className="text-xl font-bold mb-4 text-red-400">Confirmar Eliminación</h2>
        
        <p className="mb-4">
          ¿Estás seguro que deseas eliminar al usuario <span className="font-semibold">{user.nombreApellido}</span>?
        </p>
        
        <p className="mb-6 text-sm text-gray-400">
          Esta acción no se puede deshacer.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Eliminando...' : 'Eliminar Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
} 