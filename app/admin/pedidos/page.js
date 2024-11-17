'use client';
import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiTrash2 } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch('/api/admin/orders');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error al cargar los pedidos');
        }

        // Verificar que estamos recibiendo los pedidos correctamente
        if (data.success && data.orders) {
          setPedidos(data.orders);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('Error fetching pedidos:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          estado: newStatus 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchPedidos();
      } else {
        throw new Error(data.error || 'Error al actualizar el pedido');
      }

    } catch (error) {
      console.error('Error detallado:', error);
      alert(error.message || 'Error al actualizar el estado del pedido');
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`, {
          method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Actualizar la lista de pedidos
          await fetchPedidos();
        } else {
          throw new Error(data.error || 'Error al eliminar el pedido');
        }
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert(error.message);
      }
    }
  };

  const filteredPedidos = pedidos
    .filter(pedido => 
      (filterStatus === 'todos' || pedido.estado === filterStatus) &&
      (pedido._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       pedido.usuario.nombreApellido.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const renderProducto = (producto) => {
    if (!producto || !producto.genetic) {
      return <div className="text-sm text-red-400">Producto no disponible</div>;
    }

    return (
      <div className="text-sm">
        {producto.genetic.nombre} ({producto.cantidad} un.)
      </div>
    );
  };

  if (loading) {
    return <div className="text-white">Cargando pedidos...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!pedidos || pedidos.length === 0) {
    return <div className="text-white">No hay pedidos disponibles</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 pt-20">
      <h1 className="text-3xl font-bold text-white mb-8">Gestión de Pedidos</h1>
      
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID o cliente..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select
          className="bg-gray-800 border border-gray-700 rounded-lg text-white px-4 py-2 focus:outline-none focus:border-green-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="confirmado">Confirmado</option>
          <option value="en_proceso">En Proceso</option>
          <option value="completado">Completado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-700 font-medium text-gray-300">
          <div>ID Pedido</div>
          <div>Cliente</div>
          <div>Fecha</div>
          <div>Productos</div>
          <div>Total</div>
          <div>Estado</div>
          <div>Acciones</div>
        </div>

        {loading ? (
          <div className="text-center text-gray-300 py-8">
            Cargando pedidos...
          </div>
        ) : (
          filteredPedidos.map((pedido) => (
            <div key={pedido._id} className="grid grid-cols-7 gap-4 p-4 border-b border-gray-700 text-gray-300 hover:bg-gray-750">
              <div>{pedido._id.substring(0, 8)}...</div>
              <div>{pedido.usuario?.nombreApellido || 'Usuario no disponible'}</div>
              <div>{new Date(pedido.fechaPedido).toLocaleDateString()}</div>
              <div>
                {pedido.productos.map((producto, index) => (
                  <div key={index}>
                    {renderProducto(producto)}
                  </div>
                ))}
              </div>
              <div className="text-green-500 font-medium">
                ${pedido.total}
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  pedido.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-500' :
                  pedido.estado === 'confirmado' ? 'bg-blue-500/20 text-blue-500' :
                  pedido.estado === 'en_proceso' ? 'bg-purple-500/20 text-purple-500' :
                  pedido.estado === 'completado' ? 'bg-green-500/20 text-green-500' :
                  'bg-red-500/20 text-red-500'
                }`}>
                  {pedido.estado}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:border-green-500"
                  value={pedido.estado}
                  onChange={(e) => updateOrderStatus(pedido._id, e.target.value)}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
                <button
                  onClick={() => deleteOrder(pedido._id)}
                  className="p-1.5 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                  title="Eliminar pedido"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}

        {!loading && filteredPedidos.length === 0 && (
          <div className="text-center text-gray-300 py-8">
            No se encontraron pedidos
          </div>
        )}
      </div>
    </div>
  );
} 