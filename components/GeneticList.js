'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';

export default function GeneticList({ geneticas }) {
  const { addToCart, cart } = useCart();
  const { data: session } = useSession();
  const [quantities, setQuantities] = useState({});
  const [error, setError] = useState('');

  // Obtener límite según membresía
  const getMembershipLimit = () => {
    if (!session?.user?.membresia) return 0;
    
    // Extraer el número de la membresía (10G -> 10)
    const limit = parseInt(session.user.membresia);
    return isNaN(limit) ? 0 : limit;
  };

  const getCurrentCartQuantity = () => {
    return cart.reduce((total, item) => total + item.cantidad, 0);
  };

  const handleAddToCart = (genetic) => {
    if (!session) {
      setError('Debes iniciar sesión para comprar');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const quantity = parseInt(quantities[genetic._id] || 10);
    const currentCartQuantity = getCurrentCartQuantity();
    const membershipLimit = getMembershipLimit();

    // Verificar el stock disponible
    const currentInCart = cart.find(item => item.genetic._id === genetic._id)?.cantidad || 0;
    const totalRequested = currentInCart + quantity;

    if (totalRequested > genetic.stock) {
      setError(
        <div className="flex flex-col items-center">
          <span>No hay stock suficiente. Stock disponible: {genetic.stock} unidades</span>
          <span>Ya tienes {currentInCart} unidades en el carrito</span>
        </div>
      );
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Verificar límite de membresía
    if (currentCartQuantity + quantity > membershipLimit) {
      setError(
        <div className="flex flex-col items-center">
          <span>Llegaste al límite de tu membresía {session.user.membresia}</span>
          <a 
            href="https://wa.me/5491127064165" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 underline mt-1"
          >
            Podés upgradearla vía WhatsApp
          </a>
        </div>
      );
      setTimeout(() => setError(''), 5000);
      return;
    }

    addToCart(genetic, quantity);
  };

  const handleQuantityChange = (genetic, value) => {
    const newQuantity = parseInt(value);
    if (newQuantity <= 0) {
      setQuantities({ ...quantities, [genetic._id]: 1 });
      return;
    }

    const currentCartQuantity = getCurrentCartQuantity();
    const membershipLimit = getMembershipLimit();
    const currentItemQuantity = quantities[genetic._id] || 0;
    
    const totalWithNewQuantity = currentCartQuantity - currentItemQuantity + newQuantity;

    if (totalWithNewQuantity > membershipLimit) {
      setError(
        <div className="flex flex-col items-center">
          <span>Llegaste al límite de tu membresía {session.user.membresia}</span>
          <a 
            href="https://wa.me/5491127064165" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 underline mt-1"
          >
            Podés upgradearla vía WhatsApp
          </a>
        </div>
      );
      setTimeout(() => setError(''), 5000);
      return;
    }

    setQuantities({
      ...quantities,
      [genetic._id]: newQuantity
    });
  };

  return (
    <>
      {error && (
        <div className="fixed top-20 left-4 right-4 md:right-auto md:left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {geneticas.map((genetic) => (
          <div key={genetic._id} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 border border-gray-700/50">
            {/* Imagen */}
            <div className="relative h-48 sm:h-64 overflow-hidden">
              <img
                src={genetic.imagen || "/placeholder.jpg"}
                alt={genetic.nombre}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  ${genetic.precio}
                </span>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {genetic.nombre}
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {genetic.descripcion}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gray-700/30 rounded-lg p-2 sm:p-3">
                  <span className="text-gray-400 text-xs block mb-1">THC</span>
                  <span className="text-white font-semibold">{genetic.thc}%</span>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-2 sm:p-3">
                  <span className="text-gray-400 text-xs block mb-1">Stock</span>
                  <span className="text-white font-semibold">{genetic.stock} u.</span>
                </div>
              </div>

              {/* Cantidad y Botón */}
              <div className="flex items-center gap-2 sm:gap-4">
                <select
                  value={quantities[genetic._id] || 10}
                  onChange={(e) => setQuantities({
                    ...quantities,
                    [genetic._id]: parseInt(e.target.value)
                  })}
                  className="bg-gray-700 text-white rounded px-2 py-1"
                >
                  <option value={10}>10</option>
                </select>
                <button
                  onClick={() => handleAddToCart(genetic)}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-3 sm:px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                >
                  Agregar
                </button>
              </div>

              {/* Límite de membresía */}
              <p className="text-gray-500 text-xs mt-3 sm:mt-4 text-center">
                Disponible: {getMembershipLimit() - getCurrentCartQuantity()}G de {getMembershipLimit()}G
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
} 