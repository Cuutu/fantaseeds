'use client';
import { useState } from 'react';
import { FiTrash2, FiEdit, FiPlus, FiSearch } from 'react-icons/fi';
import DeleteGeneticModal from './DeleteGeneticModal';
import Image from 'next/image';

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

  const handleDelete = async (id) => {
    if (!selectedGenetic) return;
    
    try {
      const response = await fetch(`/api/genetics/${id}`, {
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

  const filteredGenetics = genetics.filter(genetic => 
    genetic.nombre.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 md:pl-8">
      <div className="max-w-6xl mt-8">
        {/* Solo mantenemos un header con título y botón */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">
            Gestión de Genéticas
          </h1>
          <button
            onClick={onAddGenetic}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200"
          >
            <FiPlus className="h-5 w-5" />
            Nueva Genética
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative max-w-2xl mb-6">
          <input
            type="text"
            placeholder="Buscar genética..."
            className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Tabla de genéticas */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">THC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {genetics && genetics.map((genetic) => (
                <tr key={genetic._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={genetic.imagen}
                        alt={genetic.nombre}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">{genetic.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">{genetic.thc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">${genetic.precio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">{genetic.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(genetic)}
                      className="text-blue-500 hover:text-blue-400 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(genetic._id)}
                      className="text-red-500 hover:text-red-400"
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
    </div>
  );
} 