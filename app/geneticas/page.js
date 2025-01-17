'use client'
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

    // Filtrar por THC
    filtered = filtered.filter(genetic => 
      genetic.thc >= filters.thcRange[0] && 
      genetic.thc <= filters.thcRange[1]
    );

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
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            Filtros
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                showFilters ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Lista de genéticas */}
        <div className="w-full">
          <GeneticList geneticas={filteredGenetics} />
        </div>

        {/* Overlay y Panel de filtros */}
        {showFilters && (
          <>
            {/* Overlay difuminado */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
              onClick={() => setShowFilters(false)}
            />
            
            {/* Panel lateral */}
            <div className="fixed right-0 top-0 h-full w-80 bg-yellow-400 z-50 transform transition-transform duration-300 ease-in-out">
              <GeneticFilter 
                onFilter={handleFilter} 
                maxPrice={Math.max(...genetics.map(g => g.precio), 10000)}
                onClose={() => setShowFilters(false)}
                totalProducts={filteredGenetics.length}
              />
            </div>
          </>
        )}
      </div>
      <Cart />
    </div>
  );
}