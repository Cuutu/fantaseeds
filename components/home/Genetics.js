'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function Genetics() {
  const { data: session } = useSession();
  const [genetics, setGenetics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenetics = async () => {
      try {
        const response = await fetch('/api/genetics/public');
        const data = await response.json();

        if (data.success) {
          setGenetics(data.genetics);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        setError('Error al cargar las genéticas');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchGenetics();
    }
  }, [session]);

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <section id="genetics" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">Cargando genéticas...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="genetics" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-400">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="genetics" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-green-400">
          Nuestras Genéticas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {genetics.map((genetic) => (
            <div 
              key={genetic._id} 
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <img
                  src={genetic.imagen}
                  alt={genetic.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {genetic.nombre}
                </h3>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-green-400 font-medium">
                    THC: {genetic.thc}%
                  </span>
                  <span className="text-gray-300 font-medium">
                    Stock: {genetic.stock}
                  </span>
                </div>

                <p className="text-gray-400 mb-4 line-clamp-3">
                  {genetic.descripcion}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-400">
                    ${genetic.precio}
                  </span>
                  {genetic.stock > 0 ? (
                    <span className="text-green-500 font-medium">
                      Disponible
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">
                      Sin stock
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 