'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function PedidosPage() {
  const { data: session } = useSession();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch('/api/user/pedidos');
        if (response.ok) {
          const data = await response.json();
          setPedidos(data.pedidos);
        }
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchPedidos();
    }
  }, [session]);

  // Función auxiliar para formatear la fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha no válida';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-white text-center">Cargando pedidos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 pt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Panel izquierdo */}
        <div className="md:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Mi Perfil</h2>
            <nav className="space-y-2">
              <Link href="/perfil" className="block w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700">
                Información Personal
              </Link>
              <Link href="/pedidos" className="block w-full text-left px-4 py-2 rounded-lg bg-green-600 text-white">
                Mis Pedidos
              </Link>
            </nav>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="md:col-span-3">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Mis Pedidos</h2>
            
            {pedidos.length === 0 ? (
              <div className="text-white text-center py-8">
                No tienes pedidos realizados
              </div>
            ) : (
              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div key={pedido._id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-gray-300">Pedido ID: {pedido._id}</p>
                        <p className="text-white">
                          Fecha: {formatearFecha(pedido.fechaPedido)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        pedido.estado === 'pendiente' ? 'bg-yellow-500/20 text-yellow-500' :
                        pedido.estado === 'confirmado' ? 'bg-blue-500/20 text-blue-500' :
                        pedido.estado === 'en_proceso' ? 'bg-purple-500/20 text-purple-500' :
                        pedido.estado === 'completado' ? 'bg-green-500/20 text-green-500' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {pedido.estado}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-gray-300">Productos:</p>
                      <ul className="list-disc list-inside text-white">
                        {pedido.productos.map((producto, index) => (
                          <li key={index}>
                            {producto.nombre} ({producto.cantidad} unidades)
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-green-500 mt-2 font-semibold">
                      Total: ${pedido.total}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 