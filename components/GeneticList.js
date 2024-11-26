'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function GeneticList({ geneticas }) {
  const { data: session } = useSession();
  const [membresia, setMembresia] = useState('0G');
  const [disponible, setDisponible] = useState(0);
  const { cart } = useCart();

  useEffect(() => {
    if (session?.user) {
      // Obtener la membresía actual del usuario
      const fetchMembresia = async () => {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          const data = await response.json();
          if (data.success) {
            setMembresia(data.user.membresia || '0G');
            
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {geneticas.map((genetic) => (
        <div key={genetic._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          {/* ... resto del código de la tarjeta ... */}
          
          <div className="p-4">
            {/* ... otros elementos ... */}
            
            <div className="text-sm text-gray-400 mt-2">
              Disponible: {disponible}G de {membresia}
              {disponible <= 0 && (
                <div className="text-red-500 mt-1">
                  Llegaste al límite de tu membresía
                  <a 
                    href="https://wa.me/tunumero" 
                    className="text-green-500 hover:text-green-400 ml-2"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Podés upgradearla vía WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 