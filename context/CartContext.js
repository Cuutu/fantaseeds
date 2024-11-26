'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userMembresia, setUserMembresia] = useState(null);
  const { data: session } = useSession();

  // Obtener membresía del usuario desde la base de datos
  useEffect(() => {
    const fetchUserMembresia = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/user/profile');
          const data = await response.json();
          if (data.success) {
            setUserMembresia(data.user.membresia);
          }
        } catch (error) {
          console.error('Error al obtener la membresía:', error);
        }
      }
    };

    fetchUserMembresia();
  }, [session]);

  // Función para obtener el límite según la membresía
  const getMembresiaLimit = (membresia) => {
    const limits = {
      '10G': 10,
      '20G': 20,
      '30G': 30
    };
    return limits[membresia] || 10;
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

  const addToCart = (item) => {
    const membresiaLimit = getMembresiaLimit(userMembresia);
    const currentTotal = getTotalUnits();
    const newTotal = currentTotal + item.cantidad;

    if (newTotal > membresiaLimit) {
      alert(`Tu membresía ${userMembresia} tiene un límite de ${membresiaLimit} unidades. No puedes agregar más productos.`);
      return false;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.genetic._id === item.genetic._id);
      
      if (existingItem) {
        const updatedQuantity = existingItem.cantidad + item.cantidad;
        const updatedTotal = currentTotal - existingItem.cantidad + updatedQuantity;
        
        if (updatedTotal > membresiaLimit) {
          alert(`Tu membresía ${userMembresia} tiene un límite de ${membresiaLimit} unidades. No puedes agregar más productos.`);
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
      addToCart,
      removeFromCart,
      clearCart,
      isOpen,
      setIsOpen
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