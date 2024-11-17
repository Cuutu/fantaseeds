'use client';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Función simple para formatear precios
const formatPrice = (price) => `$${price}`;

export default function PerfilPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    nombreApellido: '',
    email: '',
    domicilio: {
      calle: '',
      numero: '',
      codigoPostal: '',
      ciudad: '',
      provincia: ''
    }
  });
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        const response = await fetch(`/api/users/${session.user.id}`);
        const data = await response.json();
        if (data.success) {
          setUserData(data.user);
          setFormData({
            nombreApellido: data.user.nombreApellido,
            email: data.user.email,
            domicilio: data.user.domicilio || {
              calle: '',
              numero: '',
              codigoPostal: '',
              ciudad: '',
              provincia: ''
            }
          });
        }
      }
    };
    fetchUserData();
  }, [session]);

  useEffect(() => {
    const fetchPedidos = async () => {
      if (session?.user?.id && activeTab === 'pedidos') {
        setLoadingPedidos(true);
        try {
          const response = await fetch(`/api/orders/user/${session.user.id}`);
          const data = await response.json();
          if (data.success) {
            console.log('Pedidos recibidos:', data.orders);
            setPedidos(data.orders);
          }
        } catch (error) {
          console.error('Error al cargar pedidos:', error);
        } finally {
          setLoadingPedidos(false);
        }
      }
    };

    fetchPedidos();
  }, [session, activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setUserData(data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
    }
  };

  const renderPedidos = () => (
    <div className="space-y-6">
      {pedidos.map((pedido) => (
        <div key={pedido._id} className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-400">
                Pedido #{pedido._id.slice(-6)}
              </p>
              <p className="text-sm text-gray-400">
                Fecha: {new Date(pedido.fechaPedido).toLocaleDateString()}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm bg-yellow-600 text-white">
              {pedido.estado}
            </span>
          </div>

          {/* Información de productos */}
          <div className="space-y-2">
            {pedido.productos?.map((producto, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700">
                <div>
                  <p className="text-white">
                    {producto.genetic?.nombre || 'Producto'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Cantidad: {producto.cantidad}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total del pedido */}
          <div className="mt-4 pt-4 flex justify-between items-center">
            <span className="text-white font-medium">Total del pedido:</span>
            <span className="text-xl font-bold text-green-400">
              ${pedido.total || 0}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navegación */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'info' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'pedidos' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Mis Pedidos
          </button>
        </div>

        {activeTab === 'info' ? (
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-green-600 rounded-lg text-white flex items-center gap-2"
              >
                <span className="material-icons">edit</span>
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formulario de edición */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Nombre y Apellido</label>
                    <input
                      type="text"
                      value={formData.nombreApellido}
                      onChange={(e) => setFormData({...formData, nombreApellido: e.target.value})}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Calle</label>
                    <input
                      type="text"
                      value={formData.domicilio.calle}
                      onChange={(e) => setFormData({
                        ...formData,
                        domicilio: {...formData.domicilio, calle: e.target.value}
                      })}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  {/* Repetir para número, código postal, ciudad y provincia */}
                </div>
                <div className="col-span-2">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            ) : (
              /* Vista de información */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Información Personal */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Información Personal</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Nombre y Apellido
                      </label>
                      <p className="text-white">{userData?.nombreApellido}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Usuario
                      </label>
                      <p className="text-white">{userData?.usuario}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email
                      </label>
                      <p className="text-white">{userData?.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Membresía
                      </label>
                      <p className="text-white">{userData?.membresia}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Fecha de Alta
                      </label>
                      <p className="text-white">
                        {userData?.fechaAlta ? new Date(userData.fechaAlta).toLocaleDateString() : 'No disponible'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Domicilio */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Domicilio</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Calle
                      </label>
                      <p className="text-white">{userData?.domicilio?.calle || 'No especificado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Número
                      </label>
                      <p className="text-white">{userData?.domicilio?.numero || 'No especificado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Código Postal
                      </label>
                      <p className="text-white">{userData?.domicilio?.codigoPostal || 'No especificado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Ciudad
                      </label>
                      <p className="text-white">{userData?.domicilio?.ciudad || 'No especificado'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Provincia
                      </label>
                      <p className="text-white">{userData?.domicilio?.provincia || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          renderPedidos()
        )}
      </div>
    </div>
  );
} 