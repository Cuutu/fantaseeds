'use client';
import { useRouter } from 'next/navigation';

export default function Failure() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Error en el Pago
        </h1>
        <p className="text-gray-300 mb-6">
          Lo sentimos, hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
        </p>
        <button
          onClick={() => router.push('/checkout')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Volver a intentar
        </button>
      </div>
    </div>
  );
} 