'use client';
import { useRouter } from 'next/navigation';

export default function Pending() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 text-yellow-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Pago Pendiente
        </h1>
        <p className="text-gray-300 mb-6">
          Tu pago está siendo procesado. Te notificaremos cuando se confirme.
        </p>
        <button
          onClick={() => router.push('/pedidos')}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Ver mis pedidos
        </button>
      </div>
    </div>
  );
} 