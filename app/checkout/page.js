'use client';
import { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

// Inicializar MercadoPago
initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [preferenceId, setPreferenceId] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('retiro');
  const [shippingAddress, setShippingAddress] = useState({});
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const handlePaymentMethodChange = async (method) => {
    setPaymentMethod(method);
    if (method === 'mercadopago') {
      await createPreference();
    }
  };

  const createPreference = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          deliveryMethod,
          shippingAddress: deliveryMethod === 'envio' ? shippingAddress : null
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setPreferenceId(data.preferenceId);
      } else {
        throw new Error(data.error || 'Error al crear preferencia de pago');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-8">Checkout</h1>

        {/* Método de entrega */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4">Método de Entrega:</h3>
          <div className="space-y-3">
            <button
              onClick={() => setDeliveryMethod('retiro')}
              className={`w-full p-4 rounded-lg border ${
                deliveryMethod === 'retiro' 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-700 hover:border-green-500'
              } transition-colors`}
            >
              <span className="text-white">Retiro en Sucursal</span>
            </button>
            
            <button
              onClick={() => setDeliveryMethod('envio')}
              className={`w-full p-4 rounded-lg border ${
                deliveryMethod === 'envio' 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-700 hover:border-green-500'
              } transition-colors`}
            >
              <span className="text-white">Envío a Domicilio (+$500)</span>
            </button>
          </div>
        </div>

        {/* Método de pago */}
        <div className="mt-6 space-y-4">
          <h3 className="text-white font-semibold mb-4">Método de Pago:</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => handlePaymentMethodChange('mercadopago')}
              className={`w-full p-4 rounded-lg border ${
                paymentMethod === 'mercadopago' 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-700 hover:border-green-500'
              } transition-colors`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/mercadopago-logo.png" 
                    alt="Mercado Pago" 
                    className="h-6"
                  />
                  <span className="text-white">Pagar con Mercado Pago</span>
                </div>
                {paymentMethod === 'mercadopago' && (
                  <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>

            {/* Otros métodos de pago existentes */}
          </div>

          {/* Botón de Mercado Pago */}
          {paymentMethod === 'mercadopago' && preferenceId && (
            <div className="mt-4">
              <Wallet 
                initialization={{ preferenceId }}
                customization={{ 
                  texts: { valueProp: 'smart_option' },
                  visual: { buttonBackground: 'black', borderRadius: '6px' }
                }}
              />
            </div>
          )}
        </div>

        {/* Resumen del pedido */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Resumen del Pedido</h3>
          {cart.map((item) => (
            <div key={item.genetic._id} className="flex justify-between mb-2">
              <span className="text-gray-300">
                {item.genetic.nombre} x{item.cantidad}
              </span>
              <span className="text-gray-300">
                ${item.genetic.precio * item.cantidad}
              </span>
            </div>
          ))}
          {deliveryMethod === 'envio' && (
            <div className="flex justify-between mt-2 pt-2 border-t border-gray-700">
              <span className="text-gray-300">Envío</span>
              <span className="text-gray-300">$500</span>
            </div>
          )}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-700">
            <span className="text-white font-semibold">Total</span>
            <span className="text-white font-semibold">
              ${cart.reduce((acc, item) => acc + (item.genetic.precio * item.cantidad), 0) + 
                (deliveryMethod === 'envio' ? 500 : 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 