'use client'
import { useState } from 'react';

export default function GeneticFilter({ onFilter, maxPrice = 10000 }) {
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
    <div className="bg-yellow-400 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-black text-lg font-bold">Filtrar</h2>
        <button onClick={() => clearFilters()} className="text-black">
          ✕
        </button>
      </div>

      {/* Disponibilidad */}
      <div className="mb-6">
        <h3 className="text-black font-semibold mb-2">Disponibilidad</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={availability.inStock}
              onChange={() => handleAvailabilityChange('inStock')}
              className="form-checkbox"
            />
            <span className="text-black">En stock</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={availability.outOfStock}
              onChange={() => handleAvailabilityChange('outOfStock')}
              className="form-checkbox"
            />
            <span className="text-black">Sin stock</span>
          </label>
        </div>
      </div>

      {/* Precio */}
      <div className="mb-6">
        <h3 className="text-black font-semibold mb-4">Precio</h3>
        <div className="flex justify-between items-center space-x-4">
          <div className="flex items-center">
            <span className="text-black mr-2">$</span>
            <input
              type="number"
              min="0"
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, e.target.value)}
              className="w-24 p-2 rounded border border-gray-300"
            />
          </div>
          <span className="text-black">-</span>
          <div className="flex items-center">
            <span className="text-black mr-2">$</span>
            <input
              type="number"
              min={priceRange[0]}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, e.target.value)}
              className="w-24 p-2 rounded border border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="space-y-2">
        <button
          onClick={() => applyFilters(availability, priceRange)}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
        >
          Aplicar
        </button>
        <button
          onClick={clearFilters}
          className="w-full bg-transparent border border-black text-black py-2 rounded-lg hover:bg-gray-100"
        >
          Limpiar todo
        </button>
      </div>
    </div>
  );
}