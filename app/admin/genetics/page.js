'use client';
import { useState, useEffect } from 'react';
import GeneticList from '@/components/admin/GeneticList';
import GeneticModal from '@/components/admin/GeneticModal';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminGenetics() {
  const [genetics, setGenetics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  const fetchGenetics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/genetics');
      if (!response.ok) {
        throw new Error('Error al cargar las genéticas');
      }
      const data = await response.json();
      setGenetics(data);
    } catch (error) {
      console.error('Error fetching genetics:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session || session.user.rol !== 'admin') {
      router.push('/');
      return;
    }
    fetchGenetics();
  }, [session, router]);

  const handleGeneticCreated = () => {
    fetchGenetics();
  };

  const handleGeneticDeleted = async () => {
    console.log('Genética eliminada, actualizando lista...');
    await fetchGenetics();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded p-4 text-red-300">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-400">Gestión de Genéticas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Nueva Genética
        </button>
      </div>

      <GeneticList 
        genetics={genetics} 
        onGeneticDeleted={handleGeneticDeleted}
      />

      <GeneticModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGeneticCreated={handleGeneticCreated}
      />
    </div>
  );
} 