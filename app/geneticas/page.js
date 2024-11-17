'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Cart from '@/components/Cart';

export default function Genetics() {
  const { addToCart } = useCart();
  
  const handleAddToCart = (genetic, quantity = 1) => {
    addToCart(genetic, quantity);
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pr-96">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genetics.map(genetic => (
            <div key={genetic._id} className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-2">{genetic.nombre}</h2>
              <p className="text-gray-400">{genetic.descripcion}</p>
              <div className="mt-4">
                <p className="text-green-500 font-bold">${genetic.precio}</p>
                <button 
                  onClick={() => handleAddToCart(genetic)}
                  className="mt-2 w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Cart />
    </div>
  );
}