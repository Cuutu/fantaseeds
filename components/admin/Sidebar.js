import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Sidebar({ onClose }) {
  const pathname = usePathname();

  return (
    <aside className="bg-[#1a1b1e] w-64 min-h-screen relative">
      <div className="lg:hidden flex items-center justify-center p-4 border-b border-gray-800">
        <Link href="/admin" className="text-green-500 text-xl font-bold">
          FANTASEEDS
        </Link>
      </div>

      <div className="p-4 pt-6">
        <Link href="/admin" className="hidden lg:block text-green-500 text-xl font-bold mb-8">
          FANTASEEDS
        </Link>
        
        <nav className="space-y-2">
          <Link 
            href="/admin"
            onClick={onClose}
            className={`flex items-center px-4 py-3 rounded transition-colors duration-200 ${
              pathname === '/admin' 
                ? 'bg-gray-700 text-green-500' 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>

          <Link 
            href="/admin/usuarios"
            onClick={onClose}
            className={`flex items-center px-4 py-3 rounded transition-colors duration-200 ${
              pathname === '/admin/usuarios' 
                ? 'bg-gray-700 text-green-500' 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Usuarios
          </Link>

          <Link 
            href="/admin/geneticas"
            onClick={onClose}
            className={`flex items-center px-4 py-3 rounded transition-colors duration-200 ${
              pathname === '/admin/geneticas' 
                ? 'bg-gray-700 text-green-500' 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Genéticas
          </Link>

          <Link 
            href="/admin/pedidos"
            onClick={onClose}
            className={`flex items-center px-4 py-3 rounded transition-colors duration-200 ${
              pathname === '/admin/pedidos' 
                ? 'bg-gray-700 text-green-500' 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Pedidos
          </Link>

          <Link 
            href="/admin/membresias"
            onClick={onClose}
            className={`flex items-center px-4 py-3 rounded transition-colors duration-200 ${
              pathname === '/admin/membresias' 
                ? 'bg-gray-700 text-green-500' 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Membresías
          </Link>

          <Link 
            href="/admin/multimedia"
            onClick={onClose}
            className={`flex items-center px-4 py-3 rounded transition-colors duration-200 ${
              pathname === '/admin/multimedia' 
                ? 'bg-gray-700 text-green-500' 
                : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-300'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A2 2 0 0021 6.382V5a2 2 0 00-2-2H5a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L8 10m7 0v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m10 0l-2 2m-6-2l-2 2" />
            </svg>
            Multimedia
          </Link>

          <button
            onClick={() => signOut()}
            className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300 rounded transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </aside>
  );
} 