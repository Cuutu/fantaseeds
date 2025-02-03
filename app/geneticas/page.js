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
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [showModal, setShowModal] = useState(false);
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

  const handleSort = (option) => {
    setSortBy(option);
    let sorted = [...filteredGenetics];
    
    switch(option) {
      case 'price-low':
        sorted.sort((a, b) => a.precio - b.precio);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.precio - a.precio);
        break;
      case 'a-z':
        sorted.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'z-a':
        sorted.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'best-selling':
        // Ordenar por menor stock (más vendidos)
        sorted.sort((a, b) => a.stock - b.stock);
        break;
      case 'featured':
        // Mostrar primero las destacadas
        sorted.sort((a, b) => {
          if (a.destacado && !b.destacado) return -1;
          if (!a.destacado && b.destacado) return 1;
          return 0;
        });
        break;
      default:
        sorted = [...genetics];
    }
    
    setFilteredGenetics(sorted);
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
        <div className="flex justify-between mb-4 items-center">
          {/* Dropdown de ordenamiento */}
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              Ordenar por: {sortBy === 'featured' ? 'Destacados' : 
                           sortBy === 'price-low' ? 'Precio: Menor a Mayor' :
                           sortBy === 'price-high' ? 'Precio: Mayor a Menor' :
                           sortBy === 'a-z' ? 'A-Z' :
                           sortBy === 'z-a' ? 'Z-A' :
                           sortBy === 'best-selling' ? 'Más Vendidos' : 'Destacados'}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  showSort ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Menú desplegable */}
            {showSort && (
              <div className="absolute z-10 mt-2 w-56 rounded-lg bg-gray-800 shadow-lg">
                <div className="py-1">
                  <button
                    onClick={() => {handleSort('featured'); setShowSort(false);}}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                  >
                    Destacados
                  </button>
                  <button
                    onClick={() => {handleSort('a-z'); setShowSort(false);}}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                  >
                    A-Z
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botón de filtros existente */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Límite de Membresía Alcanzado</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-300">
                Llegaste al límite de tu membresía. ¿Querés aumentar tu límite?{' '}
                <a href="#" className="text-green-400 hover:text-green-300 underline">
                  Hacé click acá para upgradear
                </a>
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}