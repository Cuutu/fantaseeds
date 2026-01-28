'use client';
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

export default function AdminMembresiasPage() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMembership, setEditingMembership] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [membershipToDelete, setMembershipToDelete] = useState(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    period: '/mes',
    description: '',
    limit: '',
    features: [''],
    active: true,
    order: 0
  });

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const response = await fetch('/api/admin/memberships');
      const data = await response.json();
      
      if (data.success) {
        setMemberships(data.memberships);
      }
    } catch (error) {
      console.error('Error al cargar membresías:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeMemberships = async () => {
    try {
      const response = await fetch('/api/admin/memberships/init', {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchMemberships();
      } else {
        console.error('Error al inicializar membresías');
      }
    } catch (error) {
      console.error('Error al inicializar membresías:', error);
    }
  };

  const repairMemberships = async () => {
    try {
      const response = await fetch('/api/admin/memberships/repair', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Membresías reparadas:', data);
        await fetchMemberships();
        alert('Membresías reparadas exitosamente!');
      } else {
        console.error('Error al reparar membresías:', data);
        alert('Error al reparar membresías');
      }
    } catch (error) {
      console.error('Error al reparar membresías:', error);
      alert('Error al reparar membresías');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      price: '',
      period: '/mes',
      description: '',
      limit: '',
      features: [''],
      active: true,
      order: 0
    });
    setEditingMembership(null);
  };

  const openModal = (membership = null) => {
    if (membership) {
      setEditingMembership(membership);
      setFormData({
        id: membership.id,
        name: membership.name,
        price: membership.price,
        period: membership.period,
        description: membership.description,
        limit: membership.limit || '',
        features: membership.features,
        active: membership.active,
        order: membership.order
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingMembership 
        ? `/api/admin/memberships/${editingMembership.id}`
        : '/api/admin/memberships';
      
      const method = editingMembership ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchMemberships();
        closeModal();
      } else {
        console.error('Error al guardar membresía');
      }
    } catch (error) {
      console.error('Error al guardar membresía:', error);
    }
  };

  const handleDelete = async () => {
    if (!membershipToDelete) return;

    try {
      const response = await fetch(`/api/admin/memberships/${membershipToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchMemberships();
        setShowDeleteModal(false);
        setMembershipToDelete(null);
      } else {
        console.error('Error al eliminar membresía');
      }
    } catch (error) {
      console.error('Error al eliminar membresía:', error);
    }
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  if (loading) {
    return <div className="p-8 text-white">Cargando...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Gestión de Membresías</h1>
        <div className="flex gap-4">
          {memberships.length === 0 && (
            <button
              onClick={initializeMemberships}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              Inicializar Membresías por Defecto
            </button>
          )}
          <button
            onClick={repairMemberships}
            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            🔧 Reparar Membresías
          </button>
          <button
            onClick={() => openModal()}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FiPlus className="h-5 w-5" />
            Nueva Membresía
          </button>
        </div>
      </div>

      {/* Tabla de Membresías */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300">Nombre</th>
              <th className="text-left p-4 text-gray-300">Precio</th>
              <th className="text-left p-4 text-gray-300">Estado</th>
              <th className="text-left p-4 text-gray-300">Orden</th>
              <th className="text-left p-4 text-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership) => (
              <tr key={membership._id} className="border-b border-gray-700">
                <td className="p-4 text-white">{membership.name}</td>
                <td className="p-4 text-white">{membership.price}{membership.period}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    membership.active 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {membership.active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="p-4 text-white">{membership.order}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(membership)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                    >
                      <FiEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setMembershipToDelete(membership);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingMembership ? 'Editar Membresía' : 'Nueva Membresía'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">ID</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                    required
                    disabled={editingMembership}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Precio</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Período</label>
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({...formData, period: e.target.value})}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Descripción</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Límite</label>
                <input
                  type="text"
                  value={formData.limit}
                  onChange={(e) => setFormData({...formData, limit: e.target.value})}
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  placeholder="Ej: 10 unidades por mes"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Características</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2"
                      placeholder="Característica..."
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-green-400 hover:text-green-300 text-sm"
                >
                  + Agregar característica
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Orden</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="flex items-center text-gray-300 mt-8">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                      className="mr-2"
                    />
                    Activa
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-700">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FiCheck className="h-4 w-4" />
                  {editingMembership ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que querés eliminar la membresía &quot;{membershipToDelete?.name}&quot;?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg flex-1"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg flex-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 