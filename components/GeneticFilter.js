'use client'
import { useState } from 'react';

export default function GeneticFilter({ onFilter, maxPrice = 10000, onClose, totalProducts = 0 }) {
  const [availability, setAvailability] = useState({
    inStock: false,
    outOfStock: false
  });
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [thcRange, setThcRange] = useState([0, 30]); // Rango de THC de 0% a 30%

  const handleAvailabilityChange = (type) => {
    const newAvailability = {
      ...availability,
      [type]: !availability[type]
    };
    setAvailability(newAvailability);
    applyFilters(newAvailability, priceRange, thcRange);
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value) || 0;
    
    if (index === 0 && value > priceRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < priceRange[0]) {
      newRange[0] = value;
    }
    
    setPriceRange(newRange);
    applyFilters(availability, newRange, thcRange);
  };

  const handleThcChange = (index, value) => {
    const newRange = [...thcRange];
    newRange[index] = parseInt(value) || 0;
    
    if (index === 0 && value > thcRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < thcRange[0]) {
      newRange[0] = value;
    }
    
    setThcRange(newRange);
    applyFilters(availability, priceRange, newRange);
  };

  const applyFilters = (availabilityState, price, thc) => {
    onFilter({
      availability: availabilityState,
      priceRange: price,
      thcRange: thc
    });
  };

  const clearFilters = () => {
    setAvailability({
      inStock: false,
      outOfStock: false
    });
    setPriceRange([0, maxPrice]);
    setThcRange([0, 30]);
    onFilter({
      availability: {
        inStock: false,
        outOfStock: false
      },
      priceRange: [0, maxPrice],
      thcRange: [0, 30]
    });
  };

  return (
    <div className="h-full bg-gray-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-xl font-bold">Filtro</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      {/* Disponibilidad */}
      <div className="mb-8">
        <h3 className="text-white font-semibold mb-4 flex items-center justify-between">
          Disponibilidad
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={availability.inStock}
              onChange={() => handleAvailabilityChange('inStock')}
              className="form-checkbox text-green-500 border-gray-600 bg-gray-700"
            />
            <span className="text-gray-300">En stock</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={availability.outOfStock}
              onChange={() => handleAvailabilityChange('outOfStock')}
              className="form-checkbox text-green-500 border-gray-600 bg-gray-700"
            />
            <span className="text-gray-300">Sin stock</span>
          </label>
        </div>
      </div>

      {/* THC */}
      <div className="mb-8">
        <h3 className="text-white font-semibold mb-4 flex items-center justify-between">
          % THC 
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="number"
                value={thcRange[0]}
                onChange={(e) => handleThcChange(0, e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                placeholder="0"
                min="0"
                max="30"
              />
            </div>
            <span className="text-gray-300">-</span>
            <div className="flex-1">
              <input
                type="number"
                value={thcRange[1]}
                onChange={(e) => handleThcChange(1, e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                placeholder="30"
                min="0"
                max="30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Precio */}
      <div className="mb-8">
        <h3 className="text-white font-semibold mb-4 flex items-center justify-between">
          Precio
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                placeholder="0"
              />
            </div>
            <span className="text-gray-300">-</span>
            <div className="flex-1">
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                placeholder="330"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botones */}
      <button
        onClick={() => {
          applyFilters(availability, priceRange, thcRange);
          onClose();
        }}
        className="w-full bg-green-600 text-white py-3 rounded-lg mb-3 hover:bg-green-700"
      >
        Aplicar · {totalProducts} productos
      </button>

      <button
        onClick={() => {
          clearFilters();
          onClose();
        }}
        className="w-full text-gray-300 py-3 hover:text-white"
      >
        Limpiar todo
      </button>
    </div>
  );
}