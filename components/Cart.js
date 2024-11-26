'use client';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { FaShoppingCart, FaTimes, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { cart, removeFromCart, clearCart, isOpen, setIsOpen } = useCart();
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => {
      return sum + (item.genetic.precio * item.cantidad);
    }, 0);
    setTotal(newTotal);

    if (cart.length > 0) {
      setIsOpen(true);
    }
  }, [cart, setIsOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gray-800 shadow-xl p-6 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FaShoppingCart /> Carrito
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes size={24} />
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-400 text-center">El carrito está vacío</p>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.genetic._id} className="bg-gray-700/50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-medium">{item.genetic.nombre}</h3>
                    <p className="text-gray-400">Cantidad: {item.cantidad} unidades</p>
                    <p className="text-green-500">${item.genetic.precio * item.cantidad}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.genetic._id)}
                    className="text-red-500 hover:text-red-400 transition-colors p-2"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-white">Total:</span>
              <span className="text-lg font-bold text-green-500">${total}</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
              >
                Vaciar
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
                disabled={cart.length === 0}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 