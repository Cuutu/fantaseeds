'use client';
import { useState, useEffect } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import GeneticModal from '@/components/admin/GeneticModal';
import EditGeneticModal from '@/components/admin/EditGeneticModal';
import GeneticList from '@/components/admin/GeneticList';

export default function GeneticsPage() {
  const [genetics, setGenetics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGenetics = async () => {
    try {
      const response = await fetch('/api/genetics');
      const data = await response.json();
      
      if (data.success) {
        setGenetics(data.genetics);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenetics();
  }, []);

  const handleGeneticDeleted = () => {
    fetchGenetics(); // Recargar la lista después de eliminar
  };

  const handleGeneticCreated = () => {
    fetchGenetics(); // Recargar la lista después de crear
    setIsModalOpen(false); // Cerrar el modal
  };

  const handleAddGenetic = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6 md:pl-8">
      <div className="max-w-6xl">
        {/* Header y controles */}
        <div className="mb-8 space-y-6">
          {/* Título y botón de nueva genética */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-white">Gestión de Genéticas</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <FiPlus className="h-5 w-5" />
              Nueva Genética
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Buscar genética..."
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
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
            {/* ... resto del código de la tabla ... */}
          </table>
        </div>
      </div>
    </div>
  );
} 