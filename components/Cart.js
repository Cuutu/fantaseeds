'use client';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Cart({ isOpen, onClose }) {
  const router = useRouter();
  const { cart, clearCart, removeFromCart } = useCart();

  if (!isOpen) return null;

  // Asegurarnos de que cada item en el carrito tenga todas las propiedades necesarias
  const total = cart.reduce((acc, item) => {
    // Verificar que item.genetic y item.genetic.precio existan
    if (item?.genetic?.precio && item.cantidad) {
      return acc + (item.genetic.precio * item.cantidad);
    }
    return acc;
  }, 0);

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className={`fixed right-0 top-0 h-full w-80 bg-gray-800 shadow-lg p-6 z-50 transform transition-transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Carrito</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {cart.length === 0 ? (
          <p className="text-gray-400">El carrito está vacío</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.genetic._id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{item.genetic.nombre}</h3>
                      <p className="text-sm text-gray-400">
                        Stock disponible: {item.genetic.stock} unidades
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>${item.genetic?.precio * item.cantidad}</span>
                      <button
                        onClick={() => removeFromCart(item.genetic._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-white">Total:</span>
                <span className="text-2xl font-bold text-green-400">${total}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Vaciar
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
} 