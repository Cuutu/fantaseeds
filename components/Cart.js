'use client';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  // Asegurarnos de que cada item en el carrito tenga todas las propiedades necesarias
  const total = cart.reduce((acc, item) => {
    // Verificar que item.genetic y item.genetic.precio existan
    if (item?.genetic?.precio && item.cantidad) {
      return acc + (item.genetic.precio * item.cantidad);
    }
    return acc;
  }, 0);

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 shadow-lg p-6 transform transition-transform z-50">
      <h2 className="text-2xl font-bold text-white mb-4">Carrito</h2>
      
      {cart.length === 0 ? (
        <p className="text-gray-400">El carrito está vacío</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-white">
                <div>
                  <p>{item.genetic?.nombre}</p>
                  <p className="text-sm text-gray-400">
                    Cantidad: {item.cantidad} x ${item.genetic?.precio}
                  </p>
                </div>
                <span>${item.genetic?.precio * item.cantidad}</span>
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
  );
} 