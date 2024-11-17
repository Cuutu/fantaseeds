'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import GeneticList from '@/components/GeneticList';
import Cart from '@/components/Cart';

export default function GeneticasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [genetics, setGenetics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchGenetics = async () => {
      try {
        const response = await fetch('/api/genetics/public');
        const data = await response.json();

        if (data.success) {
          setGenetics(data.genetics);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        setError('Error al cargar las genéticas');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchGenetics();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-400 mt-8">Cargando genéticas...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-400 mt-8">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Genéticas</h1>
      <GeneticList geneticas={genetics} />
      <Cart />
    </div>
  );
} 