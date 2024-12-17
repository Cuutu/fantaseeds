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
    depto: '',
    codigoPostal: '',
    localidad: '',
    provincia: '',
    telefono: ''
  });
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (deliveryMethod === 'retiro' || 
        (deliveryMethod === 'envio' && 
         shippingAddress.calle && 
         shippingAddress.numero && 
         shippingAddress.codigoPostal && 
         shippingAddress.localidad && 
         shippingAddress.provincia && 
         shippingAddress.telefono)) {
      createPreference();
    }
  }, [deliveryMethod, shippingAddress]);

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

        {/* Dirección de envío si corresponde */}
        {deliveryMethod === 'envio' && (
          <div className="mb-8">
            <h3 className="text-white font-semibold mb-4">Dirección de Envío:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Calle *</label>
                <input
                  type="text"
                  name="calle"
                  value={shippingAddress.calle}
                  onChange={handleAddressChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Número *</label>
                <input
                  type="text"
                  name="numero"
                  value={shippingAddress.numero}
                  onChange={handleAddressChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Piso</label>
                <input
                  type="text"
                  name="piso"
                  value={shippingAddress.piso}
                  onChange={handleAddressChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Departamento</label>
                <input
                  type="text"
                  name="depto"
                  value={shippingAddress.depto}
                  onChange={handleAddressChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Código Postal *</label>
                <input
                  type="text"
                  name="codigoPostal"
                  value={shippingAddress.codigoPostal}
                  onChange={handleAddressChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Localidad *</label>
                <input
                  type="text"
                  name="localidad"
                  value={shippingAddress.localidad}
                  onChange={handleAddressChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Provincia *</label>
                <input
                  type="text"
                  name="provincia"
                  value={shippingAddress.provincia}
                  onChange={handleAddressChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  value={shippingAddress.telefono}
                  onChange={handleAddressChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <p className="text-gray-400 mt-2 text-sm">* Campos obligatorios</p>
          </div>
        )}

        {/* Resumen del pedido */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
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