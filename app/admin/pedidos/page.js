'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaTrash } from 'react-icons/fa';

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session } = useSession();

  const estadosPedido = [
    { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-500' },
    { value: 'en_curso', label: 'En curso', color: 'bg-purple-500' },
    { value: 'pendiente_envio', label: 'Pendiente de envío', color: 'bg-blue-500' },
    { value: 'pendiente_retiro', label: 'Pendiente de retiro', color: 'bg-orange-500' },
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

  const handleVerComprobante = async (pedidoId) => {
    try {
      const response = await fetch(`/api/comprobantes/${pedidoId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedComprobante(data.comprobante);
        setShowModal(true);
      } else {
        alert('Error al cargar el comprobante');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar el comprobante');
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

  // Función auxiliar para buscar en strings de forma segura
  const safeSearch = (text = '') => {
    return text?.toLowerCase().includes(searchTerm.toLowerCase());
  };

  // Función mejorada para filtrar pedidos
  const filteredPedidos = pedidos.filter(pedido => {
    // Buscar por ID (últimos 6 caracteres)
    const matchesId = pedido._id.slice(-6).toLowerCase().includes(searchTerm.toLowerCase());

    // Buscar en información del comprador (nueva estructura)
    const matchesCompradorInfo = 
      safeSearch(pedido.compradorInfo?.nombre) ||
      safeSearch(pedido.compradorInfo?.apellido) ||
      safeSearch(pedido.compradorInfo?.email);

    // Buscar en información del usuario (estructura antigua)
    const matchesUsuario = 
      safeSearch(pedido.usuario?.nombreApellido) ||
      safeSearch(pedido.usuario?.email);

    return matchesId || matchesCompradorInfo || matchesUsuario;
  });

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Gestión de Pedidos</h1>

        {/* Buscador con contador de resultados */}
        <div className="mb-6 space-y-2">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Buscar por Nº de pedido, nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Contador de resultados */}
          {searchTerm && (
            <p className="text-sm text-gray-400">
              {filteredPedidos.length} 
              {filteredPedidos.length === 1 ? ' resultado encontrado' : ' resultados encontrados'}
            </p>
          )}
        </div>

        {/* Lista de pedidos */}
        <div className="grid gap-4">
          {loading ? (
            <p className="text-white">Cargando pedidos...</p>
          ) : filteredPedidos.length > 0 ? (
            filteredPedidos.map((pedido) => (
              <div key={pedido._id} className="bg-gray-800 rounded-lg overflow-hidden">
                {/* Encabezado del pedido */}
                <div className="p-4 bg-gray-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">
                        Pedido #{pedido._id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(pedido.fechaPedido).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${getEstadoColor(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </div>
                </div>

                {/* Resto del contenido del pedido */}
                {/* ... mantener el resto del código existente ... */}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">
              No se encontraron pedidos que coincidan con la búsqueda
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Función auxiliar para obtener el color según el estado
function getEstadoColor(estado) {
  const colors = {
    'pendiente': 'bg-yellow-500/20 text-yellow-500',
    'confirmado': 'bg-green-500/20 text-green-500',
    'completado': 'bg-blue-500/20 text-blue-500',
    'cancelado': 'bg-red-500/20 text-red-500',
    'default': 'bg-gray-500/20 text-gray-500'
  };
  return colors[estado] || colors.default;
} 