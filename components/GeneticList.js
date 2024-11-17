'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaLeaf, FaBoxes } from 'react-icons/fa';

export default function GeneticList({ geneticas }) {
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {geneticas.map((genetic) => (
        <div 
          key={genetic._id}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 border border-gray-700/50"
        >
          {/* Imagen */}
          <div className="relative h-64 overflow-hidden">
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
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {genetic.nombre}
                </h2>
                <p className="text-gray-400 text-sm">
                  {genetic.descripcion}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700/30 rounded-lg p-3">
                <span className="text-gray-400 text-xs block mb-1">THC</span>
                <span className="text-white font-semibold">{genetic.thc}%</span>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-3">
                <span className="text-gray-400 text-xs block mb-1">Stock</span>
                <span className="text-white font-semibold">{genetic.stock} u.</span>
              </div>
            </div>

            {/* Cantidad y Botón */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="number"
                  min="1"
                  max={genetic.stock}
                  value={quantities[genetic._id] || 1}
                  onChange={(e) => setQuantities({
                    ...quantities,
                    [genetic._id]: parseInt(e.target.value)
                  })}
                  className="w-full bg-gray-700/30 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <button
                onClick={() => addToCart(genetic, quantities[genetic._id] || 1)}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar
              </button>
            </div>

            {/* Límite de membresía */}
            <p className="text-gray-500 text-xs mt-4 text-center">
              Puedes elegir hasta 10G por tu membresía actual
            </p>
          </div>
        </div>
      ))}
    </div>
  );
} 