'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  useEffect(() => {
    const handleSuccessfulPayment = async () => {
      try {
        // Obtener los parámetros de la URL
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');
        const externalReference = searchParams.get('external_reference');

        // Actualizar el estado del pedido en tu backend
        const response = await fetch('/api/orders/update-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentId,
            status,
            externalReference
          }),
        });

        if (response.ok) {
          // Limpiar el carrito
          clearCart();
          
          // Esperar 3 segundos antes de redirigir
          setTimeout(() => {
            router.push('/pedidos');
          }, 3000);
        }
      } catch (error) {
        console.error('Error al procesar el pago exitoso:', error);
      }
    };

    handleSuccessfulPayment();
  }, [searchParams, clearCart, router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-green-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">
          ¡Pago Exitoso!
        </h1>
        <p className="text-gray-300 mb-6">
          Tu pedido ha sido procesado correctamente. Serás redirigido a tus pedidos en unos segundos...
        </p>
        <button
          onClick={() => router.push('/pedidos')}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Ver mis pedidos
        </button>
      </div>
    </div>
  );
}

export default function Success() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
} 