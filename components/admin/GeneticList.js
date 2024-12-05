'use client';
import { useState } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditGeneticModal from './EditGeneticModal';
import GeneticModal from './GeneticModal';
import { FiPlus } from 'react-icons/fi';

export default function GeneticList({ genetics, onGeneticDeleted }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
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

  const GeneticCard = ({ genetic }) => (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center space-x-4 mb-4">
        <img 
          src={genetic.imagen} 
          alt={genetic.nombre}
          className="h-16 w-16 rounded-lg object-cover"
        />
        <div>
          <h3 className="text-lg font-medium text-gray-200">{genetic.nombre}</h3>
          <p className="text-gray-400">THC: {genetic.thc}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-400">Precio</p>
          <p className="text-gray-200">${genetic.precio}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Stock</p>
          <p className="text-gray-200">{genetic.stock}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleEditClick(genetic)}
          className="flex-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 py-2 rounded-lg transition-colors"
        >
          Editar
        </button>
        <button
          onClick={() => handleDeleteClick(genetic)}
          className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 py-2 rounded-lg transition-colors"
        >
          Eliminar
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-white">Gestión de Genéticas</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Nueva Genética
        </button>
      </div>

      {/* Vista móvil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {genetics.map((genetic) => (
          <GeneticCard key={genetic._id} genetic={genetic} />
        ))}
      </div>

      {/* Vista desktop */}
      <div className="hidden lg:block bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
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
        </div>
      </div>

      {/* Modales */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        geneticName={selectedGenetic?.nombre}
      />

      {showEditModal && (
        <EditGeneticModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          genetic={selectedGenetic}
          onGeneticUpdated={onGeneticDeleted}
        />
      )}

      {showAddModal && (
        <GeneticModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onGeneticCreated={() => {
            onGeneticDeleted();
            setShowAddModal(false);
          }}
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