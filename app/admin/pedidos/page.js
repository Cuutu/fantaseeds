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
  const [selectedComprobante, setSelectedComprobante] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Header con título - aumentamos el padding-top */}
      <div className="p-6 pt-12">
        <h1 className="text-3xl font-bold text-white text-center">
          Gestión de Pedidos
        </h1>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
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
                  <div className="p-4 border-t border-gray-700">
                    <h4 className="text-white font-semibold mb-2">Información del Cliente</h4>
                    {pedido.compradorInfo ? (
                      <>
                        <p className="text-gray-300">
                          Nombre: {`${pedido.compradorInfo.nombre} ${pedido.compradorInfo.apellido}`.trim() || 'No disponible'}
                        </p>
                        <p className="text-gray-300">
                          Email: {pedido.compradorInfo.email || 'No disponible'}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-300">Nombre: {pedido.usuario?.nombreApellido || 'Usuario no disponible'}</p>
                        <p className="text-gray-300">Email: {pedido.usuario?.email || 'Email no disponible'}</p>
                      </>
                    )}
                  </div>

                  {/* Productos */}
                  <div className="p-4 border-t border-gray-700">
                    <h4 className="text-white font-semibold mb-2">Productos</h4>
                    {pedido.productos?.map((producto, index) => (
                      <div key={index} className="flex justify-between text-gray-300">
                        <span>{producto.genetic?.nombre || 'Producto no disponible'} x{producto.cantidad}</span>
                        <span>${producto.precio || 0}</span>
                      </div>
                    ))}
                    <div className="text-right font-bold text-white mt-2">
                      Total: ${pedido.total || 0}
                    </div>
                  </div>

                  {/* Método de Pago */}
                  <div className="p-4 border-t border-gray-700">
                    <h4 className="text-white font-semibold mb-2">Método de Pago:</h4>
                    <p className="text-gray-300">
                      MercadoPago
                    </p>
                    <div className="mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                        pedido.estado === 'Pendiente' ? 'bg-yellow-500/20 text-yellow-500' :
                        pedido.estado === 'Aprobado' ? 'bg-green-500/20 text-green-500' :
                        pedido.estado === 'Rechazado' ? 'bg-red-500/20 text-red-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {pedido.estado}
                      </span>
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

      {/* Modal para mostrar el comprobante */}
      {showModal && selectedComprobante && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Comprobante de Pago</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                {selectedComprobante.tipoArchivo.includes('image') ? (
                  <img
                    src={`data:${selectedComprobante.tipoArchivo};base64,${selectedComprobante.archivo}`}
                    alt="Comprobante de pago"
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                ) : selectedComprobante.tipoArchivo === 'application/pdf' ? (
                  <object
                    data={`data:${selectedComprobante.tipoArchivo};base64,${selectedComprobante.archivo}`}
                    type="application/pdf"
                    className="w-full h-[70vh]"
                  >
                    <embed
                      src={`data:${selectedComprobante.tipoArchivo};base64,${selectedComprobante.archivo}`}
                      type="application/pdf"
                      className="w-full h-[70vh]"
                    />
                    <p className="text-gray-300 text-center py-4">
                      Si no puedes ver el PDF, puedes descargarlo usando el botón de abajo
                    </p>
                  </object>
                ) : (
                  <div className="p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-300">Archivo no previsualizable</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
              <a
                href={`data:${selectedComprobante.tipoArchivo};base64,${selectedComprobante.archivo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                Ver completo
              </a>
              
              <a
                href={`data:${selectedComprobante.tipoArchivo};base64,${selectedComprobante.archivo}`}
                download={selectedComprobante.nombreArchivo}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Descargar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 