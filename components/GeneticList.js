'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function GeneticList({ geneticas }) {
  const { data: session } = useSession();
  const [membresia, setMembresia] = useState('10G');
  const [disponible, setDisponible] = useState(10);
  const { cart, addToCart } = useCart();
  const [selectedQuantities, setSelectedQuantities] = useState({});

  useEffect(() => {
    if (session?.user) {
      // Obtener la membresía actual del usuario
      const fetchMembresia = async () => {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          const data = await response.json();
          if (data.success) {
            setMembresia(data.user.membresia || '10G');
            
            // Calcular gramos disponibles
            const totalMembresia = parseInt(data.user.membresia) || 0;
            const totalEnCarrito = cart.reduce((acc, item) => acc + item.cantidad, 0);
            setDisponible(totalMembresia - totalEnCarrito);
          }
        } catch (error) {
          console.error('Error al obtener membresía:', error);
        }
      };

      fetchMembresia();
    }
  }, [session, cart]);

  // Manejar cambio de cantidad
  const handleQuantityChange = (geneticId, quantity) => {
    setSelectedQuantities({
      ...selectedQuantities,
      [geneticId]: quantity
    });
  };

  // Manejar agregar al carrito
  const handleAddToCart = (genetic) => {
    const quantity = parseInt(selectedQuantities[genetic._id] || 10); // Default a 10 si no hay selección
    addToCart({
      genetic,
      cantidad: quantity
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.isArray(geneticas) && geneticas.map((genetic) => (
        <div key={genetic._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="relative h-64 w-full">
            <Image
              src={genetic.imagen}
              alt={genetic.nombre}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full">
              ${genetic.precio}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-xl font-bold text-white mb-2">{genetic.nombre}</h3>
            <p className="text-gray-400 mb-4">{genetic.descripcion}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-gray-400">THC</span>
                <div className="text-white font-bold">{genetic.thc}%</div>
              </div>
              <div>
                <span className="text-gray-400">Stock</span>
                <div className="text-white font-bold">{genetic.stock} u.</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input 
                type="number"
                value={10}
                readOnly
                className="bg-gray-700 text-white rounded px-3 py-2 w-24 cursor-not-allowed opacity-75"
              />
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex-grow transition-colors"
                onClick={() => handleAddToCart(genetic)}
                disabled={!session || genetic.stock <= 0}
              >
                {genetic.stock <= 0 ? 'Sin Stock' : 'Agregar'}
              </button>
            </div>

            <div className="text-sm text-gray-400 mt-2">
              Disponible: {disponible}G de {membresia}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 