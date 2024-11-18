'use client';
import { useState, useEffect } from 'react';
import { FiPlus, FiSearch } from 'react-icons/fi';
import GeneticModal from '@/components/admin/GeneticModal';
import GeneticList from '@/components/admin/GeneticList';

export default function GeneticsPage() {
  const [genetics, setGenetics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGenetics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/genetics');
      const data = await response.json();
      
      if (data.success) {
        setGenetics(data.genetics);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching genetics:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenetics();
  }, []);

  const handleGeneticDeleted = () => {
    fetchGenetics();
  };

  const handleAddGenetic = () => {
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-4 text-white">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-6 md:pl-8">
      <div className="max-w-6xl mt-8">
        <div className="mb-8 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-white">
              Gestión de Genéticas
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg transition-colors duration-200"
            >
              <FiPlus className="h-5 w-5" />
              Nueva Genética
            </button>
          </div>

          <GeneticList 
            genetics={genetics} 
            onGeneticDeleted={handleGeneticDeleted}
            onAddGenetic={handleAddGenetic}
          />

          {isModalOpen && (
            <GeneticModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onGeneticCreated={() => {
                fetchGenetics();
                setIsModalOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
} 