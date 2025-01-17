'use client'
import { useState } from 'react';

export default function GeneticFilter({ onFilter, maxPrice = 10000, onClose, totalProducts = 0 }) {
  const [availability, setAvailability] = useState({
    inStock: false,
    outOfStock: false
  });
  const [priceRange, setPriceRange] = useState([0, maxPrice]);

  const handleAvailabilityChange = (type) => {
    const newAvailability = {
      ...availability,
      [type]: !availability[type]
    };
    setAvailability(newAvailability);
    applyFilters(newAvailability, priceRange);
  };

  const handlePriceChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value) || 0;
    
    // Asegurar que el mínimo no sea mayor que el máximo y viceversa
    if (index === 0 && value > priceRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < priceRange[0]) {
      newRange[0] = value;
    }
    
    setPriceRange(newRange);
    applyFilters(availability, newRange);
  };

  const applyFilters = (availabilityState, price) => {
    onFilter({
      availability: availabilityState,
      priceRange: price
    });
  };

  const clearFilters = () => {
    setAvailability({
      inStock: false,
      outOfStock: false
    });
    setPriceRange([0, maxPrice]);
    onFilter({
      availability: {
        inStock: false,
        outOfStock: false
      },
      priceRange: [0, maxPrice]
    });
  };

  return (
    <div className="h-full bg-yellow-400 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-black text-xl font-bold">Filter</h2>
        <button 
          onClick={onClose}
          className="text-black hover:text-gray-700 text-2xl"
        >
          ×
        </button>
      </div>

      {/* Availability */}
      <div className="mb-8">
        <h3 className="text-black font-semibold mb-4 flex items-center justify-between">
          Availability
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
              className="form-checkbox text-black border-black"
            />
            <span className="text-black">In stock</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={availability.outOfStock}
              onChange={() => handleAvailabilityChange('outOfStock')}
              className="form-checkbox text-black border-black"
            />
            <span className="text-black">Out of stock</span>
          </label>
        </div>
      </div>

      {/* Price */}
      <div className="mb-8">
        <h3 className="text-black font-semibold mb-4 flex items-center justify-between">
          Price
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
                className="w-full p-2 bg-white rounded border border-gray-300"
                placeholder="0"
              />
            </div>
            <span className="text-black">-</span>
            <div className="flex-1">
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="w-full p-2 bg-white rounded border border-gray-300"
                placeholder="330"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Apply button */}
      <button
        onClick={() => {
          applyFilters(availability, priceRange);
          onClose();
        }}
        className="w-full bg-black text-white py-3 rounded-full mb-3"
      >
        Apply · {totalProducts} products
      </button>

      <button
        onClick={() => {
          clearFilters();
          onClose();
        }}
        className="w-full text-black py-3"
      >
        Clear all
      </button>
    </div>
  );
}