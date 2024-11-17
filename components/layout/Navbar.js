'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-green-800 text-white fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold">
              FANTASEEDS
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/#contact" className="hover:bg-green-700 px-3 py-2 rounded-md">
              Contacto
            </Link>
            {session && (
              <>
                <Link href="/geneticas" className="hover:bg-green-700 px-3 py-2 rounded-md">
                  Genéticas
                </Link>
                <Link 
                  href="/perfil" 
                  className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md"
                >
                  Mi Perfil
                </Link>
              </>
            )}
            {session?.user?.rol === 'administrador' && (
              <Link href="/admin" className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md">
                Panel Admin
              </Link>
            )}
            {session ? (
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md"
              >
                Cerrar Sesión
              </button>
            ) : (
              <Link href="/login" className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-md">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 