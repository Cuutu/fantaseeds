'use client';
import { useState, useEffect } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

// Inicializar MercadoPago
initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);

export default function Checkout() {
  const [isLoading, setIsLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('retiro');
  const [shippingAddress, setShippingAddress] = useState({
    calle: '',
    numero: '',
    piso: '',
    departamento: '',
    codigoPostal: '',
    localidad: '',
    provincia: '',
    telefono: ''
  });
  const router = useRouter();
  const { cart, clearCart } = useCart();

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (deliveryMethod === 'envio') {
        try {
          const response = await fetch('/api/user/get-profile');
          const data = await response.json();
          
          if (data.success && data.user) {
            if (!data.user.calle || !data.user.numero) {
              // Si no tiene dirección cargada, redirigir al perfil
              router.push('/perfil?redirect=checkout');
              return;
            }
            
            setShippingAddress({
              calle: data.user.calle || '',
              numero: data.user.numero || '',
              piso: data.user.piso || '',
              departamento: data.user.depto || '',
              codigoPostal: data.user.codigoPostal || '',
              localidad: data.user.localidad || '',
              provincia: data.user.provincia || '',
              telefono: data.user.telefono || ''
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
        piso: '',
        departamento: '',
        codigoPostal: '',
        localidad: '',
        provincia: '',
        telefono: ''
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
           shippingAddress.localidad && 
           shippingAddress.provincia && 
           shippingAddress.telefono)) {
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
                <label className="block text-sm font-medium text-gray-300">Piso</label>
                <input
                  type="text"
                  value={shippingAddress.piso}
                  onChange={(e) => setShippingAddress({...shippingAddress, piso: e.target.value})}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Departamento</label>
                <input
                  type="text"
                  value={shippingAddress.departamento}
                  onChange={(e) => setShippingAddress({...shippingAddress, departamento: e.target.value})}
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
              <div>
                <label className="block text-sm font-medium text-gray-300">Provincia *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.provincia}
                  onChange={(e) => setShippingAddress({...shippingAddress, provincia: e.target.value})}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.telefono}
                  onChange={(e) => setShippingAddress({...shippingAddress, telefono: e.target.value})}
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
            <div className="flex justify-between font-semibold">
              <span className="text-white">Total</span>
              <span className="text-white">
                ${cart.reduce((acc, item) => acc + (item.genetic.precio * item.cantidad), 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de Mercado Pago */}
        {preferenceId && (
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

        {isLoading && (
          <div className="text-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-2">Procesando...</p>
          </div>
        )}
      </div>
    </div>
  );
} 