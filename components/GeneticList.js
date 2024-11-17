'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaLeaf, FaBoxes } from 'react-icons/fa';

export default function GeneticList({ geneticas }) {
  const { cart, addToCart } = useCart();
  const { data: session, status } = useSession();
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Agregamos logs para debug
  useEffect(() => {
    console.log('Status:', status);
    console.log('Session:', session);
    console.log('User:', session?.user);
    console.log('Membresía:', session?.user?.membresia);
  }, [session, status]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          const data = await response.json();
          if (data.success) {
            // Actualizamos el estado con la membresía del usuario
            session.user.membresia = data.user.membresia;
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsLoading(false);
        }
      }
    };

    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session]);

  // Simplificamos la lógica de carga
  if (!session || !geneticas) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-white mb-4">Cargando productos...</p>
      </div>
    );
  }

  // Si no hay membresía, asignamos una por defecto (temporal)
  const userMembership = session?.user?.membresia || '10G';

  // Función para obtener el límite según la membresía
  const getMembershipLimit = (membresia) => {
    switch (membresia) {
      case '10G':
        return 10;
      case '20G':
        return 20;
      case '30G':
        return 30;
      default:
        return 10; // Por defecto, el límite más bajo
    }
  };

  // Obtener el límite actual según la membresía del usuario
  const membershipLimit = getMembershipLimit(session?.user?.membresia);

  // Calcular el total actual en el carrito para una genética específica
  const getCurrentCartQuantity = (geneticId) => {
    return cart.reduce((total, item) => {
      if (item.genetic._id === geneticId) {
        return total + item.cantidad;
      }
      return total;
    }, 0);
  };

  // Verificar si se puede agregar al carrito
  const canAddToCart = (genetic) => {
    const currentCartQuantity = getCurrentCartQuantity(genetic._id);
    const quantityToAdd = parseInt(quantities[genetic._id] || 1);
    const totalQuantity = currentCartQuantity + quantityToAdd;

    return totalQuantity <= membershipLimit;
  };

  const handleAddToCart = (genetic) => {
    const quantity = parseInt(quantities[genetic._id] || 1);
    const currentCartQuantity = getCurrentCartQuantity(genetic._id);
    
    if (currentCartQuantity + quantity > membershipLimit) {
      setAlertMessage(`No puedes agregar más de ${membershipLimit} unidades según tu membresía ${session?.user?.membresia}`);
      setShowAlert(true);
      // Auto cerrar la alerta después de 3 segundos
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    addToCart(genetic, quantity);
  };

  // Manejar cambio de cantidad
  const handleQuantityChange = (geneticId, value) => {
    const newQuantity = parseInt(value);
    const currentCartQuantity = getCurrentCartQuantity(geneticId);
    
    if (currentCartQuantity + newQuantity > membershipLimit) {
      setAlertMessage(`La cantidad total no puede superar ${membershipLimit} unidades según tu membresía ${session?.user?.membresia}`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      
      // Resetear la cantidad al máximo permitido
      const maxAllowed = membershipLimit - currentCartQuantity;
      setQuantities({
        ...quantities,
        [geneticId]: maxAllowed > 0 ? maxAllowed : 1
      });
      return;
    }
    
    setQuantities({
      ...quantities,
      [geneticId]: newQuantity
    });
  };

  return (
    <>
      {/* Alerta flotante */}
      {showAlert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg border border-red-500 flex items-center space-x-3">
            <svg 
              className="w-6 h-6 text-red-500" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{alertMessage}</span>
            <button 
              onClick={() => setShowAlert(false)}
              className="ml-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="pr-80">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          {geneticas.map((genetic) => {
            const minQuantity = 1; // Temporalmente fijamos el mínimo en 1
            const insufficientStock = genetic.stock < minQuantity;
            
            return (
              <div key={genetic._id} 
                   className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                {genetic.imagen && (
                  <div className="relative w-full h-64">
                    <Image
                      src={genetic.imagen}
                      alt={genetic.nombre}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">{genetic.nombre}</h3>
                  
                  <p className="text-gray-400 text-sm">
                    {genetic.descripcion}
                  </p>

                  <div className="flex items-center justify-between text-gray-400">
                    <span className="flex items-center">
                      <FaLeaf className="mr-2" />
                      {genetic.thc}% THC
                    </span>
                    <span className="flex items-center">
                      <FaBoxes className="mr-2" />
                      Stock: {genetic.stock}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-green-500">${genetic.precio}</div>

                  {/* Información de mínimo por membresía */}
                  <div className="text-sm text-gray-400 mt-2">
                    Podes elegir hasta {session?.user?.membresia || '10G'} por tu membresía actual
                  </div>

                  {/* Controles */}
                  <div className="flex items-center gap-4 pt-4">
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max={Math.max(1, membershipLimit - getCurrentCartQuantity(genetic._id))}
                        value={quantities[genetic._id] || 1}
                        onChange={(e) => handleQuantityChange(genetic._id, e.target.value)}
                        className="w-20 px-2 py-1 bg-gray-700 text-white rounded"
                      />
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(genetic)}
                      disabled={genetic.stock === 0 || insufficientStock}
                      className="flex-1 px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
} 