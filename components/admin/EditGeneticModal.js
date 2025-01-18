'use client';
import { useState, useEffect } from 'react';
import { FiUpload } from 'react-icons/fi';

export default function EditGeneticModal({ isOpen, onClose, onGeneticUpdated, genetic }) {
  const [formData, setFormData] = useState({
    nombre: '',
    thc: '',
    stock: '',
    precio: '',
    descripcion: '',
    imagen: '',
    destacado: false
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (genetic) {
      setFormData({
        nombre: genetic.nombre,
        thc: genetic.thc,
        stock: genetic.stock,
        precio: genetic.precio,
        descripcion: genetic.descripcion,
        imagen: genetic.imagen,
        destacado: genetic.destacado
      });
      setImagePreview(genetic.imagen);
    }
  }, [genetic]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, imagen: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/genetics/${genetic._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onGeneticUpdated();
        onClose();
      } else {
        throw new Error(data.error || 'Error al actualizar genética');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto text-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-green-400">Editar Genética</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Imagen
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FiUpload className="w-8 h-8 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click para subir</span> o arrastra y suelta
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Nombre
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          {/* THC */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              % THC
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
              value={formData.thc}
              onChange={(e) => setFormData({...formData, thc: e.target.value})}
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Stock
            </label>
            <input
              type="number"
              required
              min="0"
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Precio
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
              value={formData.precio}
              onChange={(e) => setFormData({...formData, precio: e.target.value})}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Descripción
            </label>
            <textarea
              required
              rows="4"
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.destacado}
                onChange={(e) => setFormData({...formData, destacado: e.target.checked})}
                className="form-checkbox bg-gray-700 border-gray-600 text-green-500"
              />
              <span className="text-gray-300">Marcar como destacado</span>
            </label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 ${
                loading ? 'cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Actualizando...' : 'Actualizar Genética'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 