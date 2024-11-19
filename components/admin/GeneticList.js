'use client';
import { useState } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditGeneticModal from './EditGeneticModal';

export default function GeneticList({ genetics, onGeneticDeleted }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGenetic, setSelectedGenetic] = useState(null);
  const [error, setError] = useState('');

  const handleEditClick = (genetic) => {
    setSelectedGenetic(genetic);
    setShowEditModal(true);
  };

  const handleDeleteClick = (genetic) => {
    setSelectedGenetic(genetic);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGenetic) return;
    
    try {
      const response = await fetch(`/api/genetics/${selectedGenetic._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        onGeneticDeleted();
        setShowDeleteModal(false);
        setSelectedGenetic(null);
      } else {
        throw new Error(data.error || 'Error al eliminar la genética');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  return (
    <div>
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
          {genetics.map((genetic) => (
            <tr key={genetic._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <img 
                  src={genetic.imagen} 
                  alt={genetic.nombre}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-200">{genetic.nombre}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-200">{genetic.thc}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-200">${genetic.precio}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-200">{genetic.stock}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => handleEditClick(genetic)}
                  className="text-blue-400 hover:text-blue-300 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(genetic)}
                  className="text-red-400 hover:text-red-300"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Eliminación */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        geneticName={selectedGenetic?.nombre}
      />

      {/* Modal de Edición */}
      {showEditModal && (
        <EditGeneticModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          genetic={selectedGenetic}
          onGeneticUpdated={onGeneticDeleted}
        />
      )}

      {/* Mensaje de Error */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
} 