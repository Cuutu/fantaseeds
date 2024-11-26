'use client';
import { useEffect, useState } from 'react';
import GeneticList from '@/components/GeneticList';
import Cart from '@/components/Cart';
import { useRouter } from 'next/navigation';

export default function Genetics() {
  const [genetics, setGenetics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchGenetics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/genetics/public');
      const data = await response.json();
      
      if (data.success) {
        setGenetics(data.genetics);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error al cargar las genéticas');
      console.error('Error fetching genetics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenetics();
  }, []);

  const refreshCatalog = () => {
    fetchGenetics();
    router.refresh();
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 p-4">
      Error: {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:pr-96">
        <GeneticList 
          geneticas={genetics} 
          onUpdate={refreshCatalog}
        />
      </div>
      <Cart />
    </div>
  );
}