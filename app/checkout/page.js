'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import SuccessModal from '@/components/SuccessModal';
import emailjs from '@emailjs/browser';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleConfirmarPedido = async () => {
    try {
      setIsLoading(true);
      
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

      console.log('Enviando orden:', orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID,
          {
            from_name: 'Fantaseeds',
            to_name: 'Admin',
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
            message: `
              Número de Pedido: #${data.order._id.slice(-6)}
              
              Datos del Cliente:
              Usuario: ${session.user.usuario}
              Nombre y Apellido: ${session.user.nombreApellido}
              Email: ${session.user.email}
              Dirección: ${session.user.domicilio ? 
                `${session.user.domicilio.calle} ${session.user.domicilio.numero}` : 
                'No especificada'}
              
              Productos:
              ${cart.map(item => `- ${item.genetic.nombre} (${item.cantidad} unidades)`).join('\n')}
              
              Total: $${orderData.total}
            `
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
        );

        setOrderId(data.order._id);
        setShowSuccessModal(true);
        clearCart();
      } else {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pedido: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    clearCart();
    router.push('/');
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

      <SuccessModal 
        isOpen={showSuccessModal}
        orderId={orderId}
        onClose={handleCloseModal}
      />
    </div>
  );
} 