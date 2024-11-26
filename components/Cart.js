'use client';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { FaShoppingCart, FaTimes, FaTrash } from 'react-icons/fa';

export default function Cart() {
  const { cart, removeFromCart, clearCart, isOpen, setIsOpen } = useCart();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Calcular total
    const newTotal = cart.reduce((sum, item) => {
      return sum + (item.genetic.precio * item.cantidad);
    }, 0);
    setTotal(newTotal);

    // Abrir carrito automáticamente cuando se agrega un item
    if (cart.length > 0) {
      setIsOpen(true);
    }
  }, [cart, setIsOpen]);

  if (!isOpen) return null;

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
          <div className="space-y-4 mb-6">
            {cart.map((item, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-medium">{item.genetic.nombre}</h3>
                    <p className="text-gray-400 text-sm">
                      Cantidad: {item.cantidad} unidades
                    </p>
                    <p className="text-green-500 font-medium">
                      ${item.genetic.precio * item.cantidad}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.genetic._id)}
                    className="text-red-400 hover:text-red-500 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Stock disponible:</span>
              <span className="text-white">{cart.length} unidades</span>
            </div>
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
                onClick={() => {/* Implementar checkout */}}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors"
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