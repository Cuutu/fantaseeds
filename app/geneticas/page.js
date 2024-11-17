'use client';
import { useEffect, useState } from 'react';

export default function Genetics() {
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
          setError(data.error);
        }
      } catch (error) {
        setError('Error al cargar las genéticas');
      } finally {
        setLoading(false);
      }
    };

    fetchGenetics();
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Nuestras Genéticas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {genetics.map(genetic => (
          <div 
            key={genetic._id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {genetic.nombre}
              </h2>
              
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">THC:</span> {genetic.thc}%
                </p>
                
                <p className="text-gray-600">
                  <span className="font-medium">Stock:</span> {genetic.stock} unidades
                </p>
                
                <p className="text-green-600 font-bold text-lg">
                  ${genetic.precio}
                </p>
                
                {genetic.descripcion && (
                  <p className="text-gray-600 text-sm mt-2">
                    {genetic.descripcion}
                  </p>
                )}
              </div>

              <button 
                className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-300"
                onClick={() => {/* Aquí irá la lógica para agregar al carrito */}}
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
    <div>
      {genetics.map(genetic => (
        <div key={genetic._id}>
          <h2>{genetic.nombre}</h2>
          <p>THC: {genetic.thc}</p>
          <p>Precio: ${genetic.precio}</p>
          <p>Stock: {genetic.stock}</p>
        </div>
      ))}
    </div>
  );
} 