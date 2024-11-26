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

  return (
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
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 