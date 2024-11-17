import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-[#1a1b1e] w-64 min-h-screen">
      <div className="p-4">
        <Link href="/admin" className="text-green-500 text-xl font-bold mb-8 block">
          FANTASEEDS
        </Link>
        
        <nav className="space-y-1">
          <Link 
            href="/admin"
            className={`block px-4 py-2 rounded ${
              pathname === '/admin' 
                ? 'bg-gray-700 text-green-500' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Dashboard
          </Link>

          <Link 
            href="/admin/usuarios"
            className={`block px-4 py-2 rounded ${
              pathname === '/admin/usuarios' 
                ? 'bg-gray-700 text-green-500' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Usuarios
          </Link>

          <Link 
            href="/admin/geneticas"
            className={`block px-4 py-2 rounded ${
              pathname === '/admin/geneticas' 
                ? 'bg-gray-700 text-green-500' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Genéticas
          </Link>

          <Link 
            href="/admin/pedidos"
            className={`block px-4 py-2 rounded ${
              pathname === '/admin/pedidos' 
                ? 'bg-gray-700 text-green-500' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Pedidos
          </Link>

          <button
            onClick={() => signOut()}
            className="block w-full text-left px-4 py-2 text-gray-400 hover:text-gray-300"
          >
            Cerrar Sesión
          </button>
        </nav>
      </div>
    </aside>
  );
} 