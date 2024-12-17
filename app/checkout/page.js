'use client';
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import emailjs from '@emailjs/browser';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializar MercadoPago con tu public key
initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState('retiro');
  const [shippingAddress, setShippingAddress] = useState({
    direccion: '',
    ciudad: '',
    codigoPostal: ''
  });
  const [comprobante, setComprobante] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const fileInputRef = useRef(null);
  const [preferenceId, setPreferenceId] = useState(null);

  const handleConfirmarPedido = async () => {
    try {
      if (!paymentMethod) {
        alert('Por favor, seleccione un método de pago');
        return;
      }

      setIsLoading(true);

      const orderData = {
        productos: cart.map(item => ({
          genetic: item.genetic._id,
          cantidad: item.cantidad,
          precio: item.genetic.precio
        })),
        total: cart.reduce((acc, item) => acc + (item.genetic.precio * item.cantidad), 0) + 
              (deliveryMethod === 'envio' ? 500 : 0),
        metodoPago: paymentMethod,
        metodoEntrega: deliveryMethod,
        direccionEnvio: deliveryMethod === 'envio' ? shippingAddress : null,
        comprobante: paymentMethod === 'transferencia' ? comprobante : null
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
        try {
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
              delivery_method: deliveryMethod === 'envio' ? 'Envío a domicilio' : 'Retiro en sucursal',
              delivery_address: deliveryMethod === 'envio' ? 
                `${shippingAddress.direccion}, ${shippingAddress.ciudad} (CP: ${shippingAddress.codigoPostal})` : '',
              order_total: `$${orderData.total}`,
              products_list: cart.map(item => 
                `${item.genetic.nombre} (${item.cantidad} unidades)`
              ).join('\n'),
            },
            process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
          );
        } catch (emailError) {
          console.error('Error al enviar el email:', emailError);
        }

        clearCart();
        setShowSuccessModal(true);
        
        setTimeout(() => {
          router.push('/pedidos');
        }, 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pedido: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validar el tipo de archivo
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/heic'];
        if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
          throw new Error('Tipo de archivo no válido. Por favor, sube una imagen (JPG, PNG, HEIC) o PDF.');
        }

        // Validar tamaño (máximo 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new Error('El archivo es demasiado grande. El tamaño máximo es 5MB.');
        }

        const base64 = await convertFileToBase64(file);
        setComprobante({
          archivo: base64,
          nombreArchivo: file.name,
          tipoArchivo: file.type || 'image/heic'
        });
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
        alert(error.message || 'Error al procesar el archivo');
        e.target.value = '';
      }
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
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
    <div className="min-h-screen bg-gray-900 p-4 pt-20">
      <h1 className="text-3xl font-bold text-white mb-8">Finalizar Compra</h1>
      
      {/* Método de entrega */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Método de entrega</h2>
        <div className="flex flex-col space-y-3">
          <label className="flex items-center space-x-3 text-white cursor-pointer">
            <input
              type="radio"
              name="deliveryMethod"
              value="retiro"
              checked={deliveryMethod === 'retiro'}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="form-radio text-green-500 focus:ring-green-500"
            />
            <span>Retiro por sucursal</span>
          </label>
          
          <label className="flex items-center space-x-3 text-white cursor-pointer">
            <input
              type="radio"
              name="deliveryMethod"
              value="envio"
              checked={deliveryMethod === 'envio'}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="form-radio text-green-500 focus:ring-green-500"
            />
            <span>Envío a domicilio</span>
          </label>
        </div>
      </div>

      {/* Formulario de dirección */}
      {deliveryMethod === 'envio' && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Dirección de envío</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Dirección"
              value={shippingAddress.direccion}
              onChange={(e) => setShippingAddress({...shippingAddress, direccion: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={shippingAddress.ciudad}
              onChange={(e) => setShippingAddress({...shippingAddress, ciudad: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
            />
            <input
              type="text"
              placeholder="Código Postal"
              value={shippingAddress.codigoPostal}
              onChange={(e) => setShippingAddress({...shippingAddress, codigoPostal: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
            />
          </div>
        </div>
      )}

      {/* Resumen del Pedido */}
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
        {deliveryMethod === 'envio' && (
          <div className="flex justify-between items-center text-white mb-4 border-t border-gray-700 pt-4">
            <span>Costo de envío</span>
            <span className="text-green-400">$500</span>
          </div>
        )}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <div className="flex justify-between items-center text-white">
            <span className="text-xl font-bold">Total</span>
            <span className="text-2xl font-bold text-green-400">
              ${cart.reduce((acc, item) => acc + (item.genetic.precio * item.cantidad), 0) + 
                (deliveryMethod === 'envio' ? 500 : 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Método de Pago */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Método de Pago</h2>
        <div className="mt-6 space-y-4">
          <h3 className="text-white font-semibold mb-4">Método de Pago:</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setPaymentMethod('mercadopago');
                createPreference();
              }}
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

            {/* Otros métodos de pago */}
            {/* ... */}
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
      </div>

      {/* Botón de confirmar pedido */}
      <button
        onClick={paymentMethod === 'mercadopago' ? handleMercadoPago : handleConfirmarPedido}
        disabled={isLoading || !paymentMethod}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg 
                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Procesando...' : 'Confirmar Pedido'}
      </button>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">¡Pedido Confirmado!</h3>
            <p className="text-gray-300 mb-4">
              Tu pedido #{orderId?.slice(-6)} ha sido registrado correctamente.
              Te hemos enviado un email con los detalles.
            </p>
            <p className="text-gray-400 text-sm mb-4">
              Serás redirigido a tus pedidos en 5 segundos...
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 