'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get('email');
      const password = formData.get('password');

      console.log('Intentando login con:', { email }); // Debug

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      console.log('Resultado del login:', result); // Debug

      if (result.error) {
        setError('Credenciales inválidas');
        return;
      }

      router.push('/geneticas');
      router.refresh();

    } catch (error) {
      console.error('Error en login:', error);
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              name="email"
              type="text"
              placeholder="Email o nombre de usuario"
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded bg-green-600 text-white font-semibold
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}
              transition duration-200`}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
} 