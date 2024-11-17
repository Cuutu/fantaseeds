'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import emailjs from '@emailjs/browser';

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const handleConfirmarPedido = async () => {
    try {
      setIsLoading(true);
      
      if (!session?.user) {
        throw new Error('Usuario no autenticado');
      }

      const orderData = {
        productos: cart.map(item => ({
          genetic: item.genetic._id,
          cantidad: item.cantidad,
          precio: item.genetic.precio
        })),
        total: cart.reduce((acc, item) => acc + (item.genetic.precio * item.cantidad), 0),
        usuario: session.user.id,
        estado: 'pendiente'
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

      if (data.success) {
        setOrderId(data.order._id);
        
        // Enviar email
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID,
          {
            from_name: 'Fantaseeds',
            to_name: session.user.nombreApellido,
            order_number: data.order._id.slice(-6),
            customer_name: session.user.nombreApellido,
            customer_username: session.user.usuario,
            customer_email: session.user.email,
            customer_address: session.user.domicilio ? 
              `${session.user.domicilio.calle} ${session.user.domicilio.numero}` : 
              'No especificada',
            order_total: `$${orderData.total}`,
            products_list: cart.map(item => 
              `${item.genetic.nombre} (${item.cantidad} unidades)`
            ).join('\n'),
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        );

        setShowSuccessModal(true);
        clearCart();
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al procesar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 pt-20">
      <h1 className="text-3xl font-bold text-white mb-8">Finalizar Compra</h1>
      
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Resumen del Pedido</h2>
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-white mb-4">
            <div>
              <h3 className="text-lg">{item.genetic.nombre}</h3>
              <p className="text-gray-400">Cantidad: {item.cantidad}</p>
            </div>
            <span className="text-green-400">${item.genetic.precio * item.cantidad}</span>
          </div>
        ))}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <div className="flex justify-between items-center text-white">
            <span className="text-xl font-bold">Total</span>
            <span className="text-2xl font-bold text-green-400">
              ${cart.reduce((acc, item) => acc + (item.genetic.precio * item.cantidad), 0)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleConfirmarPedido}
        disabled={isLoading || cart.length === 0}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {isLoading ? 'Procesando...' : 'Confirmar Pedido'}
      </button>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">¡Pedido Confirmado!</h3>
            <p className="text-gray-300 mb-4">
              Tu pedido #{orderId.slice(-6)} ha sido registrado correctamente.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/perfil');
              }}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 