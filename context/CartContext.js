'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userMembresia, setUserMembresia] = useState(null);
  const session = useSession();
  const [showLimitModal, setShowLimitModal] = useState(false);

  // Obtener membresía del usuario desde la base de datos
  useEffect(() => {
    const fetchUserMembresia = async () => {
      if (session?.status === 'authenticated' && session?.data?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.data.user.id}`);
          
          if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
          }
          
          const data = await response.json();
          if (data.user?.membresia) {
            setUserMembresia(data.user.membresia);
            console.log('Membresía obtenida:', data.user.membresia);
          }
        } catch (error) {
          console.error('Error al obtener la membresía:', error);
          setUserMembresia('10G'); // valor por defecto si hay error
        }
      }
    };

    fetchUserMembresia();
  }, [session]);

  // Función para obtener el límite según la membresía
  const getMembresiaLimit = (membresia) => {
    if (!membresia) return 10; // valor por defecto
    
    const numeroMembresia = parseInt(membresia?.replace('G', '')) || 10;
    console.log('Número de membresía:', numeroMembresia);
    return numeroMembresia;
  };

  // Función para calcular el total de unidades en el carrito
  const getTotalUnits = () => {
    return cart.reduce((total, item) => total + item.cantidad, 0);
  };

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const showMembresieLimitMessage = () => {
    setShowLimitModal(true);
  };

  const addToCart = (item) => {
    // Si el usuario no está autenticado, permitir agregar sin límite
    if (session?.status !== 'authenticated') {
      setCart(prevCart => {
        const existingItem = prevCart.find(i => i.genetic._id === item.genetic._id);
        if (existingItem) {
          return prevCart.map(i => 
            i.genetic._id === item.genetic._id 
              ? { ...i, cantidad: existingItem.cantidad + item.cantidad }
              : i
          );
        }
        return [...prevCart, item];
      });
      setIsOpen(true);
      return true;
    }

    // Si está autenticado, aplicar límites de membresía
    const membresiaLimit = getMembresiaLimit(userMembresia);
    const currentTotal = getTotalUnits();
    const newTotal = currentTotal + item.cantidad;

    console.log({
      Membresia: userMembresia,
      Limite: membresiaLimit,
      'Total actual': currentTotal,
      'Nuevo total': newTotal
    });

    if (newTotal > membresiaLimit) {
      showMembresieLimitMessage();
      return false;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.genetic._id === item.genetic._id);
      
      if (existingItem) {
        const updatedQuantity = existingItem.cantidad + item.cantidad;
        const updatedTotal = currentTotal - existingItem.cantidad + updatedQuantity;
        
        if (updatedTotal > membresiaLimit) {
          showMembresieLimitMessage();
          return prevCart;
        }

        return prevCart.map(i => 
          i.genetic._id === item.genetic._id 
            ? { ...i, cantidad: updatedQuantity }
            : i
        );
      }
      
      return [...prevCart, item];
    });
    setIsOpen(true);
    return true;
  };

  const removeFromCart = (geneticId) => {
    setCart(prevCart => prevCart.filter(item => item.genetic._id !== geneticId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getMaxAllowedQuantity = (membresia) => {
    const limits = {
      '10G': 10,
      '20G': 20,
      '30G': 30,
      '40G': 40
    };
    return limits[membresia] || 10;
  };

  return (
    <>
      <CartContext.Provider value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
        isOpen,
        setIsOpen,
        getTotalUnits
      }}>
        {children}
      </CartContext.Provider>

      {/* Modal de límite de membresía */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 overflow-auto backdrop-blur-sm bg-black/40 flex items-center justify-center">
          <div className="relative bg-gray-800 rounded-lg p-8 m-4 max-w-sm w-full shadow-xl">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white">
                Límite de Membresía Alcanzado
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300">
                Llegaste al límite de tu membresía. ¿Querés aumentar tu límite?{' '}
                <a 
                  href="https://api.whatsapp.com/send/?phone=5491127064165&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-400 font-medium"
                >
                  Hacé click acá para upgradear
                </a>
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowLimitModal(false)}
                className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 