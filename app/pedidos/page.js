'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PedidosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        if (status === 'authenticated') {
          const response = await fetch('/api/user/pedidos');
          const data = await response.json();
          
          if (data.success) {
            setPedidos(data.orders || []);
          } else {
            throw new Error(data.error || 'Error al cargar los pedidos');
          }
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, [status]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Mis Pedidos</h1>
        <div className="space-y-6">
          {pedidos.map((pedido) => (
            <div key={pedido._id} className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400">Pedido ID: {pedido._id}</p>
                  <p className="text-gray-400">
                    Fecha: {new Date(pedido.fechaPedido).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  pedido.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-500' :
                  pedido.estado === 'confirmado' ? 'bg-green-500/20 text-green-500' :
                  pedido.estado === 'completado' ? 'bg-blue-500/20 text-blue-500' :
                  pedido.estado === 'cancelado' ? 'bg-red-500/20 text-red-500' :
                  'bg-gray-500/20 text-gray-500'
                }`}>
                  {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                </span>
              </div>

              <div className="space-y-2">
                {pedido.productos.map((producto, index) => (
                  <div key={index} className="flex justify-between text-white">
                    <span>{producto.genetic.nombre} x{producto.cantidad}</span>
                    <span>${producto.precio * producto.cantidad}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-gray-400">
                  <p>Método de pago: {pedido.metodoPago}</p>
                  <p>Método de entrega: {pedido.metodoEntrega === 'envio' ? 'Envío a domicilio' : 'Retiro en local'}</p>
                  {pedido.metodoEntrega === 'envio' && pedido.direccionEnvio && (
                    <p>Dirección: {`${pedido.direccionEnvio.calle} ${pedido.direccionEnvio.numero}, ${pedido.direccionEnvio.localidad}`}</p>
                  )}
                </div>
                <div className="mt-4 text-right">
                  <p className="text-xl font-bold text-white">Total: ${pedido.total}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 