'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GeneticList from '@/components/GeneticList';
import Cart from '@/components/Cart';
import GeneticFilter from '@/components/GeneticFilter';

export default function Genetics() {
  const [genetics, setGenetics] = useState([]);
  const [filteredGenetics, setFilteredGenetics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const fetchGenetics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/genetics/public', {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      const data = await response.json();
      if (data.success) {
        setGenetics(data.genetics);
        setFilteredGenetics(data.genetics);
      } else {
        throw new Error(data.error || 'Error desconocido');
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

  const handleFilter = (filters) => {
    let filtered = [...genetics];

    // Filtrar por disponibilidad
    if (filters.availability.inStock || filters.availability.outOfStock) {
      filtered = filtered.filter(genetic => {
        if (filters.availability.inStock && genetic.stock > 0) return true;
        if (filters.availability.outOfStock && genetic.stock === 0) return true;
        return false;
      });
    }

    // Filtrar por precio
    filtered = filtered.filter(genetic => 
      genetic.precio >= filters.priceRange[0] && 
      genetic.precio <= filters.priceRange[1]
    );

    setFilteredGenetics(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Botón para mostrar/ocultar filtros */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500"
          >
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Panel de filtros */}
          {showFilters && (
            <div className="lg:w-1/4">
              <GeneticFilter 
                onFilter={handleFilter} 
                maxPrice={Math.max(...genetics.map(g => g.precio), 10000)}
              />
            </div>
          )}

          {/* Lista de genéticas */}
          <div className={`${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
            <GeneticList geneticas={filteredGenetics} />
          </div>
        </div>
      </div>
      <Cart />
    </div>
  );
}