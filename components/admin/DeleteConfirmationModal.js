export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, geneticName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-xl font-semibold text-white mb-4">Confirmar Eliminación</h3>
        
        <p className="text-gray-300 mb-6">
          ¿Estás seguro de que quieres eliminar la genética <span className="font-semibold text-white">{geneticName}</span>?
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
} 