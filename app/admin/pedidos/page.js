'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaTrash } from 'react-icons/fa';
import { utils as XLSXUtils, write as XLSXWrite } from 'xlsx';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pedidoToDelete, setPedidoToDelete] = useState(null);
  const [selectedComprobante, setSelectedComprobante] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const estadosPedido = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'confirmado', label: 'Confirmado' },
    { value: 'completado', label: 'Completado' },
    { value: 'cancelado', label: 'Cancelado' }
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

  const exportToExcel = () => {
    // Verificar que tengamos datos
    if (!filteredPedidos || filteredPedidos.length === 0) {
      alert('No hay pedidos para exportar');
      return;
    }

    console.log('Exportando pedidos:', filteredPedidos); // Debug

    // Preparar los datos para Excel usando los pedidos filtrados
    const dataToExport = filteredPedidos.map(pedido => ({
      'ID': pedido._id,
      'Usuario': pedido.usuario?.email || 'N/A',
      'Nombre y Apellido': pedido.compradorInfo ? 
        `${pedido.compradorInfo.nombre} ${pedido.compradorInfo.apellido}` : 
        pedido.usuario?.nombreApellido || 'N/A',
      'Fecha': new Date(pedido.fechaPedido).toLocaleDateString(),
      'Estado': pedido.estado,
      'Total': `$${pedido.total}`,
      'Método de Pago': pedido.metodoPago || 'MercadoPago',
      'Tipo de Entrega': pedido.retiro ? 'Retiro en local' : 'Envío a domicilio',
      'Dirección de Envío': pedido.retiro ? 'N/A' : 
        `${pedido.direccion || ''} ${pedido.localidad || ''} ${pedido.provincia || ''}`,
      'Productos': pedido.productos?.map(p => 
        `${p.genetic?.nombre || 'Producto'} (${p.cantidad})`
      ).join(', ') || 'N/A'
    }));

    // Crear el libro de trabajo
    const ws = XLSXUtils.json_to_sheet(dataToExport);
    const wb = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(wb, ws, "Pedidos");

    // Generar y descargar el archivo
    const excelBuffer = XLSXWrite(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `pedidos_${new Date().toISOString().split('T')[0]}.xlsx`;
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(data);
    link.download = fileName;
    link.click();
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar los pedidos');
        }

        const data = await response.json();
        console.log('Pedidos cargados:', data); // Debug
        
        if (data.success) {
          setPedidos(data.orders);
        } else {
          console.error('Error en la respuesta:', data.error);
        }
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchPedidos();
    }
  }, [session]);

  // Función para filtrar pedidos
  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = searchTerm === '' || 
      pedido._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.usuario?.nombreApellido?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || pedido.estado === statusFilter;

    const pedidoDate = new Date(pedido.fechaPedido);
    const matchesDate = (!startDate || pedidoDate >= startDate) && 
                       (!endDate || pedidoDate <= endDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

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
          {/* Filtros */}
          <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
            {/* Buscador */}
            <div className="relative flex-1 max-w-md">
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

            {/* Selector de estado */}
            <div className="flex-shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto p-3 bg-gray-700 text-white rounded-lg 
                         border border-gray-600 focus:outline-none focus:ring-2 
                         focus:ring-green-500 cursor-pointer"
              >
                {estadosPedido.map((estado) => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Fecha inicial"
                  className="bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  locale={es}
                  dateFormat="dd/MM/yyyy"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="Fecha final"
                  className="bg-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  locale={es}
                  dateFormat="dd/MM/yyyy"
                />
                {(startDate || endDate) && (
                  <button
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              Exportar a Excel
            </button>
          </div>

          {/* Contador de resultados */}
          {(searchTerm || statusFilter !== 'todos') && (
            <p className="text-sm text-gray-400 mb-4">
              {filteredPedidos.length} 
              {filteredPedidos.length === 1 ? ' resultado encontrado' : ' resultados encontrados'}
            </p>
          )}

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
              {filteredPedidos.map((pedido) => (
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
                        <p className="text-gray-300">
                          Dirección: {pedido.retiro ? 'Retira en local' : 
                            `${pedido.direccion || ''} ${pedido.localidad || ''} ${pedido.provincia || ''}`}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-300">
                          Nombre: {pedido.usuario?.nombreApellido || 'Usuario no disponible'}
                        </p>
                        <p className="text-gray-300">
                          Email: {pedido.usuario?.email || 'Email no disponible'}
                        </p>
                        <p className="text-gray-300">
                          Dirección: {pedido.retiro ? 'Retira en local' : 
                            `${pedido.usuario?.calle || ''} ${pedido.usuario?.numero || ''}, ${pedido.usuario?.localidad || ''}`}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Productos */}
                  <div className="p-4 border-t border-gray-700">
                    <h4 className="text-white font-semibold mb-2">Productos</h4>
                    {pedido.productos?.map((producto, index) => (
                      <div key={index} className="flex justify-between text-gray-300">
                        <span>
                          {producto.genetic?.nombre || 'Producto eliminado'} x{producto.cantidad}
                        </span>
                        <span>${producto.precio * producto.cantidad}</span>
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