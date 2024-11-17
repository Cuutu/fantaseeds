'use client';
import { useState, useEffect } from 'react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-300">Cargando pedidos...</div>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-300">
              Pedido #{order._id.slice(-6)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              order.estado === 'completado' ? 'bg-green-500/20 text-green-400' :
              order.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {order.estado}
            </span>
          </div>
          
          <div className="space-y-2">
            {order.productos.map((producto) => (
              <div key={producto._id} className="flex justify-between text-gray-300">
                <span>{producto.genetic.nombre} x{producto.cantidad}</span>
                <span>${producto.precio}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
            <span className="text-gray-300">Total</span>
            <span className="text-white font-bold">${order.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 