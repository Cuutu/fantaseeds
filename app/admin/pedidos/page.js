'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaTrash } from 'react-icons/fa';

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState(null);

  const estadosPedido = [
    { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-500' },
    { value: 'pendiente_retiro', label: 'Pendiente de retiro', color: 'bg-orange-500' },
    { value: 'pendiente_envio', label: 'Pendiente de envío', color: 'bg-blue-500' },
    { value: 'en_curso', label: 'En curso', color: 'bg-purple-500' },
    { value: 'completada', label: 'Completada', color: 'bg-green-500' },
    { value: 'cancelada', label: 'Cancelada', color: 'bg-red-500' }
  ];

  const actualizarEstado = async (orderId, nuevoEstado) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!response.ok) throw new Error('Error al actualizar el estado');

      // Actualizar el estado local
      setPedidos(pedidos.map(pedido => 
        pedido._id === orderId ? { ...pedido, estado: nuevoEstado } : pedido
      ));
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el estado del pedido');
    }
  };

  const handleDeleteClick = (pedido) => {
    setPedidoToDelete(pedido);
    setShowDeleteModal(true);
  };

  const confirmarEliminacion = async () => {
    if (!pedidoToDelete) return;

    try {
      const response = await fetch(`/api/admin/orders/${pedidoToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar el pedido');

      setPedidos(pedidos.filter(p => p._id !== pedidoToDelete._id));
      setShowDeleteModal(false);
      setPedidoToDelete(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el pedido');
    }
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        console.log('Iniciando fetch de pedidos...');
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        if (data.success) {
          setPedidos(data.orders);
        } else {
          throw new Error(data.error || 'Error desconocido al cargar pedidos');
        }
      } catch (error) {
        console.error('Error al cargar los pedidos:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.rol === 'administrador') {
      fetchPedidos();
    }
  }, [session, status]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header con fondo azul oscuro */}
      <div className="bg-gray-800 w-full p-6">
        <h1 className="text-3xl font-bold text-white text-center">
          Gestión de Pedidos
        </h1>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="mt-2 text-white">Cargando pedidos...</p>
            </div>
          ) : error ? (
            <div className="text-center p-4 text-red-500">Error: {error}</div>
          ) : pedidos.length === 0 ? (
            <div className="text-center p-4 text-white">No hay pedidos disponibles</div>
          ) : (
            <div className="grid gap-6">
              {pedidos.map((pedido) => (
                <div key={pedido._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {/* Cabecera del pedido */}
                  <div className="p-4 bg-gray-700 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Pedido #{pedido._id.slice(-6)}
                      </h3>
                      <p className="text-gray-300">
                        {new Date(pedido.fechaPedido).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <select
                        value={pedido.estado}
                        onChange={(e) => actualizarEstado(pedido._id, e.target.value)}
                        className="bg-gray-600 text-white rounded px-3 py-1 border border-gray-500"
                      >
                        {estadosPedido.map(estado => (
                          <option key={estado.value} value={estado.value}>
                            {estado.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDeleteClick(pedido)}
                        className="text-red-500 hover:text-red-400 p-2 transition-colors"
                        title="Eliminar pedido"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Información del cliente */}
                  <div className="p-4 border-b border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Información del Cliente</h4>
                    <p className="text-gray-300">{pedido.usuario?.nombreApellido}</p>
                    <p className="text-gray-300">{pedido.usuario?.email}</p>
                  </div>

                  {/* Productos */}
                  <div className="p-4">
                    <h4 className="font-semibold text-white mb-2">Productos</h4>
                    <div className="space-y-2">
                      {pedido.productos.map((producto, index) => (
                        <div key={index} className="flex justify-between text-gray-300">
                          <span>{producto.genetic?.nombre} x{producto.cantidad}</span>
                          <span>${producto.precio}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">
                      <span className="font-bold text-white">Total:</span>
                      <span className="font-bold text-white">${pedido.total}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que quieres eliminar el pedido #{pedidoToDelete?._id.slice(-6)}?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 