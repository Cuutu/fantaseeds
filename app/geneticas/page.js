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
        
        console.log('Respuesta de la API:', data); // Para debugging
        
        if (data.success) {
          setGenetics(data.genetics);
        } else {
          setError(data.error);
        }
      } catch (error) {
        console.error('Error fetching genetics:', error);
        setError('Error al cargar las genéticas');
      } finally {
        setLoading(false);
      }
    };

    fetchGenetics();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!genetics.length) return <div>No hay genéticas disponibles</div>;

  return (
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