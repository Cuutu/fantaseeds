'use client';
import { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';

// Inicializar MercadoPago
initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('envio');
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
  const [comprobante, setComprobante] = useState(null);
  const [showComprobanteError, setShowComprobanteError] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    calle: '',
    numero: '',
    codigoPostal: '',
    localidad: ''
  });
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const session = useSession();

  // Agregar este cálculo después de los estados iniciales
  const subtotal = cart.reduce((acc, item) => acc + (item.genetic.precio * item.cantidad), 0);
  const [total, setTotal] = useState(subtotal);

  useEffect(() => {
    // Aplicar recargo del 10% si el método es MercadoPago
    if (paymentMethod === 'mercadopago') {
      setTotal(subtotal * 1.10); // 10% más
    } else {
      setTotal(subtotal);
    }
  }, [paymentMethod, subtotal]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (deliveryMethod === 'envio') {
        try {
          const response = await fetch('/api/user/get-profile');
          const data = await response.json();
          
          if (data.success && data.user?.domicilio) {
            setShippingAddress({
              calle: data.user.domicilio.calle || '',
              numero: data.user.domicilio.numero || '',
              codigoPostal: data.user.domicilio.codigoPostal || '',
              localidad: data.user.domicilio.ciudad || ''
            });
          }
        } catch (error) {
          console.error('Error al obtener la dirección:', error);
        }
      }
    };

    fetchUserAddress();
  }, [deliveryMethod]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method);
    if (method === 'retiro') {
      setShippingAddress({
        calle: '',
        numero: '',
        codigoPostal: '',
        localidad: '',
      });
    }
  };

  useEffect(() => {
    if (!cart || cart.length === 0) {
      router.push('/');
      return;
    }

    const createInitialPreference = async () => {
      if (deliveryMethod === 'retiro' || 
          (deliveryMethod === 'envio' && 
           shippingAddress.calle && 
           shippingAddress.numero && 
           shippingAddress.codigoPostal && 
           shippingAddress.localidad )) {
        try {
          await createPreference();
        } catch (error) {
          console.error('Error al crear preferencia inicial:', error);
        }
      }
    };

    createInitialPreference();
  }, [deliveryMethod, shippingAddress, cart]);

  const createPreference = async () => {
    try {
      if (!cart || cart.length === 0) {
        throw new Error('No hay items en el carrito');
      }

      setIsLoading(true);
      
      const response = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          total: total,
          deliveryMethod,
          shippingAddress: deliveryMethod === 'envio' ? shippingAddress : null
        }),
        cache: 'no-cache',
        credentials: 'same-origin',
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setPreferenceId(data.preferenceId);
      } else {
        throw new Error(data.error || 'Error al crear preferencia de pago');
      }
    } catch (error) {
      console.error('Error detallado:', error);
      alert('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComprobanteUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setComprobante(file);
      setShowComprobanteError(false);
    } else {
      setShowComprobanteError(true);
    }
  };

  const handleTransferSubmit = async () => {
    if (!comprobante) {
      setShowComprobanteError(true);
      return;
    }

    setIsLoading(true);
    try {
      // Convertir el archivo a base64
      const fileReader = new FileReader();
      fileReader.readAsDataURL(comprobante);
      
      fileReader.onload = async () => {
        const base64Data = fileReader.result.split(',')[1];
        
        const orderData = {
          productos: cart.map(item => ({
            genetic: item.genetic,
            cantidad: item.cantidad,
            precio: item.genetic.precio
          })),
          total: cart.reduce((acc, item) => acc + (item.genetic.precio * item.cantidad), 0),
          metodoPago: 'transferencia',
          metodoEntrega: deliveryMethod,
          direccionEnvio: deliveryMethod === 'envio' ? shippingAddress : null,
          informacionCliente: {
            nombre: session?.user?.name || '',
            email: session?.user?.email || '',
          },
          comprobante: {
            archivo: base64Data,
            nombreArchivo: comprobante.name,
            tipoArchivo: comprobante.type
          }
        };

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });

        if (response.ok) {
          clearCart();
          router.push('/pedidos');
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Error al crear el pedido');
        }
      };
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pedido. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">No hay items en el carrito</p>
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-8">Checkout</h1>

        {/* Método de entrega */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Método de entrega</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleDeliveryMethodChange('retiro')}
              className={`w-full p-4 rounded-lg border ${
                deliveryMethod === 'retiro' 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-700 hover:border-green-500'
              } transition-colors`}
            >
              <span className="text-white">Retiro en Local</span>
            </button>
            <button
              onClick={() => handleDeliveryMethodChange('envio')}
              className={`w-full p-4 rounded-lg border ${
                deliveryMethod === 'envio' 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-700 hover:border-green-500'
              } transition-colors`}
            >
              <span className="text-white">Envío a Domicilio</span>
            </button>
          </div>
        </div>

        {/* Dirección de envío si corresponde */}
        {deliveryMethod === 'envio' && (
          <div className="mt-6">
            <h3 className="text-white font-semibold mb-4">Dirección de Envío:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Calle *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.calle}
                  onChange={(e) => setShippingAddress({...shippingAddress, calle: e.target.value})}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Número *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.numero}
                  onChange={(e) => setShippingAddress({...shippingAddress, numero: e.target.value})}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Código Postal *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.codigoPostal}
                  onChange={(e) => setShippingAddress({...shippingAddress, codigoPostal: e.target.value})}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Localidad *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.localidad}
                  onChange={(e) => setShippingAddress({...shippingAddress, localidad: e.target.value})}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <p className="text-gray-400 mt-2 text-sm">* Campos obligatorios</p>
          </div>
        )}

        {/* Resumen del Pedido */}
        <div className="bg-gray-800/50 rounded-lg p-6 mt-6">
          <h3 className="text-xl font-semibold text-white mb-4">Resumen del Pedido</h3>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span className="text-gray-300">{item.genetic.nombre} x{item.cantidad}</span>
              <span className="text-gray-300">${item.genetic.precio * item.cantidad}</span>
            </div>
          ))}
          
          <div className="border-t border-gray-700 mt-4 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Subtotal</span>
              <span className="text-gray-300">${subtotal}</span>
            </div>
            {paymentMethod === 'mercadopago' && (
              <div className="flex justify-between mt-2">
                <span className="text-gray-300">Costo de procesamiento</span>
                <span className="text-gray-300">${(total - subtotal).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold mt-2">
              <span className="text-white">Total</span>
              <span className="text-white">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Sección de pago */}
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-6">Método de pago</h3>
          
          {/* Selector de método de pago */}
          <div className="space-y-4 mb-6">
            <button
              onClick={() => setPaymentMethod('mercadopago')}
              className={`w-full p-4 rounded-lg border ${
                paymentMethod === 'mercadopago' 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-700 hover:border-green-500'
              } transition-colors`}
            >
              <span className="text-white">MercadoPago</span>
            </button>
            
            <button
              onClick={() => setPaymentMethod('transferencia')}
              className={`w-full p-4 rounded-lg border ${
                paymentMethod === 'transferencia' 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-700 hover:border-green-500'
              } transition-colors`}
            >
              <span className="text-white">Transferencia Bancaria</span>
            </button>
          </div>

          {/* Mostrar botón de MercadoPago o formulario de transferencia según selección */}
          {paymentMethod === 'mercadopago' && preferenceId && (
            <div className="mt-4">
              <Wallet 
                initialization={{ preferenceId }}
                customization={{ 
                  texts: { valueProp: 'smart_option' },
                  visual: { 
                    buttonBackground: 'black',
                    borderRadius: '6px'
                  }
                }}
              />
            </div>
          )}

          {paymentMethod === 'transferencia' && (
            <div className="space-y-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Datos bancarios:</h4>
                <p className="text-gray-300">Banco: XXXXX</p>
                <p className="text-gray-300">CBU: XXXXX</p>
                <p className="text-gray-300">Alias: XXXXX</p>
                <p className="text-gray-300">Titular: XXXXX</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cargar comprobante de transferencia
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleComprobanteUpload}
                  className="block w-full text-sm text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-500 file:text-white
                    hover:file:bg-green-600
                    file:cursor-pointer"
                />
                {showComprobanteError && (
                  <p className="text-red-500 text-sm mt-1">
                    Por favor, carga una imagen del comprobante
                  </p>
                )}
              </div>

              <button
                onClick={handleTransferSubmit}
                disabled={!comprobante || isLoading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 
                  text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isLoading ? 'Procesando...' : 'Confirmar pedido'}
              </button>
            </div>
          )}

          {isLoading && (
            <div className="text-center mt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-2">Procesando...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 