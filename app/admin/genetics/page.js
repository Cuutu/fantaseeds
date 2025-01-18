'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminGenetics() {
  const [genetics, setGenetics] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchGenetics();
  }, []);

  const fetchGenetics = async () => {
    try {
      const response = await fetch('/api/genetics');
      const data = await response.json();
      if (data.success) {
        setGenetics(data.genetics);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta genética?')) {
      try {
        const response = await fetch(`/api/genetics/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        if (data.success) {
          alert('Genética eliminada correctamente');
          fetchGenetics(); // Recargar la lista
        } else {
          alert(data.error || 'Error al eliminar la genética');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la genética');
      }
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/genetics/${id}/edit`);
  };

  const handleDestacadoChange = async (geneticId, isDestacado) => {
    try {
      const response = await fetch(`/api/genetics/${geneticId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destacado: isDestacado }),
      });

      if (!response.ok) throw new Error('Error al actualizar');
      
      // Actualizar la lista local
      setGenetics(genetics.map(genetic => 
        genetic._id === geneticId 
          ? { ...genetic, destacado: isDestacado }
          : genetic
      ));
    } catch (error) {
      console.error('Error:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Gestión de Genéticas</h1>
          <Link 
            href="/admin/genetics/new"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            + Nueva Genética
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-white">IMAGEN</th>
                <th className="px-6 py-3 text-left text-white">NOMBRE</th>
                <th className="px-6 py-3 text-left text-white">THC</th>
                <th className="px-6 py-3 text-left text-white">PRECIO</th>
                <th className="px-6 py-3 text-left text-white">STOCK</th>
                <th className="px-6 py-3 text-left text-white">DESTACADO</th>
                <th className="px-6 py-3 text-left text-white">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {genetics.map((genetic) => (
                <tr key={genetic._id} className="border-t border-gray-700">
                  <td className="px-6 py-4">
                    <img 
                      src={genetic.imagen || '/placeholder.jpg'} 
                      alt={genetic.nombre}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 text-white">{genetic.nombre}</td>
                  <td className="px-6 py-4 text-white">{genetic.thc}</td>
                  <td className="px-6 py-4 text-white">${genetic.precio}</td>
                  <td className="px-6 py-4 text-white">{genetic.stock}</td>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={genetic.destacado || false}
                      onChange={(e) => handleDestacadoChange(genetic._id, e.target.checked)}
                      className="form-checkbox bg-gray-700 border-gray-600 text-green-500 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(genetic._id)}
                      className="text-blue-400 hover:text-blue-300 mr-4"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(genetic._id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 