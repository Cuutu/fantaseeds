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
    <div className="p-6">
      <GeneticList 
        genetics={genetics} 
        onGeneticDeleted={handleGeneticDeleted}
        onAddGenetic={handleAddGenetic}
      />

      {isModalOpen && (
        <GeneticModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onGeneticCreated={handleGeneticCreated}
        />
      )}
    </div>
  );
} 