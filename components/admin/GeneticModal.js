'use client';
import { useState } from 'react';
import { FiUpload } from 'react-icons/fi';

export default function GeneticModal({ isOpen, onClose, onGeneticCreated }) {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    thc: '',
    stock: '',
    descripcion: '',
    destacado: false
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!file) {
        throw new Error('Por favor selecciona una imagen');
      }

      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const geneticData = {
        nombre: formData.nombre,
        precio: Number(formData.precio),
        thc: Number(formData.thc),
        stock: Number(formData.stock),
        descripcion: formData.descripcion,
        imagen: base64Image,
        activo: true
      };

      const response = await fetch('/api/genetics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(geneticData)
      });

      const data = await response.json();
      
      if (data.success) {
        onGeneticCreated();
        onClose();
      } else {
        throw new Error(data.error || 'Error al crear la genética');
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
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Nueva Genética</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Imagen</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer hover:border-gray-500">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="h-28 w-28 object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <FiUpload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-400">Click para subir imagen</p>
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

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Precio</label>
            <input
              type="number"
              value={formData.precio}
              onChange={(e) => setFormData({...formData, precio: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">THC</label>
            <input
              type="number"
              value={formData.thc}
              onChange={(e) => setFormData({...formData, thc: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
              rows="4"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 