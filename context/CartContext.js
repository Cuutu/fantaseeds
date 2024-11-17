'use client';
import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (genetic, quantity = 1) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.genetic._id === genetic._id);
      
      if (existingProduct) {
        return prevCart.map(item =>
          item.genetic._id === genetic._id
            ? { ...item, cantidad: item.cantidad + quantity }
            : item
        );
      }
      return [...prevCart, { genetic, cantidad: quantity }];
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
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