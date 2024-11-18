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
    <>
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
    </>
  );
} 