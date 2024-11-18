'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="min-h-screen bg-gray-900 p-4">
      <h1 className="text-2xl font-bold text-white mb-4">Gestión de Pedidos</h1>
      
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
        <div className="grid gap-4">
          {pedidos.map((pedido) => (
            <div key={pedido._id} className="bg-gray-800 p-4 rounded-lg text-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold">Pedido #{pedido._id.slice(-6)}</p>
                  <p>Cliente: {pedido.usuario?.nombreApellido}</p>
                  <p>Email: {pedido.usuario?.email}</p>
                </div>
                <div className="text-right">
                  <p>Estado: {pedido.estado}</p>
                  <p>Fecha: {new Date(pedido.fechaPedido).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="font-bold mb-2">Productos:</p>
                {pedido.productos.map((producto, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span>{producto.genetic?.nombre} x{producto.cantidad}</span>
                    <span>${producto.precio}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-2 border-t border-gray-700 flex justify-between items-center">
                <span className="font-bold">Total:</span>
                <span className="font-bold">${pedido.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 