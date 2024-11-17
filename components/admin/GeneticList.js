'use client';
import { useState } from 'react';
import { FiTrash2, FiEdit } from 'react-icons/fi';
import DeleteGeneticModal from './DeleteGeneticModal';

export default function GeneticList({ genetics, onGeneticDeleted, onAddGenetic }) {
  const [selectedGenetic, setSelectedGenetic] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filter, setFilter] = useState('');

  const handleDeleteClick = (genetic) => {
    if (genetic.stock > 0) {
      const confirmar = window.confirm(`Esta genética tiene ${genetic.stock} unidades en stock. ¿Estás seguro de eliminarla?`);
      if (!confirmar) return;
    }
    setSelectedGenetic(genetic);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedGenetic) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/genetics/${selectedGenetic._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar la genética');
      }

      setShowDeleteModal(false);
      setSelectedGenetic(null);
      onGeneticDeleted();
      setSuccessMessage(`${selectedGenetic.nombre} fue eliminado exitosamente`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredGenetics = genetics.filter(genetic => 
    genetic.nombre.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Gestión de Genéticas</h1>
        <button 
          onClick={onAddGenetic}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <span className="mr-2">+</span>
          Nueva Genética
        </button>
      </div>

      <div className="overflow-x-auto">
        <input
          type="text"
          placeholder="Buscar genética..."
          className="mb-4 p-2 rounded bg-gray-700 text-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                THC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredGenetics.map((genetic) => (
              <tr key={genetic._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={genetic.imagen} 
                    alt={genetic.nombre}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {genetic.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {genetic.thc}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  ${genetic.precio}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                  {genetic.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    className="text-blue-400 hover:text-blue-300"
                    onClick={() => handleEditClick(genetic)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-400 hover:text-red-300"
                    onClick={() => handleDeleteClick(genetic)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-4">Confirmar eliminación</h3>
            <p className="text-gray-300 mb-4">
              ¿Estás seguro de que deseas eliminar {selectedGenetic?.nombre}?
            </p>
            {error && (
              <p className="text-red-400 mb-4">{error}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 